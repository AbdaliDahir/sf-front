import React from "react";

const OKIcon = () => {
    const HexColor =  '#55AF27';
    const okStyle = {
        background: HexColor,
        fontSize: '0.8rem',
        padding: '4px 9px',
        color: '#fff',
        borderRadius: '40%'
    };
    return <span style={okStyle}>OK</span>;
}
export default OKIcon;