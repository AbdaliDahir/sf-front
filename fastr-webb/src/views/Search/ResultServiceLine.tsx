import * as React from "react";
import {Badge, Button, Card, Container, ListGroupItem, UncontrolledPopover,} from "reactstrap";
import {BlockingContext} from "../App";
import {Service as Service} from "../../model/service/Service";
import {ServiceStatus} from "../../model/service";
import {FormattedMessage} from "react-intl";
import {Client} from "../../model/person";
import {connect} from "react-redux";
import {AppState} from "../../store";
import UXUtils from "../../utils/UXUtils";
import {SearchResult} from "../../model/person/SearchResult";

interface Props {
    onClick?: (client: Client, service: Service) => void
    service: Service
    client: SearchResult
    authorizations: string[]
}

class ResultServiceLine extends React.Component<Props, object> {
    public static contextType = BlockingContext;

    public onClick = () => {
        if (this.props.onClick) {
            this.props.onClick(this.props.client, this.props.service);
        }
    }

    public renderBadge(status: ServiceStatus) {
        let badgeColor;
        switch (status) {
            case "ACTIVE":
                badgeColor = "success";
                break;
            case "CANCELED":
            case "REJECTED":
            case "TERMINATED":
                badgeColor = "danger";
                break;
            case "CREATED":
                badgeColor = "info";
                break;
            case "SUSPENDED":
                badgeColor = "warning";
                break;
        }

        return (
            badgeColor ?
                <Badge color={badgeColor} pill className={"w-50"}>
                    <FormattedMessage id={this.props.service.status}/>
                </Badge>
                :
                ""
        );
    }

    private scoreColor = () => {
        if (this.props.client.score > 0.89) {
            return "success";
        } else if (this.props.client.score > 0.49) {
            return "warning";
        } else {
            return "error";
        }
    }

    public superUserInfos = () => {
        const id = "superUserInfos_" + this.props.service.id + "_" + this.props.client.id;
        return (
            <React.Fragment>
                <Badge id={id} color={"gray"} className={"cursor-pointer p-1 hover-bg-secondary"} pill>?</Badge>
                <UncontrolledPopover target={id}
                                     trigger="focus click"
                                     placement="bottom">
                    <Card className={"p-2"}>
                        <Container>
                            <div className={"row flex-row-reverse"}>
                                <Button className={"btn-sm"} color={"danger"}
                                        onClick={() => document.getElementById(id)?.click()}>X</Button>
                            </div>
                            <div className={"row"}>
                                <b>Score :</b><span className={"ml-1 text-" + this.scoreColor()}>{this.props.client?.score}</span>
                            </div>
                            <div className={"row"}>
                                <b>ID Client :</b><span className={"ml-1 cursor-pointer hover-bg-secondary"}
                                                         onClick={UXUtils.copyValueToClipboard}>{this.props.client?.id}</span>
                            </div>
                            <div className={"row"}>
                                <b>ID Service :</b><span className={"ml-1 cursor-pointer hover-bg-secondary"}
                                                          onClick={UXUtils.copyValueToClipboard}>{this.props.service?.id}</span>
                            </div>
                            <div className={"row"}>
                                <b>ID CompteFactu :</b><span className={"ml-1 cursor-pointer hover-bg-secondary"}
                                                              onClick={UXUtils.copyValueToClipboard}>{this.props.service?.billingAccount?.id}</span>
                            </div>
                            <div className={"row"}>
                                <b>ID scs :</b><span className={"ml-1 cursor-pointer hover-bg-secondary"}
                                                      onClick={UXUtils.copyValueToClipboard}>{this.props.client.scs}</span>
                            </div>
                            <div className={"row"}>
                                <b>ID csu :</b><span className={"ml-1 cursor-pointer hover-bg-secondary"}
                                                      onClick={UXUtils.copyValueToClipboard}>{this.props.client.csu}</span>
                            </div>
                        </Container>
                    </Card>
                </UncontrolledPopover>
            </React.Fragment>
        )
    }

    public render(): JSX.Element {
        return (
            <ListGroupItem className="p-0 d-flex">
                <div
                    className="w-100 d-flex justify-content-between cursor-pointer px-2 py-1 hover-bg-secondary align-items-center rounded"
                    onClick={this.onClick}>
                    <strong>{this.props.service.label}</strong>
                    {this.renderBadge(this.props.service.status)}
                </div>
                {(this.props.authorizations.indexOf("isSuperUser") >= 0) && this.superUserInfos()}
            </ListGroupItem>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    authorizations: state.store.applicationInitialState?.authorizations
});

export default connect(mapStateToProps)(ResultServiceLine)