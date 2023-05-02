import * as React from "react";
import {Container} from "reactstrap";
import {BlockingContext} from "../App";

import {connect} from "react-redux";
import {toggleBlockingUI} from "src/store/actions/UIActions";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import LoginPage from "../v2/Login/LoginPage";

// Components

interface Props {
    toggleBlockingUI: () => void
}

class HomePage extends React.Component<Props> {
    public static contextType = BlockingContext;


    // tslint:disable-next-line:no-any
    public onSubmit = (obj: any) => {
        console.error(obj);
    }

    public render(): JSX.Element {
        return (
            <Container>
                <LoginPage/>
            </Container>
        );
    }
}

export default connect(null, {toggleBlockingUI})(HomePage)