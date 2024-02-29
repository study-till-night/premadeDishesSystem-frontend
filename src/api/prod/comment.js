import request from "@/utils/request";
const baseUrl = "/api/prodComment";

// 分页查询
export function queryPage(pid, type, pageId, pNum) {
  return request({
    url: `${baseUrl}/getProd`,
    method: "get",
    params: {
      pid,
      type,
      pageId,
      pNum,
    },
  });
}

// 发表
export function add(comment) {
  return request({
    url: `${baseUrl}/add`,
    method: "post",
    data: comment,
  });
}

// 点赞
export function addLove(cid) {
  return request({
    url: `${baseUrl}/love`,
    method: "post",
    params: {
      cid,
    },
  });
}
