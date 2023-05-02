import * as React from "react";
import {useEffect, useState} from "react";
import SessionService from "../../../service/SessionService";
import Formsy from "formsy-react";
import {CardBody, Container, Modal} from "reactstrap";
import CardHeader from "reactstrap/lib/CardHeader";
import Card from "reactstrap/lib/Card";
import FormGroupRadio from "../../../components/Form/FormGroupRadio";
import Loading from "../../../components/Loading";
import {useDispatch} from "react-redux";
import {fetchAndStoreApplicationInitialStateV2} from "../../../store/actions/v2/applicationInitalState/ApplicationInitalStateActions";
import { useHistory} from "react-router";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {SessionWrapper} from "../../../model/ApplicativeUser";
import {Activity} from "../../../model/Activity";
import AuthorizationService from "../../../service/AuthorizationService";
import {resetIsRecentCasesListDisplayedV2} from "../../../store/actions/v2/client/ClientActions";
import LeftDashboard from "../Layout/LeftDashboard";

const Activities = () => {
    const isAccessGOFASTR = 'isAccessGOFASTR'
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionService: SessionService = new SessionService(true);
    const service: AuthorizationService = new AuthorizationService(true)
    const [session, setSession] = useState<SessionWrapper>();
    const [actitivies, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const user = useTypedSelector(state => state.store.applicationInitialState?.user);
    const currentClient = useTypedSelector(state => state.store.client.currentClient);
    useEffect(() => {
        (async function getSession() {
            try {
                setSession(await sessionService.getSessionWrapper());
            } catch (e) {
                setError(e);
            }
        })();
    }, [])

    const checkAccessGOFASTR = async(sessionId: string) => {
        const data = await service.getAuthorizations(sessionId);
        return true;
        console.log('data', data)
        return data.some(x => x === isAccessGOFASTR)
    }
    useEffect(() => {
        if (session) {
            Promise.resolve(checkAccessGOFASTR(session.id))
                .then((result ) => {
                    if(!result){
                        history.push("/accesDenied")
                    }
                });
            setActivities(session.user.activities.filter(e => e.label && e.code).sort((o, t) => o.label.localeCompare(t.label)));
        }
    }, [session]);

    const handleSubmit = async (form) => {
        setLoading(true);
        dispatch(resetIsRecentCasesListDisplayedV2());
        try {
            const selectedActivity : Activity | undefined = actitivies.find(e => e.code === form.selectedActivityGroup)
            if (selectedActivity) {
                setSession(await sessionService.changeActivity(selectedActivity));
                Promise.resolve(dispatch(fetchAndStoreApplicationInitialStateV2()))
                    .then(() => {
                        setLoading(false);
                    });
            }

            history.push(`/v2/`);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }

    const handleDoubleClick = () => {
        document.getElementById("selectActivitySubmit")?.click();
    }

    const handleHome = () => {
        if (user && user.activity) {
            history.push(`/v2/`);
        }
    }

    useEffect(() => {
        if (currentClient && currentClient.clientData && currentClient.clientData.id && currentClient.serviceId) {
            history.push(`/v2/`);
        }
    }, [currentClient])

    return (
        <>
            <div className="main">
                <div className="main-dashboard">
                    <div className={ "main-dashboard-left"}>
                        <LeftDashboard
                            noActivity noSearch onHomeSelection={handleHome}
                        />
                    </div>
                </div>

                <div className="main-container-full ml-5">
                        <Modal isOpen={loading} centered={true}>
                            <Loading/>
                        </Modal>
                        <Formsy onSubmit={handleSubmit}>
                            <div className="row sticky-top bg-white p-4 shadow">
                                <div className="col h3">
                                    Régler mes paramètres de connexions
                                </div>
                                <div className="col text-right">
                                    <input id={"selectActivitySubmit"} type={"submit"} className="btn btn-primary"
                                           name={"validateChangeButton"} value={"valider"}
                                           disabled={actitivies.length === 0 || !!error}/>
                                </div>
                            </div>
                            <Container>
                                <Card className={"mt-4 mb-4"}>
                                    <CardHeader className={"h4"}>
                                        Sélection de l'activité
                                    </CardHeader>
                                    <CardBody className={"ml-3 mr-3"}>
                                        {(actitivies.length === 0 && !error) && (
                                            <div className={"text-danger"}>
                                                Aucune activité trouvée
                                            </div>
                                        )}
                                        {!!error && (
                                            <div className={"text-danger"}>
                                                {error}
                                            </div>
                                        )}
                                        {actitivies.length > 0 && !error && (
                                            <FormGroupRadio name={"selectedActivityGroup"}
                                                            radioListData={actitivies.map(e => ({...e, value: e.code}))}
                                                            value={user?.activity?.code}
                                                            onDoubleClick={handleDoubleClick}/>
                                        )}
                                    </CardBody>
                                </Card>
                            </Container>
                        </Formsy>
                </div>
            </div>
        </>
    );
}

export default Activities