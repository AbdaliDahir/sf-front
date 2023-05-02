import moment from "moment"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Button, Col, Label, Row } from "reactstrap"
import FormHiddenInput from "src/components/Form/FormHiddenInput"
import FormSelectInput from "src/components/Form/FormSelectInput"
import FormTextInput from "src/components/Form/FormTextInput"
import Loading from "src/components/Loading"
import ActService from "src/service/ActService"
import { AppState } from "src/store"
import { UIProps } from "src/store/actions/UIActions"
import { ClientContextSliceState } from "src/store/ClientContextSlice"
import ValidationUtils from "src/utils/ValidationUtils"

interface Props extends UIProps {
  client: ClientContextSliceState
}

interface FormData {
  ndi?: string
  serviceType?: string
  status?: string
  code?: string
  statusList?: { key: string, value: string }[]
}

const EditDischargeCodeV2 = (props: Props) => {
  const [formData, setFormData] = useState<FormData>()
  const actService = new ActService(true)

  useEffect(() => {
    actService.getStatusCodeLitige().then(data => {
      const formData: FormData = {
        ndi: props.client.service?.ndi,
        serviceType: props.client.service?.serviceType,
        status: undefined,
        code: undefined,
        statusList: data.find(d => d.serviceType == props.client.service?.serviceType)?.statusList
      }
      setFormData(formData)
    })
  }, [])

  const saveDataOnChange = (event) => {
    event.target.name === 'ndi' && setFormData({ ...formData, ndi: event.target.value })
    event.target.name === 'status' && setFormData({ ...formData, status: event.target.value })
  }

  const calculateCode = () => {
    if (!formData?.ndi || !formData?.status) return

    const dateRDV = moment(new Date()).format("DDMMYYYY")
    const seconds = Math.floor((new Date().getTime() - getMonday(new Date()).setHours(0, 0, 0, 0)) / 1000).toString(32).toUpperCase()
    const chaineDeCode = formData.ndi + dateRDV + conversionToBase32(seconds) + formData.status
    const codeEnChiffre = conversionToValeur(chaineDeCode)
    const codeFinal = conversionToBase32(seconds) + formData.status + conversionFromBase32(codeEnChiffre)
    setFormData({ ...formData, code: codeFinal })
  }

  const getMonday = (d) => {
    d = new Date(d)
    var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  const conversionToBase32 = (chaineDeCode) => {
    for (let iter = 1; iter < chaineDeCode.length + 1; iter++) {
      if (chaineDeCode[iter - 1] == "B") {
        chaineDeCode = chaineDeCode.replace("B", "C")
      } else if (chaineDeCode[iter - 1] == "C") {
        chaineDeCode = chaineDeCode.replace("C", "E")
      } else if (chaineDeCode[iter - 1] == "D") {
        chaineDeCode = chaineDeCode.replace("D", "F")
      } else if (chaineDeCode[iter - 1] == "E") {
        chaineDeCode = chaineDeCode.replace("E", "G")
      } else if (chaineDeCode[iter - 1] == "F") {
        chaineDeCode = chaineDeCode.replace("F", "H")
      } else if (chaineDeCode[iter - 1] == "G") {
        chaineDeCode = chaineDeCode.replace("G", "J")
      } else if (chaineDeCode[iter - 1] == "H") {
        chaineDeCode = chaineDeCode.replace("H", "K")
      } else if (chaineDeCode[iter - 1] == "I") {
        chaineDeCode = chaineDeCode.replace("I", "L")
      } else if (chaineDeCode[iter - 1] == "J") {
        chaineDeCode = chaineDeCode.replace("J", "M")
      } else if (chaineDeCode[iter - 1] == "K") {
        chaineDeCode = chaineDeCode.replace("K", "N")
      } else if (chaineDeCode[iter - 1] == "L") {
        chaineDeCode = chaineDeCode.replace("L", "P")
      } else if (chaineDeCode[iter - 1] == "M") {
        chaineDeCode = chaineDeCode.replace("M", "Q")
      } else if (chaineDeCode[iter - 1] == "N") {
        chaineDeCode = chaineDeCode.replace("N", "R")
      } else if (chaineDeCode[iter - 1] == "O") {
        chaineDeCode = chaineDeCode.replace("O", "S")
      } else if (chaineDeCode[iter - 1] == "P") {
        chaineDeCode = chaineDeCode.replace("P", "T")
      } else if (chaineDeCode[iter - 1] == "Q") {
        chaineDeCode = chaineDeCode.replace("Q", "U")
      } else if (chaineDeCode[iter - 1] == "R") {
        chaineDeCode = chaineDeCode.replace("R", "V")
      } else if (chaineDeCode[iter - 1] == "S") {
        chaineDeCode = chaineDeCode.replace("S", "W")
      } else if (chaineDeCode[iter - 1] == "T") {
        chaineDeCode = chaineDeCode.replace("T", "X")
      } else if (chaineDeCode[iter - 1] == "U") {
        chaineDeCode = chaineDeCode.replace("U", "Y")
      } else if (chaineDeCode[iter - 1] == "V") {
        chaineDeCode = chaineDeCode.replace("V", "Z")
      }
    }
    return chaineDeCode
  }

  const conversionToValeur = (chaineDeCode) => {
    var codeFinal = 0
    for (var iter = 1; iter < chaineDeCode.length + 1; iter++) {
      if (chaineDeCode[iter - 1] == "A") {
        codeFinal = codeFinal + (10 * iter)
      } else if (chaineDeCode[iter - 1] == "C") {
        codeFinal = codeFinal + (11 * iter)
      } else if (chaineDeCode[iter - 1] == "E") {
        codeFinal = codeFinal + (12 * iter)
      } else if (chaineDeCode[iter - 1] == "F") {
        codeFinal = codeFinal + (13 * iter)
      } else if (chaineDeCode[iter - 1] == "G") {
        codeFinal = codeFinal + (14 * iter)
      } else if (chaineDeCode[iter - 1] == "H") {
        codeFinal = codeFinal + (15 * iter)
      } else if (chaineDeCode[iter - 1] == "J") {
        codeFinal = codeFinal + (16 * iter)
      } else if (chaineDeCode[iter - 1] == "K") {
        codeFinal = codeFinal + (17 * iter)
      } else if (chaineDeCode[iter - 1] == "L") {
        codeFinal = codeFinal + (18 * iter)
      } else if (chaineDeCode[iter - 1] == "M") {
        codeFinal = codeFinal + (19 * iter)
      } else if (chaineDeCode[iter - 1] == "N") {
        codeFinal = codeFinal + (20 * iter)
      } else if (chaineDeCode[iter - 1] == "P") {
        codeFinal = codeFinal + (21 * iter)
      } else if (chaineDeCode[iter - 1] == "Q") {
        codeFinal = codeFinal + (22 * iter)
      } else if (chaineDeCode[iter - 1] == "R") {
        codeFinal = codeFinal + (23 * iter)
      } else if (chaineDeCode[iter - 1] == "S") {
        codeFinal = codeFinal + (24 * iter)
      } else if (chaineDeCode[iter - 1] == "T") {
        codeFinal = codeFinal + (25 * iter)
      } else if (chaineDeCode[iter - 1] == "U") {
        codeFinal = codeFinal + (26 * iter)
      } else if (chaineDeCode[iter - 1] == "V") {
        codeFinal = codeFinal + (27 * iter)
      } else if (chaineDeCode[iter - 1] == "W") {
        codeFinal = codeFinal + (28 * iter)
      } else if (chaineDeCode[iter - 1] == "X") {
        codeFinal = codeFinal + (29 * iter)
      } else if (chaineDeCode[iter - 1] == "Y") {
        codeFinal = codeFinal + (30 * iter)
      } else if (chaineDeCode[iter - 1] == "Z") {
        codeFinal = codeFinal + (31 * iter)
      } else {
        codeFinal = codeFinal + (parseInt(chaineDeCode[iter - 1]) * iter)
      }
    }
    return codeFinal
  }

  const conversionFromBase32 = (code) => {
    code = code % 31;
    let codeFinal = code;
    switch (code) {
      case 10:
        codeFinal = "A"; break;
      case 11:
        codeFinal = "C"; break;
      case 12:
        codeFinal = "E"; break;
      case 13:
        codeFinal = "F"; break;
      case 14:
        codeFinal = "G"; break;
      case 15:
        codeFinal = "H"; break;
      case 16:
        codeFinal = "J"; break;
      case 17:
        codeFinal = "K"; break;
      case 18:
        codeFinal = "L"; break;
      case 19:
        codeFinal = "M"; break;
      case 20:
        codeFinal = "N"; break;
      case 21:
        codeFinal = "P"; break;
      case 22:
        codeFinal = "Q"; break;
      case 23:
        codeFinal = "R"; break;
      case 24:
        codeFinal = "S"; break;
      case 25:
        codeFinal = "T"; break;
      case 26:
        codeFinal = "U"; break;
      case 27:
        codeFinal = "V"; break;
      case 28:
        codeFinal = "W"; break;
      case 29:
        codeFinal = "X"; break;
      case 30:
        codeFinal = "Y"; break;
      case 31:
        codeFinal = "Z"; break;
    }
    return codeFinal;
  }

  const isNotValid = (formData) => {
    return !formData.status || !formData.ndi || formData.ndi.length < 5 || formData.ndi.length > 20 || !/^\d+$/.test(formData.ndi)
  }

  return (
    formData ? <React.Fragment>
      <Row className="mb-3 align-items-center">
        <Col sm="3"><Label className="mr-2 mb-0">NDI</Label></Col>
        <Col sm="5">
          <FormTextInput name="ndi" id="ndi" value={formData.ndi} bsSize={"sm"} onChange={saveDataOnChange} classNameToProps="mb-0"
            validations={{ isRequired: ValidationUtils.notEmpty, inputMinLength: 5, inputMaxLength: 20, isNumeric: true}}
          />
        </Col>
        <Col sm="3 offset-1">
          <Button size={"sm"} color="primary" disabled={isNotValid(formData)} onClick={calculateCode}>Calculer code</Button>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col sm="3"><Label className="mr-2 mb-0">Statut code litige</Label></Col>
        <Col sm="5">
          <FormSelectInput name="status" id="status" value={formData.status} bsSize={"sm"} onChange={saveDataOnChange}
            validations={{ isRequired: ValidationUtils.notEmpty }} classNameToProps="mb-0">
            <option selected disabled value="" hidden={formData.status != null}/>
            {formData.statusList?.map(status => <option value={status.key}>{status.value}</option>)}
          </FormSelectInput>
        </Col>
        <Col sm="3 offset-1" style={{fontSize: '16px', fontWeight: 'bold'}}>
          {formData.code}
        </Col>
      </Row>
      <FormHiddenInput name="code" id="code" value={formData.code} validations={{ isRequired: ValidationUtils.notEmpty }} />
      <FormHiddenInput name="statusList" id="statusList" value={formData.statusList} />
      <FormHiddenInput name="serviceType" id="serviceType" value={formData.serviceType} />
    </React.Fragment> : <Loading />
  )
}

const mapStateToProps = (state: AppState) => ({
  client: state.store.client.currentClient,
})

export default connect(mapStateToProps)(EditDischargeCodeV2)