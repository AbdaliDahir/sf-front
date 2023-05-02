import React from "react";

const KOIcon = () => {
    const HexColor =  '#de251d';
    const koStyle = {
        background: HexColor,
        fontSize: '0.8rem',
        padding: '4px 9px',
        color: '#fff',
        borderRadius: '40%'
    };
    return <span style={koStyle}>KO</span>;
}
export default KOIcon;