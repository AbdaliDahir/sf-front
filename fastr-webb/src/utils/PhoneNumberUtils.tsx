export const regexPhone = /^0([1-9])(\d{2})(\d{2})(\d{2})(\d{2})$/;
export const regexPhoneFormated = /^0([1-9])(\s(\d{2}))(\s(\d{2}))(\s(\d{2}))(\s(\d{2}))$/;
export const regexNDI = /^0([^0678])(\s(\d{2}))(\s(\d{2}))(\s(\d{2}))(\s(\d{2}))$/;
export const regexMSISDN = /^0([6-7])(\s(\d{2}))(\s(\d{2}))(\s(\d{2}))(\s(\d{2}))$/;
export const formatPhoneNumber = (phoneNumber: string):string =>{
    const match = regexPhone.exec(phoneNumber);
    if (!match) {
        // throw new Error("Invalid phone number");
        return phoneNumber;
    }
    return `0${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
}