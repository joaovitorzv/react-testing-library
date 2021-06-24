import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import SelectWrapper from '../SelectWrapper'
import useIsMounted from '../../hooks/useIsMounted'

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

const FindCep = (): JSX.Element => {
  const [ufs, setUfs] = useState<Uf[]>([])
  const [cities, setCities] = useState<City[]>()

  const [selectedUf, setSelectedUf] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [streetName, setStreetName] = useState('')

  const [cepResponse, setCepResponse] = useState<ResponseCEP[]>()

  const isMounted = useIsMounted()

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(data => data.json())
      .then((response: Uf[]) => {
        if (isMounted.current) {
          setUfs(response.sort((a, b) => a.sigla.localeCompare(b.sigla)))
        }
      })
  }, [isMounted])

  useEffect(() => {
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(data => data.json())
      .then(response => {
        if (isMounted.current) setCities(response)
      })
  }, [selectedUf, isMounted])

  useEffect(() => {
    if (streetName.length < 3) return

    fetch(`https://viacep.com.br/ws/${selectedUf}/${selectedCity}/${streetName}/json`)
      .then(data => data.json())
      .then(response => {
        if (isMounted.current) setCepResponse(response)
      })
  }, [selectedUf, selectedCity, streetName, isMounted])

  return (
    <>
      <header>
        <h2>Encontre seu CEP</h2>
      </header>
      <form className='form-container'>
        <div className='selections'>
          <SelectWrapper width={100}>
            <select
              onChange={(e) => setSelectedUf(e.target.value)}
              data-testid='state-options'
            >
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
              data-testid='city-options'
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
          ? (<Skeleton height={20} count={4} style={{ marginTop: 10 }} />)
          : (
            <>
              {cepResponse.map(cep => (
                <div className='result-collumn' key={cep.cep}>
                  <div className='divider' />
                  <div className='row-small'>
                    <label>CEP</label>
                    <p>{cep.cep}</p>
                  </div>
                  <div className='row-small'>
                    <label>Cidade</label>
                    <p>{cep.localidade}</p>
                  </div>
                  <div className='row-small'>
                    <label>Rua</label>
                    <p>{cep.logradouro}</p>
                  </div>
                  <div className='row-small'>
                    <label>Bairro</label>
                    <p>{cep.bairro}</p>
                  </div>
                </div>
              ))}
            </>
          )}
      </div>
    </>
  );
}

export default FindCep;