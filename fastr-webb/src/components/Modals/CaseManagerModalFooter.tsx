import * as React from "react";
import {Button, ModalFooter} from "reactstrap";
import {FormattedMessage} from "react-intl";
import {AppState} from "../../store";
import {connect} from "react-redux";
import {toggleModalForCaseManager} from "../../store/actions/ModalAction";

interface Props {
    toggleModalForCaseManager: () => void
    isFormsyValid: boolean
}

 class CaseManagerModalFooter extends React.Component<Props > {

    constructor(props: Props ) {
        super(props);
    }


    public render(): JSX.Element {
        return (
            <ModalFooter>
                <Button color="light" onClick={this.props.toggleModalForCaseManager}><FormattedMessage
                    id="cases.button.cancel"/></Button>
                <Button submit color="primary" disabled={!this.props.isFormsyValid}>
                    <FormattedMessage
                        id="cases.button.submit"/></Button>

            </ModalFooter>        )
    }
}

const mapStateToProps = (state: AppState) => ({
    isFormsyValid: state.casePage.isFormsyValid,
})

export default connect(mapStateToProps,{toggleModalForCaseManager})(CaseManagerModalFooter)