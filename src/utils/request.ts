/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { formatMessage, Response } from 'umi'
import { extend, RequestOptionsInit } from 'umi-request';
import { REQUEST_CODE, SESSION_STORAGE_KEY } from '@/constant'

type RequestItem = {
    id: number
    url: string
    options: RequestOptionsInit
    reloadTimes: number
}

const requestList: RequestItem[] = [];

const exist = (url: string): number => {
    for (const index in requestList) {
        if (requestList[index].url === url) {
            return parseInt(index);
        }
    }
    return -1;
}

/**
 * 异常处理程序
 */
const errorRequest = (response: Response): Response | Promise<any> => {
    const index = exist(response.url);
    if (index !== -1) {
        const needReloadRequest = requestList[index];
        if (response && (response.status === REQUEST_CODE.serverTimeout || response.status === REQUEST_CODE.serverOverload)) {
            if (needReloadRequest.reloadTimes <= 1) {
                needReloadRequest.reloadTimes++;
                return new Promise(resolve => {
                    setTimeout(resolve, needReloadRequest.reloadTimes * 1000);
                }).then(() => {
                    return request(needReloadRequest.url, needReloadRequest.options);
                })
            } else {
                requestList.splice(index, 1);
                return {
                    code: REQUEST_CODE.connectError,
                    error: 'Connection exception.'
                };
            }
        }
    }
    index !== -1 && requestList.splice(index, 1);
    return response;
};

/**
 * 异常处理程序
 */
const errorHandler = (error: any): Response => {
    if (error.message === "Failed to fetch") {
        return {
            code: REQUEST_CODE.connectError,
            error: formatMessage({ id: 'error.connect' }),
        }
    }
    const { response } = error;
    return {
        code: response?.status === REQUEST_CODE.noAuthority ? REQUEST_CODE.invalidToken : '',
        status: response?.status,
        error: response?.statusText,
        response,
    };
}

/**
 * 配置request请求时的默认参数
 */
const request = extend({
    errorHandler, // 默认错误处理
    credentials: 'include', // 默认请求是否带上cookie
    prefix: '', // constants.REQUEST_PERFIX,
    // requestType: 'json',
    timeout: 5000,
    Accept: 'application/json',
    // 'Content-Type': 'application/json; charset=utf-8',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    // method: 'post',
    getResponse: false, // 是否获取源 response, 返回结果将包裹一层
});

request.interceptors.request.use((url, options) => {
    const headers = { ...options.headers };
    if (exist(url) === -1) {
        const timer = new Date().getTime();
        requestList.push({
            id: timer,
            url,
            options: {
                ...options,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    ...headers,
                    Authorization: `Zoho-oauthtoken ${sessionStorage.getItem(SESSION_STORAGE_KEY.token)}`,
                },
            },
            reloadTimes: 0,
        })
    }
    return {
        url,
        options: {
            ...options,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                ...headers,
                Authorization: `Zoho-oauthtoken ${sessionStorage.getItem(SESSION_STORAGE_KEY.token)}`,
                
            },
        },
    };
});

request.interceptors.response.use((response: Response) => {
    return errorRequest(response);
});

export default request;
