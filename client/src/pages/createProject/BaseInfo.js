/*
 * @Author: Azhou
 * @Date: 2021-05-20 22:51:30
 * @LastEditors: Azhou
 * @LastEditTime: 2021-05-23 11:52:06
 */
import React, { useState } from 'react'
import { Form, Input, Button, Radio, Checkbox } from 'antd'
import { getInstructionPlaceHolder, getNamePlaceHolder } from './utils'
import AddClassification from './AddClassification'
import { deleteProjectDt, uploadDataForm } from '@/request/actions/project'

const showTagItemBlacklist = ['TEXT_SUMMARIZATION', 'TEXT_MODERATION', 'CUSTOM']
const showShapeItemWhitelist = ['IMAGE_POLYGON_BOUNDING_BOX_V2']
const showAutoCloseWhitelist = ['POS_TAGGING_GENERIC', 'DOCUMENT_ANNOTATION']

const BaseInfo = ({ type, shape, handleProjectCreated }) => {
  const [errorMsg, setErrorMsg] = useState()
  const [classification, setClassification] = useState({
    name: '',
    displayName: '',
    classes: [],
  })
  const [form] = Form.useForm()

  const onFinish = async values => {
    const { project_name, instructions, tags } = values
    const rules = { tags, instructions }
    if (showShapeItemWhitelist.includes(type)) rules.defaultShape = values.defaultShape
    if (showAutoCloseWhitelist.includes(type)) rules.autoClose = values.autoClose
    if (classification.name && classification.displayName && classification.classes.length) {
      rules.classification = classification
    }
    const ans = {
      name: project_name,
      taskType: type,
      rules: JSON.stringify(rules),
    }
    const res = await uploadDataForm(ans)
    if (res.err) setErrorMsg(res.data)
    else handleProjectCreated(res.data.response)
  }

  const renderAdvancedOptions = type => {
    if (showShapeItemWhitelist.includes(type))
      return (
        <Form.Item label="Advanced Options" name="defaultShape" initialValue={shape}>
          <Radio.Group>
            <Radio value={'polygon'}>Polygon</Radio>
            <Radio value={'rectangle'}>Rectangle</Radio>
          </Radio.Group>
        </Form.Item>
      )
    else if (showAutoCloseWhitelist.includes(type))
      return (
        <Form.Item label="Advanced Options" name="autoClose" valuePropName="checked">
          <Checkbox>Single Label per Entity</Checkbox>
        </Form.Item>
      )
  }

  return (
    <div style={{ margin: 'auto', width: '600px' }}>
      <h1 style={{ marginBottom: '50px' }}>Create Dataset</h1>
      <Form form={form} layout="vertical" style={{ textAlign: 'left' }} onFinish={onFinish}>
        <Form.Item
          label="Dataset Name"
          name="project_name"
          rules={[
            {
              required: true,
              message: 'this value is required',
            },
          ]}
        >
          <Input placeholder={getNamePlaceHolder(type)} />
        </Form.Item>
        {!showTagItemBlacklist.includes(type) && (
          <Form.Item
            label="List of Entities/Categories"
            name="tags"
            rules={[
              {
                required: true,
                message: 'this value is required',
              },
            ]}
          >
            <Input placeholder="List of Classes comma separated : Car, Cat, Tree" />
          </Form.Item>
        )}
        <Form.Item
          label="Tagging Instruction"
          name="instructions"
          rules={[
            {
              required: true,
              message: 'this value is required',
            },
          ]}
        >
          <Input.TextArea rows={5} placeholder={getInstructionPlaceHolder(type)} />
        </Form.Item>
        {renderAdvancedOptions(type)}
      </Form>
      {['POS_TAGGING_GENERIC', 'DOCUMENT_ANNOTATION'].includes(type) && (
        <AddClassification onChange={setClassification} />
      )}
      <div style={{ textAlign: 'center' }}>
        <Button type="primary" onClick={() => form.submit()}>
          Submit
        </Button>
        <Button
          onClick={() => {
            deleteProjectDt('2c919054795c2bf001799757db18000d')
          }}
        >
          delete dirty data
        </Button>
        <div style={{ color: 'red', marginTop: 8 }}>{errorMsg}</div>
      </div>
    </div>
  )
}

export default BaseInfo
