import {CasePageReducer} from "./CasePageReducer";
import {RecentCasesReducer} from "./RecentCasesReducer";
import {UIReducer} from "./UIReducer";
import {CaseReducer} from "./CaseReducer";
import {TrayReducer} from "./TrayReducer";
import {SessionReducer} from "./SessionReducer";
import {PersistedReducer} from "./PersistedReducer";
import fetchClientReducer, {fetchCasesReducer, fetchCommunications} from "./ClientContextReducer";
import {AuthorizationReducer} from "./AuthorizationReducer";
import {CTIReducer} from "./CTIReducer";
import {ModalReducer} from "./ModalReducer";
import {OrderReducer} from "./OrderReducer";
import {ADGReducer} from "./ADGReducer";
import alertSlice from "../AlertSlice";
import UISlice from "../UISlice";
import sessionSlice from "../SessionSlice";
import billsSlice from "../BillsSlices";
import {RetentionReducer} from "./RetentionReducer";
import payloadSlice from "../PayloadSlice";
import {WebsapReducer} from "./WebsapReducer";
import {ExternalAppsReducer} from "./ExternalAppsReducer";
import {MediaReducer} from "./MediaReducer";
import {BillingReducer} from "./BillingReducer";
import {AntiChurnReducer} from "./AntiChurnReducer";
import activationFlagSlice from "../ActivationFlagSlice";
import {combineReducers} from "redux";
import landedDeviceSlice from "../LandedDeviceSlice";
import {TimeLineReducer} from "./TimeLineReducer";
import {CommandeReducer} from "./CommandeReducer";
import {ClientSecureCallStateReducer} from "./ClientSecureCallReducer";


export const reducers = {
    persisted: PersistedReducer,
    ui: UIReducer,
    case: CaseReducer,
    alert: alertSlice.reducer,
    casesHistory: fetchCasesReducer,
    order: OrderReducer,
    communications: fetchCommunications,
    casePage: CasePageReducer,
    client: fetchClientReducer,
    //TODO: A mutualiser avec le reducer plus haut, urgent
    session: SessionReducer,
    tray: TrayReducer,
    authorization: AuthorizationReducer,
    cti: CTIReducer,
    recentCases: RecentCasesReducer,
    modalManager: ModalReducer,
    bills: billsSlice.reducer,
    adg: ADGReducer,
    //TODO: A mutualiser avec le reducer plus haut, urgent
    uiContext: UISlice.reducer,
    sessionSlice: sessionSlice.reducer,
    retention: RetentionReducer,
    antiChurn: AntiChurnReducer,
    payload: payloadSlice.reducer,
    websap: WebsapReducer,
    billings: BillingReducer,
    externalApps: ExternalAppsReducer,
    mediaSetting: MediaReducer,
    activationFlag: activationFlagSlice.reducer,
    landedDevice: landedDeviceSlice.reducer,
    timeLine: TimeLineReducer,
    commandes:CommandeReducer,
    callsSecured:ClientSecureCallStateReducer,
};
const reducer = combineReducers(reducers);
export default reducer;
