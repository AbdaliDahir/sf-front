import * as React from "react";
import {connect} from "react-redux";
import {ModalBody} from "reactstrap";
import {NoteFormForModal} from "./component/mandatory/NoteFormForModal";
import {Payload} from "../../views/Cases/View/ViewCasePage";

import {AppState} from "../../store";
import ResolutionDunningTriggers from "./component/optional/ResolutionDunningTriggers";
import ContactFormForModal from "./component/mandatory/ContactFormForModal";

interface Props {
    payload: Payload
    defaultNoteText?: string
}

interface State {
    addContactForNote: boolean
}

class CaseManagerModalBody extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            addContactForNote: true,
        }
    }


    public render(): JSX.Element {
        const {defaultNoteText, payload} = this.props
        return (
            <ModalBody>
                <ContactFormForModal name="contact" payload={payload}/>
                {/*Motifs de relance de résolution de dossier*/}
                <ResolutionDunningTriggers/>
                <NoteFormForModal name="note" defaultNoteText={defaultNoteText}/>
            </ModalBody>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    isFormsyValid: state.casePage.isFormsyValid,
    retrievedCase: state.case.currentCase,
    updateMode: state.casePage.updateMode,
})

export default connect(mapStateToProps)(CaseManagerModalBody)
