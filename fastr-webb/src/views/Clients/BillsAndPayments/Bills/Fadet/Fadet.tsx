import React, {useEffect, useState} from 'react';
import {Row} from "reactstrap";
import Col from "reactstrap/lib/Col";

import FadetSelect from "./FadetSelect";
import FadetTable from "./FadetTable";

import './Fadet.css'
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {BankingMovement} from "../../../../../model/person/billing/BillingInformation";
import DisplayField from "../../../../../components/DisplayField";
import ClientService from "../../../../../service/ClientService";
import {useTypedSelector} from "../../../../../components/Store/useTypedSelector";
import {ClientContextSliceState} from "../../../../../store/ClientContextSlice";

interface Props {
    bankingMovement: BankingMovement
    isMobileService: boolean
}

const Fadet: React.FunctionComponent<Props> = (props) => {

    const clientService: ClientService = new ClientService();
    const clientContext: ClientContextSliceState = useTypedSelector(state => state.store.clientContext);
     const service = clientContext.service;

    const [loadedContext, setLoadedContext] = useState();
    const [fadetData, setFadetData] = useState();
    const [fadetPhoneNumbers, setFadetPhoneNumbers] = useState(Array());
    const [selectedNumber, setSelectedNumber] = useState(service?.label);
    const [errorFetching, setErrorFetching] = useState();
    const [fadetContextLoading, setFadetContextLoading] = useState(false);
    const [rawOptions, setRawOptions] = useState();

    useEffect(() => {
        loadFadetData()
    }, [])

    useEffect(() => {
        if(selectedNumber && fadetData) {
            filterFadetData(loadedContext)
        }
    }, [selectedNumber])



    const changeNumber = (number) => {
        setRawOptions({}) // clear all filters
        setSelectedNumber(number)
    }

    const loadFadetData = async () => {
        const {bankingMovement, isMobileService} = props;
        const invoiceNbr = bankingMovement.bill.id;
        const date = bankingMovement.bill.date;
        const isMobile = isMobileService;
        setFadetContextLoading(true)
        try {
            const loadedContext = await clientService.getFadetData(invoiceNbr, date, isMobile)

            if(loadedContext) {
                const phoneNumbers: string[] = [];
                loadedContext.forEach(context => {
                    phoneNumbers.push(context?.ndi)
                })
                setLoadedContext(loadedContext)
                setFadetPhoneNumbers(phoneNumbers)
                setFadetContextLoading(false)
                filterFadetData(loadedContext)
            }
        } catch (e) {
            const error = await e;
            setErrorFetching(error.message)
            setFadetContextLoading(false)
            NotificationManager.error(error.message)
        }

    }

    const filterFadetData = (cxt) => {
        if(selectedNumber) {
            const matchingContext = cxt?.filter(context => context?.ndi === selectedNumber)
            const fadets = matchingContext?.length > 0 ? matchingContext[0]?.fadets : []
            setFadetData(fadets)
            setRawOptions(getRawOptions(fadets))
        }
    }

    const removeDuplicatedItems = array => array.filter((current, index, arr) => arr.findIndex(t => t === current) === index)

    const getRawOptions = (fadetData) => {
        const rawOptions: {} = {};
        const rawTypesOptionsArr: string[] = [];
        const rawDetailsOptionsArr: string[] = [];
        const rawDestinationsOptionsArr: string[] = [];

        fadetData?.map(fadet => {
            if(fadet?.type) {
                rawTypesOptionsArr.push(fadet?.type)
            }
            if(fadet?.detail) {
                rawDetailsOptionsArr.push(fadet?.detail)
            }
            if(fadet?.destination) {
                rawDestinationsOptionsArr.push(fadet?.destination)
            }
        })

        rawOptions['types']= rawTypesOptionsArr ? removeDuplicatedItems(rawTypesOptionsArr) : [];
        rawOptions['details'] = rawDetailsOptionsArr ? removeDuplicatedItems(rawDetailsOptionsArr) : [];
        rawOptions['destinations'] = rawDestinationsOptionsArr ? removeDuplicatedItems(rawDestinationsOptionsArr) : [];
        return rawOptions
    }

    const handleErrorMsg = () => {
        if (errorFetching) {
            return <div className={"d-flex justify-content-center align-items-center w-100"}>
                <FormattedMessage id={"fadet.fetching.error"}/>
            </div>
        } else if (!errorFetching && fadetData?.length <= 0) {
            return <div className={"d-flex justify-content-center align-items-center w-100"}>
                <FormattedMessage id={"fadet.no.data.found"}/>
            </div>
        } else {
            return <React.Fragment />
        }
    }

    const renderFadet = () => {
        const {bankingMovement, isMobileService} = props;
        const rawOptionsReady = rawOptions?.types !== undefined && rawOptions?.details !== undefined && rawOptions?.destinations !== undefined;
        if(fadetData?.length > 0 && !errorFetching) {
            return <React.Fragment>
                <div className="border-bottom-0 mx-1 pb-0 pt-2 d-flex w-100 justify-content-between">
                    <div className="p-0">
                        {isMobileService ?
                            <div className={"w-100 mt-1"}>
                                <div className="text-left pb-0 pt-2 d-flex" >
                                    <div className={"px-0 ml-1 mr-1"}><DisplayField fieldName={"billAndPayment.bill.billNumber"}
                                                                               isLoading={bankingMovement}
                                                                               fieldValue={bankingMovement.bill.id}
                                                                               bold/></div>
                                    <Col className={"px-0"}><DisplayField fieldName={"billAndPayment.bill.reference"}
                                                                          isLoading={bankingMovement}
                                                                          fieldValue={bankingMovement.reference}
                                                                          bold/></Col>
                                </div>
                            </div>
                            : <div className={"w-100 mt-1"}>
                                <Row className="text-left mx-1 pb-0 pt-2">
                                    <Col sm={12} className={"px-0"}><DisplayField fieldName={"billAndPayment.bill.billNumber"}
                                                                                 isLoading={bankingMovement}
                                                                                 fieldValue={bankingMovement.bill.id}
                                                                                 bold/></Col>
                                </Row>
                            </div>}
                    </div>
                    <div className="p-0 w-25 mr-3">
                        {selectedNumber && fadetPhoneNumbers &&
                            <FadetSelect initPhoneNumber={selectedNumber} fadetPhoneNumbers={fadetPhoneNumbers} changeNumber={changeNumber} />
                        }
                    </div>
                </div>
                <div className="border-bottom-0 pb-5 pt-2 pl-1 mr-2">
                    {rawOptionsReady &&
                        <FadetTable fadetData={fadetData} options={rawOptions}/>
                    }
                </div>
            </React.Fragment>

        } else {
            return <div className="w-100 d-flex justify-content-center align-items-center" style={{height: "100px"}}>
                {handleErrorMsg()}
            </div>
        }
    }


    return (
        <React.Fragment>
            {fadetContextLoading ?
                <div className="w-100 d-flex justify-content-center align-items-center">
                    <span className="font-weight-light font-italic"><FormattedMessage id="fadet.loading.data.in.progress"/></span>
                </div>
                : <div className="">
                    {renderFadet()}
                </div>}

        </React.Fragment>
    )
}

export default Fadet;