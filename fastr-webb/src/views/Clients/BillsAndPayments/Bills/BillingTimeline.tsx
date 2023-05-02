import React from "react";
import "../timeline.scss"

const BillingTimeline = () => {

    return (
        <div className="timeline-container w-100">
            <ul className="vertical-timeline v-line-color">
                <li className="event grey">
                    <span className="v-timeline-icon"/>
                    <span>Règlement en attente</span>
                </li>
                <li className="event">
                    <span className="v-timeline-icon v-not"/>
                    <span>Facture - 710428860416</span>
                    <p>Période du 06/12/19 au 05/01/20</p>
                </li>
                <li className="event">
                    <span className="v-timeline-icon v-not v-line-color"/>
                    <h3>Prélèvement RIB - 004562971034</h3>
                </li>
                <li className="event">
                    <span className="v-timeline-icon  v-last"/>
                    <h3>Facture - 710428860416</h3>
                    <p>Période du 06/12/19 au 05/01/20</p>
                </li>
            </ul>
        </div>
    )
};

export default BillingTimeline
