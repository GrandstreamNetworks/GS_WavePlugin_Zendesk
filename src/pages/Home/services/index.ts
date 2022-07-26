import { SESSION_STORAGE_KEY } from '@/constant';
import request from '../../../utils/request';

export function getContact(params: string) {
    const apiHost = sessionStorage.getItem(SESSION_STORAGE_KEY.apiHost);
    return request(`${apiHost}/crm/v2/Contacts/search?phone=${params}`)
}

export function getAccount(params: string) {
    const apiHost = sessionStorage.getItem(SESSION_STORAGE_KEY.apiHost);
    return request(`${apiHost}/crm/v2/Accounts/search?phone=${params}`)
}

export function getLead(params: string) {
    const apiHost = sessionStorage.getItem(SESSION_STORAGE_KEY.apiHost);
    return request(`${apiHost}/crm/v2/Leads/search?phone=${params}`)
}

export function putCallInfo(params: LooseObject) {
    const apiHost = sessionStorage.getItem(SESSION_STORAGE_KEY.apiHost);
    return request(`${apiHost}/crm/v2/Calls`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        }
    });
}