const ZOHO_CONFIG = {
    client_id: {
        US: '1004.11V78VI9SR692N7WFB2S5Y0CCO3GMD',
        CN: '1004.OGQ8QSHDINMK0XFEH3LOSS0C9WW6KI',
        EU: '1004.11V78VI9SR692N7WFB2S5Y0CCO3GMD',
        IN: '1004.11V78VI9SR692N7WFB2S5Y0CCO3GMD',
        AU: '1004.11V78VI9SR692N7WFB2S5Y0CCO3GMD',
    },
    client_secret: {
        US: '947e57aaa187dc27404ec7c359b86a64af42cd0629',
        CN: '635fd7aac6c4fa82396ce0032c11fa8ad4062c9e7e',
        EU: '947e57aaa187dc27404ec7c359b86a64af42cd0629',
        IN: '947e57aaa187dc27404ec7c359b86a64af42cd0629',
        AU: '947e57aaa187dc27404ec7c359b86a64af42cd0629',
    },
    scope: 'ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.ALL',
}

/**
 * zoho CRM 服务器地址
 * @type {{EU: string, AU: string, IN: string, CN: string, US: string}}
 */
const ZOHO_CRM = {
    US: 'https://crm.zoho.com',
    CN: 'https://crm.zoho.com.cn',
    EU: 'https://crm.zoho.eu',
    IN: 'https://crm.zoho.in',
    AU: 'https://crm.zoho.com.au',
};

/**
 * zoho CRM URL
 * @type {{create_address: string, contacts_address: string}}
 */
const ZOHO_CRM_ADDRESS = {
    Contacts: `/crm/tab/Contacts/`,
    Accounts: `/crm/tab/Accounts/`,
    Leads: `/crm/tab/Leads/`,
    create_address: `/crm/tab/Contacts/create`,
};

/**
 * zoho 服务器地址
 * @type {{EU: string, AU: string, IN: string, CN: string, US: string}}
 */
const ZOHO_HOST = {
    US: 'https://accounts.zoho.com',
    CN: 'https://accounts.zoho.com.cn',
    EU: 'https://accounts.zoho.eu',
    IN: 'https://accounts.zoho.in',
    AU: 'https://accounts.zoho.com.au',
};

/**
 * 全局消息弹窗属性
 * @type {{duration_2: number, duration_1: number, duration_0: number, success: string, warning: string, error: string, duration_5: number, timeout: string, duration_4: number, info: string, duration_3: number}}
 */
const GLOBAL_MESSAGE = {
    timeout: 'global_message_timeout',
    error: 'global_message_error',
    success: 'global_message_success',
    info: 'global_message_info',
    warning: 'global_message_warning',
    duration_0: 0,
    duration_1: 1,
    duration_2: 2,
    duration_3: 3,
    duration_4: 4,
    duration_5: 5,
};

const REQUEST_CODE = {
    ok: 200,
    created: 201,
    deleted: 204,
    dataError: 400,
    noAuthority: 401,
    noFound: 404,
    serverError: 500,
    gatewayError: 502,
    serverOverload: 503,
    serverTimeout: 504,
    connectError: 'CONNECT_ERROR',
    invalidToken: 'INVALID_TOKEN',
    reConnect: 'RECONNECT',
};

/**
 * sessionStorage key
 * @type {{apiHost: string, host: string, token: string}}
 */
const SESSION_STORAGE_KEY = {
    token: 'token',
    host: 'host',
    apiHost: 'apiHost',
};

/**
 * 监听wave事件key
 * @type {{recvP2PIncomingCall: string, answerP2PCall: string, rejectP2PCall: string, hangupP2PCall: string}}
 */
const EVENT_KEY = {
    recvP2PIncomingCall: 'onRecvP2PIncomingCall', // 收到来电
    answerP2PCall: 'onAnswerP2PCall', // 接听来电
    hangupP2PCall: 'onHangupP2PCall', // 挂断来电
    rejectP2PCall: 'onRejectP2PCall', // 拒接来电
    initP2PCall: 'onInitP2PCall', // wave发去呼叫
    p2PCallCanceled: 'onP2PCallCanceled', // 未接来电、去电
    initPluginWindowOk: 'onInitPluginWindowOk', //初始化窗口成功
};

const WAVE_CALL_TYPE = {
    in: 'Inbound',
    out: 'Outbound',
    miss: 'Missed',
};

const DATE_FORMAT = {
    format_1: 'YYYY/MM/DD',
    format_2: 'YYYY/MM/DD HH/mm/ss',
    format_3: 'YYYY-MM-DD HH-mm-ss',
    format_4: 'YYYY-MM-DDTHH:mm:ss+ssK',
};

const MODULES = {
    contact: 'Contacts',
    account: 'Accounts',
    lead: 'Leads',
};

type CONFIG_SHOW = {
    None: null | undefined
    Name: string[],
    Phone: string,
    Fax: string,
    Email: string,
    Industry: string,
    Company: string,
    Title: string[],
    Department: string,
    Description: string,
}

const CONFIG_SHOW: CONFIG_SHOW = {
    None: undefined,
    Name: ['Full_Name', 'Account_Name'],
    Phone: "Phone",
    Fax: 'Fax',
    Email: 'Email',
    Industry: 'Industry',
    Company: 'Company',
    Title: ['Title', 'Designation'],
    Department: 'Department',
    Description: 'Description',
}

const NotificationConfig = {
    first: 'information 1',
    second: 'information 2',
    third: 'information 3',
    forth: 'information 4',
    fifth: 'information 5'
}

export {
    CONFIG_SHOW,
    NotificationConfig,
    ZOHO_CONFIG,
    ZOHO_CRM,
    ZOHO_CRM_ADDRESS,
    ZOHO_HOST,
    GLOBAL_MESSAGE,
    REQUEST_CODE,
    SESSION_STORAGE_KEY,
    EVENT_KEY,
    WAVE_CALL_TYPE,
    DATE_FORMAT,
    MODULES,
};
