import * as React from "react";
import {connect} from "react-redux";
import "./FioriForm.scss"
import {AppState} from "../../../store";
import {BlocksExternalAppsConfig} from "../../Clients/ExternalAppsConfig";
import ExternalLinksBlock from "../../Clients/ExternalLinksBlock";

interface Props {
    adgCode: string,
    payload,
    qualificationLeaf
}

class FioriForm extends React.Component<Props> {

    private externalAppsSettings = BlocksExternalAppsConfig.adg.fiori;

    constructor(props) {
        super(props);
    }

    public componentDidMount = async () => {
    };

    public renderAccessOk = () => {
        const idParams = {
            caseId: this.props.payload.idCase,
            serviceId: this.props.payload.idService,
            clientId: this.props.payload.idClient,
            contactId: this.props.payload.idContact
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

const mapStateToProps = (state: AppState) => ({
    qualificationLeaf: state.casePage.qualificationLeaf
});

export default connect(mapStateToProps)(FioriForm)

