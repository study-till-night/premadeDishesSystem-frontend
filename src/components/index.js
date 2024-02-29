// 注册全局组件 注意组件中name要有名字 大驼峰格式
export const components = (app) => {
  //获取同级目录下的.vue文件
  const requireComponent = require.context(".", true, /(\.vue)$/);
  requireComponent.keys().forEach((fileName) => {
    //fileName：同级目录所有的.vue文件
    const config = requireComponent(fileName);
    //获取到的文件名替换掉不需要的字符
    const componentName = fileName.replace("./", "").replace(".vue", "");
    //接收到的实例进行全局组件的挂载
    app.component(componentName, config.default || config);
  });
};
