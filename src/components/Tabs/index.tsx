import React, { useState } from 'react';
import cn from 'classnames'

import './styles.css'

type TabProps = {
  name?: string;
  index: number;
}

type CloneElementProps = {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const Tab: React.FC<TabProps & Partial<CloneElementProps>> = (props) => {
  return (
    <button
      onClick={() => props.setActiveIndex!(props.index)}
      className={cn('tab-btn', { active: props.activeIndex === props.index })}>
      {props.name}
    </button>
  )
}

export const TabPanel: React.FC<TabProps & Partial<CloneElementProps>> = (props) => {
  return (
    <div className={cn('tab-panel', { 'panel-hidden': props.activeIndex !== props.index })}>
      {props.children}
    </div>
  )
}

const Tabs: React.FC = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className='tabs-container'>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeIndex, setActiveIndex: setActiveIndex })
        }
      })}
    </div>
  );
}

export default Tabs;