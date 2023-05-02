import React, {useState} from "react";
import Loading from "../../components/Loading";
import {useTypedSelector} from "../../components/Store/useTypedSelector";
import {authenticateDistrib, SessionSliceState} from "../../store/SessionSlice";
import {useDispatch} from "react-redux";
import {Alert, Col, Container, Row} from "reactstrap";
import {Redirect} from "react-router";

const AuthDistrib = () => {

    const search = window.location.search;
    const params = new URLSearchParams(search);
    const clientId = params.get('clientId');
    const serviceId = params.get('serviceId');
    const channel = params.get('channel');
    //Pour palier le cross origin
    const [initAuth, setInitAuth] = useState(false)
    const dispatch = useDispatch();
    const session: SessionSliceState = useTypedSelector(state => state.sessionSlice);

    const loading = <Container className="bg-light h-100" fluid>
        <Row className="h-100 d-flex align-items-center">
            <Loading/>
        </Row>
    </Container>

    if (clientId === null || serviceId === null) {
        return <Container className="bg-light h-100" fluid>
            <Row className="h-100 d-flex align-items-center">
                <Col md={{size: 6, offset: 3}}>
                    <Alert className="text-center" color="danger">
                        <h4 className="alert-heading">Erreur</h4>
                        L'ID client ou service n'à pas été fourni par Mars.
                    </Alert>
                </Col>
            </Row>
        </Container>
    }

    if (session.loading) {
        return loading
    } else if (session.error) {

        return (
            <Container className="bg-light h-100" fluid>
                <Row className="h-100 d-flex align-items-center">
                    <Col md={{size: 6, offset: 3}}>
                        <Alert className="text-center" color="danger">
                            <h4 className="alert-heading">Erreur</h4>
                            {session.error}
                        </Alert>
                    </Col>
                </Row>
            </Container>
        )
    } else {
        if (session.user === undefined && !initAuth) {
            setInitAuth(true)
            dispatch(authenticateDistrib(channel));
            return loading
        } else {
            return (<Redirect to={"/client/" + clientId + "/service/" + serviceId}/>)
        }
    }
}

export default AuthDistrib