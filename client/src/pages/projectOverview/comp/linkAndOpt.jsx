import { MenuOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../index.module.scss'

const LinkAndOpt = () => {
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="https://www.antgroup.com">1st menu item</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="https://www.aliyun.com">2nd menu item</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
  )

  return (
    <div>
      <div>
        <Link to={'v.link'} className={styles.back}>
          Dataturks
        </Link>
        / Demo Image
      </div>
      <Dropdown overlay={menu} trigger={['click']}>
        <Button icon={<MenuOutlined />} className={'teal-btn'}>
          Options
        </Button>
      </Dropdown>
    </div>
  )
}

export default LinkAndOpt
