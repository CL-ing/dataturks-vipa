import React, { useState } from 'react'
import { Form, Input, Button } from 'antd';
import styles from './index.module.scss'
import { createUserWithPassword } from '@/request/actions/user';

const SignUp = ({handleSave}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)

    // 用户注册
    const onFinish = async (values) => {
        setLoading(true)
        const {firstName,lastName,email,password } = values
        const res = await createUserWithPassword(firstName, lastName, email, password)
        setLoading(false)
        handleSave(res)
    };
    return (
        <Form onFinish={onFinish} form={form}>
            <div className={styles.inlineForm}>
                <div style={{marginRight: '10px', width: '50%'}}>
                    <span>First Name</span>
                    <Form.Item
                        name="firstName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your first name!',
                            },
                            {
                                min: 2,
                                message: 'Password should be at least 2 letters long',
                            },
                        ]}
                    >
                        <Input placeholder="First Name" />
                    </Form.Item>
                </div>
                <div style={{marginRight: '10px', width: '50%'}}>
                    <span>Last name</span>
                    <Form.Item
                        name="lastName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your last name!',
                            },
                            {
                                min: 2,
                                message: 'Password should be at least 2 letters long',
                            },
                        ]}
                    >
                        <Input placeholder="Last name" />
                    </Form.Item>
                </div>
            </div>
            <div className={styles.blockForm}>
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
            <div className={styles.blockForm}>
                <span>Password</span>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        {
                            min: 7,
                            message: 'Password should be at least 7 letters long',
                        },
                    ]}
                >
                    <Input.Password placeholder="Create a password" />
                </Form.Item>
            </div>
            <div style={{textAlign: 'center'}}>
                <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                >
                    Sign Up
                </Button>
            </div>
        </Form>
    )
}

export default SignUp
