import * as React from 'react';
import {Button} from "reactstrap"
import Stepbar from "../../Bootstrap/Stepbar";
import StepbarItem from "../../Bootstrap/StepbarItem";
import SwitchTransition from "react-transition-group/SwitchTransition";
import {CSSFadeTransition} from "../../Transitions/CSSTransition";
import {setNotMaxwellFormLastStep} from "../../../store/actions/v2/case/CaseActions";
import {connect} from "react-redux";

interface Props {
    caseId?: string
    id?: string
    children: Array<JSX.Element>
    stepNames?: Array<string>
    initialValid?: boolean
    hidePreviousButton?: boolean
    size?: ("sm" | "md" | "lg")
    setNotMaxwellFormLastStep: (caseId: string) => void
}

interface State {
    currentStep: number
    isValid: Array<boolean>
}

class StepForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            currentStep: 0,
            isValid: [false]
        }
    }

    public componentDidMount(): void {
        const initialValidArray = this.props.children.map(() => false)
        initialValidArray.pop()
        this.setState(prevState => ({
            isValid: [prevState.isValid[0], ...initialValidArray]
        }))
    }

    public renderChildrenWithStep = () => {
        return this.props.children.map((child: JSX.Element, index) =>
            this.withStepAndValid(child, index, this.setValidation)
        )
    }

    public setValidation = (isValid: boolean, index: number) => {
        const newValid = [...this.state.isValid]
        newValid[index] = isValid

        this.setState({
            isValid: newValid
        })
    }

    public onPrevious = () => {
        this.setState(prevState => ({
            currentStep: prevState.currentStep - 1
        }))
        if(this.props.caseId && this.props.setNotMaxwellFormLastStep) {
            this.props.setNotMaxwellFormLastStep(this.props.caseId);
        }
    }

    public onNext = () => {
        this.setState(prevState => ({
            currentStep: prevState.currentStep + 1
        }))
    }

    public renderBreadCrumb = () => {
        const items: Array<JSX.Element> = []

        const andReducer = (accumulator, currentValue) => accumulator && currentValue;

        function getBeforeValid(i, isValid) {
            return i === 0 || isValid.slice(0, i).reduce(andReducer)
        }

        const getOnClickOnStep = (i) => ((e) => {
                e.preventDefault()
                const isBeforeValid: boolean = getBeforeValid(i, this.state.isValid)
                if (isBeforeValid) {
                    this.setState({currentStep: i})
                }
            }
        )
        if (this.props.stepNames) {
            this.props.stepNames.forEach((name, index) => {
                const isCurrent = index === this.state.currentStep
                items.push(
                    <StepbarItem onClick={getOnClickOnStep(index)} key={name} active={isCurrent}
                                 finish={this.state.isValid[index]} title={name}/>
                )
            })
        }
        return items
    }

    public render() {
        return (
            <div className="stepform">
                <Stepbar lg={!this.props.size || this.props.size === "lg"} color={"primary"}>
                    {this.renderBreadCrumb()}
                </Stepbar>
                <SwitchTransition>
                    <CSSFadeTransition key={this.state.currentStep}>
                        {this.renderChildrenWithStep()}
                    </CSSFadeTransition>
                </SwitchTransition>

                <div className="d-flex justify-content-between">
                    {this.state.currentStep && !this.props.hidePreviousButton ?
                        <Button className="mt-1"
                                size={this.props.size || "md"}
                                onClick={this.onPrevious}
                                type="button"> Precedent
                        </Button>
                        :
                        <div/>}

                    {this.state.currentStep !== this.props.children.length - 1 ?
                        <Button className="mt-1" disabled={!this.state.isValid[this.state.currentStep]}
                                size={this.props.size || "md"}
                                onClick={this.onNext}
                                type="button"> Suivant</Button>
                        :
                        <div/>}
                </div>
            </div>
        );
    }

    private withStepAndValid = (component, step, validFn) => {
        const changeValidation = (isValid) => validFn(isValid, step)
        if (this.state.currentStep === step) {
            return React.cloneElement(component, {
                changeValidation,
                step,
                onNext: this.onNext,
                onPrevious: this.onPrevious,
                currentStep: this.state.currentStep
            })
        } else {
            return null
        }
    }
}


export interface StepProps {
    changeValidation?: (isValid: boolean) => void
    step?: number
    onNext?: () => void
    onPrevious?: () => void
    currentStep?: number
    setValidation?: (isValid: boolean, index: number) => void
}

const mapDispatchToProps = {
    setNotMaxwellFormLastStep
}

export default connect(null, mapDispatchToProps)(StepForm);