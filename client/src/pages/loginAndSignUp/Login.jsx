import React, { useState } from 'react'
import { Form, Input, Button } from 'antd';
import styles from './index.module.scss'
import { dtLogin } from '@/request/actions/user';

const Login = ({goToSignUp, handleSave}) => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        setLoading(true)
        const {email,password } = values
        const res = await dtLogin(email, password)
        setLoading(false)
        handleSave(res)
    };

    return (
        <>
            <div className={styles.title}>Log In</div>
            <Form onFinish={onFinish} form={form}>
                <div className={styles.inlineForm}>
                    <div style={{marginRight: '10px', width: '50%'}}>
                        <span>Email</span>
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'Please input a valid email!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input placeholder="me@Email.com" />
                        </Form.Item>
                    </div>
                    <div style={{marginRight: '10px', width: '50%'}}>
                        <span>Password</span>
                        <Form.Item
                            name="password"
                            rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                            ]}
                        >
                            <Input.Password placeholder="Enter Password" />
                        </Form.Item>
                    </div>
                </div>
                <div style={{textAlign: 'center'}}>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        Log in
                    </Button>
                </div>
            </Form>
            <div style={{margin: '20px 0'}}>Forgot Password?</div>
            <div>
                <span style={{marginRight: '10px'}}>Don't have an account yet?</span>
                <Button
                    loading={loading}
                    onClick={goToSignUp}
                    size="small"
                    className="success-btn"
                >
                    Sign Up
                </Button>
            </div>
        </>
    )
}

export default Login
