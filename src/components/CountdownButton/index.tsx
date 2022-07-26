import React, { useEffect, useState } from 'react';
import { useIntl, connect, Loading } from 'umi';
import { Button } from 'antd';
import styles from './index.less'

interface Props {
    closeTime: () => void
    loginImmediately: () => void
    showTime: boolean
    btnLoading: boolean | undefined
}

const IndexPage: React.FC<Props> = ({ showTime, btnLoading, closeTime, loginImmediately }) => {
    const [time, setTime] = useState<number>(0);

    const { formatMessage } = useIntl();

    useEffect(() => {
        if (showTime) {
            setTime(30);
        }
        else {
            setTime(0);
        }
    }, [showTime]);

    useEffect(() => {
        if (time > 0) {
            setTimeout(() => {
                setTime(time => time - 1);
            }, 1000)
        } else {
            closeTime()
        }
    }, [time])

    return (
        <div className={styles.btn}>
            <Button type="primary" onClick={loginImmediately} disabled={time > 0} loading={btnLoading}>
                {time > 0 ? formatMessage({ id: 'authorization_pending' }, { time }) : formatMessage({ id: 'login.submit.btn' })}
            </Button>
        </div>
    )
}

export default connect(
    ({ loading }: { loading: Loading }) => ({
        btnLoading: loading.effects['global/getDeviceToken'],
    })
)(IndexPage);