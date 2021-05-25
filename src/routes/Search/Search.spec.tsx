import { render, screen } from '@testing-library/react';

import Search from './index';

describe('Search', () => {
  it('renders the search tabs options', () => {
    render(<Search />)

    expect(screen.getByRole('button', { name: /verificar cep/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /encontrar cep/i })).toBeInTheDocument()
  })
})
