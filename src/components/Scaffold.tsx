import React from 'react'

type ScaffoldProps = {
  className?: string
  topBar?: React.ReactNode,
  children: React.ReactNode,
  bottomBar?: React.ReactNode,
  contentClassName?: string
}
export default function Scaffold({ children, topBar, bottomBar, className, contentClassName }: ScaffoldProps) {
  return (
    <div className={`scaffold ${className ? className : ''}`}>
      {topBar && topBar}

      <div className={`scaffold-content ${contentClassName}`}>
        {children}
      </div>

      {bottomBar && bottomBar}
    </div>
  )
}
