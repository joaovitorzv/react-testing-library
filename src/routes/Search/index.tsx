import React from 'react'
import Tabs, { Tab, TabPanel } from '../../components/Tabs'

import VerifyCep from '../../components/VerifyCep'
import FindCep from '../../components/FindCep';

import './styles.css';

const Search: React.FC = () => {
  return (
    <div className='container'>
      <Tabs>
        <Tab name='Verificar CEP' index={0} />
        <Tab name='Encontrar CEP' index={1} />

        <TabPanel index={0}>
          <VerifyCep />
        </TabPanel>
        <TabPanel index={1}>
          <FindCep />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default Search;
