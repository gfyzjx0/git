import request from '@/utils/request';

const rootPath='localhosy:8000/auth_user'

export async function queryStoreData(params) {
    
    return request(`${rootPath}/user/store`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function queryDelData(params) {
   
    return request(`${rootPath}/user/destroy`, {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function queryListData(params) {
    
    return request(`${rootPath}/user/list`, {
        method: 'POST',
        data: {
            ...params,
        }
    });
}

export async function queryProvince() {
  
    return request(`${rootPath}/province`);
}

export async function queryCity(params) {
    
    return request(`${rootPath}/city`, {
        method: 'POST',
        data: {
            ...params,
        }
    });
}