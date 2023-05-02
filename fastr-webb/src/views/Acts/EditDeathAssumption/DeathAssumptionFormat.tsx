// tslint:disable-next-line:no-any TODO: A typer
export const formatDataForDeathStatus = (form: any, payload: any) => {
    // tslint:disable-next-line:no-any TODO: A typer
    const request: any = {
        act: {
            newValues: form
        },
        personId: payload.idClient,
        serviceId: payload.idService,
    };
    return request
};
