import { defineStore } from "pinia";
import { getToken, setToken, removeToken } from "@/utils/auth";
import Router, { statisRoutes } from "@/router/index";
import { getRouters } from "@/api/menu";
import { login, register, logout, getInfo } from "@/api/login";

export const useUserStore = defineStore("user", {
  state: () => {
    isLogin: false;
    token: getToken();
    name: "";
    roles: [];
    permissions: [];
  },
  actions: {
    doLogin(userName, password) {
      return new Promise((resolve, reject) => {
        login(userName, password)
          .then((res) => {
            //登录成功 再请求信息
            console.log(res);
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
    Register(userName, password, role) {},
    Logout() {
      return new Promise((resolve, reject) => {
        logout()
          .then((res) => {
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
            this.name = res.name;
            this.roles = res.roles;
            this.permissions = res.permissions;
          })
          .catch((err) => {
            resolve(err);
          });
      });
    },
  },
});

//当前用户目录
export const UseMenuStore = defineStore("menu", {
  state: () => ({
    menu: [],
  }),
  actions: {
    // 从服务端获取路由
    GenerateRoutes() {
      if (getToken()) {
        console.log("进入路由方法");
        this.menu = statisRoutes;

        return new Promise((resolve, reject) => {
          getRouters()
            .then((res) => {
              console.log(res);
              let dynamicRoutes = FilterRoutes(res.data);

              dynamicRoutes.forEach((item) => {
                this.menu.push(item);
                Router.addRoute(item);
              });

              console.log(Router.getRoutes());
              resolve(res);
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        });
      } else {
        //只添加静态路由
        this.menu = statisRoutes;
      }
    },
  },
});

const FilterRoutes = (data) => {
  let routes = [];
  data.forEach((item) => {
    routes.push({
      path: item.path,
      name: item.name,
      hidden: item.hidden,
      component: () => import(`cmp/${item.component}.vue`),
    });
  });
  return routes;
};
