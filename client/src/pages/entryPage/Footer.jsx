import React from 'react'
import styles from './index.module.scss'

const footerConfig = [
    {
        title: 'About',
        items: [
            {name:'About',linkUrl:''},
            {name:'Help',linkUrl:''},
        ]
    },
    {
        title: 'Blog',
        items: [
            {name:'All posts',linkUrl:''},
            {name:'OCR APIs comparison',linkUrl:''},
            {name:'Face reco APIs comparison',linkUrl:''},
            {name:'Best image moderation APIs',linkUrl:''},
        ]
    },
    {
        title: 'How to',
        items: [
            {name:'Image Bounding Box',linkUrl:''},
            {name:'Document Annotation',linkUrl:''},
            {name:'Polygon Bounding Box',linkUrl:''},
            {name:'POS Tagging',linkUrl:''},
        ]
    },
    {
        title: 'Features',
        items: [
            {name:'Image Annotation',linkUrl:''},
            {name:'Text Annotation',linkUrl:''},
            {name:'API Docs',linkUrl:''},
        ]
    },
    {
        title: 'Documentation',
        items: [
            {name:'Export to Pascal VOC',linkUrl:''},
            {name:'Export in TensorFlow Format',linkUrl:''},
            {name:'NER in Spacy Format',linkUrl:''},
            {name:'Docs',linkUrl:''},
        ]
    },
    {
        title: 'ML Tutorial',
        items: [
            {name:'Introduction to ML',linkUrl:''},
            {name:'ML based troll filter',linkUrl:''},
            {name:'ML and GDPR',linkUrl:''},
            {name:'TensorFlow vs Keras?',linkUrl:''},
        ]
    },
]

const Footer = () => {
    return (
        <div className={styles.footerWrap}>
            <div className={styles.linkArrWrap}>
                {footerConfig.map((v, index) =>
                    <div key={index} className={styles.itemWrap}>
                        <div className={styles.itemTitle}>{v.title}</div>
                        {v.items.map((item,i) =>
                            <span key={i} className={styles.itemLink}>{item.name}</span>
                        )}
                    </div>
                )}
            </div>
            <div style={{ color: '#ccc', marginTop: '50px' }}>
                Copyright © Trilldata Technologies Pvt Ltd 2018
            </div>
        </div>
    )
}

export default Footer
