import request from "../utils/request";
const baseUrl = "/api/shopCar";

// 查询
export function queryList(content) {
  return request({
    url: `${baseUrl}/get`,
    method: "get",
    params: {
      content,
    },
  });
}

// 增加
export function add(item) {
  return request({
    url: `${baseUrl}/add`,
    method: "post",
    data: item,
  });
}

// 修改单个
export function updateSingle(cid) {
  return request({
    url: `${baseUrl}/updateSingle`,
    method: "post",
    params: { cid },
  });
}

// 全选/取消
export function updateEntire() {
  return request({
    url: `${baseUrl}/updateEntire`,
    method: "post",
  });
}

// 删除
export function del(cid) {
  return request({
    url: `${baseUrl}/delete`,
    method: "post",
    params: {
      cid,
    },
  });
}

//下单
export function purchase(aid) {
  return request({
    url: "/api/purchase/do",
    method: "post",
    params: {
      aid,
    },
  });
}
