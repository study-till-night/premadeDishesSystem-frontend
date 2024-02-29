import request from "../utils/request";
const baseUrl = "/api/category";

//查询全部商品分类
export function queryList() {
  return request({
    method: "get",
    url: `${baseUrl}/get`,
  });
}

//按分类查询商品
export function queryBySort(sid, pid, pNum) {
  return request({
    method: "get",
    url: `${baseUrl}/sort/${sid}`,
    params: {
      pid,
      pNum,
    },
  });
}
