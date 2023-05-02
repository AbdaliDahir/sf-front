import React from 'react'
import { Badge, ListGroup } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { FILTER_NAMES } from '../utils/historique-constants';

interface Props {
  filterData ?: any,
  handleChange ?: any,
  dataType ?: string,
  filterTags ?: any
}
function FilterTypeList(props: Props) {

  const {filterData, handleChange, dataType, filterTags} = props;

  return (
    <div className='my-3'>
      <h6 className='text-primary h6'> <FormattedMessage id={"historique.filter."+dataType}/> </h6>
      <ListGroup variant="flush" as="ul" className="list-unstyled">
        { dataType != FILTER_NAMES[3] ?
          Object.keys(filterData).sort().map((key, index) => (
            filterData[key] != 0 ?
            <ListGroup.Item action key={index} className="py-0 pl-0 border-0 hover-none" as="li"> 
              <input className="d-none checkbox__filter--check" type="checkbox" id={key.toString()} name={dataType} value={key.toString()} onChange={handleChange} defaultChecked={filterTags?.includes(key.toString())}></input>
              <label htmlFor={key.toString()} className="mb-0 py-2 font-bold d-block d-flex justify-content-between align-items-start label__filter--primary">
                {key.toString()}
                <Badge pill className="p-0">
                  {filterData[key]}
                </Badge> 
              </label>
            </ListGroup.Item> 
            : null
          )) : 
          Object.keys(filterData).map((key, index) => ( 
            filterData[key] != 0  ?
            <ListGroup.Item action key={index} className="py-0 pl-0 border-0 hover-none" as="li"> 
              <input className="d-none checkbox__filter--check" type="checkbox" id={key.toString()} name={dataType} value={key.toString()} onChange={handleChange} defaultChecked={filterTags == key.toString()}></input>
              <label htmlFor={key.toString()} className="mb-0 py-2 font-bold d-block d-flex justify-content-between align-items-start label__filter--primary">
                <FormattedMessage id={"historique.filter.date." + key.toString()} />
                <Badge pill className="p-0">
                  {filterData[key]}
                </Badge> 
              </label>
            </ListGroup.Item> 
            : null
          ))
        }
      </ListGroup>
    </div>
  )
}

export default FilterTypeList
