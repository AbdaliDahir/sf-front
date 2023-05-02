import {translate} from "../components/Intl/IntlGlobalProvider";
import LocaleUtils from "./LocaleUtils";
import moment from "moment";
import {regexPhoneFormated} from "./PhoneNumberUtils";

export default class ValidationUtils {

	public static notEmpty = (values: string[], value: string) => {
		if (!!value && value !== "") {
			return true;
		} else {
			return translate.formatMessage({id: "validation.required.message"});
		}
	};

	public static isAtLeastOnePhoneFixeOrMobile = (values: string[], value: string) => {
		if (!!value && value !== "") {
			return true;
		} else {
			return translate.formatMessage({id: "validation.required.message.at.least.one.phone"});
		}
	};

	// tslint:disable-next-line:no-any
	public static notEmptyList = (values: string[], value: any[]) => {
		if (!!value && value.length>0) {
			return true;
		} else {
			return translate.formatMessage({id: "validation.required.message"});
		}
	};

    public static canBeEmpty = (values: string[], value: string) => {
        return true;
    };

    public static inputMinLength = (values: string[], value: string, lengthMinMessage: number) => {
        if (!!value && value.length >= lengthMinMessage) {
            return true;
        } else {
            return translate.formatMessage({id: "validation.minLength.message." + lengthMinMessage});
        }
    };

	public static isCountry = (values: string[], value: string) => {
		if (LocaleUtils.isCountry(value)) {
			return translate.formatMessage({id: "validation.country.message"})
		} else {
			return true
		}
	};

	public static isPhoneNumber = (values: string[], value: string) => {
		if (value && !value.match(/^[+]{1}[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)) {
			return translate.formatMessage({id: "validation.phone.number"})
		} else {
			return true
		}
	}
	/**
	 * Validation du format standard sans indicatif du pays
	 */
	public static isValidPhoneNumber = (values: string[], value: string) => {
		if (value && !value.match(regexPhoneFormated)) {
			return translate.formatMessage({id: "search.command.NLigne.validation"})
		} else {
			return true
		}
	}
	public static isValidMail = (values: string[], value: string) => {
		if (value && !value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
		)) {
			return translate.formatMessage({id: "search.command.email.validation"})
		} else {
			return true
		}
	}

	// TODO: validation des adresses par FFLINT bidule machin EDIT: vaut meiux pré-valider avant de faire un call je pense
	public static departmentNumber = (values: string[], value: string) => {
		if (!value) {
			return translate.formatMessage({id: "validation.departmentNumber.message"});
		}

		if (value.length <= 2 &&
			!isNaN(+value) &&
			((+value >= 1 && +value <= 95) || +value === 99)
		) {
			return true;
		} else if (value.length === 3 && (+value >= 971 && +value <= 976 && +value !== 975)) {
			return translate.formatMessage({id: "validation.departmentNumber.message.domtom"});
		} else {
			return translate.formatMessage({id: "validation.departmentNumber.message"});
		}
	};

	public static isZipcode = (values: string[], value: string) => {
		if (isNaN(+value)) {
			return translate.formatMessage({id: "validation.zipcode.message"})
		} else {
			return value.length === 5 ? true : translate.formatMessage({id: "validation.zipcode.message"})
		}
	};

	public static postalCode = (values: string[], value: string) => {
		if (!!value && value.length === 5 && !isNaN(+value)) {
			return true;
		} else {
			return translate.formatMessage({id: "validation.postalCode.message"});
		}
	}

	// Be careful this function return a function
	public static respectPattern = (pattern: string | RegExp) => {
		return (values: string[], value: string) => {
			if (pattern && pattern !== "") {
				value = value ? value : "";
				try {
					if (new RegExp(pattern).test(value)) {
						return true;
					} else {
						return translate.formatMessage({id: "validation.pattern.message"});
					}
				} catch (e) {
					console.error(e)
					return true;
				}
			} else {
				return true;
			}
		}
	};

	// Be careful this function return a function
	public static respectPatternwithMessage = (pattern: string | RegExp, message: string | undefined | null) => {
		return (values: string[], value: string) => {
			if (pattern && pattern !== "") {
				value = value ? value : ""
				try {
					if (new RegExp(pattern).test(value)) {
						return true;
					} else {
						return message ? message : translate.formatMessage({id: "validation.pattern.message"});
					}
				} catch (e) {
					console.error(e)
					return true;
				}
			} else {
				return true;
			}
		}
	};

	// Be careful this function return a function
	public static respectPatternOnlyIfValueNotEmpty = (pattern: string | RegExp) => {
		return (values: string[], value: string) => {
			if ((value && value !== "") && (pattern && pattern !== "")) {
				try {
					if (new RegExp(pattern).test(value)) {
						return true;
					} else {
						return translate.formatMessage({id: "validation.pattern.message"});
					}
				} catch (e) {
					console.error(e)
					return true;
				}
			} else {
				return true;
			}
		}
	};

