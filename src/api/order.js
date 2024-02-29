import request from "../utils/request";
const baseUrl = "/api/order";

// 查询
export function queryList(status, content, pid, pNum) {
  return request({
    url: `${baseUrl}/get`,
    method: "get",
    params: {
      status,
      content,
      pid,
      pNum,
    },
  });
}

// 修改
export function update(oid) {
  return request({
    url: `${baseUrl}/update`,
    method: "post",
    data: {},
    params: { oid },
  });
}
