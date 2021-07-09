import { SingleProject } from '@/components'
import { SyncOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getHomeData, getUidToken, refreshUidToken, logEvent } from '@/helpers/dthelper'
import styles from './index.module.scss'
import {
  timeConverter,
  taskTypeMap,
  DUMMY_UID,
  POS_TAGGING,
  POS_TAGGING_GENERIC,
  TEXT_SUMMARIZATION,
  IMAGE_CLASSIFICATION,
  TEXT_MODERATION,
  TEXT_CLASSIFICATION,
  DOCUMENT_ANNOTATION,
  IMAGE_POLYGON_BOUNDING_BOX,
  IMAGE_POLYGON_BOUNDING_BOX_V2,
  IMAGE_BOUNDING_BOX,
} from '@/helpers/Utils'
import {
  updateHomeData,
  selectProject,
  getOrgDetails,
  updateProjectDetails,
} from '@/redux/modules/dataturks'
import { signIn } from '@/redux/modules/auth'

class MyProjects extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    pushState: PropTypes.func,
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
    this.openCreate = this.openCreate.bind(this)
    this.loadProjectDetails = this.loadProjectDetails.bind(this)
    this.projectDetailsFetched = this.projectDetailsFetched.bind(this)
    this.state = {
      loading: false,
      homeDetails: null,
      activeMenu: 'home',
    }
  }

  componentDidMount() {
    // console.log('用户主页加载完毕 ', this.state.homeDetails, this.props)
    if (!this.state.homeDetails) {
      this.loadProjectDetails()
    }
  }

  componentWillUnmount() {
    console.log('卸载组件')
    this.setState({ homeDetails: undefined })
  }

  loadProjectDetails(cache) {
    const { uid, token } = getUidToken()
    // console.log('uid in taggerpeoj', uid, DUMMY_UID)
    if (this.props.orgName) {
      console.log('OrgDetail')
      this.props.getOrgDetails(this.props.orgName, { uid, token })
    } else if (uid !== DUMMY_UID) {
      getHomeData(this.projectDetailsFetched, cache)
    }
    this.setState({ loading: true })
  }

  projectDetailsFetched(error, response) {
    // console.log('home details fetched ', error, response)
    if (!error) {
      this.props.signIn({
        firstName: response.body.userDetails.firstName,
        lastName: response.body.userDetails.secondName,
        fullName: response.body.userDetails.firstName + ' ' + response.body.userDetails.secondName,
        uid: response.body.userDetails.uid,
        email: response.body.userDetails.email,
        profilePic: response.body.userDetails.profilePic,
      })
      this.props.updateHomeData(
        response.body.userDetails,
        response.body.projects,
        response.body.planName,
        response.body.labelsAllowed,
        response.body.labelsDone,
        response.body.subscriptionExpiryTimestamp,
        response.body.hasSubscriptionExpired
      )
      this.setState({
        homeDetails: response.body.projects,
        loading: false,
        plan: response.body.planName,
        labelsAllowed: response.body.labelsAllowed,
        labelsDone: response.body.labelsDone,
        subscriptionExpiryTimestamp: response.body.subscriptionExpiryTimestamp,
        hasSubscriptionExpired: response.body.hasSubscriptionExpired,
      })
    } else if (response && response.body) {
      if (response.body.code === 401) {
        refreshUidToken(this.loadProjectDetails)
      } else {
        this.setState({ projectDetailsError: response.body.message })
      }
    } else {
      this.setState({ projectDetailsError: 'Not able to connect' })
    }
  }

  openCreate(val) {
    this.props.history.push(val)
  }

  render() {
    return (
      <>
        <div className={styles.titleWrap}>
          <div className={styles.title}>My Projects</div>
          {/* 点击刷新功能完成 */}
          <Button
            size="small"
            className="success-btn"
            onClick={() => this.loadProjectDetails(true)}
            icon={<SyncOutlined />}
          >
            Refresh
          </Button>
        </div>

        {/* 展示项目详情完成，但是未完成点击事件 */}
        {this.state.homeDetails && this.state.homeDetails.length > 0 && (
          <div className={styles.projectsWrap}>
            {this.state.homeDetails.map((project, index) => (
              <SingleProject key={index}>{project}</SingleProject>
            ))}
          </div>
        )}

        {this.state.homeDetails && this.state.homeDetails.length === 0 && (
          <div>
            <h1>No Projects Currently</h1>
            <div>
              <Button color="blue" onClick={this.openCreate.bind(this, 'create-dataset')}>
                Create A New Project
              </Button>
            </div>
          </div>
        )}
      </>
    )
  }
}

// mapStateToProps, mapDispatchToProps
export default connect(
  state => ({
    user: state.user,
    projects: state.dataturksReducer.projects,
  }),
  {
    signIn,
    updateHomeData,
    updateProjectDetails,
    selectProject,
    getOrgDetails,
  }
)(MyProjects)
