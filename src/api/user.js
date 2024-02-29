import request from "../utils/request";
const baseUrl = "/api/userDetails";
const _baseUrl = "/api/userAccount";

// 更新密码
export function updatePwd(userName, password) {
  const data = {
    userName,
    password,
  };
  return request({
    url: `${_baseUrl}/update`,
    method: "post",
    data,
  });
}

// 校企认证
export function certificate(userOrg) {
  return request({
    url: `${_baseUrl}/certificate`,
    method: "post",
    data: userOrg,
  });
}

//用户详细信息
export function getDetails() {
  return request({
    url: `${baseUrl}/get`,
    method: "get",
  });
}
//供应商数据
export function getMyData(days) {
  return request({
    url: `${baseUrl}/getData`,
    method: "get",
    params: {
      days,
    },
  });
}

//修改用户详细信息
export function updateDetails(details) {
  return request({
    url: `${baseUrl}/update`,
    method: "post",
    data: details,
  });
}

//供应商评分
export function getGrade(uid) {
  return request({
    url: "/api/grade/get",
    method: "get",
    params: {
      uid,
    },
  });
}
