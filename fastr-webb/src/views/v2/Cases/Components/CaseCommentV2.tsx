import React, {Component} from 'react';
import "../../../Cases/Components/Contacts/Media.scss";
import CaseNoteV2 from "./CaseNoteV2";
import {CaseState} from "../../../../store/reducers/v2/case/CasesPageReducerV2";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {FormGroup} from "reactstrap";
import {setCurrentNoteV2} from "../../../../store/actions/v2/case/CaseActions";

interface Props {
    caseId: string
    currentCases: any,
    isEditable: boolean,
    setCurrentNoteV2 : (caseId:string,value:string)=>void,
    currentNoteValue?: string
}

class CaseCommentV2 extends Component<Props> {

    private refToInput?: React.RefObject<any> = React.createRef()

    constructor(props: Props) {
        super(props);
    }

    private currentCaseState = (): CaseState => {
        return this.props.currentCases[this.props.caseId]
    }

    public componentDidMount() {
        const defaultDescriptionValue: string | undefined = this.currentCaseState()?.currentCase?.description;
        if (defaultDescriptionValue) {
            this.refToInput?.current.setValue(defaultDescriptionValue);
        }
    }

    private onChangeNote = (event)=>{
        this.props.setCurrentNoteV2(this.props.caseId,event.currentTarget.value);
    }

    public render() {
        return (
            <section className={"media__wrapper"}>
                <FormGroup>
                    <CaseNoteV2
                        passRef={this.refToInput}
                        onChange={this.onChangeNote}
                        name="description"
                        id="description"
                        forceValue={this.props.currentNoteValue}
                        value={""}
                        disabled={!this.props.isEditable}/>
                </FormGroup>
            </section>

        )
    }
}

const mapStateToProps = (state: AppState) => ({
    currentCases: state.store.cases.casesList
})

const mapDispatchToProps = {
    setCurrentNoteV2
}

export default connect(mapStateToProps,mapDispatchToProps)(CaseCommentV2)

