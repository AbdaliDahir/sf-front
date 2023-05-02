import moment from 'moment';
import React, { useEffect, useState } from 'react'
import HistoriqueDisplay from 'src/model/historique/HistoriqueDisplay';
import { formatDate } from 'src/utils';
import FilterTypeList from '../Filters/FilterTypeList';
import { DATETIME_FORMAT, DATE_FILTER, EMPTY_FILTER_VALUE, FILTER_NAMES, ONE_MONTH_AGO, ONE_WEEK_AGO, THREE_MONTH_AGO } from '../utils/historique-constants';
import HistoriqueMobileCard from './HistoriqueMobileCard';

interface Props {
  data ?: [HistoriqueDisplay] | []
}

const HistoriqueContainer = (props: Props) => {
  const {data} = props;
  const [filterData, setFilterData] = useState<any>();

  // TODO :: CREATE FILTER
  const [filterType, setFilterType] = useState<any>({});
  const [filterTypeTags, setFilterTypeTags] = useState<string[]>([]);

  const [filterEtat, setFilterEtat] = useState<any>({});
  const [filterEtatTags, setFilterEtatTags] = useState<string[]>([]);

  const [filterActivite, setFilterActivite] = useState<any>({});
  const [filterActiviteTags, setFilterActiviteTags] = useState<string[]>([]);

  const [filterDate, setFilterDate] = useState<any>({...DATE_FILTER});
  const [filterDateTags, setFilterDateTags] = useState<string>("");

  const [afterGeneration, setAfterGeneration] = useState<boolean>(false);

  // DATE FILTER
  
  // console.log("🚀 ~ file: HistoriqueContainer.tsx:31 ~ HistoriqueContainer ~ one_month_ago:", three_month_ago, one_month_ago, one_week_ago)

  useEffect(() => {
    if(data && data?.length > 0) {
      setFilterData(data); 
    }    
  }, [data]);

  useEffect(() => {
    if(filterData?.length > 0) { 
      generateFilters(filterData);
    }    
  }, [filterData]);

  useEffect(() => {
      pushFilterType(filteredDATA);
  }, [afterGeneration]);

  useEffect(() => {
    if(filteredDATA?.length > 0) { 
      generateFilters(filteredDATA);
    }    
  }, [filterTypeTags,filterEtatTags,filterActiviteTags,filterDateTags]);

  const pushFilterType = (data) => {
      /// get data and loop to generate filters
      data?.forEach(element => {
        let type = element?.type_objet?.toString();
        let etat = element?.lib_statut?.toString();
        let activite = element?.activite?.toString();
        if(type && filterType.hasOwnProperty(type)) {
          let nextVal = ++filterType[type];
          setFilterType(prev => ({...prev, [type]: nextVal }));
        }
        if(etat && filterEtat.hasOwnProperty(etat)) {
          let etatNextVal = ++filterEtat[etat];
          setFilterEtat(prev => ({...prev, [etat]: etatNextVal }));
        }
        if(activite && filterActivite.hasOwnProperty(activite)) {
          let activiteNextVal = ++filterActivite[activite];
          setFilterActivite(prev => ({...prev, [activite]: activiteNextVal }));
        }
        if(element.date_creation) {
          pushDates(element.date_creation);
        }
      });  
  }

  const pushDates = (dateCreation) => {
    if(moment(formatDate(dateCreation), DATETIME_FORMAT).isSameOrBefore(moment(THREE_MONTH_AGO, DATETIME_FORMAT))) {
      let dateNextVal = ++filterDate['beforeThreeMonth'];
      setFilterDate(prev => ({...prev, ['beforeThreeMonth']: dateNextVal }));
    } else {
      let dateNextVal = ++filterDate['lastThreeMonth'];
      setFilterDate(prev => ({...prev, ['lastThreeMonth']: dateNextVal }));
    }
    if(moment(formatDate(dateCreation), DATETIME_FORMAT).isSameOrAfter(moment(ONE_MONTH_AGO, DATETIME_FORMAT))) {
      let dateNextVal = ++filterDate['lastOneMonth'];
      setFilterDate(prev => ({...prev, ['lastOneMonth']: dateNextVal }));
    }
    if(moment(formatDate(dateCreation), DATETIME_FORMAT).isSameOrAfter(moment(ONE_WEEK_AGO, DATETIME_FORMAT))) {
      let dateNextVal = ++filterDate['lastWeek'];
      setFilterDate(prev => ({...prev, ['lastWeek']: dateNextVal }));
    }
  }

  const initFiltersValues = () => {
    setFilterType(prev => ({}));
    setFilterEtat(prev => ({}));
    setFilterActivite(prev => ({}));
    setFilterDate(prev => ({...prev, ...DATE_FILTER}));
  }

  const generateFilters = (data) => {
    data?.forEach(element => {
      let type = element?.type_objet?.toString();
      let etat = element?.lib_statut?.toString();
      let activite = element?.activite?.toString();
      if(type && !filterType.hasOwnProperty(type)) {
        setFilterType(prev => {
          return ({...prev, [type]: 0 })
        })
      }
      if(etat && !filterEtat.hasOwnProperty(etat)) {
        setFilterEtat(prev => ({...prev, [etat]: 0 }));
      }
      if(activite && !filterActivite.hasOwnProperty(activite)) {
        setFilterActivite(prev => ({...prev, [activite]: 0 }));
      }
    });
    setFilterDate(prev => ({...prev, ...DATE_FILTER}));
    setAfterGeneration(!afterGeneration);
  }

  const handleChange = e => {
    initFiltersValues(); 
    const { checked, value, name } = e.target;
    switch (name) {
      case FILTER_NAMES[0]:
        checked ? setFilterTypeTags([...filterTypeTags, value.toString()]) : setFilterTypeTags(filterTypeTags.filter((filterTag) => filterTag !== value.toString()))
        break;
      case FILTER_NAMES[1]:
        checked ? setFilterEtatTags([...filterEtatTags, value.toString()]) : setFilterEtatTags(filterEtatTags.filter((filterEtat) => filterEtat !== value.toString()))
        break;
      case FILTER_NAMES[2]:
        checked ? setFilterActiviteTags([...filterActiviteTags, value.toString()]) : setFilterActiviteTags(filterActiviteTags.filter((filterActivite) => filterActivite !== value.toString()))
        break;
      case FILTER_NAMES[3]:
        checked ? setFilterDateTags(value.toString()) : setFilterDateTags("")
        break;
    }
  };

  const notEmptyObject = (obj) => { 
    return Object.keys(obj).length !== 0;
  }
  const fullFiledValue = (obj) => { 
    return  Object.values(obj).every(el => el != EMPTY_FILTER_VALUE)
  }

  const checkDateValidation= (date, filter) => {
    return filter == "beforeThreeMonth" ? moment(formatDate(date), DATETIME_FORMAT).isSameOrBefore(moment(THREE_MONTH_AGO, DATETIME_FORMAT)) : filter == "lastThreeMonth" ? moment(formatDate(date), DATETIME_FORMAT).isSameOrAfter(moment(THREE_MONTH_AGO, DATETIME_FORMAT)) : filter.includes("lastOneMonth") ? moment(formatDate(date), DATETIME_FORMAT).isSameOrAfter(moment(ONE_MONTH_AGO, DATETIME_FORMAT)) : filter.includes("lastWeek") ? moment(formatDate(date), DATETIME_FORMAT).isSameOrAfter(moment(ONE_WEEK_AGO, DATETIME_FORMAT)) : false;
  }
  const filterByDateOptions = (filterDateTags, element, filterData) => {
    return filterDateTags != "" ? checkDateValidation(element.date_creation,filterDateTags) : filterData
  }

  let filteredDATA = filterData?.filter((element) => {
    return (filterTypeTags.length > 0
      ? filterTypeTags.includes(element?.type_objet)
      : filterData) && (filterEtatTags.length > 0
        ? filterEtatTags.includes(element?.lib_statut)
        : filterData) && (filterActiviteTags.length > 0
          ? filterActiviteTags.includes(element?.activite)
          : filterData) && filterByDateOptions(filterDateTags,element,filterData)
    }
  )

  return (
      (data && data?.length > 0) ? 
        <div className="row align-items-start flex-column justify-content-between h-100 w-100 mx-0 historique__bloc">
          <div className="col card__container--width min-h-100">
            <div className="timeline-container h-100 overflow-auto scrollbarStyle py-4 pl-0">
              <div className="vertical-timeline w-100 mb-0 position-relative">
                { filteredDATA &&  
                    filteredDATA?.map((element, index) => ( 
                      <HistoriqueMobileCard element={element} index={index} key={index} dataLength={data?.length - 1}/>
                    ))
                }
              </div>
            </div>
          </div>
          <div className="col filters__container--width h-100 filters__container">
            <div className='filters'> 
              {
                <FilterTypeList filterData={filterDate} filterTags={filterDateTags} handleChange={handleChange} dataType={FILTER_NAMES[3]}/>
              }
              {
                notEmptyObject(filterType) && fullFiledValue(filterType) &&
                  <FilterTypeList filterData={filterType} filterTags={filterTypeTags} handleChange={handleChange} dataType={FILTER_NAMES[0]}/>
              }
              {
                notEmptyObject(filterEtat) && fullFiledValue(filterEtat) &&
                  <FilterTypeList filterData={filterEtat} filterTags={filterEtatTags} handleChange={handleChange} dataType={FILTER_NAMES[1]}/>
              }
              {
                notEmptyObject(filterActivite) && fullFiledValue(filterActivite) &&
                  <FilterTypeList filterData={filterActivite} filterTags={filterActiviteTags} handleChange={handleChange} dataType={FILTER_NAMES[2]}/>
              }
            </div>
          </div>
        </div>
      :
      <div className="text-center my-5">
        <h1 className='h4'>Ouhh... it's empty in here</h1>
      </div>
    
  )
}

export default HistoriqueContainer
