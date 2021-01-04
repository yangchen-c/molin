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

// 权限管理
export function powerList(params) {
  return request({
    url: 'user/loginManager',
    method: 'get',
    params
  })
}

export function powerAdd(data) {
  return request({
    url: 'user/loginManager',
    method: 'post',
    data
  })
}

export function powerUpdate(data) {
  return request({
    url: 'user/loginManager',
    method: 'put',
    data
  })
}

export function powerDelete(params) {
  return request({
    url: 'user/loginManager',
    method: 'delete',
    params
  })
}



// 用户管理
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
    url: 'user/update',
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

// 余额更新
export function detailUpdate(data) {
  return request({
    url: 'detail',
    method: 'post',
    data
  })
}

// 收货地址管理
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
// 用户审核--------------------------------------------------------------------------------------------
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

// ------------------------------------------------------------------------------------
// 财务管理
export function detailList(params, params1) {
  return request({
    url: `detail/getPaging/${params.page}/${params.size}`,
    method: 'get',
    params: params1
  })
}
export function detailList1(params) {
  return request({
    url: 'detail',
    method: 'get',
    params
  })
}
export function detailAdd(data) {
  return request({
    url: 'detail',
    method: 'post',
    data
  })
}

export function detailUpdate1(data) {
  return request({
    url: 'detail',
    method: 'put',
    data
  })
}

export function detailDelete(params) {
  return request({
    url: 'detail',
    method: 'delete',
    params
  })
}
// -----------------------------------------------------------------------------------
// 会馆管理
export function shopList(params, params1) {
  return request({
    url: `shop/getPaging/${params.page}/${params.size}`,
    method: 'get',
    params: params1
  })
}

export function shopList1(params) {
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
// 场次管理
export function sessionList(params, params1) {
  return request({
    url: `session/getPaging/${params.page}/${params.size}`,
    method: 'get',
    params: params1
  })
}
export function sessionList1(params) {
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

// -----------------------------------------------------------------------------------
// 商品管理
export function goodsList(params, params1) {
  return request({
    url: `good/getPaging/${params.page}/${params.size}`,
    method: 'get',
    params: params1
  })
}
export function goodsAdd(data) {
  return request({
    url: 'good',
    method: 'post',
    data
  })
}

export function goodsUpdate(data) {
  return request({
    url: 'good',
    method: 'put',
    data
  })
}

export function goodsDelete(params) {
  return request({
    url: 'good',
    method: 'delete',
    params
  })
}
// -----------------------------------------------------------------------------------
// 拍品管理
export function sgsList(params, params1) {
  return request({
    url: `sg/getPaging/${params.page}/${params.size}/${params.num}`,
    method: 'get',
    params: params1
  })
}
export function sgsAdd(data) {
  return request({
    url: 'sg',
    method: 'post',
    data
  })
}

export function sgsUpdate(data) {
  return request({
    url: 'sg',
    method: 'put',
    data
  })
}

export function sgsDelete(params) {
  return request({
    url: 'sg',
    method: 'delete',
    params
  })
}
// -----------------------------------------------------------------------------------
// 买单卖单管理
export function orderList(params, params1) {
  return request({
    url: `order/getPaging/${params.page}/${params.size}`,
    method: 'get',
    params: params1
  })
}
// 提货订单
export function getOrderList(params, params1) {
  return request({
    url: `order/getPaging/${params.page}/${params.size}/${params.num}`,
    method: 'get',
    params: params1
  })
}
export function orderAdd(data) {
  return request({
    url: 'order',
    method: 'post',
    data
  })
}

export function orderUpdate(data) {
  return request({
    url: 'order',
    method: 'put',
    data
  })
}
//买单卖单快递修改

export function orderUpdate1(data) {
  return request({
    url: 'order/commitMaterial',
    method: 'post',
    data
  })
}
//买单卖单快递修改end

// 买单卖单取消返场
export function orderBack(data) {
  return request({
    url: 'order/cancelBack',
    method: 'post',
    data
  })
}
// 买单卖单取消返场end


// 买单卖单取消提货
export function takeBack(params, params1) {
  return request({
    url: `order/cancelMaterial/${params.orderId}`,
    method: 'get',
    params: params1
  })
}
// 买单卖单取消提货end
export function orderDelete(params) {
  return request({
    url: 'order',
    method: 'delete',
    params
  })
}


// -----------------------------------------------------------------------------------
// 代金券管理
export function couponList(params, params1) {
  return request({
    url: `coupon/getPaging/${params.page}/${params.size}`,
    method: 'get',
    params: params1
  })
}
export function couponAdd(data) {
  return request({
    url: 'coupon',
    method: 'post',
    data
  })
}

export function couponUpdate(data) {
  return request({
    url: 'coupon',
    method: 'put',
    data
  })
}

export function couponDelete(params) {
  return request({
    url: 'coupon',
    method: 'delete',
    params
  })
}


// -----------------------------------------------------------------------------------
// 轮播图管理
export function rotationList(params, params1) {
  return request({
    url: `rotation/getPaging/${params.page}/${params.size}`,
    method: 'get',
    params: params1
  })
}
export function rotationAdd(data) {
  return request({
    url: 'rotation',
    method: 'post',
    data
  })
}

export function rotationUpdate(data) {
  return request({
    url: 'rotation',
    method: 'put',
    data
  })
}

export function rotationDelete(params) {
  return request({
    url: 'rotation',
    method: 'delete',
    params
  })
}


// 测试用接口——————————————————————————————————————————
export function ceshiList(params) {
  return request({
    url: 'good/getGoodList/1/1/30',
    method: 'get',
    params
  })
}