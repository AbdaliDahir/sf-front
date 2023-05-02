import moment from "moment"
import React from "react"
import { FormattedMessage } from "react-intl"
import { Row, Col, Label, Container } from "reactstrap"

const DischargeCodeActDataSummary = ({ act }) => {
	return (
		<React.Fragment>
			<Container>
				<Row className="border-bottom pb-2">
					<Col>
						<Label className="mr-1 mb-0 font-weight-bold"><FormattedMessage id="global.form.creationDate" /></Label>:
						<br />
						{moment(act.actCreationInfo.date).format('DD/MM/YYYY HH:mm')}
					</Col>
					<Col>
						<Label className="mr-1 mb-0 font-weight-bold"><FormattedMessage id="tray.table.header.serviceType" /></Label>:
						<br />
						{act.actDetail.serviceType}
					</Col>
				</Row>
				<Row className="border-bottom pb-2">
					<Col>
						<Label className="mr-1 mb-0 font-weight-bold">NDI</Label>:
						<br />
						{act.actDetail.ndi}
					</Col>
					<Col>
						<Label className="mr-1 mb-0 font-weight-bold">Statut code litige</Label>:
						<br />
						{act.actDetail.status}
					</Col>
				</Row>
				<Row>
					<Col className="border-bottom pb-2">
						<Label className="mr-1 mb-0 font-weight-bold">Code de décharge</Label>:
						<br />
						{act.actDetail.dischargeCode}
					</Col>
				</Row>
			</Container>
		</React.Fragment>
	)
}

export default DischargeCodeActDataSummary;