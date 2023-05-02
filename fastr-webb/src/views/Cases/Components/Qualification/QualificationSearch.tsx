import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {RouteComponentProps, withRouter} from "react-router";
import {Button, Row} from "reactstrap";
import Col from "reactstrap/lib/Col";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import CaseService from "../../../../service/CaseService";
import {AppState} from "../../../../store";
import {setHasCallTransfer} from "../../../../store/actions/";
import {
    setAdditionalData,
    setCaseMotif,
    setCaseQualification,
    setQualificationLeaf,
} from "../../../../store/actions/CasePageAction";
import {compose} from "redux";
import {connect} from "react-redux";
import './QualificationSearch.scss';

interface State {
    retrievedQualif
}

interface Props {
    client,
    searchValue: string,
    category: string,
    onSelectQualification
}

// tslint:disable-next-line:no-any
class QualificationSearch extends Component<Props & RouteComponentProps, State> {
    private caseService: CaseService = new CaseService(true)

    constructor(props) {
        super(props)
        this.state = {
            retrievedQualif: []
        }
    }

    // @ts-ignore
    private fetchQualifications = async () => {

        if (this.props.searchValue && this.props.searchValue.length >= 2) {
            const retrievedQualif: Array<CasesQualificationSettings> = await this.caseService.getCaseQualificationSettingsHierarchy(
                this.props.searchValue, this.props.category, this.props.client.service.serviceType);
            this.setState({retrievedQualif})
        } else {
            this.setState({retrievedQualif: []})
        }

    }

    private handleOnSelectQualification = (selectedQualification) => {
        this.props.onSelectQualification(selectedQualification);
    }

    async componentDidMount() {
        await this.fetchQualifications();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.searchValue && this.props.searchValue !== prevProps.searchValue) {
            await this.fetchQualifications();
        }
    }

    renderHierarchy = (qualif): Array<JSX.Element> => {
        if (qualif?.hierarchyLabel) {
            const motifs = qualif.hierarchyLabel.split("=>");
            const hierarchyElements: Array<JSX.Element> = [];
            motifs.forEach((motif, index) => {
                hierarchyElements.push(this.getHighlightedText(motif, this.props.searchValue));
                if (index < motifs.length - 1) {

                    hierarchyElements.push(<span key={index} style={{color: "red", fontWeight: "bold"}}> / </span>);
                } else if (!qualif.leaf) {
                    hierarchyElements.push(<span className={"icon-gradient icon-right"}/>)
                }
            });
            return hierarchyElements
        } else {
            return []
        }
    }

    private getHighlightedText = (text, highlight) => {
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return <span>{parts.map(part => part.toLowerCase() === highlight.toLowerCase() ? <b>{part}</b> : part)}</span>;
    }

    public render(): JSX.Element {
        return (
            <div className={"my-1"}>
                <h6>
                    <FormattedMessage id="cases.get.details.qualification.searchResult"/>
                </h6>
                <div className={"m-2 qualification-search__search-results"}>
                    {this.state.retrievedQualif && this.state.retrievedQualif?.length > 0 ?
                        this.state.retrievedQualif.map((element, index) => (
                            <Row key={index}>
                                <Col xs={12}>
                                    <Button style={{color: "black"}}
                                            onClick={() => this.handleOnSelectQualification(element)} color="link"
                                            size="sm">
                                        {this.renderHierarchy(element)}
                                    </Button>
                                </Col>
                            </Row>
                        ))
                        :
                        <span>Aucun résultat trouvé pour votre recherche.</span>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.client
});

const mapDispatchToProps = dispatch => ({
    setHasCallTransfer: (value) => dispatch(setHasCallTransfer(value)),
    setCaseQualification: (qualification: CasesQualificationSettings) => dispatch(setCaseQualification(qualification)),
    setQualificationLeaf: (qualificationLeaf) => dispatch(setQualificationLeaf(qualificationLeaf)),
    setAdditionalData: (additionalData) => dispatch(setAdditionalData(additionalData)),
    setCaseMotif: (motif) => dispatch(setCaseMotif(motif)),
})
// tslint:disable-next-line:no-any
export default compose<any>(withRouter, connect(mapStateToProps, mapDispatchToProps))(QualificationSearch)


