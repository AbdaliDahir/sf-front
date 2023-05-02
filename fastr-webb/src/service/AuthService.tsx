import AbstractService from "./AbstractService";
import {ApplicationMode} from "../model/ApplicationMode";

export default class AuthService extends AbstractService {

    constructor() {
        super(false);
    }

    public async authenticateDistribution(channel: string | null) {
        const options: RequestInit = {

            credentials: "include",
            headers: this.buildDistribDefaultHeaders("", channel),
            method: "post"
        };
        return fetch(`${this.baseUrl}/fastr-auth/sessions/authenticate/`, options)
            .then(response => {
                if (!response.ok) {
                    throw response.json()
                }
                return response.json();
            })
    }

    public async authenticateLogin(usr: string, pwd: string) {
        const options: RequestInit = {
            headers: this.buildDefaultHeaders(),
            method: "post",
            body: JSON.stringify({
                login: usr,
                password: pwd,
                from: ApplicationMode.GOFASTR
            })
        };

        return fetch(`${this.baseUrl}/fastr-auth/sessions/authenticate/`, options)
            .then((response) => {
                if (!response.ok) {
                    throw response.json();
                }
                return response.json();
            });
    }

    public async encryptPassword(pwd: string) : Promise<string>{
        const options: RequestInit = {
            headers: this.buildDefaultHeaders(),
            method: "post",
            body: JSON.stringify({
                password: pwd
            })
        };

        return fetch(`${this.baseUrl}/fastr-auth/sessions/password/encrypt`, options)
            .then((response) => {
                if (!response.ok) {
                    throw response.json();
                }
                return response.text();
            });
    }

    protected buildDistribDefaultHeaders(session: string, channel: string | null) {
        const myHeaders = new Headers();
        myHeaders.set("X-Auth-Token", session)
        myHeaders.set("cache-control", "no-store")
        myHeaders.set("pragma", "no-store")
        myHeaders.set("Content-Type", "application/json")
        myHeaders.set("SM_USER", "1234")
        myHeaders.set("SM_CODEORIAN", "1234")
        myHeaders.set("SM_SSODIST", channel ? channel : "")
        return myHeaders
    }

    protected buildDefaultHeaders() {
        const myHeaders = new Headers();
        myHeaders.set("cache-control", "no-store")
        myHeaders.set("pragma", "no-store")
        myHeaders.set("Content-Type", "application/json")
        return myHeaders
    }
}
