import { defineStore } from "pinia";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { login, register, logout, getInfo } from "@/api/login";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      isLogin: false,
      token: getToken(),
      uid: Number,
      name: String,
      role: String,
      permissions: [],
    };
  },
  actions: {
    DoLogin(userName, password) {
      return new Promise((resolve, reject) => {
        login(userName, password)
          .then(({ data }) => {
            console.log(data);

            if (data.msg === "密码错误") reject("密码错误");
            if (data.msg === "用户不存在") reject("用户不存在");
            const tokenInfo = data;
            this.uid = tokenInfo.loginId;

            removeToken("satoken");
            setToken(tokenInfo.tokenValue, {
              expires: tokenInfo.tokenTimeout / 60 / 60 / 24,
            });
            //登录成功 再请求信息
            this.GetInfo()
              .then((res) => {
                resolve(res);
              })
              .catch((err) => {
                reject(err);
              });
            this.isLogin = true;
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    Register(userName, password, role, providerName) {
      return new Promise((resolve, reject) => {
        register(userName, password, role, providerName)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    Logout() {
      return new Promise((resolve, reject) => {
        logout()
          .then((res) => {
            removeToken();
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    GetInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            console.log("getinfo");
            this.uid = res.uid;
            this.name = res.name;
            this.role = res.roles[0];
            this.permissions = res.permissions;
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
});
