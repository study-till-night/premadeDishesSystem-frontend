import { defineStore } from "pinia";
import Router, { statisRoutes } from "@/router/index";
import { getToken } from "@/utils/auth";
import { getRouters } from "@/api/menu";
import pinia from "@/store/factory.js";
import { useUserStore } from "@/store/user.js";

const userStore = useUserStore(pinia);
// vite专属写法 批量导入某目录下所有文件
const modules = import.meta.glob("../views/**");

export const useMenuStore = defineStore("menu", {
  state: () => {
    return {
      menu: [],
    };
  },
  actions: {
    // 从服务端获取路由
    GenerateRoutes() {
      return new Promise((resolve, reject) => {
        if (getToken()) {
          // console.log("进入路由方法");
          this.menu = [];

          //向服务端请求路由
          getRouters()
            .then((res) => {
              let dynamicRoutes = FilterRoutes(res.data);
              // console.log(Router.getRoutes(), dynamicRoutes);

              // 将动态路由赋予vuerouter
              dynamicRoutes.forEach((item) => {
                this.menu.push(item);
                Router.addRoute("layout", item);
              });

              // 不识别的path自动匹配404
              Router.addRoute({
                name: "to404",
                path: "/:catchAll(.*)",
                redirect: "/404",
              });
              resolve(res);
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        } else {
          //只添加静态路由
          this.menu = statisRoutes;
          resolve();
        }
      });
    },
  },
});

// 将接口返回对象转换为router对象
const FilterRoutes = (data) => {
  let routes = [];
  console.log(modules);

  data.forEach((item) => {
    if (item.name !== "index")
      routes.push({
        path: item.path,
        name: item.name,
        meta: {
          title: item.title,
          hidden: item.hidden,
        },
        // 相对根目录而言
        // component: () => import(`/src/views/${item.component}.vue`),
        component: modules[`../views/${item.component}.vue`],
      });
    else
      routes.unshift({
        path: item.path,
        name: item.name,
        meta: {
          title: item.title,
          hidden: item.hidden,
        },
        // component: () => import(`/src/views/${item.component}.vue`),
        component: modules[`../views/${item.component}.vue`],
      });
  });
  return routes;
};

// 将字符串转换为组件对象
export const loadView = (view) => {
  if (import.meta.env.VITE_ENV === "development") {
    return (resolve) => require([`/src/views/${view}`], resolve);
  } else {
    // 使用 import 实现生产环境的路由懒加载
    // return () => import(`@/views/${view}`);
    return (resolve) => require([`/src/views/${view}`], resolve);
  }
};
