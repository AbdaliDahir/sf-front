import Formsy from "formsy-react"
import * as React from 'react'
import {FormattedMessage} from "react-intl"
import {connect} from 'react-redux'
import Card from "reactstrap/lib/Card"
import CardBody from "reactstrap/lib/CardBody"
import CardHeader from "reactstrap/lib/CardHeader"
import Col from "reactstrap/lib/Col"
import Collapse from "reactstrap/lib/Collapse"
import Row from "reactstrap/lib/Row"
import {translate} from "../../../components/Intl/IntlGlobalProvider"
import CaseService from "../../../service/CaseService"
import {AppState} from "../../../store"
import {dispatchAndStoreThemesSelection} from "../../../store/actions"
import ThemeFilterLevel from "./ThemeFilterLevel"
import {SessionStorageKeys} from "../../../model/TableFilters/SessionStorageKeys";
import {Base64} from "js-base64";
import {ActionsSuiviesFilters} from "../../../model/TableFilters/actionsSuivies/ActionsSuiviesFilters";

interface Props {
    activityCode: string
    isSupervisor: boolean

    themeSelection: string[]

    storeCurrentThemesSelection: (themeSelection: string[]) => void
}

interface State {
    themes: string[][]
    collapse: boolean
}

class ThemeFilter extends React.Component<Props, State> {
    private caseService = new CaseService(true);

    constructor(props: Props) {
        super(props)
        this.state = {
            themes: [],
            collapse: false
        }
    }

    public componentWillMount() {
        this.getThemes(this.props.activityCode);
        this.getInitialThèmes();
    }

    public componentDidUpdate(prevProps: Readonly<Props>) {
        // When activity change then refetch themes and put themeSelection to Initial State
        if (this.props.activityCode && this.props.activityCode !== prevProps.activityCode) {
            this.getThemes(this.props.activityCode)
            this.props.storeCurrentThemesSelection([translate.formatMessage({id: "tray.cases.filter.themes.all"})])
        }
        // When themeSelection is reset then refetch themes
        if (prevProps.themeSelection[0] !== this.props.themeSelection[0] &&
            this.props.themeSelection[0] === translate.formatMessage({id: "tray.cases.filter.themes.all"})) {
            this.getThemes(this.props.activityCode)
        }
    }

    public getThemes(actCode) {
        if (!actCode) {
            return;
        }
        if (this.props.isSupervisor) {
            this.caseService.getActionMonitoringThemesFromTray(actCode).then(res =>
                this.setState({
                    themes: res
                })
            )
        } else {
            this.caseService.getActionMonitoringThemesFromStock(actCode).then(res =>
                this.setState({
                    themes: res
                })
            )
        }
    }

    public onChange = (e) => {
        const selectedValue = e.currentTarget.value;
        const level = +e.currentTarget.id;
        let newThemeSelection = [...this.props.themeSelection]

        newThemeSelection = newThemeSelection.slice(0, level)

        if (level < newThemeSelection.length) {
            newThemeSelection.splice(level, 1, selectedValue)
        } else {
            newThemeSelection.splice(level, 0, selectedValue)
        }

        this.props.storeCurrentThemesSelection(newThemeSelection)
    }

    public toggle = () => {
        this.setState(prevState => ({
            collapse: !prevState.collapse,
        }))
    };

    public getValue = (i: number) => {
        return this.props.themeSelection[i] ? this.props.themeSelection[i] : translate.formatMessage({id: "tray.cases.filter.themes.all"})
    }

    public isHidden = (...i) => {
        return i.reduce((accumulation, currentValue) => accumulation || this.getValue(currentValue) === translate.formatMessage({id: "tray.cases.filter.themes.all"}))
    }

    public render() {
        return (
            <Card className="mt-1">
                <CardHeader>
                    <Row onClick={this.toggle} className={"cursor-pointer"}>
                        <Col md={11}>
                            <span className="icon-gradient icon-rom mr-2"/>
                            <FormattedMessage id={"tray.cases.filter.themes.title"}/>
                        </Col>
                        <Col md={1}>
                            <i className={"p-0 icon float-right " + (this.state.collapse ? "icon-down" : "icon-up")}/>
                        </Col>
                    </Row>
                </CardHeader>
                <Collapse isOpen={!this.state.collapse}>
                    <CardBody>
                        <Formsy>
                            <Row>
                                <ThemeFilterLevel level={0} value={this.getValue(0)} onChange={this.onChange}
                                                  themes={this.state.themes}
                                                  selected={this.props.themeSelection}
                                                  saved={this.getValue(0) !== translate.formatMessage({id: "tray.cases.filter.themes.all"})}
                                />
                                <ThemeFilterLevel level={1} value={this.getValue(1)}
                                                  hidden={this.isHidden(0)} onChange={this.onChange}
                                                  themes={this.state.themes}
                                                  selected={this.props.themeSelection}
                                                  saved={this.getValue(1) !== translate.formatMessage({id: "tray.cases.filter.themes.all"})}
                                />
                                <ThemeFilterLevel level={2} value={this.getValue(2)}
                                                  hidden={this.isHidden(0, 1)}
                                                  onChange={this.onChange} selected={this.props.themeSelection}
                                                  themes={this.state.themes}
                                                  saved={this.getValue(2) !== translate.formatMessage({id: "tray.cases.filter.themes.all"})}
                                />
                                <ThemeFilterLevel level={3} value={this.getValue(3)}
                                                  hidden={this.isHidden(0, 1, 2)}
                                                  onChange={this.onChange} selected={this.props.themeSelection}
                                                  themes={this.state.themes}
                                                  saved={this.getValue(3) !== translate.formatMessage({id: "tray.cases.filter.themes.all"})}
                                />
                            </Row>
                        </Formsy>
                    </CardBody>
                </Collapse>
            </Card>
        );
    }
    private getInitialThèmes(){
        const encodedSessionStorageFilters = sessionStorage.getItem(this.props.activityCode+SessionStorageKeys.ACTIONS_SUIVIES)
        if(encodedSessionStorageFilters !== null) {
            const sessionStorageFilters: ActionsSuiviesFilters = JSON.parse(Base64.decode(encodedSessionStorageFilters))
            if (sessionStorageFilters?.themeFilters) {
                this.props.storeCurrentThemesSelection(sessionStorageFilters?.themeFilters)
            } else {
                this.props.storeCurrentThemesSelection([translate.formatMessage({id: "tray.cases.filter.themes.all"})])
            }
        }
    }

}

const mapStateToProps = (state: AppState) => ({
    themeSelection: state.tray.themeSelection
})

const mapDispatchToProps = dispatch => (
    {
        storeCurrentThemesSelection: (themeSelection: string[]) => dispatch(dispatchAndStoreThemesSelection(themeSelection))
    }
)

export default connect(mapStateToProps, mapDispatchToProps)(ThemeFilter);