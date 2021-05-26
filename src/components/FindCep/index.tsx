import React, { useEffect, useState } from 'react';
import InputMask from 'react-input-mask'
import Skeleton from 'react-loading-skeleton';

import SelectWrapper from '../SelectWrapper'

import './styles.css'

type Uf = {
  id: number;
  sigla: string;
}

type City = {
  nome: string;
}

type ResponseCEP = {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
}

const FindCep: React.FC = () => {
  const [ufs, setUfs] = useState<Uf[]>([])
  const [cities, setCities] = useState<City[]>()

  const [selectedUf, setSelectedUf] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [streetName, setStreetName] = useState('')

  const [cepResponse, setCepResponse] = useState<ResponseCEP[]>()

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(data => data.json())
      .then(response => setUfs(response))
  }, [])

  useEffect(() => {
    console.log(selectedUf)

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(data => data.json())
      .then(response => setCities(response))
  }, [selectedUf])

  useEffect(() => {
    console.log(streetName)
    if (streetName.length < 3) return

    fetch(`https://viacep.com.br/ws/${selectedUf}/${selectedCity}/${streetName}/json`)
      .then(data => data.json())
      .then(response => setCepResponse(response))

    console.log(cepResponse)
  }, [selectedCity, streetName])

  return (
    <>
      <header>
        <h2>Encontre seu CEP</h2>
      </header>
      <form className='form-container'>
        <div className='selections'>
          <SelectWrapper width={100}>
            <select onChange={(e) => setSelectedUf(e.target.value)}>
              <option value='default'>Estado</option>
              {ufs.map(uf => (
                <option
                  key={uf.id}
                  value={uf.sigla}
                >
                  {uf.sigla}
                </option>
              ))}
            </select>
          </SelectWrapper>
          <SelectWrapper width={290}>
            <select
              disabled={!selectedUf}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value='default'>Cidade</option>
              {cities?.map(city => (
                <option
                  key={city.nome}
                  value={city.nome}
                >
                  {city.nome}
                </option>
              ))}
            </select>
          </SelectWrapper>
        </div>
        <input
          placeholder='Nome da rua'
          className='street-input'
          onChange={(e) => setStreetName(e.currentTarget.value)}
        />
      </form>
      <div className='results-container' data-testid='cep-results'>
        {!cepResponse
          ? (<Skeleton height={30} count={4} />)
          : (
            <>
              {cepResponse.map(cep => (
                <>
                  <div className='divider' />
                  <div className='row'>
                    <label>CEP</label>
                    <p>{cep.cep}</p>
                  </div>
                  <div className='row'>
                    <label>Cidade</label>
                    <p>{cep.localidade}</p>
                  </div>
                  <div className='row'>
                    <label>Rua</label>
                    <p>{cep.logradouro}</p>
                  </div>
                  <div className='row'>
                    <label>Bairro</label>
                    <p>{cep.bairro}</p>
                  </div>
                </>
              ))}
            </>
          )}
      </div>
    </>
  );
}

export default FindCep;