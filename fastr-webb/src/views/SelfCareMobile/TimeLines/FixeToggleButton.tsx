import * as React from "react";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import Switch from "../../../components/Bootstrap/Switch";
import {FormattedMessage} from "react-intl";
import {ToggleParams} from "../../../model/TimeLine/ToggleParams";

interface Props {
    params: ToggleParams
    changeSwitchStatus
}

const FixeToggleButton = (props: Props) => {
    const {params, changeSwitchStatus} = props
    return (
        <div>
            {params.isAuthorized ?
                <Container>
                    <Row className={"totalDiscount"}>
                        <Col>
                            <Row>
                                <div className="d-flex align-items-center justify-content-start">
                                    <div className="ml-3 mr-3">
                                        {params.thickness ?
                                            <Switch name={params.id} id={params.id}
                                                    color={params.color}
                                                    thickness={params.thickness}
                                                    onChange={changeSwitchStatus} checked={params.checked}/>
                                        : <Switch name={params.id} id={params.id}
                                                  color={params.color}
                                                  onChange={changeSwitchStatus} checked={params.checked}/>
                                        }
                                    </div>
                                    <div>
                                        <span className="font-weight-light"><FormattedMessage id={params.label}/></span>
                                    </div>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Container>
                : <React.Fragment />
            }
        </div>
    )
}

export default FixeToggleButton