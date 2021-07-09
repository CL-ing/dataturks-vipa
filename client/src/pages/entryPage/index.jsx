/*
 * @Author: Azhou
 * @Date: 2021-05-11 10:32:38
 * @LastEditors: Azhou
 * @LastEditTime: 2021-05-11 12:49:23
 */
import React from 'react'
import { Button } from 'antd';
import styles from './index.module.scss'
import { useHistory } from 'react-router-dom'
import EntryNavbar from './EntryNavbar'
import Footer from './Footer'

const EntryPage = () => {
    const history = useHistory();
    return (
        <div>
            <EntryNavbar />
            <div className={styles.container}>
                <Button
                    type="primary"
                    className={`${styles.buttonWrap} ${styles.loginWrap}`}
                    onClick={()=>history.push('/login')}
                >
                    LOGIN
                </Button>
                <Button type="primary" className={styles.buttonWrap}>ADMIN SETUP</Button>
                <Button type="primary" className={styles.buttonWrap}>CHANGE PASSWORD</Button>
            </div>
            <Footer />
        </div>
    )
}

export default EntryPage
