import request from 'umi-request';

export async function queryHome() {
  return request('/api/home');
}

export async function submitHome(params) {
  return request('/api/home', {
    method: 'POST',
    data: params,
  });
}
