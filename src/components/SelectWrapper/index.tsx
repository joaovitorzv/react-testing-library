import React from 'react';

import './styles.css'

type Props = {
  width: number;
}

const SelectWrapper: React.FC<Props> = (props) => {
  return (
    <div className='select' style={{ width: props.width }}>
      {props.children}
    </div>
  );
}

export default SelectWrapper;