import React, { useState } from 'react';
import InputMask from 'react-input-mask'

// import { Container } from './styles';

const FindCep: React.FC = () => {
  const [streetName, setStreetName] = useState('')

  return (
    <>
      <header>
        <h2>Encontre seu CEP</h2>
      </header>
      <form className='form-container'>
        <div className='select'>
          <select>
            <option value='SP'>SP</option>
            <option value='SP'>RJ</option>
            <option value='SP'>ES</option>
            <option value='SP'>RS</option>
          </select>
        </div>
        <select>
          <option value='SP'>Franca</option>
          <option value='SP'>Campinas</option>
          <option value='SP'>Rolandia</option>
          <option value='SP'>Cacetete</option>
        </select>
        <input placeholder='Nome da rua' />
      </form>
    </>
  );
}

export default FindCep;