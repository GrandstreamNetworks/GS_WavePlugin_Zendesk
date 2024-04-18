import request from "@/utils/request";

export function getContact(params: any) {
    return request(`https://api.getbase.com/v3/contacts/search`, {
        method: 'POST',
        body: JSON.stringify(params),
    })
}

export function getLead(params: any) {
    return request(`https://api.getbase.com/v3/leads/search`, {
        method: 'POST',
        body: JSON.stringify(params),
    })
}

export function getContactInfo(id: string) {
    return request(`https://api.getbase.com/v2/contacts/${id}`)
}

export function getLeadInfo(id: string) {
    return request(`https://api.getbase.com/v2/leads/${id}`)
}

export function putCallInfo(params: LooseObject) {
    return request(`https://api.getbase.com/v2/calls`, {
        method: 'POST',
        body: JSON.stringify(params)
    })
}

export function createContact(params: LooseObject) {
    return request(`https://api.getbase.com/v2/contacts`, {
        method: 'POST',
        body: JSON.stringify(params)
    })
}

export function createLead(params: LooseObject) {
    return request(`https://api.getbase.com/v2/leads`, {
        method: 'POST',
        body: JSON.stringify(params)
    })
}