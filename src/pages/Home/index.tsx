import React, { useCallback } from 'react';
import { connect, Dispatch, GlobalModelState, useIntl } from 'umi';
import { get } from 'lodash';
import moment from 'moment';
import { getNotificationBody, getValueByConfig } from '@/utils/utils';
import { CallAction, ConfigBlock, ConnectError, ConnectState, Footer } from '@/components';
import { MODULES, ZOHO_CRM, ZOHO_CRM_ADDRESS } from '@/constant';
import styles from './index.less'

interface HomeProps {
    getContact: (obj: LooseObject) => Promise<LooseObject>
    putCallInfo: (obj: LooseObject) => Promise<LooseObject>
    uploadCall: boolean
    tokenInfo: LooseObject
    showConfig: LooseObject
    host: string
    callState: Map<string, boolean>
}

type Who = {
    id: string
    name: string
}

type CallParams = {
    Call_Purpose: string
    Call_Start_Time: string
    Subject: string
    Call_Type: string
    $se_module: string
    Dialled_Number?: string
    Call_Duration?: string | number
    Call_Duration_in_seconds?: number
    Call_Result?: string
    Call_Status?: string
    Who_Id?: Who
    What_Id?: Who
    Description?: string,
}

const HomePage: React.FC<HomeProps> = (props) => {
    const {
        getContact,
        putCallInfo,
        uploadCall,
        tokenInfo,
        showConfig,
        host,
        callState,
    } = props;
    const { formatMessage } = useIntl();

    /**
     * 上报通话
     */
    const uploadCallInfo = useCallback((callNum: string, callStartTimeStamp: number, callEndTimeStamp: number, callDirection: string) => {
        if (!uploadCall) {
            return;
        }
        callNum = callNum.replace(/\b(0+)/gi, '');
        getContact({ callNum, ...tokenInfo, host }).then(contactInfo => {
            if (!contactInfo?.id) {
                return;
            }
            const duration = callEndTimeStamp - callStartTimeStamp;
            const duration_minutes = moment.duration(duration).hours() * 60 + moment.duration(duration).minutes()
            const duration_seconds = moment.duration(duration).seconds();
            const data: CallParams = {
                Call_Purpose: '-None-',
                Call_Start_Time: moment(callStartTimeStamp || undefined).format(),
                Subject: `${contactInfo.Full_Name || contactInfo?.Account_Name} 's call.`,
                Call_Type: callDirection,
                $se_module: contactInfo?.Module,
                Dialled_Number: callNum,
                Call_Duration: `${duration_minutes}:${duration_seconds}`,
                Call_Duration_in_seconds: moment.duration(duration).asSeconds()
            }
            contactInfo?.Module === MODULES.contact
                ? data.Who_Id = { id: contactInfo.id, name: contactInfo.Full_Name, }
                : data.What_Id = { id: contactInfo.id, name: contactInfo.Full_Name, }

            const params = {
                callInfo: {
                    data: [data]
                },
                tokenInfo,
            };
            putCallInfo(params).then(res => {
                console.log('putCallInfo:', params, res);
            });
        })
    }, [tokenInfo, host, uploadCall])

    const getUrl = (contact: LooseObject) => {
        const zoho_crm_host = get(ZOHO_CRM, host);
        return contact?.id ? zoho_crm_host + get(ZOHO_CRM_ADDRESS, contact?.Module) + contact.id : zoho_crm_host + ZOHO_CRM_ADDRESS.create_address;
    }

    /**
     * 通话事件的监听回调方法
     * 调用getContact 获取联系人信息
     * 根据showConfig -- 自定义通知展示信息，定义body
     *
     * @param callNum 通话号码
     */
    const initCallInfo = useCallback((callNum: string) => {
        // callNum 去除前面的0
        callNum = callNum.replace(/\b(0+)/gi, '');
        getContact({ callNum, ...tokenInfo, host }).then(contact => {
            console.log("callState", callState);
            if (!contact?.displayNotification || !callState.get(callNum)) {
                return;
            }
            const url = getUrl(contact);
            const pluginPath = sessionStorage.getItem('pluginPath');

            // body对象，
            const body: LooseObject = {
                logo: `<div style="margin-bottom: 12px"><img src="${pluginPath}/zoho.svg" alt=""/> ZohoCRM</div>`,
            }
            if (contact?.id) {
                // 将showConfig重复的删除
                const configList = [...new Set<string>(Object.values(showConfig))]
                console.log(configList);
                for (const key in configList) {
                    console.log(configList[key])
                    if (!configList[key]) {
                        continue;
                    }

                    // 取出联系人的信息用于展示
                    const configValue = getValueByConfig(contact, configList[key]);
                    console.log(configValue);
                    if (configList[key] === 'Phone') {
                        body[`config_${key}`] = `<div style="font-weight: bold">${callNum}</div>`
                    }
                    else if (configValue) {
                        body[`config_${key}`] = `<div style="font-weight: bold; display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 5;overflow: hidden;word-break: break-all;text-overflow: ellipsis;">${configValue}</div>`
                    }
                }
            }
            else {
                body.phone = `<div style="font-weight: bold;">${callNum}</div>`
            }
            body.action = `<div style="margin-top: 10px;display: flex;justify-content: flex-end;"><button style="background: none; border: none;">
                     <a href=${url} target="_blank" style="color: #62B0FF">
                         ${contact?.id ? formatMessage({ id: 'home.detail' }) : formatMessage({ id: 'home.edit' })}
                     </a>
                 </button></div>`;

            console.log('displayNotification');

            // getNotificationBody自定义的工具类方法，将对象的所有value拼接成富文本。
            // @ts-ignore
            pluginSDK.displayNotification({
                notificationBody: getNotificationBody(body),
            })
        })
    }, [tokenInfo, host, showConfig, callState]);

    return (
        <>
            <CallAction uploadCallInfo={uploadCallInfo} initCallInfo={initCallInfo} />
            <ConnectError />
            <div className={styles.homePage}>
                <ConnectState />
                <ConfigBlock />
            </div>
            <Footer url={get(ZOHO_CRM, host)} message={formatMessage({ id: 'home.toCRM' })} />
        </>
    )
}

export default connect(
    ({ global }: { global: GlobalModelState }) => ({
        uploadCall: global.uploadCall,
        tokenInfo: global.tokenInfo,
        host: global.host,
        showConfig: global.showConfig,
        callState: global.callState,
    }),
    (dispatch: Dispatch) => ({
        getContact: (payload: LooseObject) => dispatch({
            type: 'home/getContact',
            payload,
        }),
        putCallInfo: (payload: LooseObject) => dispatch({
            type: 'home/putCallInfo',
            payload
        }),
    })
)(HomePage);
