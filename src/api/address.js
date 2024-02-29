import request from "../utils/request";
const baseUrl = "/api/address";

// 提交订单时查询
export function queryList() {
  return request({
    url: `${baseUrl}/getList`,
    method: "get",
  });
}

// 分页查询
export function queryPage(uid, pid, pNum) {
  return request({
    url: `${baseUrl}/getPage`,
    method: "get",
    params: {
      uid,
      pid,
      pNum,
    },
  });
}

// 增加
export function add(address) {
  return request({
    url: `${baseUrl}/add`,
    method: "post",
    data: address,
  });
}

// 修改
export function update(address) {
  return request({
    url: `${baseUrl}/update`,
    method: "post",
    data: address,
  });
}

// 删除
export function del(aid) {
  return request({
    url: `${baseUrl}/delete`,
    method: "post",
    params: {
      aid,
    },
  });
}

// 修改默认地址
export function ChooseDefault(aid) {
  return request({
    url: `${baseUrl}/default`,
    method: "post",
    params: {
      aid,
    },
  });
}
