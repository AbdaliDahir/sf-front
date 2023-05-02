import React, { useEffect, useState } from 'react'
import { BiFilter } from 'react-icons/bi';
import DashboardComponent from './DashboardComponent';
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

const animatedComponents = makeAnimated();
export interface DashSetting {
  name: string;
  title: string;
  dashType: string;
  function: string
}
export interface Selection { value: string; label: string }
export interface GlobalFilter {
  sites: Selection[];
  activities: Selection[];
  startDate: Date | null;
  endDate: Date | null;
}
const listSettings: DashSetting[] = [
  { name: 'histoCases', title: 'Historique mes dossiers créés', dashType: 'bar', function: '' },
  { name: 'histoActions', title: 'Historique mes actions créés', dashType: 'bar', function: '' },
  { name: 'currentCases', title: 'Dossier en cours par statut', dashType: 'pie', function: '' },
  { name: 'currentActions', title: 'Action en cours par statut', dashType: 'pie', function: '' },
];
const DashboardContainer = () => {
  const [dashSettings, setDashSettings] = useState<DashSetting[]>();
  const [globalFilter, setglobalFilter] = useState<GlobalFilter>();
  const sitesToSelect: Selection[] = [
    { value: 'INTELCIA CASABLANCA', label: 'INTELCIA CASABLANCA' },
    { value: 'RANDSTAD OFFSHORE', label: 'RANDSTAD OFFSHORE' },
    { value: 'ALTICE CAMPUS', label: 'ALTICE CAMPUS' },
    { value: 'INTELCIA - GP SC - COTE D"IVOIRE', label: 'INTELCIA - GP SC - COTE D"IVOIRE' },
    { value: 'INTELCIA - GP SC - PORTUGAL', label: 'INTELCIA - GP SC - PORTUGAL' }
  ]
  const activityToSelect: Selection[] = [
    { value: 'FRONT CO', label: 'FRONT CO' },
    { value: 'FRONT CO PREMIUM', label: 'FRONT CO PREMIUM' },
    { value: 'BACK CO SOLUTION', label: 'BACK CO SOLUTION' }
  ]
  useEffect(() => {
    setDashSettings(listSettings)
  }, []);

  const updateGlobalFilter = (value, type: string) => {
    if (globalFilter) {
      const newFilter = globalFilter;
      newFilter[type] = value;
      setglobalFilter({ ...globalFilter, [type]: value });
    }
  }
  return (
    <div className='mt-3'>
      {/* filters */}
      <div className='w-100 d-flex mb-3'>
        <div className='w-100 d-flex'>
          {/* sites filter */}
          <div className='d-flex flex-column justify-content-center mr-3'>
            <BiFilter size={20} />
          </div>
          <div className="input-group w-25 mr-2">
            <Select
              className='w-100'
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti={true}
              placeholder='Select sites ...'
              options={sitesToSelect}
              onChange={(e) => updateGlobalFilter(e, 'sites')}
              value={globalFilter?.sites}
            />
          </div>
          {/* activities filter */}
          <div className={"input-group mr-2 w-25"}>
            <Select
              className='w-100'
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              placeholder='Select activities ...'
              options={activityToSelect}
              onChange={(e) => updateGlobalFilter(e, 'activities')}
              value={globalFilter?.activities}
            />
          </div>
          {/* date plage */}

          {/* search button */}
          <div className='ml-3'>
            <button className='btn btn-primary'>Search</button>
          </div>
        </div>
      </div>
      <div className='d-flex mt-3 justify-content-between'>
        {dashSettings?.map(setting => {
          return (
            <DashboardComponent dashSetting={setting} globalFilter={globalFilter} />
          )
        })}
      </div>
    </div>
  )
}

export default DashboardContainer