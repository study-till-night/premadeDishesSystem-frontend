import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "@/layout/index.vue";

export const statisRoutes = [
  {
    path: "/login",
    name: "login",
    meta: {
      title: import.meta.env.VITE_APP_TITLE,
    },
    component: () => import("@/views/login.vue"),
    hidden: true,
  },
  {
    path: "/register",
    name: "register",
    meta: {
      title: import.meta.env.VITE_APP_TITLE,
    },
    component: () => import("@/views/register.vue"),
    hidden: true,
  },
  {
    path: "",
    component: Layout,
    name: "layout",
    redirect: "index",
    children: [
      {
        path: "index",
        component: () => import("@/views/index.vue"),
        name: "index",
        meta: { title: "首页" },
      },
    ],
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404.vue"),
    meta: { title: "404" },
    hidden: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: statisRoutes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 };
  },
});

export default router;
