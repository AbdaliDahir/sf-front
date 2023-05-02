export default class StringUtils {

    public static truncate(s: string, length: number): string {
        return s.length > length ? s.substr(0, length) : s;
    }

    public static formatCallNumber(s: string, padding: number) {
        let finalString: string = "";

        for (let i = 0; i < s.length ; i) {
            finalString += s.charAt(i);
            if (++i % padding === 0 && i !== 0) {
                finalString += " "
            }
        }

        return finalString;

    }

    public static withoutAccentsAndLowerCase(entry: string): string {
        return entry?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    public static firstContainsSecondIgnoringCaseAndAccents(txt1: string, txt2: string): boolean {
        return this.withoutAccentsAndLowerCase(txt1).includes(this.withoutAccentsAndLowerCase(txt2));
    }

    public static isJsonString(text: string): boolean { 
        try {
            JSON.parse(text);
        } catch (e) {
            return false;
        }
        return true; 
    }

    public static formatPrice(price: string) : string  {
        return `${(parseFloat(price)/100).toFixed(2)} €`?.replace(".", ",");
    }
}
