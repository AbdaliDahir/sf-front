import * as React from "react";
import iconSfr from "../../img/sfrIconDegrade.svg";
import {Card, CardBody} from "reactstrap";
import {translate} from "../../components/Intl/IntlGlobalProvider";
import {useHistory} from "react-router";
import {useEffect} from "react";
import SessionService from "../../service/SessionService";
import {logOut} from "../../store/reducers/v2";
import {useDispatch} from "react-redux";
import { useTypedSelector } from "src/components/Store/useTypedSelector";
import { AppState } from "src/store";
import { ApplicationMode } from "src/model/ApplicationMode";

const AccesDeniedPage = () =>  {
    const sessionIsFrom = useTypedSelector((state: AppState) => state.store.applicationInitialState.sessionIsFrom)
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        SessionService.logout();
        dispatch(logOut());
    }, [])
    const handleConnect = () => {
        history.push("/login");
    }
    const isFromGoFastr = () => {
        return sessionIsFrom === ApplicationMode.GOFASTR;
    }
    return (
        <>
            <div className="row bg-gradient-red linear height-33">
                <div className="col-lg col-md">
                    <img src={iconSfr} className={"mt-4 ml-4"} width="55" height="55"/>
                </div>
                <div className="col-lg-5 col-md-5">
                    <div className="mt-10 text-white text-center h2">
                        {translate.formatMessage({id: "acces.denied.page.title"})}
                    </div>
                    <Card className={"mt-5 login-box col-lg-5 col-md-5 position-fixed"}>
                    <CardBody>
                        <span className="jfjfj"/>
                        <div className="text-center mt-2">
                            <div className="mt-5 alert alert-white-primary text-primary">
                                <p>{translate.formatMessage({id: "acces.denied.page.body"})}</p>
                            </div>
                                {isFromGoFastr() ? <div>
                                    <button className="btn btn-primary" onClick={handleConnect}>Se connecter</button>
                                </div> : <></>}

                        </div>
                    </CardBody>
                    </Card>
                </div>
                <div className="col-lg col-md"/>
            </div>

        </>
    )
}

export default  AccesDeniedPage