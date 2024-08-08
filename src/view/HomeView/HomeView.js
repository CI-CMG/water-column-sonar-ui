import React, {
  useEffect,
  useState,
} from 'react';
import {
  useGetSatellitesQuery,
} from '../../services/api.ts'


export default function HomeView() {
  useEffect(() => { document.title = `Home`; }, []);
  
  const [isLoading, setLoading] = useState(false)
  const [value, setValue] = useState('nothing here')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Call API
  const apiResult = useGetSatellitesQuery()

  // Update files data on changed API result
  useEffect(() => {
    if (apiResult.status === 'fulfilled') {
      setValue(apiResult.data.value)
      setErrorMessage('');
    } else if (apiResult.status === 'rejected') {
      setErrorMessage('API error');
    }
    setLoading(false)
  }, [apiResult])

  return (
    <div className="HomeView">
      <h1>Home</h1>
      <p>{ isLoading ? 'loading value' : `api depth value: ${value} meters` }</p>
    </div>
  );
}
