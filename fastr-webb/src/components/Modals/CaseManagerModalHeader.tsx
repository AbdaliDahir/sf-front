import * as React from "react";
import {ModalHeader} from "reactstrap";

interface Props {
    modalTitle: string
}

export class CaseManagerModalHeader extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }


    public render(): JSX.Element {
        const {modalTitle} = this.props;
        return (
                <ModalHeader><h4>{modalTitle}</h4></ModalHeader>
        )
    }
}