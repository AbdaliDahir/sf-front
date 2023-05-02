import * as React from "react";
import * as moment from "moment";

import {Breadcrumb, Col} from "reactstrap";
import ActService from "../../../../service/ActService";
import {FormattedMessage} from "react-intl";
import {CaseResource} from "../../../../model/CaseResource";
import Label from "reactstrap/lib/Label";
import {AntiChurnActResponseDTO} from "../../../../model/acts/antichurn/AntiChurnActResponseDTO";
import {AppState} from "../../../../store";
import {fetchAndStoreAntiChurnSettings} from "../../../../store/actions/AntiChurnAction";
import {connect} from "react-redux";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";

interface Props {
    caseResource: CaseResource
    actDetail?: AntiChurnActResponseDTO
    antiChurnSetting: Map<string, string>
    fetchAndStoreAntiChurnSettings: () => void
}

interface State {
    data?: AntiChurnActResponseDTO
}

interface ValueDisplayOrganization {
    elementsOfFirstCol: JSX.Element[]
    elementsOfSecondCol: JSX.Element[]
}

class AntichurnDataSummary extends React.Component<Props, State> {

    private actService: ActService = new ActService(true);
    private DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;

    constructor(props: Props) {
        super(props);
        this.state = {}
    }

    public componentDidMount = async () => {
        const {actDetail, caseResource, antiChurnSetting, fetchAndStoreAntiChurnSettings} = this.props
        if (!antiChurnSetting) {
            await fetchAndStoreAntiChurnSettings()
        }
        if (actDetail) {
            this.setState({data: actDetail})
            return;
        }
        if (caseResource) {
            const antichurnData = await this.actService.getActAntiChurn(caseResource.id);
            this.setState({
                data: antichurnData
            });
        }
    }

    public fieldValueExists = (value): boolean => {
        if (undefined === value || null === value) {
            return false
        }
        if (typeof value === "string" && !value) {
            return false
        }
        return true
    }

    public createFieldElement = (key, value): JSX.Element => {
        let valueToDisplay
        if (value.label) {
            valueToDisplay = value.label
        } else if (typeof value === "string") {
            const valueFromSetting = this.props.antiChurnSetting.get(value)
            valueToDisplay = valueFromSetting ? valueFromSetting : translate.formatMessage({id: value})
        } else {
            valueToDisplay = value
        }
        return (
            <div className="mb-2">
                <span className="font-weight-bold"><FormattedMessage id={`acts.antichurn.${key}`}/> :</span>
                <br/>
                {valueToDisplay}
            </div>
        )
    }

    public getValueDisplayOrganization = (): ValueDisplayOrganization => {
        const {antiChurnData} = this.state.data!;
        let numberOfExistingValue: number = 0;
        const elementsOfFirstCol: JSX.Element[] = [];
        const elementsOfSecondCol: JSX.Element[] = [];

        Object.keys(antiChurnData).forEach((key) => {
            const value = antiChurnData[key]
            if (!this.fieldValueExists(value)) {
                return;
            }
            const element: JSX.Element = this.createFieldElement(key, value);

            ++numberOfExistingValue
            if (numberOfExistingValue <= 5) {
                elementsOfFirstCol.push(element)
            } else {
                elementsOfSecondCol.push(element)
            }
        })
        if (elementsOfFirstCol.length) {
            const lastFirstColElem = elementsOfFirstCol.pop()!
            elementsOfFirstCol.push({...lastFirstColElem, props: {...lastFirstColElem["props"], className:""}})

            if (elementsOfSecondCol.length) {
                const lastSecondColElem = elementsOfSecondCol.pop()!
                elementsOfSecondCol.push({...lastSecondColElem, props: {...lastSecondColElem["props"], className:""}})
            }
        }
        const organization: ValueDisplayOrganization = {
            elementsOfFirstCol: elementsOfFirstCol,
            elementsOfSecondCol: elementsOfSecondCol
        }
        return organization
    }


    public render(): JSX.Element {
        const {data} = this.state
        if (!data) {
            return <React.Fragment/>
        }
        const valueDisplayOrganization: ValueDisplayOrganization = this.getValueDisplayOrganization();
        return (
            <React.Fragment>
                <strong>
                    <Label>
                        <FormattedMessage id="antichurn.summary.title"/>
                        {data.actFunctionalId ? data.actFunctionalId : ""} &nbsp;
                        <FormattedMessage id="antichurn.summary.creationDate"/>
                        {moment(this.props.caseResource.creationDate).format(this.DATETIME_FORMAT)}
                    </Label>
                </strong>

                {valueDisplayOrganization.elementsOfFirstCol &&
                <Breadcrumb>
                    <Col>
                        {valueDisplayOrganization.elementsOfFirstCol}
                    </Col>

                    {valueDisplayOrganization.elementsOfSecondCol &&
                    <Col>
                        {valueDisplayOrganization.elementsOfSecondCol}
                    </Col>
                    }
                </Breadcrumb>
                }
            </React.Fragment>
        )

    }
}

const mapStateToProps = (state: AppState) => ({
    antiChurnSetting: state.antiChurn.antiChurnSettings?.settingAsKeyValue
});

const mapDispatchToProps = {
    fetchAndStoreAntiChurnSettings
}

export default connect(mapStateToProps, mapDispatchToProps)(AntichurnDataSummary)