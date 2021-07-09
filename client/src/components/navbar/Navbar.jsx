import React from 'react'
import { useHistory } from 'react-router-dom'
import styles from './index.module.scss'

const Navbar = () => {
  const history = useHistory()
  const menuItems = [
    { name: 'Documentation', onClick: () => {} },
    { name: 'APIs', onClick: () => {} },
    {
      name: 'Try Demo',
      onClick: () => {
        history.push('/try-demo')
      },
    },
    { name: 'Sign Up/Login', onClick: () => {} },
  ]
  const handleClick = item => {
    if (typeof item.onClick === 'function') item.onClick()
  }
  return (
    <div className={styles.navbarWrap}>
      <div className={styles.navbar}>
        <span className={styles.navbarTitle}>Dataturks</span>
        <div className={styles.navbarMenu}>
          {menuItems.map((item, index) => (
            <div key={index} className={styles.menuItem} onClick={() => handleClick(item)}>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Navbar
