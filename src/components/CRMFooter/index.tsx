import React from 'react';
import styles from './index.less'

interface Props {
    url: string
    message: string
}

const IndexPage: React.FC<Props> = ({ url, message }) => {    const onClick = () => {
        window.open(url)
    }

    return (
        <div className={styles.footer}>
            <span className={styles.openUrl} onClick={onClick}>{message}</span>
        </div >
    )
}

export default IndexPage;