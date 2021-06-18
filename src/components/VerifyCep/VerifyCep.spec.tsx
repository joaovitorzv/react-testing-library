import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import VerifyCep from './index';

const server = setupServer(
  rest.get('https://viacep.com.br/ws/:cep/json', (req, res, ctx) => {
    const { cep } = req.params

    let responseCepParsed = cep.split('')
    responseCepParsed.splice(5, 0, '-')
    responseCepParsed = responseCepParsed.join('')

    return res(ctx.json({
      cep: responseCepParsed,
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

describe('Verify Cep', () => {
  it('show the component header', () => {
    const { getByRole } = render(<VerifyCep />)
    expect(getByRole('heading', { name: /verifique seu cep/i })).toBeInTheDocument()
  });

  it('search for a valid CEP and get data response back', async () => {
    const { getByPlaceholderText, getByText } = render(<VerifyCep />)

    fireEvent.change(getByPlaceholderText('00000-000'), { target: { value: '14404254' } })

    await waitFor(() => getByText(/franca/i))
  });

  it('search for a invalid CEP and get an error', async () => {
    const { getByRole, getByText, getByTestId } = render(<VerifyCep />)
    server.use(
      rest.get(`https://viacep.com.br/ws/:cep/json`, (req, res, ctx) => {
        return res(
          ctx.json({ erro: true })
        )
      })
    )

    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: '99999999' } })
    await waitFor(() => getByTestId('error-msg'))
    expect(getByText(/cep não encontrado/i)).toBeInTheDocument()
  });

  it('search for a valid CEP and show in last searches', async () => {
    const { getByRole, getByTestId } = render(<VerifyCep />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: '14404254' } })

    await waitFor(() => getByTestId('last-search-btn'))
    expect(getByRole('button', { name: /14404-254/i })).toBeInTheDocument()
  })

  it('search for 4 valid CEPs and only show the last 3 searched', async () => {
    const { getByRole, queryByRole } = render(<VerifyCep />)
    const input = getByRole('textbox')

    for (let i = 0; i <= 4; i++) {
      let cepValue = `14404-25${i}`

      fireEvent.change(input, { target: { value: cepValue } })
      await waitFor(() => getByRole('button', { name: new RegExp(cepValue, 'i') }))
    }

    expect(queryByRole('button', { name: /14404-250/i })).not.toBeInTheDocument()
  })
})
