import * as React from 'react';
import {Card, CardBody, Col, Row} from "reactstrap";

interface Props {
    changeValidation?: (isValid: boolean) => void
}

class SecondStepMock extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
    }

    // That means no Validation required
    public componentDidMount(): void {
        if (this.props.changeValidation) {
            this.props.changeValidation(true)
        }
    }


    public render() {

        return (
            <div>
                <Card className="mt-1">
                    <CardBody className="p-1">
                        <Row>
                            <Col md={3} >
                                    TESTTETETSTSTTS
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default SecondStepMock;