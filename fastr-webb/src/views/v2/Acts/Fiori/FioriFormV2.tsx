import * as React from "react";
import {connect} from "react-redux";
import "./FioriFormV2.scss"
import {AppState} from "../../../../store";
import ExternalLinksBlock from "../../../Clients/ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../../../Clients/ExternalAppsConfig";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {Contact} from "../../../../model/Contact";

interface Props {
    caseId:string,
    adgCode: string,
    qualificationLeaf,
    client: ClientContextSliceState,
    currentContact: Contact | undefined
}

class FioriFormV2 extends React.Component<Props> {

    private externalAppsSettings = BlocksExternalAppsConfig.adg.fiori;

    constructor(props) {
        super(props);
    }

    public componentDidMount = async () => {
    };

    public renderAccessOk = () => {
        const idParams = {
            caseId: this.props.caseId,
            serviceId: this.props.client.serviceId,
            clientId: this.props.client.clientData?.id,
            contactId: this.props.currentContact?.contactId
        };
        return <section>
            <section className="fiori-form__top-section">
                <label className="fiori-form__label">Actions dans FIORI</label>
                {this.externalAppsSettings &&
                <section className="fiori-form__links-section">
                    <div className="mr-5">
                        <ExternalLinksBlock settings={this.externalAppsSettings.common}
                                            idParams={{...idParams, idApp: 'CONSULTATION'}}
                                            isLoading={true}
                                            isQualificationLeaf={this.props.qualificationLeaf}
                                            indsideFastrCase={true}/>
                    </div>
                    <div className="ml-5">
                        <ExternalLinksBlock settings={this.externalAppsSettings[this.props.adgCode]}
                                            idParams={{...idParams, idApp: this.externalAppsSettings[this.props.adgCode][0].value}}
                                            isLoading={true}
                                            isQualificationLeaf={this.props.qualificationLeaf}
                                            indsideFastrCase={true}/>
                    </div>
                </section>
                }
            </section>
        </section>
    };

    public render(): JSX.Element {
        return (
            <section>
                {this.renderAccessOk()}
            </section>
        )
    }

}

const mapStateToProps = (state: AppState,ownProps) => ({
    qualificationLeaf: state.store.cases.casesList[ownProps.caseId]?.qualificationLeaf,
    client: state.store.client.currentClient,
    currentContact: state.store.contact.currentContact
});

export default connect(mapStateToProps)(FioriFormV2)

