import * as React from 'react';
import {ChangeEvent} from 'react';
import {withFormsy} from "formsy-react";
import {legalCategoryList, LegalCategorySettings, getLegalCategoryMap} from "../legalCategory";
import {FormGroup, Input, InputProps} from "reactstrap";
import {PassDownProps} from "formsy-react/dist/Wrapper";

interface Props {
    onChange: (value: LegalCategorySettings) => void
    valueFromContext: LegalCategorySettings,
}

interface State {
    legalCategoryMap: Map<string, string>
}

type PropType = PassDownProps & Props & InputProps

class LegalCategory extends React.Component<PropType, State> {

    constructor(props: PropType) {
        super(props);
        this.state = {legalCategoryMap: getLegalCategoryMap()}
    }

    public changeValue = (event: ChangeEvent<HTMLInputElement>) => {

        const codeFromMap: string = this.state.legalCategoryMap.get(event.currentTarget.value) ?  this.state.legalCategoryMap.get(event.currentTarget.value)! : "";

        const newValue: LegalCategorySettings = {
            "name": codeFromMap !== undefined ? codeFromMap : "",
            "code": event.currentTarget.value
        };

        this.props.setValue(newValue.code);
        this.props.onChange(newValue)
    };

    public getLegalCategoryList(): JSX.Element[] {
        return legalCategoryList.map(
            (category, index) =>
                <option key={index} value={category.code}>{category.name}</option>
        )
    }

    public render(): JSX.Element {
        return (
            <FormGroup>
                <Input
                    {...this.props}
                    type="select"
                    onChange={this.changeValue}>
                    <option disabled selected>{this.props.valueFromContext.name}</option>
                    {this.getLegalCategoryList()}
                </Input>
            </FormGroup>
        );
    }


}

export default withFormsy<LegalCategorySettings, PropType>(LegalCategory);