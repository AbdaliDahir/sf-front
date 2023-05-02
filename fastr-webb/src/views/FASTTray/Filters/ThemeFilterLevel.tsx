import * as React from "react";
import {FormattedMessage} from "react-intl"
import {Col, Row} from "reactstrap"
import FormSelectInput from "../../../components/Form/FormSelectInput"
import {translate} from "../../../components/Intl/IntlGlobalProvider"
import {arrayEquals} from "../../../utils/ArrayUtils";


interface Props {
    level: number
    value: string
    onChange: (e: React.FormEvent<HTMLInputElement>) => void
    themes: string[][]
    hidden?: boolean
    selected: string[]
    saved?:boolean
}

const ThemeFilterLevel: React.FunctionComponent<Props> = (props: Props) => {

    const renderOptions = () => {
        const selectionThemes: Set<string> = new Set();

        props.themes.forEach(themeQualif => {
            const {level, selected} = props
            if (level) {
                if(arrayEquals(themeQualif.slice(0, selected.length), selected)) {
                    if (themeQualif[level]) {
                        selectionThemes.add(themeQualif[level])
                    }
                }
            } else {
                selectionThemes.add(themeQualif[level])
            }
        })
        if (selectionThemes.size === 0) {
            return []
        }

        const themesOptionsHTML: JSX.Element[] = []
        selectionThemes.forEach(value => themesOptionsHTML.push(<option key={value}>{value}</option>))
        return themesOptionsHTML;
    }

    if (props.hidden) {
        return null
    }

    const options: JSX.Element[] = renderOptions()

    if (!options.length && props.level) {
        return null
    }

    return (
        <Col xs={3}>
            <Row>
                <Col className="text-center text-muted">
                    <FormattedMessage id={`tray.cases.filter.themes.level${props.level + 1}.title`}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormSelectInput key={props.level}
                                     name={`level${props.level}`} id={`${props.level}`}
                                     onChange={props.onChange}
                                     value={props.value}
                                     saved={props.saved}>
                        <option
                            selected={true}>{translate.formatMessage({id: "tray.cases.filter.themes.all"})} </option>
                        {options}
                    </FormSelectInput>
                </Col>
            </Row>
        </Col>
    )

}
export default ThemeFilterLevel;
