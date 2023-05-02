import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Badge, CardBody, Col, Row} from "reactstrap";
import {Service} from "../../../../model/service";
import Table from "reactstrap/lib/Table";
import CardHeader from "reactstrap/lib/CardHeader";
import Card from "reactstrap/lib/Card";
import Collapse from "reactstrap/lib/Collapse";
import UXUtils from "../../../../utils/UXUtils";

interface Props {
    servicesByBillingAccountId: Service[] | undefined
}

interface State {
    collapse: boolean;
}

export default class ServicesListByBillingAccountId extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: true,
        }
    }

    public toggleServices = () => {
        this.setState(prevState => ({collapse: !prevState.collapse}));
    };

    public render(): JSX.Element {
        const {collapse} = this.state;
        const {servicesByBillingAccountId} = this.props;
        if (servicesByBillingAccountId !== undefined && servicesByBillingAccountId !== null && servicesByBillingAccountId.length > 0) {
            return (
                <Row>
                    <Col md={6}>
                        <Card>
                            <CardHeader>
                                <Row onClick={this.toggleServices} className={"align-items-center"}>
                                    <Col md={10}>
                                        <Badge color={servicesByBillingAccountId.length === 0 ? "secondary" : "primary"}
                                               className={"m-1"}>{servicesByBillingAccountId.length}</Badge>
                                        <FormattedMessage id="act.address.services.in.table"/>
                                    </Col>
                                    <Col md={2}>
                                        <i className={"p-0 icon float-right " + (collapse ? "icon-down" : "icon-up")}/>
                                    </Col>
                                </Row>
                            </CardHeader>

                            <Collapse isOpen={!collapse}>
                                <CardBody className={"p-0"}>
                                    <Table bordered responsive className="w-100 m-0 table-hover table-sm">
                                        <thead className={"bg-secondary"}>
                                        <tr>
                                            <th data-sortable="true"><FormattedMessage
                                                id="act.address.services.number.table"/>
                                            </th>
                                            <th data-sortable="true"><FormattedMessage
                                                id="act.address.services.id.table"/>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {servicesByBillingAccountId.map((service, index) =>
                                            <tr key={index} className={"hover-bg-none"}>
                                                <td onClick={UXUtils.copyValueToClipboard} className={"hover-bg-secondary cursor-pointer"}>{service.label}</td>
                                                <td onClick={UXUtils.copyValueToClipboard} className={"hover-bg-secondary cursor-pointer"}>{service.id}</td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Collapse>
                        </Card>
                    </Col>
                </Row>)
        } else {
            return (<React.Fragment/>)
        }
    }
}
