export default class UXUtils {

    public static copyValueToClipboard = (clickEvent) => {
        let text = clickEvent.currentTarget.innerText;
        if (text != null) {
            text = text.replace(/\s/g, "").trim();
        }
        navigator.clipboard.writeText(text);
    };

    public static copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    }

    public static stopPropagation = (evt) => {
        evt.stopPropagation();
    }

}