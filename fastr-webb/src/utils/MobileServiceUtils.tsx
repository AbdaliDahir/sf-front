import {LandedOption} from "../model/service/LandedLineService";
import {MobileOption} from "../model/service/MobileOption";
import {MobileDiscount, MobileLineService} from "../model/service";
import * as moment from "moment";

export default class MobileServiceUtils {

    public static computeOptionAmount = (mobileLineService: MobileLineService) => {

        const clientOptions = mobileLineService.options;
        return clientOptions
            .filter(e => e.billing && e.billing.billingPrice)
            .filter(e => e.status === "ACTIVE")
            .filter(e => MobileServiceUtils.isComputableOption(e, mobileLineService?.billingAccount?.billingDay))
            .map(e => e?.billing?.billingPrice ? e?.billing?.billingPrice : 0)
            .reduce((a, b) => a + b, 0)
    }

    public static isComputableOption(option: MobileOption, billingDay: number) {
        const billingType = option.billing?.billingType;
        const billingPeriodicty = option.billing?.billingPeriodicty;
        if (billingType) {
            if (billingType === "PERIODIC" && billingPeriodicty === "MONTHLY") {
                return true
            } else if (billingType === "PONCTUAL") {
                if (!option.activationDate) return false
                const activationDate = new Date(option.activationDate)
                const nextJJ = moment().toDate();
                billingDay && billingDay !== 0 ? nextJJ.setDate(billingDay) : nextJJ.setDate(1)
                const monthAgo = new Date()
                monthAgo.setMonth(nextJJ.getMonth() - 1)
                billingDay && billingDay !== 0 ? monthAgo.setDate(billingDay) : monthAgo.setDate(1)
                const isBeforeJJ = activationDate < nextJJ
                const isAfterLastJJ = monthAgo <= activationDate
                return isBeforeJJ && isAfterLastJJ
            }
        }
        return false
    }

    public static isComputableMobileDiscount(mobileDiscount: MobileDiscount, billingDay: number) {
        const billingType = mobileDiscount?.billingType;
        if (billingType) {
            if (billingType === "PERIODIC") {
                return true
            } else if (billingType === "PONCTUAL") {
                if (!mobileDiscount.startDate) return false
                const activationDate = new Date(mobileDiscount.startDate)
                const nextJJ = moment().toDate();
                billingDay && billingDay !== 0 ? nextJJ.setDate(billingDay) : nextJJ.setDate(1)
                const monthAgo = new Date()
                monthAgo.setMonth(nextJJ.getMonth() - 1)
                billingDay && billingDay !== 0 ? monthAgo.setDate(billingDay) : monthAgo.setDate(1)
                const isBeforeJJ = activationDate < nextJJ
                const isAfterLastJJ = monthAgo <= activationDate
                return isBeforeJJ && isAfterLastJJ
            }
        }
        return false
    }

    public static computeDiscountAmount = (mobileLineService: MobileLineService) => {
        const discounts = mobileLineService?.mobileDiscount?.discounts;

        return discounts
            .filter(e => e.status === "ACTIVE")
            .filter(e => MobileServiceUtils.isComputableMobileDiscount(e, mobileLineService?.billingAccount?.billingDay))
            .map(e => e?.amount ? e?.amount : 0)
            .reduce((a, b) => a + b, 0)

    }

    public static computeLandedOptionAmount = (options: LandedOption[]) => {
        return options
            .filter(e => e.billing && e.billing.billingPrice)
            .filter(e => e.status === "Actif")
            .map(e => e?.billing?.billingPrice ? e?.billing?.billingPrice : 0)
            .reduce((a, b) => a + b, 0)
    }

    public static computeLandedOptionsTvAmount = (options: LandedOption[]) => {
        return options
            .filter(e => e.billing && e.billing.billingPrice)
            .filter(e => e.status === "Actif" || e.status === "Suspendu" )
            .map(e => e?.billing?.billingPrice ? e?.billing?.billingPrice : 0)
            .reduce((a, b) => a + b, 0)
    }


    public static computeLandedDiscountAmount = (options: LandedOption[]) => {
        return options
            .filter(e => e.status === "ACTIVE")
            .map(e => e?.billing.billingPrice ? e?.billing.billingPrice : 0)
            .reduce((a, b) => a + b, 0)
    }
}