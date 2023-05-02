import React from "react"

class Props {
    head: string
    price: number
    currency?: string
    period?: string
    baseline?: string
    badge?: string
    color?: string
    size?: "lg" | "sm" |"md";
    children?
}
const Price = (props: Props) => {

    const currency = !props.currency ? "€" : props.currency
    const color = !props.color ? "primary" : props.color
    const size = !props.size ? "md" : props.size
    const period = !props.period ? "/Mois" : props.period

    return (
        <div >
            {props.badge && <span className={`badge badge-carret-bottom badge-${color}`}>${props.badge}</span>}
            <div className={`price-screen price-screen-${size} price-screen-${color}`}>
                <div className="price-screen-content">
                    <div className="price-screen-shadow"></div>
                    <div className="price-screen-head">{props.head}</div>
                    <div className="price-screen-price-content">
                        <div className="price">
                            <div className="price-content">
                                <div className="price-value">{props.price}</div>
                                <div className="price-detail">
                                    <div className="price-cents">{currency}</div>
                                    <div className="price-period">{period}</div>
                                </div>
                                {props.children && <div className="price-screen-subprice">{props.children}</div>}
                            </div>
                        </div>
                    </div>
                    {props.baseline && <div className="price-screen-baseline">{props.baseline}</div>}

                </div>
            </div>
        </div>
    )
}

export default Price;