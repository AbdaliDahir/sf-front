import * as React from "react";
import {Breadcrumb, BreadcrumbItem, Row, Col} from "reactstrap";
import {FormattedMessage} from "react-intl";

interface Props {
    motifTags: string[]
    themeTags?: string[]
}

class SelectedCaseQualification extends React.Component<Props, object> {

    public render(): JSX.Element {

        return (

            <Breadcrumb>
                <Col>
                    <Row>
                        <strong><FormattedMessage
                            id="cases.list.recent.single.case.motif"/></strong> &nbsp;{this.props.motifTags ? this.renderTags(this.props.motifTags) : ""}
                    </Row>

                    {this.props.themeTags ? <Row><strong> <FormattedMessage id="cases.list.recent.single.case.theme"/>
                    </strong>&nbsp; {this.renderTags(this.props.themeTags)}</Row> : <React.Fragment/>}
                </Col>
            </Breadcrumb>
        );

    }


    public renderTags = (tags: string[]) => {
        return tags.length > 0 ? tags.map((e, i) => {
            return <BreadcrumbItem  key={i}>{e}</BreadcrumbItem>
        }) : <React.Fragment/>
    }
}

export default SelectedCaseQualification
