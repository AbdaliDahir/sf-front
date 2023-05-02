import * as React from "react";
import {useState} from "react";
import {Redirect} from "react-router";
import {useDispatch} from "react-redux";
import {Card, CardBody, Modal} from "reactstrap";
import {authenticateLogin, SessionSliceState} from "../../../store/SessionSlice";
import Loading from "../../../components/Loading";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import CardHeader from "reactstrap/lib/CardHeader";

import iconSfr from "../../../img/sfrIconDegrade.svg"
import './LoginPage.scss';

const LoginPage = () => {

  const dispatch = useDispatch();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const session: SessionSliceState = useTypedSelector(state => state.sessionSlice);

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(authenticateLogin(username, password));
  };

  if (session.user !== undefined) {
    return (<Redirect to={"/activities/"}/>);
  } else {
    return (
        <React.Fragment>
          <div className="row bg-gradient-red linear height-33">
            <div className="col-lg col-md">
              <img src={iconSfr} className={"mt-4 ml-4"} width="55" height="55"/>
            </div>
            <div className="col-lg-5 col-md-5">
              <div className="mt-10 text-white text-center h2">
                Bienvenue sur FAST'R
              </div>
              <Card className={"mt-5 login-box col-lg-5 col-md-5 position-fixed"}>
                <CardHeader className="h5" style={{
                  borderTop: 'none',
                  backgroundColor: "#fff",
                  borderBottom: '1px solid #e9e9e9'
                }}>
                  <i className={"icon-gradient icon-locked"}/> Connexion
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleSubmit} className={"row"}>
                    <div className={"col"}/>
                    <div className={"col-5"}>
                      <div className="form-group">
                        <label className="form-control-label font-weight-bold">Identifiant</label>
                        <input type="text" className="form-control"
                               onChange={e => setUserName(e.target.value)}
                               required/>
                      </div>
                      <div className="form-group">
                        <label className="form-control-label font-weight-bold">Mot de passe</label>
                        <input type="password" className="form-control"
                               onChange={e => setPassword(e.target.value)}
                               required/>
                      </div>
                      <div className="error-text">
                        {session.error ? "Erreur : " + session.error : ""}
                      </div>
                      <div className="text-center mt-2">
                        <button type="submit" className="btn btn-primary">Se connecter</button>
                      </div>
                    </div>
                    <div className={"col"}/>
                  </form>
                </CardBody>
              </Card>
            </div>
            <div className="col-lg col-md"/>
          </div>
          <div className="row bg-light"/>

          <Modal isOpen={session.loading} centered={true}>
            <Loading/>
          </Modal>
        </React.Fragment>
    );
  }
}

export default LoginPage