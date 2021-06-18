import { fireEvent, render, waitFor, screen, getByRole, findByRole, getByTestId, findByText, getByText, getByPlaceholderText, queryByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import FindCep from './index'

const server = setupServer(
  rest.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, sigla: 'SP' },
      { id: 2, sigla: 'MG' },
      { id: 3, sigla: 'AM' }
    ]))
  }),
  rest.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/:uf/municipios', (req, res, ctx) => {
    return res(ctx.json([
      { nome: 'Franca' },
      { nome: 'Campinas' },
      { nome: 'Osasco' }
    ]))
  }),
  rest.get('https://viacep.com.br/ws/:uf/:city/:street/json', (req, res, ctx) => {
    const { city, street } = req.params

    return res(ctx.json([
      {
        cep: '14404-254',
        logradouro: street,
        localidade: city,
      }
    ]))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Find Cep', () => {
  it('show the component header', () => {
    const { getByRole } = render(<FindCep />)

    expect(getByRole('heading', { name: /encontre seu cep/i })).toBeInTheDocument()
  })

  it('loads uf select options', async () => {
    const { getByRole } = render(<FindCep />)

    await waitFor(() => getByRole('option', { name: /sp/i }))
    await waitFor(() => getByRole('option', { name: /mg/i }))
    await waitFor(() => getByRole('option', { name: /am/i }))
  })

  it('loads city select options', async () => {
    const { getByRole, getByTestId } = render(<FindCep />)

    await waitFor(() => getByRole('option', { name: /sp/i }))
    userEvent.selectOptions(getByTestId('state-options'), ['SP'])

    await waitFor(() => getByRole('option', { name: /franca/i }))
    await waitFor(() => getByRole('option', { name: /campinas/i }))
    await waitFor(() => getByRole('option', { name: /osasco/i }))
  })

  it('input less than 3 characters on search input shouldn\'t make any request', async () => {
    const { getByRole, getByTestId, getByPlaceholderText, queryByText } = render(<FindCep />)

    await waitFor(() => getByRole('option', { name: /sp/i }))
    userEvent.selectOptions(getByTestId('state-options'), ['SP'])

    await waitFor(() => getByRole('option', { name: /franca/i }))
    userEvent.selectOptions(getByTestId('city-options'), ['Franca'])

    userEvent.type(getByPlaceholderText('Nome da rua'), 'Ho')

    expect(queryByText('14404-254')).not.toBeInTheDocument()
  })

  it('input 3 characters on search and get successful response', async () => {
    const { getByRole, getByTestId, getByPlaceholderText, getByText } = render(<FindCep />)

    await waitFor(() => getByRole('option', { name: /sp/i }))
    userEvent.selectOptions(getByTestId('state-options'), ['SP'])

    await waitFor(() => getByRole('option', { name: /franca/i }))
    userEvent.selectOptions(getByTestId('city-options'), ['Franca'])

    userEvent.type(getByPlaceholderText('Nome da rua'), 'Hono')

    expect(await waitFor(() => getByText('14404-254'))).toBeInTheDocument()
  })
})