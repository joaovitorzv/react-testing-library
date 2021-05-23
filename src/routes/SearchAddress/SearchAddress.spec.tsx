import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import SearchAddress from './index';

const server = setupServer(
  rest.get('https://viacep.com.br/ws/:cep/json', (req, res, ctx) => {
    const { cep } = req.params

    let cepParsed = cep.split('')
    cepParsed.splice(5, 0, '-')
    cepParsed = cepParsed.join('')

    return res(ctx.json({
      cep: cepParsed,
      localidade: 'Rua exemplo',
      bairro: 'Bairro exemplo',
      uf: 'Franca',
      logradouro: 'SP'
    }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('App', () => {
  it('shows the app header', () => {
    render(<SearchAddress />)
    expect(screen.getByRole('heading', { name: /procure por algum cep/i })).toBeInTheDocument()
  });

  it('search for a valid CEP and get data response back', async () => {
    render(<SearchAddress />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '14404254' } })

    await waitFor(() => screen.getByText(/franca/i))
  });

  it('search for a invalid CEP and get an error', async () => {
    render(<SearchAddress />)
    server.use(
      rest.get(`https://viacep.com.br/ws/:cep/json`, (req, res, ctx) => {
        return res(
          ctx.json({ erro: true })
        )
      })
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 99999999 } })
    await waitFor(() => screen.getByTestId('error-msg'))
    expect(screen.getByText(/cep não encontrado/i)).toBeInTheDocument()
  });

  it('search for a valid CEP and show in last searches', async () => {
    render(<SearchAddress />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '14404254' } })

    await waitFor(() => screen.getByTestId('last-search-btn'))
    expect(screen.getByRole('button', { name: /14404-254/i })).toBeInTheDocument()
  })

  it('search for 4 valid CEPs and only show the last 3 searched', async () => {
    render(<SearchAddress />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: '14404254' } })
    await waitFor(() => screen.getByRole('button', { name: /14404-254/i }))

    fireEvent.change(input, { target: { value: '14404255' } })
    await waitFor(() => screen.getByRole('button', { name: /14404-255/i }))

    fireEvent.change(input, { target: { value: '14404256' } })
    await waitFor(() => screen.getByRole('button', { name: /14404-256/i }))

    fireEvent.change(input, { target: { value: '14404257' } })
    await waitFor(() => screen.getByRole('button', { name: /14404-257/i }))

    expect(screen.queryByRole('button', { name: /14404-254/i })).not.toBeInTheDocument()
  })
})
