import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import './DashboardCases.css';
import DashBoardGeneric from './DashBoardGeneric';

const DashboardCases = () => {

    const Totals = [{ name: "à reprendre en charge", value: 25 },
    { name: "Prises en charge", value: 135 },
    { name: "Modifié +5 J", value: 5 },
    { name: "Prise en charge dépassée", value: 115 },
    { name: "NPTA dépassé", value: 354 },
    { name: "XXXXX", value: 0 }];


    return (
        <div style={{ backgroundColor: "ghostwhite", boxSizing: "border-box" }}>
            <div className='d-flex w-100 h-100 justify-content-between mt-4'>
                {/* <div className='w-25'><h3>Filter</h3></div> */}
                <div className='w-100 h-100'>
                    {/* TOTAL CARDS */}
                    <div className='d-flex h-100 flex-column'>
                        <div className='w-100 d-flex justify-content-between mb-4'>
                            {Totals.map(total => (
                                <Card className="card-hover" key={total.name} style={{ width: `${100 / (Totals.length + 1)}%` }}>
                                    <CardHeader className='bg-white text-info text-start h-50 font-weight-normal font-italic'>{total.name}</CardHeader>
                                    <CardBody className='text-lg-center text-primary font-weight-bold'>{total.value}</CardBody>
                                </Card>
                            ))}
                        </div>
                        <div className='w-100 h-75 d-flex mt-4 mb-4'>
                            <DashBoardGeneric />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardCases