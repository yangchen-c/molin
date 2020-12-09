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
