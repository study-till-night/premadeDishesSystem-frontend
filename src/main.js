import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./store/factory.js";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "nprogress/nprogress.css";
import Nprogress from "nprogress";
import { useUserStore } from "@/store/user.js";
import { useMenuStore } from "@/store/menu.js";
import { getToken } from "@/utils/auth";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "default-passive-events";
import { components } from "./components/index";

Nprogress.configure({
  easing: "ease", // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});

const menuStore = useMenuStore(pinia);
const userStore = useUserStore(pinia);
const whiteList = ["/login", "/register"];

// 初始化动态路由
async function init() {
  if (userStore.isLogin === false) {
    await menuStore
      .GenerateRoutes()
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }
}

// 等待初始化完成再挂载
async function call() {
  await init();
  app.use(router).use(pinia).use(ElementPlus);
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
  app.mount("#app");
}

router.beforeEach((to, from, next) => {
  console.log("进入路由守卫" + "to" + to.fullPath);
  const userStore = useUserStore(pinia);
  Nprogress.start();
  to.meta.title && (document.title = to.meta.title);
  if (getToken()) {
    if (userStore.isLogin === false) {
      //没有当前用户信息则向服务端申请
      console.log("重新获取信息");
      userStore.GetInfo();
      userStore.isLogin = true;
      next();
    } else next();
  } else if (whiteList.indexOf(to.path) !== -1) {
    //在白名单内直接进入
    next();
  } else {
    next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
  }
  Nprogress.done();
});

const app = createApp(App);
// components(app);
call();
