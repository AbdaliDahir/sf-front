import * as React from "react";
import {useEffect} from "react";
import SessionService from "../../../service/SessionService";
import {Redirect} from "react-router";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {Container} from "reactstrap";
import {ApplicativeUser} from "../../../model/ApplicativeUser";
import {logOut} from "../../../store/reducers/v2";

const LogoutPage = () => {

    const dispatch = useDispatch();
    const user: ApplicativeUser | undefined = useTypedSelector(state => state.sessionSlice.user);

    useEffect(() => {
        SessionService.logout();
        dispatch(logOut());
    }, [])

    return user ? <Container/> : <Redirect to={"/login"}/>;
}

export default LogoutPage