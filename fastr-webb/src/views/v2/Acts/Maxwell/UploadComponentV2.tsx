import * as React from "react";
import Dropzone from "react-dropzone";
import {NotificationManager} from "react-notifications";
import Button from "reactstrap/lib/Button";

import Col from "reactstrap/lib/Col";
import FormGroup from "reactstrap/lib/FormGroup";
import Label from "reactstrap/lib/Label";
import ListGroup from "reactstrap/lib/ListGroup";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import Row from "reactstrap/lib/Row";

import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {StepProps} from "../../../../components/Form/StepForm/StepForm";
import FormTextInput from "../../../../components/Form/FormTextInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {
    setCanNotOpenMaxwellModal,
    setFormMaxwellCompleteV2,
    setFormMaxwellIncompleteV2,
    setMaxwellIncidentTitleV2,
    setUploadedFilesMaxwellV2,
    setMaxwellDropZoneEmpty,
    setMaxwellDropZoneNotEmpty,
    setMaxwellFormLastStep,
} from "../../../../store/actions/v2/case/CaseActions";
import {AppState} from "../../../../store";
import {setBlockingUIV2} from "../../../../store/actions/v2/ui/UIActions";
import {EMaxwellCallOrigin} from "../../../../model/maxwell/enums/EMaxwellCallOrigin";
import CaseService from "../../../../service/CaseService";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {Activity} from "../../../../model/Activity";

interface Props extends StepProps {
    uploadedFiles: Array<File>
    incidentTitle: string
    setUploadedFilesMaxwellV2: (caseId: string, uploadedFiles: Array<File>) => void
    setFormMaxwellCompleteV2: (caseId: string) => void
    setFormMaxwellIncompleteV2: (caseId: string) => void
    setMaxwellIncidentTitleV2: (caseId: string, incidentTitle: string) => void
    caseId: string,
    setBlockingUIV2,
    maxwellCallOrigin,
    setCanNotOpenMaxwellModal: (caseId: string) => void,
    ticketTitle?: string,
    callOrigin?: EMaxwellCallOrigin
    actIdToFinalize: string,
    readOnly: boolean
    setMaxwellDropZoneEmpty: (caseId: string) => void
    setMaxwellDropZoneNotEmpty: (caseId: string) => void
    setMaxwellFormLastStep: (caseId: string) => void
    payload: any
    userActivity: Activity
}

const caseService: CaseService = new CaseService(true);
class UploadComponentV2 extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    public componentDidMount = async () => {
        if (this.props.uploadedFiles && this.props.uploadedFiles.length > 0) {
            this.props.setUploadedFilesMaxwellV2(this.props.caseId,this.props.uploadedFiles)
        }

