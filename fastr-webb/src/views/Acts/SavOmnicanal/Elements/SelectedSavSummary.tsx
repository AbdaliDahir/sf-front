import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import Label from "reactstrap/lib/Label";
import {SavSummary, SavAct, Sav} from "../../../../model/acts/savOmnical/Sav"
import {SavHistoric} from "./SavHistoric"
import { FormattedMessage } from "react-intl";

interface Props {
    savSummary: SavSummary
    isSavSummaryLoading?: boolean
    sav?: Sav;
}
interface State {
    comment?: string
    listOfSav?: Array<SavAct>
}

class SelectedSavSummary extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state={
            comment: "",
            listOfSav: []
        }
    }

    public componentDidMount = () => {
        const {savSummary} = this.props
        const lastAct = savSummary && savSummary.savActs && savSummary.savActs.length > 0 ? savSummary.savActs.slice(-1)[0] : {};
        this.setState({
            comment:  lastAct?.actDetail?.suiviSav?.comment ? lastAct.actDetail.suiviSav.comment : '',
            listOfSav: savSummary?.savActs && savSummary?.savActs.length > 0 ? savSummary.savActs : []
        });
    }

    public componentDidUpdate = (prevProps) => {
        if (this.props.savSummary !== prevProps.savSummary) {
            const {savSummary} = this.props
            const lastAct = savSummary && savSummary.savActs && savSummary.savActs.length > 0 ? savSummary.savActs.slice(-1)[0]: undefined;
            this.setState({
                comment: lastAct?.actDetail?.suiviSav?.comment ? lastAct.actDetail.suiviSav.comment : '',
                listOfSav: savSummary?.savActs && savSummary?.savActs?.length > 0 ? savSummary.savActs: []
            });
        }
    }


    public renderComment = () => {
        const comment = this.state.comment !== '' ? this.state.comment : '';
        const {isSavSummaryLoading} = this.props
        return (

            <React.Fragment>
                {isSavSummaryLoading ?
                    <span className="font-weight-light font-italic"><FormattedMessage id="adg.sav.omnicanal.get.sav.list.loading"/></span>
                    : <div>
                        {comment &&
                        <Row>
                            <Col md={7}>
                                <strong>
                                    <Label>
                                        <FormattedMessage id="adg.sav.omnicanal.get.sav.comment.title"/>
                                    </Label>
                                </strong>
                            </Col>
                        </Row> }
                        <div>{comment ? comment : <span className="font-weight-bold"><FormattedMessage id="adg.sav.omnicanal.get.sav.no.comment.found"/></span>}</div>
                    </div>
                }
            </React.Fragment>
        )
    }


    public render(): JSX.Element {
        const {savSummary: {currentStatus, replacementProduct, statusHistory}, sav} = this.props;
        const {listOfSav} = this.state;
        const savStatus = statusHistory && statusHistory?.length > 0 ? statusHistory : [];
        return (
            <div>
            {this.props.savSummary &&
                <div>
                    {/* <Row className="pl-4 pt-3 pr-4">
                        <Col md={10}>
                            <div className="sav-omnicanal__title">
                                <FormattedMessage id="adg.sav.omnicanal.infos"/>
                            </div>
                        </Col>
                    </Row> */}
                    <Row className="mt-2 pl-4 pr-4">
                        <Col md={4}>
                            <p className="mb-2">
                                <span> <strong><FormattedMessage id="adg.sav.omnicanal.ref.case"/></strong></span>
                                <br/>
                                {sav && sav.globalcareReference ? sav.globalcareReference : ''}
                            </p>
                            <p className="mb-2">
                                <strong><FormattedMessage id="adg.sav.omnicanal.supported"/></strong>
                                <br/>
                                {sav && sav.statusDate ? sav.statusDate : ''}
                            </p>
                            <p className="mb-2">
                                <strong><FormattedMessage id="adg.sav.omnicanal.treated.by"/></strong>
                                <br/>
                                {currentStatus && currentStatus.userName ? currentStatus.userName : ''}
                            </p>
                            {replacementProduct && <p className="mb-2"> <div>
                                    <strong><FormattedMessage id="adg.sav.omnicanal.product.replacement"/></strong>
                                    <br/>
                                    {replacementProduct ? 'OK' : ''}
                                </div></p>
                            }  
                        </Col>

                        <Col md={8}>
                            {this.renderComment()}
                        </Col>
                    </Row>
                    <Row className="mt-0 pl-3">
                        <SavHistoric listOfSav={listOfSav} savStatus={savStatus}/>
                    </Row>
                </div>
            }
            </div>
        )
    }
}

export default SelectedSavSummary
