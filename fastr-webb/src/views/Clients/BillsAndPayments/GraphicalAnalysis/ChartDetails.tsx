import React from "react";
import {GraphSelectedItem} from "../../../../model/GraphSelectedItem";
import {Detail, Category} from "../../../../model/BillsResponseDTO";
import './GraphicalAnalysis.css'
import LocaleUtils from "../../../../utils/LocaleUtils";

interface Props {
    selectedItem?: GraphSelectedItem
}

const ChartDetails = (props: Props) => {
    const {selectedItem} = props;
    const isItem = selectedItem && selectedItem?.billReference

    const renderAmounts = (amount: any) => {
        const amountToNumb = typeof amount === "string" && amount.indexOf(',') !== -1 ? Number(amount.replace(/,/g, '.')) : amount
        return isNaN(amountToNumb) ? amount : LocaleUtils.formatCurrency(amountToNumb, false, true)
    }

    const renderDmsDetails = (detail: Detail) => {
        if(detail) {
            return <div className="w-100 d-flex justify-content-between">
                {detail.label &&
                    <div className="pr-4">{detail.label}</div>
                }
                {detail.amount &&
                    <div className="detail-amount">{renderAmounts(detail.amount)}</div>
                }
            </div>
        } else {
            return <React.Fragment/>
        }
    }

    const renderCategories = (categorie: Category) => {
        if(categorie) {
            const isDmsDetails = categorie.dmsDetails && categorie.dmsDetails.length > 0
            return <div className="w-100 d-flex flex-column">
                    <div className="w-100 d-flex justify-content-between">
                        {categorie.label &&
                            <div className={`pr-4 ${isDmsDetails ? "font-weight-bold" : ""}`}>{categorie.label}</div>
                        }
                        {categorie.amount &&
                            <div className={`detail-amount ${isDmsDetails ? "font-weight-bold" : ""}`}>{renderAmounts(categorie.amount)}</div>
                        }
                    </div>
                {isDmsDetails &&
                    <div className={"mb-2"}>
                        {categorie.dmsDetails?.map(detail => renderDmsDetails(detail))}
                    </div>
                }
                </div>
        } else {
            return <React.Fragment/>
        }
    }

    return <div className="w-100 d-flex justify-content-center align-items-center">
        <div className="w-100 d-flex justify-content-start align-items-center">
            <div className="chartDetailsContent w-100 d-flex flex-column justify-content-start">
                <div className="w-100 d-flex">
                    {isItem &&
                        <div>
                            <span className="font-weight-bold">Facture N° : </span>
                            {selectedItem?.billReference}
                        </div>
                    }
                    {isItem && selectedItem?.date &&
                        <div>
                            <span className="font-weight-bold ml-1">Du : </span>
                            {selectedItem?.date}
                        </div>
                    }
                </div>

                {isItem && selectedItem?.amount &&
                <div>
                    <span className="font-weight-bold">Montant : </span>
                    {renderAmounts(selectedItem?.amount)}
                </div>}


                {isItem && selectedItem?.rubrique &&
                <div className="font-weight-bold d-flex align-items-start justify-content-between mt-3 mb-2 text-uppercase">
                    <div className="font-weight-bold d-flex align-items-center pr-4">
                        <span className="rubriqueSquare mr-2"/>
                        {selectedItem?.rubrique}
                    </div>
                    {selectedItem?.amount &&
                        <div className="detail-amount">
                            {renderAmounts(selectedItem?.amount)}
                        </div>
                    }
                </div>}

                {isItem && selectedItem?.dmsItem && selectedItem?.dmsItem?.dmsCategories &&
                    selectedItem.dmsItem.dmsCategories.map(categorie => renderCategories(categorie))
                }
            </div>
        </div>
    </div>
}

export default ChartDetails