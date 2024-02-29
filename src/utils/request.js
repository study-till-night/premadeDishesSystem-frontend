import axios from "axios";
import { getToken } from "@/utils/auth";
import { ElMessage } from "element-plus";
import errorCode from "@/utils/errorCode";
import { removeToken } from "@/utils/auth";
import router from "@/router";
axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";

const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  // baseURL: "/api",
  // 超时
  timeout: 10000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    if (getToken() && !isToken) {
      config.headers["satoken"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // console.log(config.headers);
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // console.log(res);
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode["default"];
    if (msg === "404") router.push("/404");
    if (
      res.request.responseType === "blob" ||
      res.request.responseType === "arraybuffer"
    )
      return res.data;

    if (code === 500) {
      ElMessage.error(msg);
      if (msg.indexOf("Token无效") !== -1 || msg.indexOf("顶下线") !== -1) {
        removeToken();
        router.push("/login");
      }
      return Promise.reject(new Error(msg));
    } else {
      if (res.data.msg && res.data.msg.includes("成功")) ElMessage.success(msg);
      return res.data;
    }
  },
  (err) => {
    console.log("err" + err);
    let { message } = err;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    ElMessage({
      message: message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(err);
  }
);
export default service;
