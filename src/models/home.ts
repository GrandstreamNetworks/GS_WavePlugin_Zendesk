import { createContact, createLead, getContact, getContactInfo, getLead, getLeadInfo, putCallInfo } from '@/services/home';
import { get } from 'lodash';
import { Effect, Reducer } from 'umi';

export interface HomeModelState {
}

export interface HomeModelType {
    namespace: string
    state: HomeModelState
    effects: {
        getContact: Effect
        putCallInfo: Effect
        createNewContact: Effect
    }
    reducers: {
        save: Reducer<HomeModelState>
    }
}

const HomeModal: HomeModelType = {
    namespace: 'home',
    state: {},

    effects: {
        * getContact({ payload }, { call, put }): any {
            const params = {
                items: [{
                    data: {
                        query: {
                            filter: {
                                or: [
                                    {
                                        filter: {
                                            attribute: {
                                                name: "phone_numbers.phone"
                                            },
                                            parameter: {
                                                contains: payload.callNum
                                            }
                                        }
                                    },
                                    {
                                        filter: {
                                            attribute: {
                                                name: "phone_numbers.mobile"
                                            },
                                            parameter: {
                                                contains: payload.callNum
                                            }
                                        }
                                    },
                                    {
                                        filter: {
                                            attribute: {
                                                name: "fax"
                                            },
                                            parameter: {
                                                contains: payload.callNum
                                            }
                                        }
                                    },
                                ]
                            }
                        }
                    }
                }]
            }

            let res = yield call(getContact, params);
            // 异常判断
            let connectState = res?.code || 'SUCCESS';
            yield put({
                type: 'global/save',
                payload: {
                    connectState,
                }
            })
            const contact = get(res, ['items', 0, 'items', 0, 'data']) || {};
            if (!contact.id) {
                res = yield call(getLead, params);
                const lead = get(res, ['items', 0, 'items', 0, 'data']) || {};
                if (!lead.id) {
                    lead.displayNotification = connectState === 'SUCCESS';
                    return lead;
                }
                const leadInfoRes = yield call(getLeadInfo, lead.id);
                const leadInfo = get(leadInfoRes, ['data']) || {};
                leadInfo.resource_type = 'lead';
                leadInfo.displayNotification = connectState === 'SUCCESS';
                return leadInfo;
            }
            const contactInfoRes = yield call(getContactInfo, contact.id);
            const contactInfo = get(contactInfoRes, ['data']) || {};
            contactInfo.resource_type = 'contact';
            contactInfo.displayNotification = connectState === 'SUCCESS';
            return contactInfo;
        },

        * putCallInfo({ payload }, { call, put }): any {
            let res = yield call(putCallInfo, payload);
            let connectState = res?.code || 'SUCCESS';
            yield put({
                type: 'global/save', payload: { connectState, }
            })
            return res;
        },

        * createNewContact({ payload }, { call, put }): any {
            const { contactInfo, attributesType } = payload;
            let res = null;
            switch (attributesType) {
                case 'Lead':
                    res = yield call(createLead, contactInfo);
                    break
                default:
                    res = yield call(createContact, contactInfo);
                    break
            }
            let connectState = res?.code || 'SUCCESS';
            yield put({
                type: 'global/save', payload: { connectState }
            })
            return res.data ? {
                ...res.data,
                resource_type: attributesType
            } : {};
        }


    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload }
        }
    }
}

export default HomeModal;
