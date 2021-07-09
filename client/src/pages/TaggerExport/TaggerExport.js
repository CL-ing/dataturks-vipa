import React, {Component} from 'react';
import PropTypes from "prop-types"
import 'semantic-ui-css/semantic.min.css'
import {connect} from 'react-redux';
import {downloadfile, getUidToken, logEvent} from '@/helpers/dthelper';
import {setCurrentProject, getProjectDetails} from '@/redux/modules/dataturks';
import {Button, Form, Label, Segment, Icon, Breadcrumb} from 'semantic-ui-react';
import {
  TEXT_SUMMARIZATION, DOCUMENT_ANNOTATION,
  POS_TAGGING_GENERIC, POS_TAGGING,
  TEXT_CLASSIFICATION, TEXT_MODERATION,
  IMAGE_POLYGON_BOUNDING_BOX, IMAGE_POLYGON_BOUNDING_BOX_V2,
  IMAGE_BOUNDING_BOX, IMAGE_CLASSIFICATION
} from '@/helpers/Utils';

const FileSaver = require('file-saver');

class TaggerExport extends Component {
  static propTypes = {
    user: PropTypes.object,
    pushState: PropTypes.func,
    uploadDataForm: PropTypes.func,
    projectDetails: PropTypes.object,
    currentProject: PropTypes.string,
    goBack: PropTypes.func,
    params: PropTypes.object,
    orgName: PropTypes.string,
    projectName: PropTypes.string,
    setCurrentProject: PropTypes.func,
    getProjectDetails: PropTypes.func,
    currentPathProject: PropTypes.string,
    currentPathOrg: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.downloadFile = this.downloadFile.bind(this);
    this.downloadCallback = this.downloadCallback.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
  }

  state = {
    loading: false,
    downloadFormat: 'json',
    itemOption: 'TAGGED',
    projectDetails: this.props.location.state,
  }

  componentDidMount() {
    console.log('Did mount TaggerVisualize() ', this.state.projectDetails, this.state.hits);
  }

  downloadCallback = (error, response) => {
    console.log(' download call back ', error, response);
    const {projectDetails} = this.state;
    if (!error) {
      this.setState({loading: false});
      const blob = new Blob([response.text], {type: 'application/octet-stream'});
      if (projectDetails) {
        const taskType = projectDetails.task_type;
        if (taskType === TEXT_MODERATION || taskType === TEXT_SUMMARIZATION) {
          FileSaver.saveAs(blob, projectDetails.name + '.tsv');
        } else {
          if (this.state.downloadFormat === 'json') {
            FileSaver.saveAs(blob, projectDetails.name + '.json');
          } else if (this.state.downloadFormat === 'stanford') {
            FileSaver.saveAs(blob, projectDetails.name + '.tsv');
          } else {
            FileSaver.saveAs(blob, projectDetails.name + '.txt');
          }
        }
      } else {
        FileSaver.saveAs(blob, projectDetails.name);
      }
    } else {
      alert(response.body.message);
    }
  }

  handleChange = (event, {value}) => {
    console.log('handle change', event, value);
    this.setState({itemOption: value});
  }

  handleChange2 = (event, {value}) => {
    console.log('handle change', event, value);
    this.setState({downloadFormat: value});
  }

  downloadFile = () => {
    console.log('downloadfile ', this.state);
    this.setState({loading: true});
    const {projectDetails} = this.state;
    downloadfile(projectDetails.id, this.state.itemOption, this.downloadCallback, this.state.downloadFormat);
  }

