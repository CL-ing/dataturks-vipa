import { EllipsisOutlined } from '@ant-design/icons'
import { Button, Popover, Progress } from 'antd'
import React from 'react'
import styles from './index.module.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { taskTypeMap } from '@/helpers/Utils'

class SingleProject extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    updateHomeData: PropTypes.func,
    projects: PropTypes.array,
    selectProject: PropTypes.func,
    params: PropTypes.object,
    orgName: PropTypes.string,
    getOrgDetails: PropTypes.func,
    updateProjectDetails: PropTypes.func,
    signIn: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.openStats = this.openStats.bind(this)
  }

  openStats(field1, field2, field3) {
    console.log('opening ', field1, field2, field3)
    if (field1 === 'tag') {
      this.props.history.push('/projects/' + field2 + '/' + field3 + '/space')
    } else {
      this.props.history.push('/projects/' + field2 + '/' + field3)
    }
  }

  render() {
    // console.log("你好，我是项目小框", this.props.children)
    // 项目详情在 this.props.children.projectDetails 中
    const projectDetails = this.props.children.projectDetails
    return (
      <div className={styles.projectWrap}>
        <div className={styles.topWrap}>
          {projectDetails.role === 'OWNER' && <span className={styles.isOwner}>Owner</span>}

          {projectDetails.role === 'OWNER' && (
            <Popover placement="bottom" content={<span>copy</span>} trigger="click">
              <EllipsisOutlined style={{ fontSize: 20 }} />
            </Popover>
          )}
        </div>

        <div className={styles.title}>{projectDetails.name}</div>

        {projectDetails.visibility_type && (
          <div className={styles.belongType}>{projectDetails.visibility_type}</div>
        )}

        <div>{taskTypeMap[projectDetails.task_type]}</div>

        {/* <div className={styles.desc}>{projectDetails.shortDescription}</div> */}

        <Progress
          percent={
            projectDetails.totalHits === 0
              ? 0
              : ((projectDetails.totalHitsDone * 100) / projectDetails.totalHits).toFixed()
          }
          status="active"
          style={{ padding: '0 20px', height: '20px' }}
        />

        <div className={styles.desc}>
          {projectDetails.totalHitsDone} / {projectDetails.totalHits}
        </div>

        <div className={styles.btnWrap}>
          <Button type="primary">
            <Link
              to={{
                pathname:
                  '/userHome/projects/' + projectDetails.orgName + '/' + projectDetails.name,
              }}
            >
              Overview
            </Link>
          </Button>
        </div>
      </div>
    )
  }
}

export default connect(state => ({}), {})(SingleProject)
