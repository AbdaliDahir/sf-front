import * as React from "react";
import {FormattedMessage} from "react-intl";
import {FormChanges} from "../ViewCasePage";
import {Case} from "../../../../model/Case";

import FormTextAreaInput from "../../../../components/Form/FormTextAreaInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {connect} from "react-redux";
import {CaseCategory} from "../../../../model/CaseCategory";

interface Props {
    caseToBeUpdated: Case,
    updateMode: boolean,
    getClientRequestChanges: (formChanges: FormChanges) => void,
    idAct?: string,
    isCurrUserEliToUpdateImmediateCase:boolean,
    isCurrUserEliToUpdateScaledCase:boolean
}


class ClientRequest extends React.Component<Props, object> {

    constructor(props: Props) {
        super(props);
    }

    public handleClientRequestChange = (event: React.FormEvent<HTMLInputElement>) => {
        const formChanges: FormChanges = {
            clientRequest: event.currentTarget.value
        };
        this.props.getClientRequestChanges(formChanges);
    };

    public render(): JSX.Element {
        const {caseToBeUpdated,isCurrUserEliToUpdateImmediateCase,isCurrUserEliToUpdateScaledCase} = this.props;
        const shouldEdit = this.props.updateMode &&(
            (caseToBeUpdated.category === CaseCategory.SCALED && isCurrUserEliToUpdateScaledCase) ||
            (caseToBeUpdated.category !== CaseCategory.SCALED && isCurrUserEliToUpdateImmediateCase));
        const textAreaValue:string = this.props.idAct ? translate.formatMessage({id: "create.act.client.request"}).concat(translate.formatMessage({id: "act.title." + this.props.idAct}).toLowerCase()) : caseToBeUpdated.clientRequest!=="Pré-enregistrement du dossier par le système" ? caseToBeUpdated.clientRequest : "";
        if (shouldEdit) {
            return (
                <React.Fragment>
                    <strong><FormattedMessage id="cases.client.request"/><span className="text-danger">*</span></strong>
                    <p className="blockquote mt-2">
                        <FormTextAreaInput
                            value={textAreaValue}
                            name="clientRequest"
                            id="clientRequest"
                            validations={{"inputMinLength": 20, "inputMaxLength": 800}}
                            onChangeCapture={this.handleClientRequestChange}/>
                    </p>
                </React.Fragment>
            )
        } else {
            return (
                <div className="text-center">
                    <strong><FormattedMessage id="cases.client.request"/></strong>
                    <p className="blockquote">{caseToBeUpdated.clientRequest}</p>
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        isCurrUserEliToUpdateImmediateCase: state.casePage.isCurrUserEliToUpdateImmediateCase,
        isCurrUserEliToUpdateScaledCase: state.casePage.isCurrUserEliToUpdateScaledCase,
    }
}

export default connect(mapStateToProps)(ClientRequest)