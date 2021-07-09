/*
 * @Author: Azhou
 * @Date: 2021-05-19 15:18:29
 * @LastEditors: Azhou
 * @LastEditTime: 2021-05-19 17:15:36
 */
import { MinusCircleFilled, PlusCircleFilled } from '@ant-design/icons'
import { Form, Input } from 'antd'
import React, { useState } from 'react'
import styles from './index.module.scss'

const AddClassification = ({ value = {}, onChange }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showDeleteBtn, setShowDeleteBtn] = useState(false)
  const [form] = Form.useForm()
  const onFieldsChange = (changedFields, allFields) => {
    let allFilled = true
    allFields.forEach(v => {
      if (!v.value) allFilled = false
    })
    setShowDeleteBtn(allFilled)
    onChange({
      name: form.getFieldValue('classification_name'),
      displayName: form.getFieldValue('classification_disp_name'),
      classes: form.getFieldValue('classification_classes')?.split(','),
    })
  }
  return (
    <div className={styles.addClassificationWrap}>
      {showDeleteBtn ? (
        <div
          className={styles.deleteBtn}
          onClick={() => {
            setShowAddForm(false)
            form.resetFields()
            setShowDeleteBtn(false)
          }}
        >
          <MinusCircleFilled style={{ color: '#2185d0' }} /> remove Classification
        </div>
      ) : (
        <div className={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? (
            <MinusCircleFilled style={{ color: '#2185d0' }} />
          ) : (
            <PlusCircleFilled style={{ color: '#2185d0' }} />
          )}
          {showAddForm ? ' Hide' : ' Add'} Classification
        </div>
      )}

      {showAddForm && (
        <div style={{ width: '300px', textAlign: 'center', margin: 'auto' }}>
          <h4> Classification Options </h4>
          <Form layout="vertical" onFieldsChange={onFieldsChange} form={form}>
            <Form.Item label="Name" name="classification_name">
              <Input placeholder="Theme" />
            </Form.Item>
            <Form.Item label="Display Name" name="classification_disp_name">
              <Input placeholder="Select the article theme." />
            </Form.Item>
            <Form.Item label="Classes" name="classification_classes">
              <Input placeholder="News,Sports,Business" />
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  )
}

export default AddClassification
