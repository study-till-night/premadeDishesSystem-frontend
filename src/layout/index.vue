<template>
  <el-container>
    <!-- 头部导航栏 -->
    <el-header>
      <Navbar />
    </el-header>
    <!-- 页面主体 -->
    <el-main>
      <AppMain />
    </el-main>
    <!-- 页脚 -->
    <el-footer>
      <Footer />
    </el-footer>
  </el-container>
</template>

<script setup>
import AppMain from './components/AppMain.vue';
import Navbar from './components/Navbar/index.vue';
import Footer from './components/footer.vue';
</script>   

<style lang="less" scoped>
footer {
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: #000;
  z-index: 1;
}



header {
  background-color: #545c64;
  text-align: center;
}
</style>