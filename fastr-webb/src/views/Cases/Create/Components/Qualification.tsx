import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Breadcrumb, BreadcrumbItem, CardHeader, Col, Row, UncontrolledAlert} from "reactstrap";
import {CaseQualification} from "../../../../model/CaseQualification";
import {AppState} from "../../../../store";

interface Props {
    isScalingMode: boolean
    motif: CaseQualification
    adgFailureReason?: string
}

class Qualification extends Component<Props> {
    public render() {
        const {caseType, tags} = this.props.motif;
        const displayedType = caseType;
        const qualif = tags.map((e, i) => (<BreadcrumbItem key={i}>{e}</BreadcrumbItem>))
        return (
            <div>
                {!!this.props.adgFailureReason && <Row><Col md={12}><UncontrolledAlert color="danger" fade={false}><FormattedMessage
                    id="Act has failed"/>{this.props.adgFailureReason}</UncontrolledAlert></Col></Row>}
                {!this.props.isScalingMode ?
                    <div>
                        <CardHeader className="bg-light font-weight-bold mt-2">
                            <span className="icon-gradient icon-rom mr-2"/>
                            <FormattedMessage id={"cases.get.details.qualification"}/></CardHeader>
                        <Breadcrumb>
                            <h6>{caseType === 'Motif'|| caseType === 'Thème'? displayedType :""}</h6>{qualif}
                        </Breadcrumb>
                    </div>
                    : <React.Fragment/>
                }
            </div>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    isScalingMode: state.casePage.isScalingMode,
    motif: state.casePage.motif,
    adgFailureReason: state.casePage.adgFailureReason
})


export default connect(mapStateToProps)(Qualification)
