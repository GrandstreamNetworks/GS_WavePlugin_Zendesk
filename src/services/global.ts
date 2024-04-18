import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 获取联系人列表
 * @returns
 */
export function getUser(params: any) {
    return request(`https://api.getbase.com/v2/users/me`);
}
