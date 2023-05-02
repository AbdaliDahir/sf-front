import * as React from "react";
import BootstrapTable from "react-bootstrap-table-next"
import {Container, CustomInput} from "reactstrap"
import {StepProps} from "../../../../components/Form/StepForm/StepForm"
import {translate} from "../../../../components/Intl/IntlGlobalProvider"
import {GingerTemplateModel} from "../../../../model/acts/send-communication/GingerTemplateModel"
import Loading from "../../../../components/Loading";

interface Props extends StepProps {
	models?: Array<GingerTemplateModel>
	selected?: GingerTemplateModel
	setSelected: (model: GingerTemplateModel) => void
}

const ModelChoice: React.FunctionComponent<Props> = (props: Props) => {
	if (!props.models) {
		return <Loading />
	}

	const {selected} = props
	const nameSelected = selected && selected.name

	React.useEffect(() => {
		if (props.changeValidation && selected) {
			props.changeValidation(true)
		}
	}, [selected])

	const handleOnSelect = row => props.setSelected(row)
	const tagsFormatter = cell => cell.join(", ")


	const columns = [{
		dataField: 'id',
		text: 'Id de template',
		hidden: true
	}, {
		dataField: 'description',
		text: translate.formatMessage({id: "act.send.communication.template.description"})
	}, {
		dataField: 'availableMedia',
		text: translate.formatMessage({id: "act.send.communication.template.media"}),
		formatter: tagsFormatter
	}];

	const selectRow = {
		mode: 'radio',
		clickToSelect: true,
		onSelect: handleOnSelect,
		selectionRenderer: ({mode, checked, disabled }) => (
			<CustomInput type="radio" checked={checked} disabled={disabled} />
		),
		selected: [nameSelected]
	};


	const sortedModels = props.models.sort((a, b) => a && a.description !=null ? a.description.localeCompare(b.description) :0)
	return (
		<div>
			<Container>
				<BootstrapTable
					keyField='name'
					data={sortedModels}
					columns={columns}
					selectRow={selectRow}
				/>
			</Container>
		</div>
	)

}
export default ModelChoice;