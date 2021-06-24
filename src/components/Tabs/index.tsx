import React, { useState } from 'react';
import cn from 'classnames'

import './styles.css'

type withChildren<T = {}> =
  T & { children?: React.ReactNode };

type TabProps = withChildren<{
  name?: string;
  index: number;
}>

type CloneElementProps = {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const Tab = (props: TabProps & Partial<CloneElementProps>) => {
  return (
    <button
      onClick={() => props.setActiveIndex!(props.index)}
      className={cn('tab-btn', { active: props.activeIndex === props.index })}>
      {props.name}
    </button>
  )
}

export const TabPanel = (props: TabProps & Partial<CloneElementProps>) => {
  return (
    <div className={cn('tab-panel', { 'panel-hidden': props.activeIndex !== props.index })}>
      {props.children}
    </div>
  )
}

const Tabs = (props: withChildren): JSX.Element => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className='tabs-container'>
      {React.Children.map(props.children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeIndex, setActiveIndex: setActiveIndex })
        }
      })}
    </div>
  );
}

export default Tabs;