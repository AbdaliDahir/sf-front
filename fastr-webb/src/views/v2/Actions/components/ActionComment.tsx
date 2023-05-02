import React, {Component} from 'react';
import {connect} from "react-redux";
import {FormGroup} from "reactstrap";
import {setActionComment} from "../../../../store/actions/v2/case/CaseActions";
import "../../../Cases/Components/Contacts/Media.scss"
import ActionNote from "./ActionNote";

interface Props {
    caseId: string
    readOnly: boolean,
    setActionComment : (caseId:string,value:string)=>void,
}

class ActionComment extends Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    private onChangeActionNote = (event)=>{
        this.props.setActionComment(this.props.caseId, event.currentTarget.value);
    }

    public render() {
        return (
            <section className={"media__wrapper"}>
                <FormGroup>
                    <ActionNote
                        onChange={this.onChangeActionNote}
                        name="action.comment"
                        id="comment"
                        value={""}
                        disabled={this.props.readOnly}/>
                </FormGroup>
            </section>

        )
    }
}

const mapDispatchToProps = {
    setActionComment
}

export default connect(null,mapDispatchToProps)(ActionComment)

