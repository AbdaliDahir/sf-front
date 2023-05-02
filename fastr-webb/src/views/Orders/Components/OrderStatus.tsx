import Stepbar from "../../../components/Bootstrap/Stepbar";
import StepbarItem from "../../../components/Bootstrap/StepbarItem";
import React from "react";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import OrderContextProps from "../../../store/types/OrderContext";

interface Props {
    color: string
}

class OrderStatus extends React.Component<Props & OrderContextProps> {

    public render(): JSX.Element {
        if (this.props.order.data && this.props.order.data.steps && this.props.order.data.currentStep) {
            const order = this.props.order.data;
            return (
                <div className="pb-3 pt-3">
                    <Stepbar lg color={this.props.color}>
                        {order.steps.map((e, i) => <StepbarItem key={i} active={e.active} finish={e.finish}
                                                                title={e.label} date={e.date}/>)}
                    </Stepbar>
                </div>
            )
        } else {
            return <React.Fragment/>
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    order: {
        data: state.order.data,
        loading: state.order.loading,
        error: state.order.error,
    },
});

export default connect(
    mapStateToProps,
)(OrderStatus);
