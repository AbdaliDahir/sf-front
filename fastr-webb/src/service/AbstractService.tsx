import {store} from "../index";

export default abstract class AbstractService {
    private readonly sessionEnabled: boolean;

    protected baseUrl = process.env.REACT_APP_FASTR_API_URL;

    constructor(sessionEnabled: boolean) {
        this.sessionEnabled = sessionEnabled;
    }

    protected getBaseUrl() {
        const forceBackendHost = store.getState().store.applicationInitialState.forceBackendHost;
        return !!forceBackendHost ? forceBackendHost : this.baseUrl;
    }

    protected async getValue(url: string) {
        let session: string;
        if (this.sessionEnabled) {
            session = this.checkForSession();
        } else {
            session = "";
        }

        const options: RequestInit = {
            credentials: "include",
            headers: this.buildGetHeaders(session),
            method: "get"
        };

        return await fetch(this.customEncodeURI(this.getBaseUrl() + url), options).then(response => {
            if (!response.ok) {
                throw response.text()
            }
            return response.text();
        })
    }

    protected get<T>(url: string): Promise<T> {
        let session: string;
        if (this.sessionEnabled) {
            session = this.checkForSession();
        } else {
            session = "";
        }

        const options: RequestInit = {
            credentials: "include",
            headers: this.buildGetHeaders(session),
            method: "get"
        };

        return fetch(this.customEncodeURI(this.getBaseUrl() + url), options).then(response => {
            if (!response.ok) {
                throw response.json()
            }
            return response.json();
        })
    }

    protected getFile<T>(url: string): Promise<Blob> {
        let session: string;
        if (this.sessionEnabled) {
            session = this.checkForSession();
        } else {
            session = "";
        }

        const options: RequestInit = {
            credentials: "include",
            headers: this.buildGetFileHeaders(session),
            method: "get"
        };

        return fetch(this.customEncodeURI(this.getBaseUrl() + url), options).then(response => {
            if (!response.ok) {
                throw response.blob()
            }
            return response.blob();
        })
    }

    protected postFiles<B, T>(url: string, files: File[]): Promise<T> {
        let session: string;
        if (this.sessionEnabled) {
            session = this.checkForSession();
        } else {
            session = "";
        }
        const myHeaders = new Headers();
        myHeaders.set("X-Auth-Token", session)


        const formData = new FormData();
        let counter = 1;
        for (const file of files) {
            const extension = file.name.split('.').pop();
            const newName = "PJ" + counter + "." + extension;
            formData.append('file', file,newName);
            counter++
        }
        
        const options: RequestInit = {
            body: formData,
            credentials: "include",
            headers: myHeaders,
            method: "post"
        };
        return fetch(this.customEncodeURI(this.getBaseUrl() + url), options)
            .then(response => {
                if (!response.ok) {
                    throw response.json()
                }
                return response.json();
            })
    }


    protected post<B, T>(url: string, body: B): Promise<T> {
        let session: string;
        if (this.sessionEnabled) {
            session = this.checkForSession();
        } else {
            session = "";
        }

        const options: RequestInit = {
            body: JSON.stringify(body),
            credentials: "include",
            headers: this.buildDefaultHeaders(session),
            method: "post"
        };
        return fetch(this.customEncodeURI(this.getBaseUrl() + url), options)
            .then(response => {
                if (!response.ok) {
                    throw response.json()
                }
                return response.json();
            })
    }


    protected postWithCustomHeader<B, T>(url: string, body: B, headers: any[]): Promise<String> {
        let session: string;
        if (this.sessionEnabled) {
            session = this.checkForSession();
        } else {
            session = "";
        }

        const options: RequestInit = {
            body: JSON.stringify(body),
            credentials: "include",
            headers: this.buildCustomHeaders(session, headers),
            method: "post"
        };
        return fetch(this.customEncodeURI(this.getBaseUrl() + url), options)
            .then(response => {
                if (!response.ok) {
                    throw response.json()
                }
                return response.text();
            })
    }

    protected postNoBody<B>(url: string, body: B): Promise<void> {
        let session: string;
        if (this.sessionEnabled) {
            session = this.checkForSession();
        } else {
            session = "";
        }

        const options: RequestInit = {
            body: JSON.stringify(body),
            credentials: "include",
            headers: this.buildDefaultHeaders(session),
            method: "post"
        };
        return fetch(this.customEncodeURI(this.getBaseUrl() + url), options)
            .then(response => {
                if (!response.ok) {
                    throw response.json()
                }
            })
    }

    // TODO: If not body, invalid json
    protected put<B, T>(url: string, body: B): Promise<T> {
        let session: string;
        if (this.sessionEnabled) {
            session = this.checkForSession();
        } else {
            session = "";
        }

        const options: RequestInit = {
            body: JSON.stringify(body),
            credentials: "include",
            headers: this.buildDefaultHeaders(session),
            method: "put"
        };
        return fetch(this.customEncodeURI(this.getBaseUrl() + url), options)
            .then(response => {
                if (!response.ok) {
                    throw response.json()
                }
                return response.json();
            })
    }

    protected putNoBody<B>(url: string, body: B): Promise<void> {
        let session: string;
        if (this.sessionEnabled) {
            session = this.checkForSession();
        } else {
            session = "";
        }

        const options: RequestInit = {
            body: JSON.stringify(body),
            credentials: "include",
            headers: this.buildDefaultHeaders(session),
            method: "put"
        };

        return fetch(this.customEncodeURI(this.getBaseUrl() + url), options)
            .then(response => {
                if (!response.ok) {
                    throw response.json()
                }
            })
    }

    protected buildGetHeaders(session: string) {
        const myHeaders = new Headers();
        myHeaders.set("X-Auth-Token", session)
        myHeaders.set("cache-control", "no-store, no-cache, must-revalidate")
        myHeaders.set("pragma", "no-cache")
        myHeaders.set("Content-Type", "application/json")
        return myHeaders
    }

    protected buildGetFileHeaders(session: string) {
        const myHeaders = new Headers();
        myHeaders.set("X-Auth-Token", session)
        myHeaders.set("cache-control", "no-store, no-cache, must-revalidate")
        myHeaders.set("pragma", "no-cache")
        return myHeaders
    }


    protected buildDefaultHeaders(session: string) {
        const myHeaders = new Headers();
        myHeaders.set("X-Auth-Token", session)
        myHeaders.set("cache-control", "no-store")
        myHeaders.set("pragma", "no-store")
        myHeaders.set("Content-Type", "application/json")
        return myHeaders
    }


    protected buildCustomHeaders(session: string, headers: any[]) {
        const myHeaders = this.buildDefaultHeaders(session)
        headers.forEach(header => {
            myHeaders.set(header.key, header.value) 
        });
        return myHeaders
    }


    private checkForSession(): string {
        const session: string | undefined = this.getSession();
        if (!session) {
            throw ({message: "Session does not exists", status: 500});
        } else {
            return session.valueOf();
        }
    }

    private getSession(): string | undefined {
        const session = sessionStorage.getItem("sessionId");
        if (!!session) {
            return session;
        } else {
            return undefined;
        }
    }

    // Encode URI & encode "+"
    private customEncodeURI(uri:string) {
        return encodeURI(uri).split("+").join("%2B");
    }
}
