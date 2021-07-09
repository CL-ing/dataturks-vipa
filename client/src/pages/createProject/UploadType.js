/*
 * @Author: Azhou
 * @Date: 2021-05-20 22:52:08
 * @LastEditors: Azhou
 * @LastEditTime: 2021-05-23 11:18:45
 */
// todo: [install bytes], [clear error message]
import { Button, Checkbox, Upload, message, Radio, Progress } from 'antd'
import React, { useState } from 'react'
import styles from './index.module.scss'
import { imagePolyBoundingSample, posSample, textClassificationJsonSample } from './config'
import { uploadFileDT } from '@/request/actions/project'

const UploadType = ({ type, currentProject, handleUploaded }) => {
  const [uploadType, setUploadType] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)
  const [fileUploadProgress, setFileUploadProgress] = useState(0)
  const [file, setFile] = useState()
  const [uploadErrMsg, setUploadErrMsg] = useState('')
  const [isURLs, setIsURLs] = useState(false)

  const handleUploadFile = event => {
    console.log('handle upload file', event.target.files[0])
    setFile(event.target.files[0])
  }

  const fileUploadProgressCallback = event => {
    console.log('file upload progress', event.percent)
    setFileUploadProgress(event.percent)
  }

  const fileUploaded = result => {
    if (result.err) {
      setUploadErrMsg(result.data || 'something was wrong')
      handleUploaded(false)
    } else {
      handleUploaded(true, result.data)
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setUploadErrMsg('Please choose a file')
      return
    }
    setUploadLoading(true)
    let format = undefined
    if (uploadType === 'Pre-Annotated') {
      format = 'PRE_TAGGED_JSON'
      if (
        [
          'TEXT_SUMMARIZATION',
          'TEXT_MODERATION',
          'VIDEO_CLASSIFICATION',
          'IMAGE_CLASSIFICATION',
        ].includes(type)
      ) {
        format = 'PRE_TAGGED_TSV'
      } else if (type === 'TEXT_CLASSIFICATION') {
        format = selectedFormat === 'json' ? 'PRE_TAGGED_JSON' : 'PRE_TAGGED_TSV'
      }
    } else {
      if (['DOCUMENT_ANNOTATION', 'POS_TAGGING_GENERIC'].includes(type) && isURLs) {
        format = 'URL_FILE'
      }
    }
    const res = await uploadFileDT(file, currentProject, fileUploadProgressCallback, format)
    setUploadLoading(false)
    fileUploaded(res)
  }

  return (
    <div>
      {!uploadType && (
        <div className={styles.chooseType}>
          <h1> Select Upload Type </h1>
          <div className={styles.itemWrap} onClick={() => setUploadType('Raw')}>
            <div className={styles.header}>Upload Raw Data</div>
          </div>
          <div className={styles.itemWrap} onClick={() => setUploadType('Pre-Annotated')}>
            <div className={styles.header}>Upload Pre-Annotated Data</div>
            <div className={styles.desc}>
              If you have some data which is already pre-annotated and want to go through
              annotations and correct them.
            </div>
          </div>
        </div>
      )}
      {uploadType === 'Raw' && (
        <div>
          <h1>Import Data</h1>
          <Button onClick={() => setUploadType('')}>Change Import Type</Button>
          <h3 style={{ margin: '20px 0' }}> Select file with input data </h3>
          <div style={{ opacity: '0.7', fontSize: '17px' }}>
            {type === 'POS_TAGGING' && <p>Please upload a text/doc/pdf file </p>}
            {type === 'POS_TAGGING_GENERIC' && (
              <div>
                <p>Upload a Text/CSV file where each line has one data-item to be tagged.</p>
                <div>
                  <p>Advanced Details</p>
                  <Checkbox onChange={e => setIsURLs(e.target.checked)}>URLs ?</Checkbox>
                </div>
              </div>
            )}
            {type === 'TEXT_SUMMARIZATION' && (
              <p>
                Please upload a text file with each line in file having sentence to be summarized.
                <br />
                <strong> OR </strong> <br />A zip file of all the text documents to be summarized.
                Max file size is 100 MB for free plans
              </p>
            )}
            {type === 'TEXT_MODERATION' && (
              <p>
                Please upload a text file with each line in file having sentence to be moderated.
                <br />
                <strong> OR </strong> <br />A zip file of all the text documents to be moderated.
                Max file size is 100 MB for free plans
              </p>
            )}
            {type === 'TEXT_CLASSIFICATION' && (
              <p>
                Please upload a text file with each line in file having sentence to be classified.
                <br />
                <strong> OR </strong> <br />A zip file of all the text documents to be classified.
                Max file size is 100 MB for free plans
              </p>
            )}
            {type === 'IMAGE_CLASSIFICATION' && (
              <p>
                Upload a text file containing URLs of images. <br />
                <strong> OR </strong> <br />A zip file of all the images. Max file size is 100 MB
                for free plans
              </p>
            )}
            {type === 'VIDEO_CLASSIFICATION' && (
              <p>Upload a text file containing URLs of videos.</p>
            )}
            {(type === 'IMAGE_BOUNDING_BOX' ||
              type === 'IMAGE_POLYGON_BOUNDING_BOX' ||
              type === 'IMAGE_POLYGON_BOUNDING_BOX_V2') && (
              <p>
                Upload a text file containing URLs of images. <br />
                <strong> OR </strong> <br />A zip file of all the images. Max file size is 100 MB
                for free plans
              </p>
            )}
            {type === 'VIDEO_BOUNDING_BOX' && <p>Upload a text file containing URLs of videos.</p>}
            {type === 'DOCUMENT_ANNOTATION' && (
              <div>
                <p>
                  Please upload a valid text/doc/pdf file.
                  <br />
                  <strong> OR </strong> <br />A zip file of all the text/pdf/doc documents. Max file
                  size is 100 MB for free plans
                </p>
                <div>
                  <p>Advanced Details</p>
                  <Checkbox>URLs ?</Checkbox>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {uploadType === 'Pre-Annotated' && (
        <div>
          <h3>Select file with Pre-Annotated data</h3>
          <Button onClick={() => setUploadType('')}>Change Import Type</Button>
          <div style={{ opacity: '0.7', fontSize: '17px' }}>
            {(type === 'POS_TAGGING' ||
              type === 'POS_TAGGING_GENERIC' ||
              type === 'DOCUMENT_ANNOTATION') && (
              <div>
                <p>
                  Please upload a text file with each line in file having input sentence in
                  following json format. Format is similar to the annotated and downloaded json file
                  from dataturks. Max size 10MB
                </p>
                <pre>
                  <code>{JSON.stringify(posSample)}</code>
                </pre>
                <p>
                  <b>Content</b> contains input text, <b>annotation</b> has the labeled content,{' '}
                  <b>extras</b> is for some extra columns that you want to show with each row.
                </p>
              </div>
            )}
            {type === 'IMAGE_POLYGON_BOUNDING_BOX_V2' && (
              <div>
                <p>
                  Please upload a text file with each line in file having input sentence in
                  following json format. Format is similar to the annotated and downloaded json file
                  from dataturks. Max size 10MB
                </p>
                <pre>
                  <code>{JSON.stringify(imagePolyBoundingSample)}</code>
                </pre>
                <p>
                  <b>Content</b> contains image URL, <b>annotation</b> has the co-ordinate of
                  polygon [first and last value of array is of same co-ordinate], <b>extras</b> is
                  for some extra columns that you want to show with each row.
                </p>
              </div>
            )}
            {type === 'VIDEO_BOUNDING_BOX' && (
              <div>
                <p>
                  Please upload a text file with each line in file having input sentence in
                  following json format. Format is similar to the annotated and downloaded json file
                  from dataturks. Max size 10MB
                </p>
                <pre>
                  <code>{JSON.stringify(imagePolyBoundingSample)}</code>
                </pre>
                <p>
                  <b>Content</b> contains video URL, <b>annotation</b> has the co-ordinate of
                  polygon [first and last value of array is of same co-ordinate], <b>extras</b> is
                  for some extra columns that you want to show with each row.
                </p>
              </div>
            )}
            {(type === 'TEXT_SUMMARIZATION' || type === 'TEXT_MODERATION') && (
              <div>
                <p>
                  Please upload a text file with each line in file having input sentence in
                  following tab seperated format. Max size 10MB
                  <pre>
                    Text Line Result Text Extra KeyValue Pair1(optional) Extra KeyValue
                    Pair1(optional) AFP - India's Tata Iron and Steel Company Ltd. Tata Iron and
                    Steel Company. id=1 content=games British Foreign Minister UK Foreign Minister
                    id=2 content=UK site=34 Japan carmaker Toyota Japanese carmaker Toyota id=100
                  </pre>
                  <b>Content</b> contains input text, <b>annotation</b> has the labeled content,{' '}
                  <b>extras</b> is for some extra columns that you want to show with each row.
                </p>
              </div>
            )}
            {type === 'TEXT_CLASSIFICATION' && (
              <Radio.Group
                onChange={e => {
                  setSelectedFormat(e.target.value)
                }}
              >
                <Radio value={'tsv'}>TSV</Radio>
                <Radio value={'json'}>json</Radio>
              </Radio.Group>
            )}
            {type === 'TEXT_CLASSIFICATION' && selectedFormat === 'json' && (
              <p>
                Please upload a text file with each line in file having input sentence in json
                format. This is same as download format from dataturks Max size 10MB
                <pre>{textClassificationJsonSample}</pre>
              </p>
            )}
            {type === 'TEXT_CLASSIFICATION' && selectedFormat === 'tsv' && (
              <p>
                Please upload a text file with each line in file having input sentence in following
                tab seperated format. Max size 10MB
                <pre>
                  Text Line Comma Separated Labels Extra KeyValue Pair1(optional) Extra KeyValue
                  Pair1(optional)
                  <br />
                  <br />
                  <br />
                  <br />
                  AFP - India's Tata Iron and Steel Company Ltd. Class1, Class2 id=1 content=games
                  <br />
                  British Foreign Minister Class4,Class5 id=2 content=UK site=34
                  <br />
                  Japan carmaker Toyota Class1 id=100
                </pre>
              </p>
            )}
            {type === 'IMAGE_CLASSIFICATION' && (
              <p>
                Please upload a text file with each line in file having input sentence in following
                tab seperated format. Max size 10MB
                <pre>
                  Image_URL Comma Separated Labels Extra KeyValue Pair1(optional) Extra KeyValue
                  Pair1(optional)
                  <br />
                  <br />
                  <br />
                  <br />
                  http://amazonaws.com/grande.jpg Class1, Class2, Class3 id=1 context=image1
                  <br />
                  http://amazonaws.com/Carraway.jpg Class1 id=2 context=image2 site=34
                  <br />
                  http://.amazonaws.com/slices.jpg Class1, Class2 id=32
                </pre>
              </p>
            )}
            {type === 'VIDEO_CLASSIFICATION' && (
              <p>
                Please upload a text file with each line in file having input sentence in following
                tab seperated format. Max size 10MB
                <pre>
                  Video_URL Comma Separated Labels Extra KeyValue Pair1(optional) Extra KeyValue
                  Pair1(optional)
                  <br />
                  <br />
                  <br />
                  <br />
                  http://amazonaws.com/grande.mp4 Class1, Class2, Class3 id=1 context=image1
                  <br />
                  http://amazonaws.com/Carraway.mp4 Class1 id=2 context=image2 site=34
                  <br />
                  http://.amazonaws.com/slices.mp4 Class1, Class2 id=32
                </pre>
              </p>
            )}
            {type === 'TEXT_SUMMARIZATION' && (
              <div>
                <p>
                  Please upload a text file with each line in file having input sentence in
                  following tab seperated format. Max size 10MB
                  <pre>
                    Text Line Result Text Extra KeyValue Pair1(optional) Extra KeyValue
                    Pair1(optional) AFP - India's Tata Iron and Steel Company Ltd. Tata Iron and
                    Steel Company. id=1 content=games British Foreign Minister UK Foreign Minister
                    id=2 content=UK site=34 Japan carmaker Toyota Japanese carmaker Toyota id=100
                  </pre>
                  <b>Content</b> contains input text, <b>annotation</b> has the labeled content,{' '}
                  <b>extras</b> is for some extra columns that you want to show with each row.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {uploadType && (
        <div>
          <form encType="multipart/form-data" action="" key="importFile">
            <input
              disabled={uploadLoading}
              type="file"
              name="fileName"
              onChange={handleUploadFile}
            />
            {file && file.size > 10000000 && (
              <p style={{ color: 'red', fontWeight: 'bold' }}>File size is big: {file.size}</p>
            )}
            {file && file.size < 10000000 && <p> File Size: {file.size} </p>}
          </form>
          <div style={{ textAlign: 'center', margin: '15px 0' }}>
            <Button onClick={handleSubmit} type="primary">
              Submit
            </Button>
            {uploadErrMsg && <div style={{ color: 'red', marginTop: 8 }}>{uploadErrMsg}</div>}
          </div>
          {fileUploadProgress > 0 && uploadLoading && <Progress percent={fileUploadProgress} />}
        </div>
      )}
    </div>
  )
}

export default UploadType
