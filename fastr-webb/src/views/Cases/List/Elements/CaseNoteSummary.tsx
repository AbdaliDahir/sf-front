import * as React from "react";

import {Breadcrumb, Col, Row} from "reactstrap";
import {RetentionActResponseDTO} from "../../../../model/acts/retention/RetentionActResponseDTO";
import {FormattedMessage} from "react-intl";
import {CaseNote} from "../../../../model/CaseNote";
import * as moment from "moment";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";

interface Props {
    caseNote: CaseNote
}

interface State {
    retentionResponse?: RetentionActResponseDTO
}

class CaseNoteSummary extends React.Component<Props, State> {

    private DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;

    constructor(props: Props) {
        super(props);
        this.state = {}

    }

    public componentDidMount = async () => {
    }

    public getSummaryData(): string {
        const caseNote = this.props.caseNote
        if (caseNote.contact && caseNote.contact.media) {
            if (caseNote.contact.media.type === "SANS_CONTACT") {
                return translate.formatMessage({id: "contact.media." + caseNote.contact.media.type}) + " VIA " + translate.formatMessage({id: "cases.create.channel." + caseNote.contact.channel})
            } else {
                return translate.formatMessage({id: "contact.media." + caseNote.contact.media.type}) + " " + translate.formatMessage({id: "cases.create.mediaInOrOut." + caseNote.contact.media.direction}) + " VIA " + translate.formatMessage({id: "cases.create.channel." + caseNote.contact.channel})
            }
        }
        return "";
    }


    public render(): JSX.Element {
        const caseNote = this.props.caseNote
        return (
            <React.Fragment>
                <Breadcrumb>
                    <Col>
                        <Row>
                            <div className="mb-3 mr-5">
                            <span className="font-weight-bold"><FormattedMessage
                                id="contactData.summary.creationDate"/> :</span>
                                <br/>
                                {moment(caseNote?.creationDate).format(this.DATETIME_FORMAT)}
                            </div>
                            <div className="mb-3 mr-5">
                            <span className="font-weight-bold"><FormattedMessage
                                id="contactData.summary.contactCreator"/> :</span>
                                <br/>
                                {caseNote.creator ? caseNote.creator.login : ""}
                            </div>
                            <div className="mb-3 mr-5">
                            <span className="font-weight-bold"><FormattedMessage
                                id="contactData.summary.media"/> :</span>
                                <br/>
                                {this.getSummaryData()}
                            </div>
                        </Row>
                        <Row className="d-block">
                            <span className="font-weight-bold"><FormattedMessage
                                id="contactData.summary.description"/> :</span>
                            <br/>
                            {caseNote.description}
                        </Row>
                    </Col>
                </Breadcrumb>
            </React.Fragment>
        )

    }
}

export default (CaseNoteSummary)
