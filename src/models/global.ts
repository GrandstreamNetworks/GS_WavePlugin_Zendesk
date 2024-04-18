import { getUser } from '@/services/global';
import { get } from 'lodash';
import { Effect, Reducer, history } from 'umi';

export interface GlobalModelState {
    userConfig: LooseObject
    user: LooseObject
    connectState: string
    uploadCall: true
    showConfig: LooseObject
    callState: Map<string, boolean>
}

export interface GlobalModelType {
    namespace: string;
    state: GlobalModelState;
    effects: {
        getUser: Effect
        saveUserConfig: Effect
        logout: Effect
        userConfigChange: Effect
    };
    reducers: {
        save: Reducer<GlobalModelState>;
    };
}

const GlobalModal: GlobalModelType = {
    namespace: 'global',
    state: {
        user: {},
        userConfig: {},
        connectState: 'SUCCESS',
        uploadCall: true,
        showConfig: {},
        callState: new Map(),
    },

    effects: {
        * getUser(_, { call, put }): any {
            const res = yield call(getUser);
            let connectState = res?.code || 'SUCCESS';
            const user = get(res, ['data']) || {};
            if (user.id) {
                yield put({
                    type: 'save',
                    payload: {
                        user,
                        connectState,
                    },
                });
                return user;
            }
            yield put({
                type: 'save',
                payload: {
                    connectState,
                },
            });
            return res;
        },

        * logout(_, { call, put, select }) {
            const { userConfig } = yield select((state: any) => state.global);
            userConfig.autoLogin = false;
            userConfig.token = undefined;
            yield put({
                type: 'saveUserConfig',
                payload: userConfig
            });
            history.replace({ pathname: "login" });
        },

        * userConfigChange({ payload }, { put, select }) {
            const { userConfig } = yield select((state: any) => state.global);
            const newConfig = {
                ...userConfig,
                ...payload,
            }
            yield put({
                type: 'saveUserConfig',
                payload: newConfig,
            })
        },

        * saveUserConfig({ payload }, { put }) {
            console.log(payload);
            // @ts-ignore
            pluginSDK.userConfig.addUserConfig({ userConfig: JSON.stringify(payload) }, function ({ errorCode }) {
                console.log(errorCode);
            });
            yield put({
                type: 'save',
                payload: {
                    userConfig: payload,
                },
            });
        },
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },
};

export default GlobalModal;