  render() {
    console.log('TaggerExport props are ', this.props, this.state);
    const {itemOption, downloadFormat, projectDetails} = this.state;
    const orgName = projectDetails.orgName;
    const projectName = projectDetails.name;
    return (
      <div className="taggerPages">
        {
          <div className="text-center">
            {
              <div>
                <Segment basic size="large" loading={this.state.loading}>
                  <Button className="pull-left"
                          onClick={() => this.props.history.push('/userHome/projects/' + orgName + '/' + projectName)}
                          compact><Icon name="arrow left"/>Project</Button>
                  <div className="text-center">
                    <Breadcrumb size="big">
                      <Breadcrumb.Section link
                                          onClick={() => this.props.history.push('/userHome/projects/' + orgName)}>{orgName}</Breadcrumb.Section>
                      <Breadcrumb.Divider/>
                      <Breadcrumb.Section active link
                                          onClick={() => this.props.history.push('/userHome/projects/' + orgName + '/' + projectName)}>
                        {projectName}
                      </Breadcrumb.Section>
                    </Breadcrumb>
                  </div>
                </Segment>
              </div>
            }
            <h1>Export Data</h1>
            <Segment basic size="mini" padded compact loading={this.state.loading}>
              <Form size="small" key="import1" loading={this.state.loading}>
                <Form.Group inline style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                  <Form.Radio label="All Items" value="ALL" checked={itemOption === 'ALL'} onChange={this.handleChange}/>
                  <Form.Radio label="Completed Items" value="TAGGED" checked={itemOption === 'TAGGED'} onChange={this.handleChange}/>
                </Form.Group>

                <br/>
                {projectDetails && projectDetails.task_type === IMAGE_CLASSIFICATION &&
                <p>Download file would be a text file where each line is a JSON containing the image URL and the classes
                  marked for the image.</p>
                }
                {projectDetails && (projectDetails.task_type === IMAGE_BOUNDING_BOX) &&
                <div>
                  <p>Download file would be a text file where each line is a JSON containing the image URL and the
                    coordinates of the bounded objects in the image</p>
                </div>
                }
                {projectDetails && (projectDetails.task_type === IMAGE_POLYGON_BOUNDING_BOX || projectDetails.task_type === IMAGE_POLYGON_BOUNDING_BOX_V2) &&
                <p>Download file would be a text file where each line is a JSON containing the image URL and the
                  coordinates of the bounded objects in the image</p>
                }
                {projectDetails && (projectDetails.task_type === DOCUMENT_ANNOTATION || projectDetails.task_type === POS_TAGGING_GENERIC) &&
                <p>Download file would be a text file where each line is a JSON containing the selected text, start
                  index, end index and marked category</p>
                }
                {projectDetails && projectDetails.task_type === TEXT_SUMMARIZATION &&
                <p>Download file would be a tab seperated file with input in first column and output row in second
                  column.</p>
                }
                {projectDetails && projectDetails.task_type === TEXT_MODERATION &&
                <p>Download file would be a tab seperated file with input in first column and output row in second
                  column.</p>
                }
                {projectDetails && projectDetails.task_type === POS_TAGGING &&
                <p>Download file would be a text file where each line is a JSON containing the input text and annotated
                  text.</p>
                }
                {projectDetails && projectDetails.task_type === TEXT_CLASSIFICATION &&
                <p>Download file would be a text file where each line is a JSON containing the input text, associated
                  label and notes.</p>
                }
                {
                  projectDetails && (projectDetails.task_type === POS_TAGGING || projectDetails.task_type === DOCUMENT_ANNOTATION || projectDetails.task_type === POS_TAGGING_GENERIC) &&
                  <div>
                    <Form.Group inline style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                      <Form.Radio label="Json Format" value="json" checked={downloadFormat === 'json'} onChange={this.handleChange2}/>
                      <Form.Radio label="Stanford NER Format" value="stanford" checked={downloadFormat === 'stanford'} onChange={this.handleChange2}/>
                    </Form.Group>
                  </div>
                }
                <br/>
                <Button primary size="mini" onClick={this.downloadFile}>
                  Download file
                </Button>
                <br/>

                <div style={{height: '100px'}}/>
                <br/>
                <br/>
                {projectDetails && (projectDetails.task_type === IMAGE_BOUNDING_BOX) &&
                <Label color="teal" as="a" href="https://dataturks.com/help/ibbx_dataturks_to_pascal_voc_format.php"
                       target="_blank">
                  Convert to Pascal VOC format
                </Label>
                }
                {projectDetails && (projectDetails.task_type === IMAGE_POLYGON_BOUNDING_BOX_V2) &&
                <Label color="teal" as="a"
                       href="https://medium.com/@dataturks/converting-polygon-bounded-boxes-in-the-dataturks-json-format-to-mask-images-f747b7ba921c"
                       target="_blank">
                  Create a PNG Encoded Mask
                </Label>
                } {projectDetails && (projectDetails.task_type === POS_TAGGING || projectDetails.task_type === DOCUMENT_ANNOTATION || projectDetails.task_type === POS_TAGGING_GENERIC) &&
              <Label color="teal" as="a" href="https://dataturks.com/help/dataturks-ner-json-to-spacy-train.php"
                     target="_blank">
                Convert to Spacy format
              </Label>
              }
              </Form>
            </Segment>
          </div>
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.auth.user,
    currentPathOrg: state.dataturksReducer.currentPathOrg,
    currentPathProject: state.dataturksReducer.currentPathProject,
    currentProject: state.dataturksReducer.currentProject,
    projectDetails: state.dataturksReducer.projectDetails
  }),
  {downloadfile, getProjectDetails, setCurrentProject}
)(TaggerExport)
