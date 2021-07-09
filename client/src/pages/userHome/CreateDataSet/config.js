/*
 * @Author: Azhou
 * @Date: 2021-05-16 14:07:21
 * @LastEditors: Azhou
 * @LastEditTime: 2021-05-17 21:20:06
 */
export const annotationArr = [
  {
    name: 'Image Annotations',
    contents: [
      {
        title: 'Image Classification',
        subTitle: 'Image Classification',
        desc: 'Upload file with image urls and get your team to classify image.',
        type: 'IMAGE_CLASSIFICATION',
      },
      {
        title: 'Image Bounding Box',
        subTitle: 'Image Bounding Box',
        desc: 'Create rectangular bounding boxes around objects in Images.',
        type: 'IMAGE_BOUNDING_BOX_V2',
      },
      {
        title: 'Image Segmentation',
        subTitle: 'Bounding Box, Polygons etc.',
        desc: 'Create free-form polygons, points, lines in images.',
        type: 'IMAGE_POLYGON_BOUNDING_BOX_V2',
      },
    ],
  },
  {
    name: 'Video Annotations',
    contents: [
      {
        title: 'Video Classification',
        subTitle: 'Video Classification',
        desc: 'Upload file with video urls and get your team to classify videos.',
        type: 'VIDEO_CLASSIFICATION',
      },
      {
        title: 'Video Annotation',
        subTitle: 'Video Annotation',
        desc: 'Object Tracking: Create rectangular bounding boxes around objects in video.',
        type: 'VIDEO_BOUNDING_BOX',
      },
    ],
  },
  {
    name: 'Text Annotations',
    contents: [
      {
        title: 'Document Annotations',
        subTitle: 'Document Processing, NLP',
        desc: 'Full-length document NER annotation. Annotate individual files (PDF, DOC, Text) one-by-one',
        type: 'DOCUMENT_ANNOTATION',
      },
      {
        title: 'NER Tagging',
        subTitle: 'NLP, Text Processing, Large Sentences',
        desc: 'Line-by-line NER annotation. Upload a CSV file and do NER on each row.',
        type: 'POS_TAGGING_GENERIC',
      },
      {
        title: 'PoS Tagging for Small Sentences',
        subTitle: 'NLP, Text Processing, Search Queries and Logs',
        desc: 'Optimized for small sentences. Annotate words in a sentence.',
        type: 'POS_TAGGING',
      },
      {
        title: 'Text Summarization',
        subTitle: 'NLP, Text Processing',
        desc: 'Upload file with text and invite people to write summaries',
        type: 'TEXT_SUMMARIZATION',
      },
      {
        title: 'Text Classification',
        subTitle: 'NLP, Text Processing, IR',
        desc: 'Create project with entities and text, get your team to classify them',
        type: 'TEXT_CLASSIFICATION',
      },
      {
        title: 'Text Moderation',
        subTitle: 'Text Processing, User Generated Content',
        desc: 'Get your team to moderate the user generated text',
        type: 'TEXT_MODERATION',
      },
    ],
  },
  {
    name: 'Custom Annotations',
    contents: [
      {
        title: 'Email us for Custom Annotation',
        subTitle:
          'If there is any annotation use-case which is not covered in the list, please drop us an email at contact@dataturks.com',
        desc: '',
        type: 'CUSTOM',
      },
    ],
  },
]
