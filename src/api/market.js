import request from "../utils/request";

export function queryList(days, category) {
  return request({
    url: "/api/market/get",
    method: "get",
    params: {
      days,
      category,
    },
  });
}
