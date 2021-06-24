import React from 'react';

import './styles.css'

type Props = {
  width: number;
  children: React.ReactNode;
}

const SelectWrapper = (props: Props): JSX.Element => {
  return (
    <div className='select' style={{ width: props.width }}>
      {props.children}
    </div>
  );
}

export default SelectWrapper;