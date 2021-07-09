import React from 'react'
import { HomeOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import styles from './index.module.scss'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { Button } from 'antd'

const linkArr = [
  {
    name: 'Test',
    link: '',
  },
  {
    name: 'nkoljfekji fini',
    link: '',
  },
  {
    name: 'kooopfinlenahag',
    link: '',
  },
]

const LeftPanel = () => {
  const history = useHistory()
  let location = useLocation()
  const isActive = tag => {
    if (tag === 'home' && location.pathname === '/userHome/my-projects') return true
    if (tag === 'dataset' && location.pathname === '/userHome/create-dataset') return true
  }
  return (
    <div className={styles.leftWrap}>
      <div className={`${styles.leftButton} ${styles.username}`}>
        <UserOutlined className={styles.icon} />
        <span>zhou</span>
      </div>
      <div
        className={`${styles.leftButton} ${styles.link}`}
        onClick={() => history.push('/userHome/my-projects')}
        style={{ background: isActive('home') ? '#f2f2f2' : '' }}
      >
        <HomeOutlined className={styles.icon} />
        <span>Home</span>
      </div>
      <div
        className={`${styles.leftButton} ${styles.link}`}
        onClick={() => history.push('/userHome/create-dataset')}
        style={{ background: isActive('dataset') ? '#f2f2f2' : '' }}
      >
        <PlusOutlined className={styles.icon} />
        <span>Create Dataset</span>
      </div>
      <Button>Get API Key</Button>
      <div className={styles.labelWrap}>
        <Button size="small" className="success-btn">
          Onprem users
        </Button>
        <div>Labels Used</div>
        <span className={styles.number}>0</span>
        <div>Total Labels in Package</div>
        <span className={styles.number}>2500000</span>
      </div>
      <div className={styles.linkWrap}>
        <div className={styles.linkTitle}>Datasets</div>
        {linkArr.map((v, index) => (
          <Link to={v.link} className={styles.linkProject} key={index}>
            {v.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default LeftPanel
