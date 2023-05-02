import {Service} from "../model/service/Service";
import {ServiceStatus} from "../model/service";
import {Alert, Badge} from "reactstrap";
import {FormattedMessage} from "react-intl";
import * as React from "react";


export default class ServiceUtils {

    public static isFixe(service: Service) {
        return service.offerTypeId === '06';
    }

    public static hideString = (string: string) => {
        if (string) {
            const stringLength = string.length;
            return Array(stringLength + 1).join("*")
        }
        return "********"
    };

    public static hideWholeIban = (string: string) => {
        if (string) {
            return ServiceUtils.chunk(ServiceUtils.hideString(string), 4).join(" ");
        }
        return "********"
    };

    public static renderEmptyDataMsg(msg: string, borderTop: boolean) {
        let styles = "text-muted text-center font-weight-bold font-size-m"
        if (borderTop) styles += " border-top pt-2"
        return (
            <div className={styles}>
                <FormattedMessage id={msg}/>
            </div>
        )
    }

    public static renderEmptySessionMsg() {
        return (
            <Alert className="text-center" color="danger">
                <h5 className="alert-heading"><FormattedMessage id={"session.invalid.title"}/></h5>
            </Alert>
        )
    }


    public static chunk(str, n) {
        let ret = [];
        let i;
        let len;
        for (i = 0, len = str.length; i < len; i += n) {
            // @ts-ignore
            ret.push(str.substr(i, n))
        }
        return ret
    };

    /**
     * Format the given iban.
     * If the iban has more than 16 characters, the method shows the first eight and the last four; otherwise it shows
     * the first eight and the last two. The other characters are replaced by *. A space is added every 4 characters.
     *
     * @param iban
     * @return formatted iban
     */
    public static hideIban(iban?: string) {
        if (!iban) {
            return "";
        }

        let hiddenIban: string;

        if (iban.length > 16) {
            hiddenIban = iban.substr(0, 8) + iban.substring(8, iban.length - 4)
                .replace(/./g, "*") + iban.substring(iban.length - 4, iban.length);
        } else {
            hiddenIban = iban.substr(0, 8) + iban.substring(8, iban.length - 2)
                .replace(/./g, "*") + iban.substring(iban.length - 2, iban.length);
        }

        return hiddenIban.replace(/(.{4})/g, "$1 ").trim();
    }

    public static renderBadge(status: ServiceStatus) {
        switch (status) {
            case "ACTIVE":
                return <Badge color="success" pill><FormattedMessage id={status}/></Badge>;
            case "CANCELED":
                return <Badge color="danger" pill><FormattedMessage id={status}/></Badge>;
            case "CREATED":
                return <Badge color="info" pill><FormattedMessage id={status}/></Badge>;
            case "SUSPENDED":
                return <Badge color="warning" pill><FormattedMessage id={status}/></Badge>;
            case "TERMINATED":
                return <Badge color="danger" pill><FormattedMessage id={status}/></Badge>;
            case "REJECTED":
                return <Badge color="danger" pill><FormattedMessage id={status}/></Badge>;
        }
    }


    public static hideCardNumber(cardNumber: string) {
        if (!cardNumber) {
            return cardNumber;
        }
        return '*'.repeat(cardNumber.length) + cardNumber.substr(cardNumber.length - 4);
    }

    public static isMobileService = (service: Service | undefined) => {
        if (service && (service.category === "MOBILE" || service.category === "LOCATION")) {
            return true;
        } else {
            return false
        }
    }


    public static isLandedService = (service: Service | undefined) => {
        if (service && service.category === "FIXE") {
            return true;
        } else {
            return false
        }
    }


}