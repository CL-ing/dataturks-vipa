import React, { useState } from 'react'
import { Navbar, Footer } from '@/components/index'
import { useHistory } from 'react-router-dom'
import styles from './index.module.scss'
import Login from './Login'
import SignUp from './SignUp'

const LoginAndSignUp = () => {
    const [panelType, setPanelType] = useState('login')
    const history = useHistory();
    
    // 登录/注册成功后的回调函数
    const handleSave = (res) => {
        const { id, token } = res;
        window.sessionStorage.setItem('uid', id);
        window.sessionStorage.setItem('token', token);
        history.push('/userHome/my-projects')
    }
    // 用户登录
    return (
        <>
            <Navbar />
            <div className={styles.loginWrap}>
                <div className={styles.leftText}>
                    <span>Super Easy Data Annotations</span>
                    <span>Invite your team and generate high quality labeled data in minutes</span>
                    <span>By signing up on Dataturks, you agree with our privacy policy and terms.</span>
                </div>
                <div className={styles.rightPanel}>
                    {panelType === 'login' && <Login
                        goToSignUp={() => setPanelType('signUp')}
                        handleSave={handleSave}
                    />}
                    {panelType === 'signUp' && <SignUp
                        handleSave={handleSave}
                    />}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default LoginAndSignUp
