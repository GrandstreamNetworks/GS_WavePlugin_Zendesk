import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Form, Image, Select } from 'antd';
import { connect, Dispatch, history, Loading, useIntl } from 'umi';
import { get } from 'lodash';
import { REQUEST_CODE, SESSION_STORAGE_KEY, ZOHO_CONFIG, ZOHO_HOST } from '@/constant';
import { CountdownButton, Footer } from '@/components';
import SelectIcon from '../../asset/login/service-line.svg';
import DownIcon from '../../asset/login/down.svg';
import Change from '../../asset/login/change.svg';
import styles from './index.less';

const { Option } = Select;

interface AuthProps {
    getDeviceCode: (obj: LooseObject) => Promise<LooseObject>;
    getDeviceToken: (obj: LooseObject) => Promise<LooseObject>;
    getUser: (obj: LooseObject) => Promise<LooseObject>;
    saveUserConfig: (obj: LooseObject) => void;
    save: (obj: LooseObject) => void;
    loginLoading: boolean | undefined
}

/**
 * 鉴权页
 *
 * @returns React.ReactElement
 * @param props
 */
const IndexPage: React.FC<AuthProps> = (props) => {
    const {
        getDeviceCode,
        getDeviceToken,
        getUser,
        saveUserConfig,
        save,
        loginLoading
    } = props;
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [remember, setRemember] = useState<boolean>(true);
    const [showTime, setShowTime] = useState<boolean>(false);
    const [loginState, setLoginState] = useState<boolean>(false);
    const [host, setHost] = useState<string>('');
    const [form] = Form.useForm();
    const code = useRef(null);

    const { formatMessage } = useIntl();

    /**
     * 自动登录状态更改
     * @param e
     */
    const onCheckChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setRemember(e.target.checked);
    };

    /**
     * 初始化 errorMessage
     * 关闭异常信息提示
     */
    const onfocus = () => {
        setErrorMessage('');
    };

    const closeTime = useCallback(() => {
        setShowTime(false);
    }, []);

    const toChangeHost = () => {
        setLoginState(false);
    }

    const onSelectChange = (value: string) => {
        setHost(value);
    }

    /**
     * 获取用户信息
     * @param {Object} userConfig 配置信息
     */
    const getUserInfo = (userConfig: LooseObject) => {
        const config = {
            ...userConfig,
            tokenInfo: userConfig.tokenInfo ?? {
                ...userConfig,
            },
            showConfig: userConfig.showConfig ?? {
                first: 'Name',
                second: 'Phone',
                third: 'None',
                forth: 'None',
                fifth: 'None',
            }
        }
        getUser(config).then(res => {
            if (res?.id) {
                // 获取token成功，保存token信息
                saveUserConfig(config);
                save(config);
                history.replace({ pathname: '/home' });
            }
        });
    }

    /**
     * 获取Device code
     * 发送权限申请，获取用户授权URL
     */
    const login = () => {
        // 立即关闭倒计时
        setShowTime(false);
        getDeviceCode({
            host,
            data: {
                client_id: get(ZOHO_CONFIG, ['client_id', host]),
                grant_type: 'device_request',
                scope: ZOHO_CONFIG.scope,
                access_type: 'offline',
            }
        }).then(res => {
            console.log(res);
            if (res?.code === REQUEST_CODE.connectError) {
                setErrorMessage('error.network');
                return;
            }
            if (res?.status || res?.error) {
                setErrorMessage('error.message');
                return;
            }
            setLoginState(true);
            const { verification_uri_complete, device_code } = res;

            // verification_uri_complete 用户授权URL
            if (verification_uri_complete && device_code) {
                code.current = device_code;
                window.open(verification_uri_complete);
            }
        });
    }

    /**
     * 授权后，获取token 信息
     */
    const loginImmediately = useCallback(() => {
        getDeviceToken({
            host,
            data: {
                client_id: get(ZOHO_CONFIG, ['client_id', host]),
                client_secret: get(ZOHO_CONFIG, ['client_secret', host]),
                grant_type: 'device_token',
                code: code.current,
            }
        }).then(tokenInfo => {
            if (tokenInfo.error) {
                if (tokenInfo.error === 'access_denied' || tokenInfo.error === 'expired') {
                    setLoginState(false);
                }
                else {
                    setShowTime(true);
                }
                if (tokenInfo.error !== 'authorization_pending') {
                    setErrorMessage(tokenInfo.error);
                }
            }
            if (tokenInfo.access_token) {
                const userConfig = {
                    tokenInfo,
                    autoLogin: remember, // 自动登录
                    host,
                    uploadCall: true, // 上报通话
                };
                getUserInfo(userConfig);
            }
        })
    }, [host, remember]);

    useEffect(() => {
        // 获取保存的信息
        // @ts-ignore
        pluginSDK.userConfig.getUserConfig(function ({ errorCode, data, }: { errorCode: number, data: string }) {
            console.log(errorCode, data);
            if (errorCode === 0 && data) {
                const userConfig = JSON.parse(data);

                form.setFieldsValue({ host: userConfig.host })
                setHost(userConfig.host)
                sessionStorage.setItem(
                    SESSION_STORAGE_KEY.apiHost,
                    userConfig.tokenInfo?.api_domain || userConfig.api_domain,
                );
                sessionStorage.setItem(
                    SESSION_STORAGE_KEY.token,
                    userConfig.tokenInfo?.access_token,
                );
                if (userConfig.autoLogin) {
                    getUserInfo(userConfig);
                }
            }
        });
    }, []);

    return (
        <>
            {errorMessage && (
                <div className={styles.errorDiv}>
                    <div className={styles.errorMessage}>
                        {formatMessage({ id: errorMessage })}
                    </div>
                </div>
            )}
            <div className={styles.homePage}>
                <div hidden={loginState}>
                    <Form
                        className={styles.form}
                        form={form}
                        layout="vertical"
                        onFinish={login}
                        onFocus={onfocus}
                    >
                        <Form.Item style={{ marginBottom: 0 }}>
                            <div style={{ marginBottom: '64px' }}>
                                <div className={styles.selectIcon}>
                                    <Image src={SelectIcon} preview={false} />
                                </div>
                                <Form.Item
                                    name="host"
                                    rules={[
                                        {
                                            required: true,
                                            message: formatMessage({ id: 'login.host.error' }),
                                        },
                                    ]}
                                    initialValue="US"
                                >
                                    <Select
                                        placeholder={formatMessage({ id: 'login.host' })}
                                        suffixIcon={<Image src={DownIcon} preview={false} />}
                                        onChange={onSelectChange}
                                    >
                                        <Option value="US">{ZOHO_HOST.US}</Option>
                                        <Option value="CN">{ZOHO_HOST.CN}</Option>
                                        <Option value="EU">{ZOHO_HOST.EU}</Option>
                                        <Option value="IN">{ZOHO_HOST.IN}</Option>
                                        <Option value="AU">{ZOHO_HOST.AU}</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loginLoading}>
                                {formatMessage({ id: 'login.identity.authorization' })}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className={styles.form} hidden={!loginState}>
                    <div className={styles.zohoHost}>
                        <span className={styles.hostSpan}>{get(ZOHO_HOST, host)}</span>
                        <div className={styles.changeHost} onClick={toChangeHost}>
                            <Image src={Change} preview={false} />
                            <span>Switch Server</span>
                        </div>
                    </div>
                    <CountdownButton showTime={showTime} closeTime={closeTime} loginImmediately={loginImmediately} />
                    <div className={styles.remember}>
                        <Checkbox checked={remember} onChange={onCheckChange}>
                            {formatMessage({ id: 'login.remember' })}
                        </Checkbox>
                    </div>
                </div>
            </div>
            {!loginState &&
                <Footer url='https://documentation.grandstream.com/knowledge-base/wave-crm-add-ins/#overview'
                    message={formatMessage({ id: 'login.user.guide' })} />}
            {loginState && <Footer url='https://www.zoho.com/crm/developer/docs/api/v2/api-limits.html'
                message={formatMessage({ id: 'login.learn.package' })} />}
        </>
    )
};

export default connect(
    ({ loading }: { loading: Loading }) => ({
        loginLoading:
            loading.effects['global/getDeviceCode'] || loading.effects['global/getUser'],
    }),
    (dispatch: Dispatch) => ({
        getDeviceCode: (payload: LooseObject) =>
            dispatch({
                type: 'global/getDeviceCode',
                payload,
            }),
        getDeviceToken: (payload: LooseObject) =>
            dispatch({
                type: 'global/getDeviceToken',
                payload,
            }),
        getUser: (payload: LooseObject) =>
            dispatch({
                type: 'global/getUser',
                payload,
            }),
        saveUserConfig: (payload: LooseObject) =>
            dispatch({
                type: 'global/saveUserConfig',
                payload,
            }),
        save: (payload: LooseObject) => dispatch({
            type: 'global/save',
            payload
        })
    }),
)(IndexPage);
