import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

function resolve(dir) {
  return path.join(__dirname, dir);
}

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // 获取.env文件里定义的环境变量

  const name = env.VITE_APP_TITLE || "SMART_PREDISHES预制菜交易平台"; // 网页标题
  const port = env.VITE_PORT || 80; // 端口
  const prefix = env.VITE_APP_BASE_URL;

  return defineConfig({
    plugins: [vue()],
    publicPath: env.VITE_ENV === "production" ? "/" : "/",
    // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
    outputDir: "dist",
    // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
    assetsDir: "static",
    name: name,
    resolve: {
      alias: {
        "@": resolve("/src"),
        cmp: resolve("/src/components"),
      },
    },
    server: {
      // port,
      // proxy: {
      //   "/api": {
      //     target: "http://localhost:8089/", //接口的前缀
      //     ws: true, //代理websocked
      //     changeOrigin: true, //虚拟的站点需要更管origin
      //     rewrite: (path) => path.replace(/^\/api/, ""),
      //   },
      // },
    },
  });
};