        if (this.props.callOrigin && (this.props.callOrigin === EMaxwellCallOrigin.FROM_INCIDENTS_LIST || this.props.callOrigin === EMaxwellCallOrigin.FROM_HISTORY)) {
            this.props.setMaxwellIncidentTitleV2(this.props.caseId, this.props.ticketTitle ? this.props.ticketTitle : "")
            this.props.uploadedFiles.splice(0, this.props.uploadedFiles.length)
            const filesNames: Array<string> = await caseService.getMaxwellFileNames(this.props.actIdToFinalize);
            for (const fileName of filesNames) {
                const blob: Blob = await caseService.downloadMaxwellAttachment(this.props.actIdToFinalize, fileName);
                this.props.setUploadedFilesMaxwellV2(this.props.caseId, this.props.uploadedFiles.concat(this.blobToFile(blob, fileName)));
            }
        }
        if (this.props.changeValidation) {
            this.props.changeValidation(this.props.uploadedFiles.length > 0);
        }
        if(this.props.setMaxwellFormLastStep) {
            this.props.setMaxwellFormLastStep(this.props.caseId)
        }
    }

    public blobToFile = (theBlob: Blob, fileName:string): File => {
        const b: any = theBlob;
        b.lastModifiedDate = new Date();
        b.name = fileName;
        return theBlob as File;
    }

    public onPreviewDrop = (file) => {
        const currentFile = file[0]
        const extension = currentFile.name.split('.').pop();
        const uploadedFiles = this.props.uploadedFiles;

        if (uploadedFiles.length === 5) {
            this.warning("case.attachement.number.over")
        }
        else if (extension === "exe" || extension === "bat" || extension === "sh" || extension === "bin" || extension === "php") {
            this.warning("case.attachement.bad.extension")
        }
        else if (currentFile.size > 2000000) {
            this.warning("case.attachement.size.over.limit")
        }
        else if (this.isFileAlreadyPresent(currentFile)) {
            this.warning("case.attachement.same.msg")
        }
        else {
            this.props.setUploadedFilesMaxwellV2(this.props.caseId, uploadedFiles.concat(currentFile));
        }
    }

    public delete = (file: File) => {
        const updatedFiles = this.props.uploadedFiles.filter(element => element.name !== file.name)
        this.props.setUploadedFilesMaxwellV2(this.props.caseId, updatedFiles)
    }

    public fileDownload = (file: File) => {
        const url = window.URL.createObjectURL(file.slice());
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click()
    }

    public attachementEmpty = () => {
        this.props.setMaxwellDropZoneEmpty(this.props.caseId);
        return <ListGroupItem className={"text-center font-weight-bold pt-4 pb-4"} color={"primary"}>
            <FormattedMessage
                id="case.attachement.empty"/>

        </ListGroupItem>
    }

    public renderUploadedFiles = () => {
        return (
            <ListGroup>
                {this.props.uploadedFiles && this.props.uploadedFiles.length ?
                    this.props.uploadedFiles.map((file, key) => (
                        this.previewFile(file, key)))
                    : this.attachementEmpty()
                }
            </ListGroup>
        )
    }

    public handleChangeIncidentTitle = (event) => {
        const value = event.target.value
        this.props.setMaxwellIncidentTitleV2(this.props.caseId, value)
    }


    public previewFile = (file: File, key: number) => {
        this.props.setMaxwellDropZoneNotEmpty(this.props.caseId);
        const fileSize = (file.size / 1000000).toFixed(2);
        return (
            <ListGroupItem>
                <Row className={"text-center"}>
                    <Col md={5} className={"border-right"}>
                        {file.name}
                    </Col>
                    <Col md={3} className={"border-right"}>
                        {fileSize}
                        <FormattedMessage
                            id="case.attachement.size.unit"/>
                    </Col>
                    <Col md={4}>
                        <Button color="primary" size="sm" onClick={this.fileDownload.bind(this, file)}>
                            <span className="icon-white icon-download"/>
                        </Button>
                        &nbsp;
                        {!this.props.readOnly && <Button color="primary" size="sm" onClick={this.delete.bind(this, file)}>
                            <span className="icon-white icon-close"/>
                        </Button>}
                    </Col>
                </Row>
            </ListGroupItem>
        )
    }

    public renderDropZone(): JSX.Element {
        const signUpForm = {
            border: '2px dashed red',
            cursor: "copy"
        }

        return (
            <Dropzone onDrop={this.onPreviewDrop} disabled={this.props.readOnly}>
                {({getRootProps, getInputProps}) => (
                    <section style={signUpForm}>
                        <div {...getRootProps()} className={"pt-4 pb-4"}>
                            <input {...getInputProps()} />
                            <span
                                className="icon icon-upload  mr-2"/>
                            <FormattedMessage
                                id="case.attachement.select.msg"/>
                        </div>
                    </section>
                )}
            </Dropzone>
        )
    }


    public componentDidUpdate(prevProps: Readonly<Props>): void {
        this.props.uploadedFiles.length > 0 && this.props.incidentTitle !== undefined ? this.setFormComplete() : this.setFormIncomplete();
        if (prevProps.uploadedFiles.length !== this.props.uploadedFiles.length && this.props.uploadedFiles.length > 0) {
            if (this.props.changeValidation) {
                this.props.changeValidation(this.props.uploadedFiles.length > 0);
            }
        }
    }

    public render(): JSX.Element {
        return (
            <React.Fragment>
                <Row>
                    <Col md={3}/>
                    <Col className={"text-center"}>
                        <FormGroup>
                            <h6><Label for="incidenttitle"><FormattedMessage id={"act.ADG_MAXWELL.step.attachments.incidentTitle"}/></Label><span className="text-danger">*</span></h6>
                            <FormTextInput id={"incidenttitle"}
                                           name={"incidenttitle"}
                                           label={translate.formatMessage({id: "act.ADG_MAXWELL.step.attachments.incidentTitle"})}
                                           value={this.props.incidentTitle}
                                           onChange={this.handleChangeIncidentTitle}
                                           disabled={this.props.readOnly}
                                           validations={{
                                               isRequired: ValidationUtils.notEmpty
                                               , "inputMaxLength": 38, "inputMinLength": 10
                                           }}/>
                        </FormGroup>
                    </Col>
                    <Col md={3}/>
                </Row>

                <Row className={"align-middle mb-2"}>
                    <Col md={6} className={"text-center border-right align-middle"}>
                        {this.renderDropZone()}
                    </Col>
                    <Col md={6}>
                        {this.renderUploadedFiles()}
                    </Col>
                </Row>
            </React.Fragment>
        )
    }

    public setFormComplete() {
        if(!this.props.readOnly) {
            this.props.setFormMaxwellCompleteV2(this.props.caseId);
            if (this.props.maxwellCallOrigin === EMaxwellCallOrigin.FROM_CASE) {
                this.props.setBlockingUIV2(false);
            }
        }
    }

    public setFormIncomplete() {
        this.props.setFormMaxwellIncompleteV2(this.props.caseId);
        if(this.props.maxwellCallOrigin === EMaxwellCallOrigin.FROM_CASE) {
            this.props.setBlockingUIV2(true);
            this.props.setCanNotOpenMaxwellModal(this.props.caseId);
        }
    }

    public warning = (msg) => {
        NotificationManager.warning(<FormattedMessage
            id={msg}/>)
    }

    public isFileAlreadyPresent = (file: File) => {
        const fileName = file.name;
        const uploadedFiles = this.props.uploadedFiles;
        for (const currentFile of uploadedFiles) {
            if (currentFile.name === fileName) {
                return true;
            }
        }
        return false
    }

}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    uploadedFiles: state.store.cases.casesList[ownProps.caseId].maxwellIncident?.uploadedFilesMaxwell,
    incidentTitle: state.store.cases.casesList[ownProps.caseId].maxwellIncident?.incidentTitle,
    maxwellCallOrigin: state.store.cases.casesList[ownProps.caseId].maxwellIncident?.callOrigin,
    actIdToFinalize:  state.store.cases.casesList[ownProps.caseId]?.maxwellIncident?.actIdToFinalize,
    payload: state.payload.payload,
    userActivity: state.store.applicationInitialState.user!.activity
})
const mapDispatchToProps = {
    setFormMaxwellIncompleteV2,
    setFormMaxwellCompleteV2,
    setUploadedFilesMaxwellV2,
    setMaxwellIncidentTitleV2,
    setBlockingUIV2,
    setCanNotOpenMaxwellModal,
    setMaxwellDropZoneEmpty,
    setMaxwellDropZoneNotEmpty,
    setMaxwellFormLastStep
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadComponentV2)