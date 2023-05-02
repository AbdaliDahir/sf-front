import * as React from "react";
import {FormattedMessage} from "react-intl"
import {Col, Row} from "reactstrap"
import FormSelectInput from "../../../components/Form/FormSelectInput"
import Formsy from "formsy-react";
import {ChangeEvent, useEffect, useState} from "react";
import CaseService from "../../../service/CaseService";
import {Site} from "../../../model/Site";


interface Props {
    value?: string
    onChange: (e: Site) => void
    hidden?: boolean
    selected?: string,
    activity: string
}

const LogicalSiteFilter: React.FunctionComponent<Props> = (props: Props) => {
    const caseService: CaseService = new CaseService(true);
    const [options, setOptions] = useState<Site[]>([]);
    useEffect(() => {
        if (options.length === 0) {
            caseService.getLogicalSites(props.activity).then((data:Site[]) =>{
                setOptions(data)
            })
        }
    }, [options.length])
    const renderOptions = () => {
        const listOfSiteToRender : JSX.Element[] = [];
        options.forEach( option => {
                const { code, label } = option;
                listOfSiteToRender.push(<option key={code}> {label} </option>)
            }
        );
        return listOfSiteToRender;
    };

    const selectSite = (event : ChangeEvent<HTMLInputElement>) : void => {
        const codeSite: Site | undefined = options.find(option => option.label === event.target.value);
        if (codeSite) {
            props.onChange(codeSite);
        }
    }

    return (
        <Col xs={12}>
            <Row>
                <Col className="text-center text-muted">
                    <FormattedMessage id={`tray.cases.filter.site.title`}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Formsy>
                        <FormSelectInput key="site-filter" value={props.value?? null} selected={props.selected?? null}
                                         name="site-filter-name" id="site-filter-id" disabled={false} onChange={selectSite} 
                        >
                            { renderOptions() }
                        </FormSelectInput>
                    </Formsy>
                </Col>
            </Row>
        </Col>
    )

}
export default LogicalSiteFilter;
