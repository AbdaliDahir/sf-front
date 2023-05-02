import * as React from "react";
import {FormChanges} from "../ViewCasePage";
import {Case} from "../../../../model/Case";
import FormTextAreaInput from "../../../../components/Form/FormTextAreaInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {connect} from "react-redux";

interface Props {
    caseToBeUpdated: Case,
    caseRetreived: Case,
    getNoteChanges: (formChanges: FormChanges) => void,
    disabled? : boolean
    idAct?:string,
    value?:string,
    isFromAutoAssign
}


class NoteForEdition extends React.Component<Props, object> {

    constructor(props: Props) {
        super(props);
    }

    public handleNoteChange = (event: React.FormEvent<HTMLInputElement>) => {
        const formChanges: FormChanges = {
            noteDescription: event.currentTarget.value
        };
        this.props.getNoteChanges(formChanges);
    };

    private computeValue= ()=>{
        if(this.props.isFromAutoAssign
            && this.props.caseRetreived?.notes?.length>0
            && !this.props.value){
            const comment = this.props.caseRetreived.notes;
            return  comment[comment.length-1].description
        }
        if(this.props.value){
            return this.props.value;
        }else {
            return this.props.idAct ? translate.formatMessage({id: "create.act.note.description"})
                .concat(translate.formatMessage({id: "act.title." + this.props.idAct}).toLowerCase()) : ""
        }
    }

    public render(): JSX.Element {
            return (
                <div>
                    <p className="blockquote m-0">
                        <FormTextAreaInput validations={{"inputMinLength": 20, "inputMaxLength": 4000}}
                                           className={"m-0"}
                                           name="description"
                                           id="description"
                                           onChangeCapture={this.handleNoteChange}
                                           value={this.computeValue()}
                                           disabled={this.props.disabled}
                                           placeholder={"Ecrire ici la réponse apportée au client"}
                        />
                    </p>
                </div>
            )
        }
}
function mapStateToProps(state) {
    return {
        caseRetreived: state.case.currentCase,
        isFromAutoAssign: state.casePage.isFromAutoAssign
    }
}
export default connect(mapStateToProps)(NoteForEdition)