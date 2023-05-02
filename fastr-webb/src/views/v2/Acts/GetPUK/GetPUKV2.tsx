import * as React from "react";
import {Alert, Container} from "reactstrap";
import {FormattedMessage} from "react-intl";
import "./getPukV2.css";
import {compose} from "redux";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {AppState} from "../../../../store";
import {ClientContext} from "../../../../store/types/ClientContext";
import {MobileLineService} from "../../../../model/service";

interface Props {
    client: ClientContext<MobileLineService>
}

interface State {
    puk: string | null;
}

const myStyle: object = {
    fontFamily: 'monospace',
    MozAppearance: 'textfield',
    borderRadius: '6px',
    border: '1px solid',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,.10)',
    margin: '4px',
    paddingLeft: '8px',
    width: '36px',
    height: '42px',
    fontSize: '32px',
    boxSizing: 'border-box',
    color: 'dimgrey',
    backgroundColor: '#efeff1',
    borderColor: 'lightgrey',
    cursor: 'not-allowed'
}

class GetPUKV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            puk: null
        }
    }

    public render(): JSX.Element {
        const puk = this.props.client?.service?.simCard?.puk;

        if (!puk) {
            return <Alert color="warning">
                <FormattedMessage id="acts.puk.none"/>
            </Alert>

        } else {
            return (
                <Container fluid>
                    <div className="text-center">
                        <h3>
                            <FormattedMessage id="acts.puk.title"/>
                        </h3>
                        <Alert color="warning">
                            <FormattedMessage id="acts.puk.advise"/>
                        </Alert>

                        <div style={{display: "inline-block"}}>
                            {puk.split('').map((value, i) => {
                                return (
                                    <input
                                        data-id={i}
                                        autoFocus={i === 0}
                                        value={value}
                                        key={`input_${i}`}
                                        type={'number'}
                                        min={0}
                                        max={9}
                                        maxLength={puk.length === i + 1 ? 1 : puk.length}
                                        style={myStyle}
                                        autoComplete="off"
                                        disabled={true}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </Container>
            )
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.store.client.currentClient
})

// tslint:disable-next-line:no-any
export default compose<any>(withRouter, connect(mapStateToProps))(GetPUKV2)