import { Footer } from '@/components';
import { AUTO_CREATE_CONFIG_DEF, LOGIN_KEYS, NOTIFICATION_CONFIG_DEF, REQUEST_CODE, SESSION_STORAGE_KEY, UPLOAD_CALL_CONFIG_DEF } from "@/constant";
import { Button, Checkbox, Form, Image, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ConnectProps, Dispatch, Loading, connect, history, useIntl } from 'umi';
import LockIcon from '../../asset/login/lock-line.svg';
import CloseIcon from '../../asset/login/password-close.svg';
import OpenIcon from '../../asset/login/password-open.svg';
import styles from './index.less';

interface LoginProps extends ConnectProps {
    getUser: () => Promise<LooseObject>
    saveUserConfig: (obj: LooseObject) => void
    save: (obj: LooseObject) => void
    loginLoading: boolean | undefined
}

const IndexPage: React.FC<LoginProps> = ({ getUser, saveUserConfig, save, loginLoading, location }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [remember, setRemember] = useState(true);
    const [form] = Form.useForm();
    const { formatMessage } = useIntl();
    const config = useRef<LooseObject>({});

    const onCheckChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) => {
        setRemember(e.target.checked);
    };

    const onfocus = () => {
        setErrorMessage('');
    }

    const loginSuccess = () => {
        history.replace({ pathname: '/home', });
    }

    const getUserInfo = (values: LooseObject) => {
        getUser().then(res => {
            console.log(res);
            if (res.id) {
                const userConfig = {
                    autoLogin: remember,
                    token: remember ? values.token : undefined,
                    uploadCall: values.uploadCall ?? true,
                    notification: values.notification ?? true,
                    autoCreate: values.autoCreate ?? false,
                    autoCreateConfig: values.autoCreateConfig ?? AUTO_CREATE_CONFIG_DEF,
                    uploadCallConfig: values.uploadCallConfig ?? UPLOAD_CALL_CONFIG_DEF,
                    notificationConfig: values.notificationConfig ?? NOTIFICATION_CONFIG_DEF,
                }
                saveUserConfig(userConfig);
                loginSuccess();
                return;
            }
            if (res?.code === REQUEST_CODE.connectError) {
                setErrorMessage("error.network");
            }
            else {
                setErrorMessage("error.api");
            }
        })
    }

    const onFinish = (values: LooseObject) => {

        sessionStorage.setItem(SESSION_STORAGE_KEY.token, values.token);

        getUserInfo({
            ...config.current,
            ...values,
        });
    };

    useEffect(() => {
        console.log(location);

        // @ts-ignore
        pluginSDK.userConfig.getUserConfig(function ({ errorCode, data }) {
            console.log(errorCode, data);
            if (errorCode === 0 && data) {
                const userConfig = JSON.parse(data);
                console.log(userConfig);
                form.setFieldsValue(userConfig);
                config.current = userConfig;

                // 已登录的与预装配置进行对比
                let sameConfig = true;

                // 有预装配置 走预装配置
                const preParamObjectStr = sessionStorage.getItem('preParamObject');
                if (preParamObjectStr) {
                    const preParamObject = JSON.parse(sessionStorage.getItem('preParamObject') || '');
                    if (preParamObject) {
                        const formParams: any = {};
                        Object.keys(preParamObject).forEach((item) => {
                            LOGIN_KEYS.forEach((element) => {
                                if (item.toLowerCase() === element.toLowerCase()) {
                                    formParams[element] = preParamObject[item];
                                    if (!sameConfig) {
                                        return;
                                    }
                                    sameConfig = preParamObject[item] === userConfig[item.toLowerCase()];
                                }
                            });
                        });
                        form.setFieldsValue({ ...formParams });
                    }
                }
                if (userConfig.autoLogin && sameConfig) {
                    onFinish(userConfig);
                }
            }
            else {
                // 有预装配置 走预装配置
                const preParamObjectStr = sessionStorage.getItem('preParamObject');
                if (!preParamObjectStr) {
                    return;
                }
                const preParamObject = JSON.parse(preParamObjectStr);
                const userInfo: any = { token: '' }
                if (preParamObject) {
                    Object.keys(preParamObject).forEach(item => {
                        userInfo[item.toLowerCase()] = preParamObject[item]
                    })
                    form.setFieldsValue({ ...userInfo })
                }
                onFinish(userInfo);
            }
        })
    }, [])

    return (
        <>
            {errorMessage && <div className={styles.errorDiv}>
                <div className={styles.errorMessage}>{formatMessage({ id: errorMessage })}</div>
            </div>}
            <div className={styles.homePage}>
                <Form
                    className={styles.form}
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFocus={onfocus}
                >
                    <div className={styles.formContent}>
                        <Form.Item
                            name="token"
                            rules={
                                [{
                                    required: true,
                                    message: formatMessage({ id: 'login.token.error' })
                                }]
                            }>
                            <Input.Password
                                placeholder={formatMessage({ id: 'login.token' })}
                                prefix={<Image src={LockIcon} preview={false} />}
                                iconRender={(visible) =>
                                    visible
                                        ? (<Image src={OpenIcon} preview={false} />)
                                        : (<Image src={CloseIcon} preview={false} />)
                                }
                            />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loginLoading}>
                            {formatMessage({ id: 'login.submit' })}
                        </Button>
                    </Form.Item>
                    <div className={styles.remember}>
                        <Checkbox checked={remember} onChange={onCheckChange}>
                            {formatMessage({ id: 'login.remember' })}
                        </Checkbox>
                    </div>
                </Form>
            </div>
            <Footer url="https://documentation.grandstream.com/knowledge-base/wave-crm-add-ins/#overview"
                message={formatMessage({ id: 'login.user.guide' })} />
        </>
    );
};

export default connect(
    ({ loading }: { loading: Loading }) => ({
        loginLoading: loading.effects['global/getUser']
    }),
    (dispatch: Dispatch) => ({
        getUser: () => dispatch({
            type: 'global/getUser',
        }),
        saveUserConfig: (payload: LooseObject) => dispatch({
            type: 'global/saveUserConfig',
            payload,
        }),
        save: (payload: LooseObject) => dispatch({
            type: 'global/save',
            payload
        }),
    })
)(IndexPage);
