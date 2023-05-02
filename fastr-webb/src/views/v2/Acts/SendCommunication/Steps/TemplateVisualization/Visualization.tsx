import * as React from "react";

interface Props {
    content: string
    focusedField?: string
    highlighted?: boolean
}

const Visualization: React.FunctionComponent<Props> = (props: Props) => {
    const visuRef: React.Ref<HTMLDivElement> = React.useRef(null)

    if (visuRef.current) {
        if (props.focusedField) {
            visuRef.current.innerHTML = props.content && props.content.replace(`param${props.focusedField}`, "focus-highlight")
        } else {
            visuRef.current.innerHTML = props.content
        }
    }

    return (
        <div id="visualization" ref={visuRef} className={`${props.highlighted ? "template " : ""}mr-lg-5 mr-sm-5`}>
            Ceci est un message d'erreur, Votre template n'a pas pu être affiché
        </div>
    )

}
export default Visualization;