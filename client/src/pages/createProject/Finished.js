/*
 * @Author: Azhou
 * @Date: 2021-05-20 22:52:26
 * @LastEditors: Azhou
 * @LastEditTime: 2021-05-23 11:35:15
 */
import { Button } from 'antd'
import React from 'react'
import styles from './index.module.scss'

const Finished = ({ type, fileUploadStats }) => {
  const startTagging = () => {}
  return (
    <div>
      <h2> Project creation successful</h2>
      <div className={styles.uploadResult}>
        <span style={{ color: '#21ba45' }}>{fileUploadStats.numHitsCreated}</span> Number of HITs
        created
      </div>
      <div className={styles.uploadResult}>
        <span style={{ color: 'red' }}>{fileUploadStats.numHitsIgnored}</span> Number of HITs
        Ignored
      </div>
      <div className={styles.uploadResult}>
        <span>{fileUploadStats.totalUploadSizeInBytes}</span> File Size
      </div>
      <br />
      <div style={{ height: '60px' }} />
      <Button className="teal-btn" onClick={startTagging}>
        {(type === 'POS_TAGGING' ||
          type === 'DOCUMENT_ANNOTATION' ||
          type === 'POS_TAGGING_GENERIC') &&
          'Start Tagging'}
        {type === 'TEXT_SUMMARIZATION' && 'Summarize Text'}
        {type === 'TEXT_MODERATION' && 'Moderate Text'}
        {type === 'TEXT_CLASSIFICATION' && 'Classify Text'}
        {type === 'IMAGE_CLASSIFICATION' && 'Classify Image'}
        {type === 'VIDEO_CLASSIFICATION' && 'Classify Videos'}
        {type === 'VIDEO_BOUNDING_BOX' && 'Bound Videos'}
        {(type === 'IMAGE_BOUNDING_BOX' ||
          type === 'IMAGE_POLYGON_BOUNDING_BOX' ||
          type === 'IMAGE_POLYGON_BOUNDING_BOX_V2') &&
          'Bound Images'}
      </Button>
    </div>
  )
}

export default Finished
