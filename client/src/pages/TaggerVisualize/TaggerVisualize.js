import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Statistic, Header, Button, Icon, Breadcrumb } from 'semantic-ui-react'
import { fetchStats, getUidToken } from '@/helpers/dthelper'
import { setCurrentProject } from '@/redux/modules/dataturks'
import {
  POS_TAGGING,
  VIDEO_BOUNDING_BOX,
  VIDEO_CLASSIFICATION,
  DOCUMENT_ANNOTATION,
  IMAGE_POLYGON_BOUNDING_BOX_V2,
  TEXT_CLASSIFICATION,
  POS_TAGGING_GENERIC,
  IMAGE_BOUNDING_BOX,
  IMAGE_POLYGON_BOUNDING_BOX,
  IMAGE_CLASSIFICATION,
  TEXT_SUMMARIZATION,
  TEXT_MODERATION,
} from '@/helpers/Utils'
import { BarChart, Bar, Tooltip, YAxis, XAxis, Legend } from 'recharts'
import Table from 'react-bootstrap/lib/Table'

const statsLabel = { textTransform: 'initial', fontWeight: '300' }

class TaggerVisualize extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    pushState: PropTypes.func,
    currentProject: PropTypes.string,
    projectDetails: PropTypes.object,
    goBack: PropTypes.func,
    params: PropTypes.object,
    orgName: PropTypes.string,
    projectName: PropTypes.string,
    setCurrentProject: PropTypes.func,
  }

  constructor(props) {
    console.log('TaggerVisualize 组件 props are ', props)
    super(props)
    this.projectDetailsFetched = this.projectDetailsFetched.bind(this)
  }

  state = {
    projectStats: undefined,
    loading: false,
    taskType: undefined,
    projectDetails: this.props.location.state,
  }

  componentDidMount() {
    console.log(
      'Did mount TaggerVisualize()，查看组件初始状态 ',
      this.state,
      '组件属性',
      this.props
    )
    const { orgName, projectName } = this.props.match.params
    const projectDetails = this.state.projectDetails

    if (!this.state.projectStats) {
      this.loadProjectDetails(projectDetails.id)
    }
  }

  getLabelsCountChart(inData) {
    console.log('inData', inData)
    const dataArray = []
    if (inData) {
      Object.keys(inData).forEach(function (tag) {
        const data = {}
        const tagValue = inData[tag]
        if (tagValue.label) {
          data.name = tagValue.label
        } else {
          data.name = tag
        }
        // data.name = tagValue.label;
        data.Count = tagValue.count
        dataArray.push(data)
      })
    }
    // const width = 100 * dataArray.length;
    console.log('data is ', inData, dataArray)
    return (
      <div className="marginTop">
        <div>
          <BarChart layout="vertical" width={1000} height={500} data={dataArray}>
            <Tooltip />
            <Legend />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Bar dataKey="Count" stackId="a" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    )
  }

  getDocLabelsChart(inData) {
    const dataArray = []
    if (inData) {
      Object.keys(inData).forEach(function (tag) {
        const data = {}
        const tagValue = inData[tag]
        data.name = tag
        data.Count = tagValue.count
        dataArray.push(data)
      })
    }
    // const width = 100 * dataArray.length;
    console.log('data is ', inData, dataArray)
    return (
      <div className="marginTop">
        <div>
          <BarChart layout="vertical" width={1000} height={500} data={dataArray}>
            <Tooltip />
            <Legend />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Bar dataKey="Count" stackId="a" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    )
  }

  getLabelsChart(inData) {
    const dataArray = []
    if (inData) {
      Object.keys(inData).forEach(function (tag) {
        const data = {}
        const tagValue = inData[tag]
        data.name = tag
        data['Total Words'] = tagValue.count
        data['Unique Words'] = tagValue.numUniqWords
        data['Word Frequency'] = (tagValue.count / tagValue.numUniqWords).toPrecision(2)
        dataArray.push(data)
      })
    }
    // const width = 100 * dataArray.length;
    console.log('data is ', inData, dataArray)
    return (
      <div className="marginTop">
        <div>
          <BarChart layout="vertical" width={1000} height={500} data={dataArray}>
            <Tooltip />
            <Legend />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Bar dataKey="Total Words" stackId="a" fill="#8884d8" />
            <Bar dataKey="Unique Words" stackId="a" fill="#82ca9d" />
          </BarChart>
        </div>
        <br />
        <br />
        <div>
          <BarChart layout="vertical" width={1000} height={500} data={dataArray}>
            <Tooltip />
            <XAxis type="number" />
            <YAxis type="catehory" dataKey="name" type="category" />
            <Legend />
            <Bar dataKey="Word Frequency" stackId="c" fill="#ffc658" />
          </BarChart>
        </div>
      </div>
    )
  }

  getWordsChart(inData) {
    console.log('data is ', inData)
    const renderArr = []
    for (let index = 0; index < inData.length; index++) {
      renderArr.push(
        <tr>
          <td>{inData[index].phrase}</td>
          <td>{inData[index].count}</td>
        </tr>
      )
    }
    return (
      <Table striped bordered condensed hover responsive>
        <thead>
          <tr>
            <th>Word</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>{renderArr}</tbody>
      </Table>
    )
  }

  loadProjectDetails(pid, cache) {
    const projectDetails = this.state.projectDetails
    // TODO_REPLACE
    this.setState({ loading: true, projectDetails: projectDetails })
    if (pid) {
      fetchStats(pid, this.projectDetailsFetched, cache)
    } else {
      fetchStats(this.props.currentProject, this.projectDetailsFetched, cache)
    }
  }

  projectDetailsFetched(error, response) {
    console.log(' project details fetched ', error, response)
    if (!error) {
      let projectStats = {}
      let taskType = undefined
      if (response.body.details.task_type === POS_TAGGING) {
        projectStats = response.body.posTaggingStats
        taskType = response.body.details.task_type
      } else if (
        response.body.details.task_type === TEXT_SUMMARIZATION ||
        response.body.details.task_type === TEXT_MODERATION
      ) {
        projectStats = response.body.textSummarizationStats
        taskType = response.body.details.task_type
      } else if (response.body.details.task_type === TEXT_CLASSIFICATION) {
        projectStats = response.body.textClassificationStats
        taskType = TEXT_CLASSIFICATION
      } else if (response.body.details.task_type === IMAGE_CLASSIFICATION) {
        projectStats = response.body.imageClassificationStats
        taskType = IMAGE_CLASSIFICATION
      } else if (response.body.details.task_type === VIDEO_CLASSIFICATION) {
        projectStats = response.body.videoClassificationStats
        taskType = VIDEO_CLASSIFICATION
      } else if (response.body.details.task_type === IMAGE_BOUNDING_BOX) {
        projectStats = response.body.imageBoundingBoxStats
        taskType = IMAGE_BOUNDING_BOX
      } else if (
        response.body.details.task_type === IMAGE_POLYGON_BOUNDING_BOX ||
        response.body.details.task_type === IMAGE_POLYGON_BOUNDING_BOX_V2
      ) {
        projectStats = response.body.imageBoundingBoxStats
        taskType = response.body.details.task_type
      } else if (response.body.details.task_type === DOCUMENT_ANNOTATION) {
        projectStats = response.body.documentTaggingStats
        taskType = DOCUMENT_ANNOTATION
      } else if (response.body.details.task_type === POS_TAGGING_GENERIC) {
        projectStats = response.body.documentTaggingStats
        taskType = POS_TAGGING_GENERIC
      } else if (response.body.details.task_type === VIDEO_BOUNDING_BOX) {
        projectStats = response.body.videoBoundingBoxStats
        taskType = VIDEO_BOUNDING_BOX
      }
      this.setState({ projectStats, taskType, loading: false })
    }
  }

  handleSubmit = response => {
    console.log('response', response, this.props.login)

    if (response && response.profileObj) {
      this.props.login(response.profileObj.name, response.profileObj.imageUrl)
    }
  }

  render() {
    console.log('开始渲染，查看组件状态 ', this.state, '组件属性', this.props)
    const { projectStats, taskType, projectDetails } = this.state
    const { orgName } = projectDetails
    const projectName = projectDetails.name

    return (
      <div className="taggerPages">
        {
          <div>
            {
              <div>
                <Segment
                  basic
                  size="large"
                  loading={this.state.loading}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Button
                    className="pull-left"
                    onClick={() =>
                      this.props.history.push('/userHome/projects/' + orgName + '/' + projectName)
                    }
                    compact
                  >
                    <Icon name="arrow left" />
                    Project
                  </Button>
                  <div className="text-center">
                    <Breadcrumb size="big">
                      <Breadcrumb.Section
                        link
                        onClick={() => this.props.history.push('/userHome/projects/' + orgName)}
                      >
                        {orgName}
                      </Breadcrumb.Section>
                      <Breadcrumb.Divider />
                      <Breadcrumb.Section
                        active
                        link
                        onClick={() =>
                          this.props.history.push(
                            '/userHome/projects/' + orgName + '/' + projectName
                          )
                        }
                      >
                        {projectName}
                      </Breadcrumb.Section>
                    </Breadcrumb>
                  </div>
                  <div className="text-right">
                    <Button
                      size="tiny"
                      positive
                      className="pull-right"
                      onClick={() => this.loadProjectDetails(this.state.projectDetails.id, false)}
                      compact
                    >
                      <Icon name="refresh" />
                      Refresh
                    </Button>
                  </div>
                </Segment>
              </div>
            }
            <br />

            {projectStats &&
              taskType !== DOCUMENT_ANNOTATION &&
              taskType !== VIDEO_CLASSIFICATION &&
              taskType !== POS_TAGGING_GENERIC &&
              taskType !== IMAGE_CLASSIFICATION &&
              taskType !== IMAGE_BOUNDING_BOX &&
              taskType !== IMAGE_POLYGON_BOUNDING_BOX &&
              taskType !== VIDEO_BOUNDING_BOX &&
              taskType !== IMAGE_POLYGON_BOUNDING_BOX_V2 && (
                <div className="text-center col-md-12">
                  <Segment basic vertical textAlign="center" loading={this.state.loading}>
                    <Header as="h2">Project Insights</Header>
                    <div>
                      <br />
                      <br />
                      <Statistic.Group size="mini" widths="three">
                        <Statistic color="green">
                          <Statistic.Value>{projectStats.totalUniqWords}</Statistic.Value>
                          <Statistic.Label style={statsLabel}>Unique Words</Statistic.Label>
                        </Statistic>
                        <Statistic color="green">
                          <Statistic.Value>
                            {(projectStats.totalWords / projectStats.totalUniqWords).toPrecision(2)}
                          </Statistic.Value>
                          <Statistic.Label style={statsLabel}>Word Frequency</Statistic.Label>
                        </Statistic>
                        <Statistic color="green">
                          <Statistic.Value>{projectStats.totalWords}</Statistic.Value>
                          <Statistic.Label style={statsLabel}>Total Words</Statistic.Label>
                        </Statistic>
                      </Statistic.Group>
                    </div>
                    <br />
                    <br />
                    <div className="marginTopExtra col-md-12">
                      <div className="col-md-6">
                        {projectStats.leastFrequentWords &&
                          projectStats.leastFrequentWords.length > 0 && (
                            <div className="marginTop">
                              <h4> Least frequent words </h4>
                              {this.getWordsChart(projectStats.leastFrequentWords)}
                            </div>
                          )}
                      </div>
                      <div className="col-md-6">
                        {projectStats.mostFrequentWords &&
                          projectStats.mostFrequentWords.length > 0 && (
                            <div className="marginTop">
                              <h4> Most frequent words </h4>
                              {this.getWordsChart(projectStats.mostFrequentWords)}
                            </div>
                          )}
                      </div>
                    </div>
                  </Segment>
                </div>
              )}
            <br />

            {projectStats && taskType === POS_TAGGING && (
              <div className="text-center col-md-12">
                <Segment basic vertical textAlign="center" loading={this.state.loading}>
                  <Header as="h2">Insights from completed HITs</Header>
                  <div>
                    <br />
                    <br />
                    <Statistic.Group size="mini" widths="three">
                      <Statistic color="green">
                        <Statistic.Value>{projectStats.totalUniqWordsWithLabels}</Statistic.Value>
                        <Statistic.Label style={statsLabel}>Unique Words</Statistic.Label>
                      </Statistic>
                      <Statistic color="green">
                        <Statistic.Value>
                          {(
                            projectStats.totalWordsWithLabels /
                            projectStats.totalUniqWordsWithLabels
                          ).toPrecision(2)}
                        </Statistic.Value>
                        <Statistic.Label style={statsLabel}>Word Frequency</Statistic.Label>
                      </Statistic>
                      <Statistic color="green">
                        <Statistic.Value>{projectStats.totalWordsWithLabels}</Statistic.Value>
                        <Statistic.Label style={statsLabel}>Total Words</Statistic.Label>
                      </Statistic>
                    </Statistic.Group>
                  </div>
                </Segment>
              </div>
            )}
            {((projectStats && taskType === TEXT_SUMMARIZATION) ||
              taskType === TEXT_MODERATION) && (
              <div className="text-center col-md-12">
                <Segment basic vertical textAlign="center" loading={this.state.loading}>
                  <Header as="h2">Insights from completed HITs</Header>
                  <div>
                    <br />
                    <br />
                    <Statistic.Group size="mini" widths="two">
                      <Statistic color="green">
                        <Statistic.Value>{projectStats.avrWordsInHits}</Statistic.Value>
                        <Statistic.Label style={statsLabel}>Average Words in HITs</Statistic.Label>
                      </Statistic>
                      <Statistic color="green">
                        <Statistic.Value>{projectStats.avrWordsInHitResults}</Statistic.Value>
                        <Statistic.Label style={statsLabel}>
                          Average Words in HIT Results
                        </Statistic.Label>
                      </Statistic>
                    </Statistic.Group>
                  </div>
                </Segment>
              </div>
            )}

            {projectStats && taskType === POS_TAGGING && (
              <div className="text-center col-md-12">
                <Segment basic vertical textAlign="center" loading={this.state.loading}>
                  <div>{this.getLabelsChart(projectStats.perLabelStat)}</div>
                </Segment>
              </div>
            )}

            {projectStats && taskType === TEXT_CLASSIFICATION && (
              <div className="text-center col-md-12">
                <Segment basic vertical textAlign="center" loading={this.state.loading}>
                  <div>{this.getLabelsCountChart(projectStats.labelCounts)}</div>
                </Segment>
              </div>
            )}
            {projectStats &&
              (taskType === IMAGE_CLASSIFICATION ||
                taskType === VIDEO_CLASSIFICATION ||
                taskType === IMAGE_BOUNDING_BOX ||
                taskType === VIDEO_BOUNDING_BOX ||
                taskType === IMAGE_POLYGON_BOUNDING_BOX ||
                taskType === IMAGE_POLYGON_BOUNDING_BOX_V2) && (
                <div className="text-center col-md-12">
                  <Segment basic vertical textAlign="center" loading={this.state.loading}>
                    <div>{this.getLabelsCountChart(projectStats.laeblStats)}</div>
                  </Segment>
                </div>
              )}
            {projectStats &&
              (taskType === DOCUMENT_ANNOTATION || taskType === POS_TAGGING_GENERIC) && (
                <div className="text-center col-md-12">
                  <Segment basic vertical textAlign="center" loading={this.state.loading}>
                    <div>{this.getDocLabelsChart(projectStats.perLabelStat)}</div>
                  </Segment>
                </div>
              )}

            {projectStats && (taskType === TEXT_SUMMARIZATION || taskType === TEXT_MODERATION) && (
              <div className="text-center col-md-12">
                <Segment basic vertical textAlign="center" loading={this.state.loading}>
                  <div className="marginTop" style={{ paddingLeft: '20%', paddingRight: '20%' }}>
                    <h4> Most frequent Excluded Words </h4>
                    {this.getWordsChart(projectStats.mostFrequentExcludedWords)}
                  </div>
                </Segment>
              </div>
            )}
          </div>
        }
      </div>
    )
  }
}

export default connect(
  state => ({
    user: state.user,
    currentProject: state.dataturksReducer.currentProject,
    projectDetails: state.dataturksReducer.projectDetails,
  }),
  {
    setCurrentProject,
  }
)(TaggerVisualize)
