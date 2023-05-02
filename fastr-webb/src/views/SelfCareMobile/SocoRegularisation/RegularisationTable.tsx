import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import {
    Badge     ,
    Button    ,
    Card      ,
    CardBody  ,
    CardHeader,
    Col       ,
    Collapse  ,
    Row       ,
    Table     ,
} from "reactstrap";
import { translate } from "src/components/Intl/IntlGlobalProvider";
import { TimeLineRegularisationItem } from "src/model/TimeLine/Regularisation";
import { VALID_REGUL_TYPE_FOR_DETAIL } from "../tools/time_regularisation_mapper";

interface RegularisationTableProps {
    regularisations: TimeLineRegularisationItem[];
    openDetail: (index: string, famille?: string) => void;
}

const RegularisationTable = (props: RegularisationTableProps) => {
    
    const TABLE_HEADERS = [
        "solucitation.regul.table.famille",
        "solucitation.regul.table.libelle",
        "solucitation.regul.table.motif",
        "solucitation.regul.table.statut",
        "solucitation.regul.table.lastupdate",
        "solucitation.regul.table.montant",
        "solucitation.regul.table.period",
        "solucitation.regul.table.details",
    ];
    const [isCollapse, setIsCollapse] = useState(true);
    return (
        <div>
            <Card>
                <CardHeader>
                    <Row>
                        <Col className="align-middle" md={11}>
                            <Badge color="primary" className="m-1" />
                            <h4>
                                <FormattedMessage id="timeline.regul.table.title" />
                            </h4>
                        </Col>
                        <Col md={1}>
                            <Button
                                color="primary"
                                className="btn-sm p-1"
                                onClick={() => setIsCollapse(!isCollapse)}
                            >
                                <span className="icon-white icon-down p-0" />
                            </Button>
                        </Col>
                    </Row>
                </CardHeader>
                <Collapse isOpen={isCollapse}>
                    <CardBody>
                        <Table
                            bordered
                            className="table table-sm mt-2 table-hover text-center"
                        >
                            <thead title={translate.formatMessage({ id: "note.list" })}>
                                <tr>
                                    {TABLE_HEADERS.map((header) => (
                                        <th key={header}>
                                            <FormattedMessage id={header} />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {props.regularisations.map(
                                    (regul: TimeLineRegularisationItem) => {
                                        return (
                                            <tr key={regul.id}>
                                                <td>{regul.famille}</td>
                                                <td>{regul.libelle}</td>
                                                <td>{regul.motif}</td>
                                                <td>{regul.status}</td>
                                                <td>{regul.lastUpdate}</td>
                                                <td>{regul.montant}</td>
                                                <td>{regul.period}</td>
                                                <td>
                                                    {regul.famille &&
                                                        VALID_REGUL_TYPE_FOR_DETAIL[regul.famille] && (
                                                            <span
                                                                className="background-magnifying-glass"
                                                                id={regul.id}
                                                            >
                                                                <span
                                                                    className="icon-white icon-search cursor-pointer"
                                                                    onClick={() =>
                                                                        props.openDetail(
                                                                            regul.id ?? "",
                                                                            regul.famille
                                                                        )
                                                                    }
                                                                />
                                                            </span>
                                                        )}

                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </Table>
                    </CardBody>
                </Collapse>
            </Card>
        </div>
    );
};

export default RegularisationTable;
