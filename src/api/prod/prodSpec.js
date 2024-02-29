import request from "@/utils/request";
const baseUrl = "/api/prodSpec";

// 查询
export function queryList(pid, pageId, pNum) {
  return request({
    url: `${baseUrl}/get`,
    method: "get",
    params: {
      pid,
      pageId,
      pNum,
    },
  });
}

// 增加
export function add(spec) {
  return request({
    url: `${baseUrl}/add`,
    method: "post",
    data: spec,
  });
}

// 启用该规格
export function updateEnabled(sid) {
  return request({
    url: `${baseUrl}/enable`,
    method: "post",
    params: {
      sid,
    },
  });
}

// 修改
export function update(spec) {
  return request({
    url: `${baseUrl}/update`,
    method: "post",
    data: spec,
  });
}

// 删除
export function del(sid) {
  return request({
    url: `${baseUrl}/delete`,
    method: "post",
    params: {
      sid,
    },
  });
}
