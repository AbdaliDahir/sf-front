import * as React from 'react';
import {FormattedMessage} from "react-intl"
import {Button} from "reactstrap"

interface Props {
    value: boolean
}

class RestitutionCaseDataBoolean extends React.Component<Props> {
    public render() {
        return this.props.value ? (<Button size="sm" color="primary" id="yes" value="yes" disabled>
                <FormattedMessage id={"component.switch.yes"}/>
            </Button>
        ) : (
            <Button size="sm" color="primary" id="no" value="no" disabled>
                <FormattedMessage id={"component.switch.no"}/>
            </Button>
        )
    }
}

export default RestitutionCaseDataBoolean;