import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const HelpModal = ({ active, onClickClose }) => {
    return (
        <div aria-label="help info" className={active ? 'modalActive' : 'modalInactive'}>
            <div className="modal-info">
              <span className="title">This is what each position means</span>
              <div className="asterisks">*<sub>1</sub> *<sub>2</sub> *<sub>3</sub> *<sub>4</sub> *<sub>5</sub></div>
              <div className="explanation">
                <div>1 - minutes</div>
                <div>2 - hours</div>
                <div>3 - day of the month (eg, the 20th)</div>
                <div>4 - month</div>
                <div>5 - day of the week (eg, Monday)</div>
              </div>
            </div>
            <div role="button" aria-label="cancel button" className="cancel-button">
                <FontAwesomeIcon icon={faTimesCircle} onClick={onClickClose} />
            </div>
        </div>
    )
}

export default HelpModal;