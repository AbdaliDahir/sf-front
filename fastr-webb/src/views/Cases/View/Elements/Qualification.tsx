import * as React from "react";
import {Breadcrumb, BreadcrumbItem} from "reactstrap";

interface Props {
    qualifTags?
    type: string
}

class Qualification extends React.Component<Props, object> {

    public render(): JSX.Element {
        const {type} = this.props;
        const displayedType = type;
        const qualif = this.props.qualifTags.map((e, i) => {
            return <BreadcrumbItem key={i}>{e}</BreadcrumbItem>
        })
        return (

            <Breadcrumb>
               <h6>{type === 'Motif'|| type === 'Thème'? displayedType :""}</h6>&nbsp; {qualif !== undefined ? qualif : ""}
            </Breadcrumb>
        );
    }
}

export default Qualification
