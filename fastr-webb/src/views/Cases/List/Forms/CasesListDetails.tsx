import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import {Case} from "../../../../model/Case";
import RecentCasesTable from "../Elements/RecentCasesTable";
import {State} from "../ListRecentCasesPage";


export interface Props {
    casesList: Array<Case>;
    idService?: string
    authorizations
}

export default class CasesListDetails extends React.Component<Props, State> {

    public render(): JSX.Element {
        const {casesList, idService} = this.props;
        return (
            <div>
                <Row className="mt-2">
                    <Col md={12}>
                        <RecentCasesTable casesRecentList={casesList} idService={idService} authorizations={this.props.authorizations}/>
                    </Col>
                </Row>
            </div>
        );
    }
}
