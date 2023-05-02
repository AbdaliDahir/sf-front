import React from 'react';
import {FormGroup} from "reactstrap";
import LineActivationSteps from "./LineActivationSteps"

const Dashboard = () => {
        return (
            <React.Fragment>
                <FormGroup>
                    <LineActivationSteps/>
                </FormGroup>
            </React.Fragment>
        )
}

export default Dashboard