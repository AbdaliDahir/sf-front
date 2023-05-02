import {LandedOption} from "../../../../../model/service/LandedLineService";
import {MobileOption} from "../../../../../model/service/MobileOption";
import {MobileDiscount} from "../../../../../model/service";

export default class ContractUtils {

    public static sortActiveMobileOptions = (optionA: MobileOption, optionB: MobileOption) => {
        if (optionA?.billing?.billingPrice > 0 && (!optionB.billing || !optionB.billing.billingPrice || optionB.billing.billingPrice == 0)) {
            return -1
        }
        else if (optionB?.billing?.billingPrice > 0 && optionA?.billing?.billingPrice == 0  ) {
            return 1;
        }
        else if (optionA.endDate && optionB.endDate) {
            return new Date(optionA.endDate).getTime() - new Date(optionB.endDate).getTime();
        } else {
            return new Date(optionB.activationDate).getTime() - new Date(optionA.activationDate).getTime();
        }
    }

    public static sortActiveMobileDiscounts = (discountA: MobileDiscount, discountB: MobileDiscount) => {
        if (discountA.endDate && discountB.endDate) {
            return new Date(discountA.endDate).getTime() - new Date(discountB.endDate).getTime();
        } else {
            return new Date(discountB.startDate).getTime() - new Date(discountA.startDate).getTime();
        }
    };

    public static sortLandedTvOptions = (optionA: LandedOption, optionB: LandedOption) => {
        if (optionA?.billing?.billingPrice > 0 && optionB?.billing?.billingPrice == 0 ) {
            return -1
        }
        else if (optionB?.billing?.billingPrice > 0 && optionA?.billing?.billingPrice == 0  ) {
            return 1;
        }
        else if (optionA?.billing?.billingPrice > 0 && optionB?.billing?.billingPrice > 0 ) {
            return 0;
        }
        else if (optionA.terminationDate && optionB.terminationDate) {
            return new Date(optionA.terminationDate).getTime() - new Date(optionB.terminationDate).getTime();
        } else {
            return new Date(optionB.activationDate).getTime() - new Date(optionA.activationDate).getTime();
        }

    };

    public static sortActiveLandedOptions = (optionA: LandedOption, optionB: LandedOption) => {
        if (optionA?.billing?.billingPrice > 0 && optionB?.billing?.billingPrice == 0 ) {
            return -1
        }
        else if (optionB?.billing?.billingPrice > 0 && optionA?.billing?.billingPrice == 0  ) {
            return 1;
        }
        else if (optionA?.billing?.billingPrice > 0 && optionB?.billing?.billingPrice > 0 ) {
            return 0;
        }
        else if (optionA.terminationDate && optionB.terminationDate) {
            return new Date(optionA.terminationDate).getTime() - new Date(optionB.terminationDate).getTime();
        } else {
            return new Date(optionB.activationDate).getTime() - new Date(optionA.activationDate).getTime();
        }

    };

    public static sortActiveDiscountsByDate = (discountA: LandedOption, discountB: LandedOption) => {
        if (discountA.status === "ACTIVE" && discountB.status === "TERMINATED") {
            return -1;
        } else if (discountA.status === "TERMINATED" && discountB.status === "ACTIVE") {
            return 1;
        } else {
            if (discountA.terminationDate && discountB.terminationDate) {
                if (discountA.status === "ACTIVE") {
                    return new Date(discountA.terminationDate).getTime() - new Date(discountB.terminationDate).getTime();
                } else {
                    return new Date(discountB.terminationDate).getTime() - new Date(discountA.terminationDate).getTime();
                }
            } else {
                return new Date(discountB.activationDate).getTime() - new Date(discountA.activationDate).getTime();
            }
        }
    };


    public static sortTerminatedDiscounts = (discountA: LandedOption, discountB: LandedOption) => {
        return new Date(discountB.terminationDate).getTime() - new Date(discountA.terminationDate).getTime();
    }


    public static sortTerminatedOptionsByDate = (optionA: MobileOption | MobileDiscount, optionB: MobileOption | MobileDiscount) => {
        return new Date(optionB.endDate).getTime() - new Date(optionA.endDate).getTime();
    }
}