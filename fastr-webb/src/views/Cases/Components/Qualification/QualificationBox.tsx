import * as React from "react";
import {Col, UncontrolledTooltip} from "reactstrap";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";

interface Props {
    getNextThemes: (event: CasesQualificationSettings) => void
    elements: CasesQualificationSettings[]
}

export default class QualificationBox extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    private MAX_CHARS_TO_DISPLAY = 25;

    public renderIconOrDefault(element) {
        if (element.icon) {
            return <span className={"d-flex align-self-center icon-gradient " + element.icon}/>
        } else {
            return <span className={"d-flex align-self-center icon-gradient icon-right"}/>
        }
    }
     renderList():JSX.Element[]{
        let arr:JSX.Element[] = [];
        this.props.elements.forEach((element)=>
         arr.push(<Col className="px-2" onClick={this.props.getNextThemes.bind(this, element)}>
             <div className="d-flex qualification-box justify-content-between my-2">
                 {element.label.length > this.MAX_CHARS_TO_DISPLAY &&
                     <UncontrolledTooltip placement="top" target={"label_qualif_"+element.id}>
                         {element.label}
                     </UncontrolledTooltip>
                 }
                 <span className={element.selected?"qualification-box__selected":""} id={"label_qualif_"+element.id}>
                     {element.label.length > this.MAX_CHARS_TO_DISPLAY ? element.label.substring(0, this.MAX_CHARS_TO_DISPLAY) + "..." : element.label}
                 </span>
                 {!element.isLeaf && this.renderIconOrDefault(element)}
             </div>
         </Col>)
         )
         return arr;
     }

    public render() {
        return (
            <div className={"qualification-box__list"}>
                {this.props.elements && this.renderList()}
            </div>
        )
    }
}