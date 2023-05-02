import React from "react"
import { useEffect, useState } from "react"
import { Row, Col, Label } from "reactstrap"
import FormSwitchInput from "src/components/Form/FormSwitchInput"
import Loading from "src/components/Loading"
import { translate } from "../../../../components/Intl/IntlGlobalProvider"
import FormHiddenInput from "src/components/Form/FormHiddenInput"
import ValidationUtils from "src/utils/ValidationUtils"
import ClientService from "src/service/ClientService"
import { UIProps } from "src/store/actions/UIActions"
import { ClientContextSliceState } from "src/store/ClientContextSlice"
import { connect } from "react-redux"
import { AppState } from "src/store"
import { MobileLineService } from "src/model/service"
import StringUtils from "src/utils/StringUtils"

interface Props extends UIProps {
	client: ClientContextSliceState
}

interface FormData {
	checked: boolean
	imei ?: string
	error?: string
}

const EditReturnBox4G = (props: Props) => {
	const [formData, setFormData] = useState<FormData>()
	const clientService: ClientService = new ClientService()

	useEffect(() => {
		const service = props.client.service as MobileLineService;
		if (service.contractualTerminal.imei) {
			const formData: FormData = {
				checked: false,
				imei: service.contractualTerminal.imei
			}
			setFormData(formData)
		}
		else
			clientService.getEquipementRestitution(props.client.serviceId).then(data => {
				const formData: FormData = {
					checked: false,
					imei: data[0]?.imei
				}
				setFormData(formData)
			}).catch(async (e) => {
				const error = await e;
				const formData: FormData = {
					checked: false,
					imei: "",
					error: StringUtils.isJsonString(error.message) ? JSON.parse(error.message).message : error.message
				}
				setFormData(formData)
			})
	}, [])

	return (
		formData ? <React.Fragment>
			<Row className="align-items-center">
				<Col sm="8"><Label className={formData.error ? 'mr-2 text-danger' : 'mr-2'}>{formData.error ? formData.error : 'Le client confirme-t-il avoir retourné sa BOX 4G ?'}</Label></Col>
				<Col sm="4">
					<FormSwitchInput color="primary"
						name="checked"
						id="checked"
						className="mb-0"
						disabled={!formData.imei}
						valueOn={translate.formatMessage({ id: "global.dialog.yes" })}
						valueOff={translate.formatMessage({ id: "global.dialog.no" })}
						value={formData.checked}
						validations={{ isRequired: ValidationUtils.notEmpty }}
						thickness={"sm"} />
				</Col>
			</Row>
			<FormHiddenInput name="imei" id="imei" value={formData.imei} />
		</React.Fragment> : <Loading />
	)
}

const mapStateToProps = (state: AppState) => ({
	client: state.store.client.currentClient,
})

export default connect(mapStateToProps)(EditReturnBox4G)
