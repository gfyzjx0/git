import request from 'umi-request';

export async function queryPerson(params) {
  return request('/api/person', {
    params,
  });
}
export async function removePerson(params) {
  return request('/api/person', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addPerson(params) {
  return request('/api/person', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updatePerson(params) {
  return request('/api/person', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
