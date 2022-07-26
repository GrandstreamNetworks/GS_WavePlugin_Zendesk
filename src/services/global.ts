import { stringify } from 'qs';
import { get } from 'lodash';
import request from '../utils/request';
import { SESSION_STORAGE_KEY, ZOHO_HOST } from '@/constant';

/**
 * 获取联系人列表
 * @returns
 */
export function getUser() {
    const apiHost = sessionStorage.getItem(SESSION_STORAGE_KEY.apiHost);
    return request(`${apiHost}/crm/v2/users?type=CurrentUser`);
}

export function getToken(params: LooseObject) {
    const { host, data } = params;
    return request(`${get(ZOHO_HOST, host)}/oauth/v2/token`, {
        method: 'POST',
        body: stringify(data)
    });
}

export function getDeviceCode(params: LooseObject) {
    const { host, data } = params;
    return request(`${get(ZOHO_HOST, host)}/oauth/v3/device/code`, {
        method: 'POST',
        body: stringify(data),
    })
}

export function getDeviceToken(params: LooseObject) {
    const { host, data } = params;
    return request(`${get(ZOHO_HOST, host)}/oauth/v3/device/token`, {
        method: 'POST',
        body: stringify(data),
    })
}

export function revokeToken(params: LooseObject) {
    const { host, token } = params;
    return request(`${get(ZOHO_HOST, host)}/oauth/v2/token/revoke?token=${token}`, {
        method: 'POST',
    })
}