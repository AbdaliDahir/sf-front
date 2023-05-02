import * as React from "react";
import {FormattedMessage} from "react-intl";
import {CardHeader} from "reactstrap";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import Table from "reactstrap/lib/Table";
import {Case} from "../../../../model/Case";
import {RouteComponentProps, withRouter} from "react-router";
import FastService from "../../../../service/FastService";

interface Props {
    casesList: Array<Case>
    fastTabId: string
}


class ExistingCasesByMotifTable extends React.Component<Props & RouteComponentProps, object> {

    constructor(props: Props & RouteComponentProps) {
        super(props);
    }

    public redirectToUpdateCasePage = (caseId: string) => (event: React.MouseEvent<HTMLElement>) => {
        // TODO la redirection ci-dessous est executee si on est sur FASTR, si on est sur FAST il faut faire un postMessage pour que fast ferme la page en cours et ouvre la page de modification
        if(process.env.NODE_ENV==="development") {
            this.props.history.push("/cases/" + caseId + "/view" + this.props.location.search)
        }

        const url: string = "/cases/" + caseId + "/view" + this.props.location.search + "&edit";
        FastService.postRedirectMessage({
            urlUpdate: url,
            idCase: caseId,
            fastTabId: this.props.fastTabId
        });
        // this.props.history.push(url)
    };

    public renderCasesList(): JSX.Element[] {
        return this.props.casesList.map(
            (recentCase, index) =>
                <tr key={index}>
                    <td><a className={"text-primary btn btn-link"}
                           onClick={this.redirectToUpdateCasePage(recentCase.caseId)}><label><strong>{recentCase.caseId}</strong></label></a>
                    </td>
                </tr>
        )
    }

    public render(): JSX.Element {
        const {casesList} = this.props;
        return (
            <div>
                <Card>
                    <CardHeader>
                        <Row>
                            <Col md={11}>
                                <FormattedMessage id="cases.list.existing.table.title"/>
                            </Col>
                        </Row>
                    </CardHeader>

                    <CardBody>
                        <Table bordered responsive data={casesList}
                               className="w-100 mt-1 table-hover table-sm">
                            <tbody>
                            {this.renderCasesList()}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default withRouter(ExistingCasesByMotifTable)
