import React, { useEffect } from 'react'
import { Switch } from 'react-router-dom'
import { Footer, Navbar } from '@/components'
import RouteWithSubRoutes from '@/router/routeWithSubRoutes'
import LeftPanel from './leftPanel'
import styles from './index.module.scss'
import { getHomeData } from '@/request/actions/user'
import { useDispatch } from 'react-redux'

const UserHome = ({ routes }) => {
  const dispatch = useDispatch()
  const fetchData = async () => {
    const res = await getHomeData()
    const { userDetail } = res
    dispatch({
      type: 'UPDATE_USER_DETAIL',
      payload: userDetail,
    })
  }
  useEffect(() => {
    // todo: auth 登录拦截
    // 获取用户信息并存储到redux
    fetchData()
  }, [])
  return (
    <>
      <Navbar />
      <div className={styles.userHomeContainer}>
        <LeftPanel />
        <div style={{ padding: '30px', flex: 1 }}>
          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default UserHome
