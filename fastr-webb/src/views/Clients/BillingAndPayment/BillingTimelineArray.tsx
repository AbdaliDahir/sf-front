import React from 'react';
import Card from "reactstrap/lib/Card";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
// import TimelineEnd from "src/img/timeline-end.svg"
// import TimelineFull from "src/img/timeline-full.svg"
import {mockForTimeline} from '../../../mock/mockTimelineVertical';
import './billingAndPayment.css';

const SvgIconTLE = () => (<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={"85"} height={"85"}
                               viewBox="0 0 52 52">
    <path d="M39,26c0-7.2-5.8-13-13-13c-7.2,0-13,5.8-13,13c0,6.3,4.5,11.6,10.5,12.8v13.7h5V38.8C34.5,37.6,39,32.3,39,26z M26,35
	c-5,0-9-4-9-9c0-5,4-9,9-9c5,0,9,4,9,9C35,31,31,35,26,35z" fill={"#707070"}/>
</svg>)

const SvgIconTLF = () => (<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={"85"} height={"85"}
                               viewBox="0 0 52 52">
    <path d="M39,26c0-6.3-4.5-11.6-10.5-12.8V0h-5v13.2C17.5,14.4,13,19.7,13,26c0,6.3,4.5,11.6,10.5,12.8v13.7h5V38.8
	C34.5,37.6,39,32.3,39,26z M26,35c-5,0-9-4-9-9c0-5,4-9,9-9c5,0,9,4,9,9C35,31,31,35,26,35z" fill={"#E03C3C"}/>
</svg>)


const BillingTimelineTable = (props) => {

    const renderRowTable = () => {
        const length = mockForTimeline.length
        return mockForTimeline.map((elementOfTheTable, index) => {
            if (index === 0) {
                return (
                    <Row>
                        {/*<Col md={1} className={"iconOfHell"}><img src={TimelineEnd} className={"red"}/></Col>*/}
                        <Col md={1} className={"test"}><SvgIconTLE/></Col>
                        <Col md={7} className={"test"}>{elementOfTheTable.label}</Col>
                        <Col md={2} className={"test"}>{elementOfTheTable.date}</Col>
                        <Col md={2} className={"test"}>{elementOfTheTable.prix}</Col>
                    </Row>
                )
            } else if (index === length - 1) {
                return (
                    <Row>
                        {/*<Col md={1} className={"flip-horizontally iconOfHell"}><img src={TimelineEnd} className={"red"}/></Col>*/}
                        <Col md={1} className={"test flip-horizontally"}><SvgIconTLE/></Col>
                        <Col md={7} className={"test"}>{elementOfTheTable.label}</Col>
                        <Col md={2} className={"test"}>{elementOfTheTable.date}</Col>
                        <Col md={2} className={"test"}>{elementOfTheTable.prix}</Col>
                    </Row>
                )
            }
            return (
                <Row>
                    {/*<Col md={1} className={"iconOfHell"}><img src={TimelineFull} className={"red"}/></Col>*/}
                    <Col md={1} className={"test"}><SvgIconTLF/></Col>
                    <Col md={7} className={"test"}>{elementOfTheTable.label}</Col>
                    <Col md={2} className={"test"}>{elementOfTheTable.date}</Col>
                    <Col md={2} className={"test"}>{elementOfTheTable.prix}</Col>
                </Row>
            )
        })
    }

    return (
        <Card>
            {renderRowTable()}
        </Card>
    );
}

export default BillingTimelineTable;
