import request from "@/utils/request";
const baseUrl = "/api/prodPro";

// 查询
export function queryList(uid, pid, pNum) {
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
export function add(prod) {
  return request({
    url: `${baseUrl}/add`,
    method: "post",
    data: prod,
  });
}

// 上传货物文件
export function uploadProdImg(img, pid) {
  return request({
    url: "/file/uploadProImg",
    method: "post",
    headers: {
      "content-type": "multipart/form-data",
    },
    params: {
      img,
      pid,
    },
  });
}
// 修改
export function update(prod) {
  return request({
    url: `${baseUrl}/update`,
    method: "post",
    data: prod,
  });
}

// 修改货物个性化配比许可
export function updateCustomizable(pid) {
  return request({
    url: `${baseUrl}/updateCustomizable`,
    method: "post",
    params: { pid },
  });
}

// 删除
export function del(pid) {
  return request({
    url: `${baseUrl}/delete`,
    method: "post",
    params: {
      pid,
    },
  });
}

// 搜索
export function search(content, category, uid) {
  return request({
    url: `${baseUrl}/search`,
    method: "get",
    params: {
      content,
      category,
      uid,
    },
  });
}
