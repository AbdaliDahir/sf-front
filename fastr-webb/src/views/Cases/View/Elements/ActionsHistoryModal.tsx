import * as React from "react";
import "../../View/ViewCase.scss"
import "./ActionHistory.scss"
import Modal from "react-bootstrap/Modal";
import {FormattedMessage} from "react-intl";
import ActionDetailHistory from "./ActionDetailHistory";
import * as moment from "moment";
import {Action} from "../../../../model/actions/Action";
import ActionDetail from "./ActionDetail";


interface Props {
    actions?: Action[]
    index: number
    isOpen: boolean
    notifyParentOnChange: (index: number) => void,
    action?: Action
}

interface State {
    historyModalIsOpen?: boolean
}


export class ActionsHistoryModal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            historyModalIsOpen: false
        };
    }


    public shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: Readonly<void>): boolean {
        if (nextProps.isOpen !== this.state.historyModalIsOpen) {
            this.setState({
                historyModalIsOpen: nextProps.isOpen
            });
            return true;
        } else if (nextState.historyModalIsOpen === false && nextProps.isOpen) {
            this.setState({
                historyModalIsOpen: false
            });
            this.notifyParent();
            return true;
        } else {
            return false;
        }
    }

    public closeModal = () => {
        this.setState({
            historyModalIsOpen: false
        });
    };

    public notifyParent = () => {
        this.props.notifyParentOnChange(this.props.index);
    };

    public render() {
        const action = this.props.action
        if (action) {
            return (
                <Modal show={this.state.historyModalIsOpen} onHide={this.closeModal} dialogClassName="lg"
                       className={"text-smaller"}>
                    <Modal.Header onHide={this.closeModal} className={"text-center font-weight-bold card-header"}
                                  closeButton>
                        <div className={"text-center font-weight-bold"}>
                            <span><FormattedMessage id={"actions.history.modal.header.title"}/> n° {action?.actionId} : </span>
                            <span>{action?.actionLabel}</span>
                            <span> du </span>
                        </div>
                        {action?.creationDate &&
                            <div
                                className={"text-center font-weight-bold"}>&nbsp;{moment(action?.creationDate).format(process.env.REACT_APP_FASTR_DATETIME_FORMAT)}</div>
                        }
                    </Modal.Header>
                    <Modal.Body>
                        <ActionDetail action={action}/>
                        <ActionDetailHistory action={action}/>
                    </Modal.Body>
                </Modal>
            )
        } else {
            return (<React.Fragment/>);
        }
    }
}