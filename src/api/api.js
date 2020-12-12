import request from '@/utils/request'

// 上传文件
// const uploadPath = process.env.VUE_APP_BASE_API + '/upload'
const uploadPath = 'https://upload.qiniup.com/'
export { uploadPath }

export function uploadFile(data) {
  return request({
    url: '/upload',
    method: 'post',
    data
  })
}


// yc用户管理
export function userList(params, params1) {
  return request({
    url: `user/getPaging/${params.page}/${params.size}`,
    method: 'get',
    params: params1
  })
}

export function userAdd(data) {
  return request({
    url: 'user',
    method: 'post',
    data
  })
}

export function userUpdate(data) {
  return request({
    url: 'user',
    method: 'put',
    data
  })
}

export function userDelete(params) {
  return request({
    url: 'user',
    method: 'delete',
    params
  })
}
// yc收货地址管理
export function addressList(params) {
  return request({
    url: 'address/getAddressList',
    method: 'get',
    params
  })
}

export function addressDelete(params) {
  return request({
    url: 'address',
    method: 'delete',
    params
  })
}
// yc用户审核--------------------------------------------------------------------------------------------
export function uCheckList(params, params1) {
  return request({
    url: `examine/getPaging/${params.page}/${params.size}`,
    method: 'get',
    params: params1
  })
}
export function uCheckAdd(data) {
  return request({
    url: 'examine',
    method: 'post',
    data
  })
}

export function uCheckUpdate(data) {
  return request({
    url: 'examine',
    method: 'put',
    data
  })
}

export function uCheckDelete(params) {
  return request({
    url: 'examine',
    method: 'delete',
    params
  })
}


// -----------------------------------------------------------------------------------
// yc会馆管理
export function shopList(params) {
  return request({
    url: 'shop',
    method: 'get',
    params
  })
}
export function shopAdd(data) {
  return request({
    url: 'shop',
    method: 'post',
    data
  })
}

export function shopUpdate(data) {
  return request({
    url: 'shop',
    method: 'put',
    data
  })
}

export function shopDelete(params) {
  return request({
    url: 'shop',
    method: 'delete',
    params
  })
}

// -----------------------------------------------------------------------------------
// yc场次管理
export function sessionList(params) {
  return request({
    url: 'session',
    method: 'get',
    params
  })
}
export function sessionAdd(data) {
  return request({
    url: 'session',
    method: 'post',
    data
  })
}

export function sessionUpdate(data) {
  return request({
    url: 'session',
    method: 'put',
    data
  })
}

export function sessionDelete(params) {
  return request({
    url: 'session',
    method: 'delete',
    params
  })
}
