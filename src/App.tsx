import React, {useState} from 'react';
import './App.css';
import logins from './logins';


const OPEN_ALL_LINK_CLASS = "open-all-link";

const LoginsModal: React.FC = ({children}) => {
  return <div>
    <section role="dialog" tabIndex={-1}
             className="slds-modal slds-fade-in-open slds-modal_medium"
             aria-labelledby="header43" aria-modal="true" aria-describedby="modal-content-id-1">
      <div className="slds-modal__container">
        <header className="slds-modal__header slds-grid slds-grid_align-spread slds-grid_vertical-align-center">
          <h2 id="header43" className="slds-text-heading_large">Salesforce Logins</h2>
          <OpenAllButton/>
        </header>
        <div className="slds-modal__content slds-text-align--center slds-p-around_x-large">
          {children}
        </div>
      </div>
    </section>
    <div className="slds-backdrop slds-backdrop_open"/>
  </div>;
};

const AddTile: React.FC = () => <Tile name=""
                                      link_url="mailto:egrim@salesforce.com?subject=Missing%20login%20page&body=Here's%20a%20login%20you%20should%20add%3A%20%3CURL%20here%3E%0D%0A"
                                      svg_url={process.env.PUBLIC_URL + "/assets/icons/utility-sprite/svg/symbols.svg#add"}
                                      include_in_open_all={false}/>

const Tile: React.FC<{
  name: string,
  link_url: string,
  img_url?: string,
  svg_url?: string,
  include_in_open_all?: boolean
}> = ({name, link_url, img_url, svg_url, include_in_open_all = true}) => {
  let link_class_names = "slds-visual-picker slds-visual-picker_medium slds-text-link_reset";
  if (include_in_open_all) {
    link_class_names += " " + OPEN_ALL_LINK_CLASS;
  }

  let asset = null;
  if (img_url !== undefined) {
    asset = <img className="slds-icon slds-icon_large" src={img_url} aria-hidden="true" alt=""/>
  } else if (svg_url !== undefined) {
    asset = <svg className="slds-button__icon" aria-hidden="true">
            <use xlinkHref={svg_url}/>
          </svg>;
  }

  return (
    <a href={link_url} className={link_class_names}>
      <span className="slds-visual-picker__figure slds-visual-picker__icon slds-align_absolute-center slds-box_link">
        <span className="slds-icon_container">
          {asset}
        </span>
      </span>
      <span className="slds-visual-picker__body slds-align_absolute-center">
        <span className="slds-text-title">{name}</span>
      </span>
    </a>
  )
}

function OpenAllButton() {
  const [showPopover, setShowPopover] = useState(false);

  let popover = null;
  if (showPopover) {
    popover =
      <section aria-describedby="dialog-body-id-99" aria-labelledby="dialog-heading-id-1" id="popup-error-popover"
               className="slds-popover slds-popover_error slds-nubbin_right-top-corner slds-is-absolute" role="dialog">
        <button
          className="slds-button slds-button_icon slds-button_icon-small slds-float_right slds-popover__close slds-button_icon-inverse"
          title="Close dialog" onClick={event => {
          event.preventDefault();
          setShowPopover(false);
        }}>
          <svg className="slds-button__icon" aria-hidden="true">
            <use xlinkHref={process.env.PUBLIC_URL + "/assets/icons/utility-sprite/svg/symbols.svg#close"}/>
          </svg>
          <span className="slds-assistive-text">Close dialog</span>
        </button>
        <header className="slds-popover__header">
          <div className="slds-media slds-media_center slds-has-flexi-truncate ">
            <div className="slds-media__figure">
              <span className="slds-icon_container slds-icon-utility-error">
                <svg className="slds-icon slds-icon_x-small" aria-hidden="true">
                  <use xlinkHref={process.env.PUBLIC_URL + "/assets/icons/utility-sprite/svg/symbols.svg#error"}/>
                </svg>
              </span>
            </div>
            <div className="slds-media__body">
              <h2 className="slds-truncate slds-text-heading_medium" id="dialog-heading-id-1"
                  title="Resolve error">Grumpy Browser</h2>
            </div>
          </div>
        </header>
        <div className="slds-popover__body" id="dialog-body-id-99">
          <p>Your browser prevented us from opening all these login pages.
            Please try disabling your popup-blocker and try again.
          </p>
        </div>
      </section>
  }

  return (
    <div className="slds-is-relative">
      {popover}
      <button className="slds-button slds-button_neutral" onClick={(event) => {
        event.preventDefault();
        setShowPopover(false);

        let pickerElements = document.querySelectorAll<HTMLAnchorElement>(`.${OPEN_ALL_LINK_CLASS}`);
        let windowRefs: Window[] = [];
        for (let i = 0; i < pickerElements.length; i++) {
          let pickerElement = pickerElements[i];
          let windowRef = window.open(pickerElement.href);
          if (windowRef == null) {
            console.error("Failed to open a link (likely due to a pop-up blocker)");
            setShowPopover(true);
            windowRefs.map(windowRef => windowRef.close());
            return;
          }

          windowRefs.push(windowRef);
        }

        windowRefs[0].focus();
      }}>
        <svg className="slds-button__icon slds-button__icon_left">
          <use xlinkHref={process.env.PUBLIC_URL + "/assets/icons/utility-sprite/svg/symbols.svg#open"}/>
        </svg>
        Open All
      </button>
    </div>
  )
}

function App() {
  return (
    <LoginsModal>
      {logins.map(login_data => <Tile name={login_data.name} link_url={login_data.link_url} key={login_data.link_url}
                                      img_url={login_data.img_url}/>)}
      <AddTile/>
    </LoginsModal>
  )
}

export default App;
