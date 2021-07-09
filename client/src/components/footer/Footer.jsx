import React from 'react'
import styles from './index.module.scss'

const footerItems = [
    { name: 'Dataturks',linkUrl:'' },
    { name: 'Blog',linkUrl:'' },
    { name: 'Contact',linkUrl:'' },
    { name: 'Privacy Policy',linkUrl:'' },
]

const Footer = () => {
    return (
        <div className={styles.footerWrap}>
            <div className={styles.footerMenu}>
                {footerItems.map((item, index) =>
                    <span key={index} className={styles.footerItem}>{item.name}</span>
                )}
            </div>
            <div style={{ color: '#ccc', marginBottom: '30px' }}>
                (+91) 080-331-72755, +91-99010-49915, +91-88614-08222
            </div>
            <div style={{ color: '#ccc'}}>
                contact@dataturks.com
            </div>
        </div>
    )
}

export default Footer
