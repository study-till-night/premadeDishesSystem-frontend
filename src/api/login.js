import request from "../utils/request";

// 登录方法
export function login(userName, password) {
  const data = {
    userName,
    password,
  };
  return request({
    url: "/system/login",
    headers: {
      isToken: false,
    },
    method: "post",
    data: data,
  });
}

// 注册方法
export function register(userName, password, userRole, org) {
  const user = {
    userName,
    password,
    userRole,
  };
  return request({
    url: "/system/register",
    headers: {
      isToken: false,
    },
    method: "post",
    data: {
      user,
      org,
    },
  });
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: "/system/getInfo",
    method: "get",
  });
}

// 退出方法
export function logout() {
  return request({
    url: "/system/logout",
    method: "post",
  });
}
