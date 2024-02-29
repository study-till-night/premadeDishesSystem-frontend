import request from "@/utils/request.js";
const baseUrl = "/api/prodUser";

// 推荐货物哦
export function recommend(num) {
  return request({
    url: `${baseUrl}/recommend`,
    method: "get",
    params: {
      num,
    },
  });
}

// 搜索
export function search(content, pid, pNum) {
  return request({
    url: `${baseUrl}/search`,
    method: "get",
    params: {
      content,
      pid,
      pNum,
    },
  });
}

// 查看单一货物
export function viewOne(pid) {
  return request({
    url: `${baseUrl}/view`,
    method: "get",
    params: {
      pid,
    },
  });
}
