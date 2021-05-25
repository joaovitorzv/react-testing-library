import React from 'react';

import { Link } from 'react-router-dom'

import './styles.css'

const NotFound: React.FC = () => {
  return (
    <section className='not-found'>
      <h2>404, Pagina não encontrada!</h2>
      <Link to='/' className='link'>Voltar para a pagina inicial</Link>
    </section>
  );
}

export default NotFound;