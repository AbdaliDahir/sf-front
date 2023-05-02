import * as React from "react";

export function getValidState(valid: boolean, pristine: boolean): { invalid: boolean, valid: boolean } {
    if (pristine) {
        return {invalid: false, valid: false}
    }
    if (!valid) {
        return {invalid: true, valid: false}
    } else {
        return {invalid: false, valid: true}
    }
}

export function getRequired(isRequired: boolean) {
    if (isRequired) {
        return <span className="text-danger">*</span>
    } else {
        return undefined
    }
}