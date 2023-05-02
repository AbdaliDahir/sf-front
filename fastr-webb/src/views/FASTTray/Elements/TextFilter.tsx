/* tslint:disable */
// @ts-nocheck
import * as React from "react";
import SelectFilter from "./SelectFilter";
import {useState, useEffect, useRef} from "react";
import useIsFirstRender from "../../../utils/useIsFirstRender";
interface Props {
    onFilter: (e) => void
    column: any
    initialValue ?: string
    disabled?:boolean


}
const filter = (onFilter ,value) => {
    onFilter({
        value
    });
}
const TextFilter: React.FunctionComponent<Props> = ({
    onFilter,
    column,
    initialValue,
    disabled,
}) => {
    const inputRef = useRef()
    const firstRen = useIsFirstRender()
    const [inputValue, setInputValue] = useState(initialValue)
    const initialized = initialValue !== ''
    const handleClick = (e) => {
        e.stopPropagation();
    }
    const handleChange = (e) => {
        e.stopPropagation();
        const currentValue = e.currentTarget.value;
        setInputValue(currentValue)
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            if(!firstRen){
                filter(onFilter, inputValue)
            }

        }, 500)
        return () => clearTimeout(timer)
    }, [inputValue])
    useEffect(() => {
         if(initialValue?.length > 0 && inputValue?.length === 0){
            setInputValue(initialValue)
         }else if(!initialized){
             inputRef.current.value = ''
         }

    }, [initialValue])
    return initialized ? (
                <input
                    id={`text-filter-column-${column.dataField}`}
                    value={disabled ? '':inputValue}
                    onChange={handleChange}
                    onClick={handleClick}
                    className={`text-filter form-control ${((initialValue && initialValue !== "")|| disabled)? "initial-filter-border" :""}`}
                    placeholder={`Entrer ${column.text} ...`}
                    disabled={disabled}
                    ref={inputRef}
                />
        ):(
            <input
                id={`text-filter-column-${column.dataField}`}
                onChange={handleChange}
                onClick={handleClick}
                className={`text-filter form-control ${((initialValue && initialValue !== "")|| disabled)? "initial-filter-border" :""}`}
                placeholder={`Entrer ${column.text} ...`}
                disabled={disabled}
                ref={inputRef}
            />
        )
}
SelectFilter.defaultProps ={
    disabled:false,
}
export default TextFilter