	// Be careful this function return a function
	public static respectStrictPattern = (pattern: string | RegExp) => {
		return (values: string[], value: string) => {
			if (pattern && pattern !== "" && value) {
				try {
					const matchFound = value.match(new RegExp(pattern))
					if (new RegExp(pattern).test(value) && matchFound && matchFound[0] === value) {
						return true;
					} else {
						return translate.formatMessage({id: "validation.pattern.message"});
					}
				} catch (e) {
					console.error(e)
					return true;
				}
			} else {
				return true;
			}
		}
	};


	// Be careful this function return a function
	public static isBetween = (min?: number | null, max?: number | null) => {
		return (values: string[], value: string) => {
			if (max && +value > max) {
				return "la valeur doit être inferieure à " + max;
			} else if (min && +value < min) {
				return "la valeur doit être superieur à " + min;
			} else {
				return true;
			}
		}
	};

	// Be careful this function return a function
	public static isEqual = (compareValue) => {
		return (values: string[], value: string) => {
			if (value === compareValue) {
				return false;
			}
			return true;
		}
	};


    // Iban Validation
    public static isValidIban(values: string[], iban: string) {
        const codeLengths = {
            AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29, CH: 21, CR: 21, CY: 28, CZ: 24,
            DE: 22, DK: 18, DO: 28, EE: 20, ES: 24, LC: 30, FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28,
            HR: 21, HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28, LI: 21, LT: 20, LU: 20, LV: 21,
            MC: 27, MD: 24, ME: 22, MK: 19, MR: 27, MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
            RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26
        };
        iban = iban && iban.trim();
        if (iban && iban.length > 0) {
            iban = iban.toUpperCase().replace(/[^A-Z0-9]/g, '');
            iban = iban.replace(/\s/g, '');
            const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);
            let digits: string;
            if (!code || iban.length !== codeLengths[code[1]]) {
                return "La taille de l'iban ne correspond pas à celle du code pays.";
            }
            digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, (match: string) => {
                return (match.charCodeAt(0) - 55).toString();
            });
            return ValidationUtils.mod97(digits) === 1 ? true : "L'iban saisi n'est pas valide.";
        } else {
            return true;
        }
    }

    public static inputMinMaxLength = (values: string[], value: string) => {
        if (!!value && value.length >= 10 && value.length <= 14) {
            return true;
        } else {
            return translate.formatMessage({id: "validation.bicMinMaxLength.message"});
        }
    };

    public static isFrenchMobilePhoneNumber = (values: string[], value: string) => {
        if (!value) {
            return true;
        }

        value = value.startsWith("+33") ? "0" + value.substring(3) : value

        if (!value.match(/^0[6-7][0-9]{8}$/)) {
            return translate.formatMessage({id: "validation.french.mobilePhone.number"})
        }

        return true
    }

    /**
     * Validation pour champ de téléphone français fixe ou autre (hors mobile)
     *
     * @param isFixe
     */
    public static isFrenchPhoneNumber = (values: string[], value: string, type: string) => {
        if (!value) {
            return true;
        }
        value = value.startsWith("+33") ? "0" + value.substring(3) : value

        if ("FIXE" === type) {
            return !value.match(/^0[1-58-9][0-9]{8}$/) ? translate.formatMessage({id: "validation.french.phone.number"}) : true

        } else if (type === "FAX" || type === "OTHER") {
            return !value.match(/^0[1-9][0-9]{8}$/) ? translate.formatMessage({id: "validation.french.other.number"}) : true

        } else {
            return translate.formatMessage({id: "validation.french.phone.number"})
        }
    }

    private static mod97(digital: number | string) {
        digital = digital.toString();
        let checksum: number | string = digital.slice(0, 2);
        let fragment = '';
        for (let offset = 2; offset < digital.length; offset += 7) {
            fragment = checksum + digital.substring(offset, offset + 7);
            checksum = parseInt(fragment, 10) % 97;
        }
        return checksum;
    }

    public static isFutureDateOrEmpty = (values: string[], value: Date) => {
    	if (!value) {
    		return true;
		}
		return !moment(value).startOf('day').isBefore(moment(new Date()).startOf('day')) ?
			true : translate.formatMessage({id: "validation.futureDate.message"})
	}

	// SIRET CENTRAL VALIDATION
	public static siretNumberValidation = (values: string[], value: string) => {
		if (!value) {
			return translate.formatMessage({id: "validation.siretMinMaxLength.type.message"});
		}
		if (new RegExp(/^[0-9]{14}$/).test(value)) {
			return true;
		} else {
			return translate.formatMessage({id: "validation.siretMinMaxLength.type.message"});
		}
	};
}
