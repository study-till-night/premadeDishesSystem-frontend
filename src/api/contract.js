import request from "../utils/request";
const baseUrl = "/api/contract";

// 查询
export function queryList(status, content, pid, pNum) {
  return request({
    url: `${baseUrl}/get`,
    method: "get",
    params: {
      content,
      status,
      pid,
      pNum,
    },
  });
}

// 查看评价
export function queryCom(type, pid, pNum) {
  return request({
    url: `${baseUrl}/getCom`,
    method: "get",
    params: {
      type,
      pid,
      pNum,
    },
  });
}

// 统计记录数
export function countRecords(uid) {
  return request({
    url: `${baseUrl}/count`,
    method: "get",
    params: {
      uid,
    },
  });
}

// 查看一个
export function queryOne(cid) {
  return request({
    url: `${baseUrl}/getOne`,
    method: "get",
    params: {
      cid,
    },
  });
}

// 增加
export function propose(contract) {
  return request({
    url: `${baseUrl}/propose`,
    method: "post",
    data: contract,
  });
}

// 商议
export function discuss(config) {
  return request({
    url: `${baseUrl}/discuss`,
    method: "post",
    params: config,
  });
}

// 决定
export function decide(cid, type, reason) {
  return request({
    url: `${baseUrl}/decide`,
    method: "post",
    params: {
      cid,
      type,
      reason,
    },
  });
}

// 发货
export function delivery(cid, date) {
  return request({
    url: `${baseUrl}/delivery`,
    method: "post",
    params: {
      cid,
      date,
    },
  });
}

// 发布评价
export function comment(cid, grade, comment) {
  return request({
    url: `${baseUrl}/comment`,
    method: "post",
    params: {
      cid,
      grade,
      comment,
    },
  });
}
