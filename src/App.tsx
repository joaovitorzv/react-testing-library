import React, { useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import InputMask from 'react-input-mask'

import searchStorage from './services'
import { clearCepValue } from './utils'

import './App.css';

type ResponseCEP = {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

interface CEP {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

function App() {
  const [error, setError] = useState(false)
  const [cepValue, setCepValue] = useState('')
  const [cepResponse, setCepResponse] = useState<CEP>()

  const mountedRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    setCepValue((prevState) => clearCepValue(prevState))

    if (cepValue.length === 8) {
      fetch(`https://viacep.com.br/ws/${cepValue}/json`)
        .then(data => data.json())
        .then((response: ResponseCEP) => {
          if (!response.cep) throw new Error()

          if (mountedRef.current) {
            setCepResponse({
              cep: response.cep,
              city: response.localidade,
              neighborhood: response.bairro,
              state: response.uf,
              street: response.logradouro
            })
            setError(false)
          }
        })
        .catch(err => setError(true))
    }
  }, [cepValue])

  const [lastSearches, setLastSearches] = useState<string[]>(searchStorage.getSearches())

  useEffect(() => {
    if (cepResponse) {
      searchStorage.storeSearch(cepResponse.cep)
      setLastSearches(searchStorage.getSearches())
    }
  }, [cepResponse])

  return (
    <div className="App">
      <div className='container'>
        <header>
          <h2>Procure por algum CEP</h2>
        </header>
        <form className='form-container'>
          <InputMask
            mask='99999-999'
            placeholder='00000-000'
            onChange={(e) => setCepValue(e.target.value)}
            value={cepValue}
          />
          {error && (<p className='error-message' data-testid='error-msg'>CEP não encontrado</p>)}
        </form>
        <div className='last-searches'>
          {lastSearches.length > 0 && (
            <p>last successful searches</p>
          )}
          <div className='row'>
            {lastSearches.map(search => (
              <button
                key={search}
                onClick={() => setCepValue(search)}
                className='last-search'
                data-testid='last-search-btn'
              >
                {search}
              </button>
            ))}
          </div>
        </div>
        <div className='divider' />
        <div className='results-container' data-testid='cep-results'>
          {!cepResponse
            ? (<Skeleton height={30} count={4} />)
            : (
              <>
                <div className='row'>
                  <label>Estado</label>
                  <p>{cepResponse.state}</p>
                </div>
                <div className='row'>
                  <label>Cidade</label>
                  <p>{cepResponse.city}</p>
                </div>
                <div className='row'>
                  <label>Rua</label>
                  <p>{cepResponse.street}</p>
                </div>
                <div className='row'>
                  <label>Bairro</label>
                  <p>{cepResponse.neighborhood}</p>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}

export default App;
