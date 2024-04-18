/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { formatMessage, Response } from 'umi'
import { extend } from 'umi-request';
import { REQUEST_CODE, SESSION_STORAGE_KEY } from '@/constant'

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
    'Content-Type': 'application/json; charset=utf-8',
    // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    // method: 'post',
    getResponse: false, // 是否获取源 response, 返回结果将包裹一层
});

request.interceptors.request.use((url, options) => {
    const headers = { ...options.headers };
    const token = sessionStorage.getItem(SESSION_STORAGE_KEY.token);
    return {
        url,
        options: {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                ...headers,
            },
        },
    };
});

request.interceptors.response.use((response: Response) => {
    return response;
});

export default request;
