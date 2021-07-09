import { Button } from 'antd'
import React from 'react'
import { annotationArr } from './config'
import styles from './index.module.scss'
import { useHistory } from 'react-router-dom'

const CreateDataSet = () => {
  const history = useHistory()
  const handleCreate = type => {
    if (type === 'IMAGE_BOUNDING_BOX_V2') {
      history.push(`/userHome/import?type=${type}&shape=rectangle`)
    } else {
      history.push(`/userHome/import?type=${type}`)
    }
  }
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontWeight: 500, fontSize: '24px' }}>Create Dataset</div>
      <div style={{ marginBottom: '30px' }}>
        How to create a dataset? <a href="#javascript;">See Demo Videos</a>
      </div>
      <div className={styles.annotationsWrap}>
        {annotationArr.map((v, index) => (
          <div className={styles.itemWrap} key={index}>
            <div className={styles.title}>{v.name}</div>
            <div className={styles.contentWrap}>
              {v.contents.map((_item, idx) => (
                <div className={styles.contentItem} key={idx}>
                  <div className={styles.contentTitle}>{_item.title}</div>
                  <div className={styles.subTitle}>{_item.subTitle}</div>
                  <div className={styles.desc}>{_item.desc}</div>
                  <Button className="success-btn" onClick={() => handleCreate(_item.type)}>
                    Create Dataset
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreateDataSet
