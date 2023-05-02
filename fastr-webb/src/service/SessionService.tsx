import AbstractService from "./AbstractService";
import {Activity} from "../model/Activity";
import {SessionWrapper} from "../model/ApplicativeUser";

export default class SessionService extends AbstractService {

    public static registerSession(sesssionId: string): void {
        sessionStorage.setItem('sessionId', sesssionId);
    }

    public static clearSession(): void {
        sessionStorage.clear();
    }

    public static logout(): void {
        const sessionId = sessionStorage.getItem("sessionId");
        const options: RequestInit = {
            method: "delete"
        };
        fetch(`${this.base}/fastr-auth/sessions/${sessionId}`, options)
            .then(() => this.clearSession());
    }

    public static getSession(): string {
        const session = sessionStorage.getItem("sessionId");
        if (!!session) {
            return session;
        } else {
            return "";
        }
    }

    public static checkSession(sessionid: string) {
        const options: RequestInit = {
            credentials: "include",
            headers: {
                "X-Auth-Token": sessionid,
                "cache-control": "no-store",
                "pragma": "no-store"
            },
            method: "get"
        };

        return fetch(`${this.base}/fastr-auth/sessions/check/${sessionid}`, options)
    }

    private static base = process.env.REACT_APP_FASTR_API_URL;

    public async getUserActivity(sessionId: string): Promise<Activity> {
        return this.get<Activity>(`/fastr-auth/sessions/${sessionId}/userActivity`);
    }

    public async getSessionWrapper(): Promise<SessionWrapper> {
        const sessionId = SessionService.getSession();
        return this.get<SessionWrapper>(`/fastr-auth/sessions/${sessionId}`);
    }

    public async changeActivity(selectedActivity: Activity): Promise<SessionWrapper> {
        const sessionId = SessionService.getSession();
        return this.post<Activity, SessionWrapper>(`/fastr-auth/sessions/${sessionId}/userActivity`, selectedActivity);
    }
}
