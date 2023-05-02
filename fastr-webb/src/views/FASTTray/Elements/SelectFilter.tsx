/* tslint:disable */
// @ts-nocheck
import * as React from "react";

interface Props {
    onFilter: (e) => void
    column: any
    options: any
    initialOption ?: string
    disabled?:boolean

}
const SelectFilter: React.FunctionComponent<Props> = ({
      onFilter,
      column,
      options,
      initialOption,
      disabled
  }) => {
    const handleClick = (e) => {
        e.stopPropagation();
    }
    const filter = (option) => {
        onFilter({
            option
        });
    }
    const handleChange = (e) => {
        e.stopPropagation()
        const currentOption = e.currentTarget.value;
        filter(currentOption)
    }
    const getListOption = (options) => {
        const items = []
        items.push(
            <option value="default"> Tous </option>
        )
        Object.keys(options).forEach(key => items.push(<option value={key}>{options[key]}</option>))
        return items;
    }
    return disabled ?(
        <select
            key="select"
            className={`form-control`}
            onChange={handleChange}
            onClick={handleClick}
            value={initialOption}
            disabled={disabled}
        >
            {getListOption(options)}
        </select>
    ):(
        <select
            key="select"
            className={`form-control ${(initialOption && initialOption !== 'default')? "initial-filter-border" :""}`}
            onChange={handleChange}
            onClick={handleClick}
            value={initialOption}
            disabled={disabled}
        >
            {getListOption(options)}
        </select>
    )

}
SelectFilter.defaultProps ={
    disabled:false
}
export default SelectFilter