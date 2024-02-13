// import React from 'react'
import styles from './Button.module.css'

export default function Button(prop) {
    const {children, onClick, type} = prop;

  return (
    <button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>{children}</button>
  )
}
