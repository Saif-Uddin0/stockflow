import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};

export default useAppContext;
