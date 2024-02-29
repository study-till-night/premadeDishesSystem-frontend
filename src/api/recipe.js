import request from "../utils/request";
const baseUrl = "/api/recipe";

// 分页查询
export function queryPage(pid, pNum, uid) {
  return request({
    url: `${baseUrl}/get`,
    method: "get",
    params: {
      uid,
      pid,
      pNum,
    },
  });
}

// 增加
export function add(recipe) {
  return request({
    url: `${baseUrl}/add`,
    method: "post",
    data: recipe,
  });
}

// 修改
export function update(recipe) {
  return request({
    url: `${baseUrl}/update`,
    method: "post",
    data: recipe,
  });
}

// 点赞
export function addLove(rid) {
  return request({
    url: `${baseUrl}/love`,
    method: "post",
    params: {
      rid,
    },
  });
}
