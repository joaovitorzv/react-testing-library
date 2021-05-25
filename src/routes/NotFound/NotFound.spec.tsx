import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import NotFound from './index'


describe('Not Found', () => {
  it('get NotFound error when go to a unexistent path', () => {
    render(<NotFound />, { wrapper: MemoryRouter })

    expect(screen.getByRole('heading', { name: /404, pagina não encontrada!/i })).toBeInTheDocument()
  })
})