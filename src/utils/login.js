import { UseMenuStore } from "@/store";
import { staticRouter, dynamicRouter } from "@/utils/routerData.js";
import Router from "@/router";
import { useRoute, useRouter } from "vue-router";
import pinia from "@/store/factory.js";

const menuStore = UseMenuStore(pinia);

const routes = staticRouter;
export default function useAddRoutes() {
  console.log(menuStore.isLogin);
  if (menuStore.isLogin === true) {
    console.log("进入方法");
    menuStore.updateMenu(staticRouter);

    setTimeout(() => {
      addRoutes(dynamicRouter);
      console.log(routes);
      menuStore.updateMenu(routes);
      routes.forEach((item) => {
        Router.addRoute(item);
      });

      const router = useRouter();
    }, 2000);
  } else {
    menuStore.updateMenu(staticRouter);
    console.log(Router.getRoutes());
  }
}

const addRoutes = (data) => {
  data.forEach((item) => {
    routes.push({
      path: item.path,
      name: item.name,
      component: () => import(`cmp/${item.component}.vue`),
    });
  });
};
