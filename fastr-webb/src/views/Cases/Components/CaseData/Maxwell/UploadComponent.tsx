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
import FormTextInput from "../../../../../components/Form/FormTextInput";
import {setFormMaxellComplete, setFormMaxellIncomplete} from "../../../../../store/actions";
import {connect} from "react-redux";

import {AppState} from "../../../../../store";
import {setUploadedFilesMaxwell} from "../../../../../store/actions/CasePageAction";
import ValidationUtils from "../../../../../utils/ValidationUtils";
import {StepProps} from "../../../../../components/Form/StepForm/StepForm";


interface Props extends StepProps {
    uploadedFiles: Array<File>
    setUploadedFilesMaxwell: (uploadedFiles: Array<File>) => void
    setFormMaxellComplete: () => void,
    setFormMaxellIncomplete: () => void

}


class UploadComponent extends React.Component<Props> {


    constructor(props: Props) {
        super(props);
    }

    public componentDidMount = async () => {
        if (this.props.uploadedFiles && this.props.uploadedFiles.length > 0) {
            this.props.setUploadedFilesMaxwell([])
        }

        if (this.props.changeValidation) {
            this.props.changeValidation(false);
        }
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
            this.props.setUploadedFilesMaxwell(uploadedFiles.concat(currentFile));
        }
    }

    public delete = (file: File) => {
        // The Delete Works :D
        const updatedFiles = this.props.uploadedFiles.filter(element => element.name !== file.name)
        this.props.setUploadedFilesMaxwell(updatedFiles)
    }


    public renderUploadedFiles = () => {
        return (
            <ListGroup>
                {this.props.uploadedFiles && this.props.uploadedFiles.length ?
                    this.props.uploadedFiles.map((file, key) => (
                        this.previewFile(file, key)))
                    :
                    <ListGroupItem className={"text-center font-weight-bold pt-4 pb-4"} color={"primary"}>
                        <FormattedMessage
                            id="case.attachement.empty"/>

                    </ListGroupItem>
                }
            </ListGroup>
        )
    }


    public previewFile = (file: File, key: number) => {
        const fileSize = (file.size / 1000000).toFixed(2);
        return (
            <ListGroupItem>
                <Row className={"text-center"}>
                    <Col md={7} className={"border-right"}>
                        {file.name}
                    </Col>
                    <Col md={3} className={"border-right"}>
                        {fileSize}
                        <FormattedMessage
                            id="case.attachement.size.unit"/>
                    </Col>
                    <Col md={2}>
                        <Button color="primary" size="sm" onClick={this.delete.bind(this, file)}>
                            <span className="icon-white icon-close"/>
                        </Button>
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
            <Dropzone onDrop={this.onPreviewDrop}>
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
        if (prevProps.uploadedFiles.length !== this.props.uploadedFiles.length && this.props.uploadedFiles.length > 0) {
            if (this.props.changeValidation) {
                this.props.changeValidation(this.props.uploadedFiles.length > 0);
            }
        }
    }

    public render(): JSX.Element {
        this.props.uploadedFiles.length > 0 ? this.props.setFormMaxellComplete() : this.props.setFormMaxellIncomplete();
        return (
            <React.Fragment>
                <Row>
                    <Col md={3}/>
                    <Col className={"text-center"}>
                        <FormGroup>
                            <h6><Label for="incidenttitle">Titre de l'incident</Label><span className="text-danger">*</span></h6>
                            <FormTextInput id={"incidenttitle"}
                                           name={"incidenttitle"}
                                           value={""}
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

const mapStateToProps = (state: AppState) => ({
    uploadedFiles: state.casePage.uploadedFiles,

})
const mapDispatchToProps = {
    setFormMaxellIncomplete,
    setFormMaxellComplete,
    setUploadedFilesMaxwell
}
export default connect(mapStateToProps, mapDispatchToProps)(UploadComponent)
