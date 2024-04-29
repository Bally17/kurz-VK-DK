import { useState } from 'react';

const useData = () => {
  const [storedData, setStoredData] = useState([]);

  const saveData = (data) => {
    localStorage.setItem('userData', JSON.stringify(data));
    setStoredData(data);
  };

  const loadData = () => {
    const data = localStorage.getItem('userData');
    if (data) {
      setStoredData(JSON.parse(data));
    }
  };

  return { storedData, saveData, loadData };
};

export default useData;
