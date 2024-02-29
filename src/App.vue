<template>
  <router-view />
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  font-family: "微软雅黑";
  box-sizing: border-box;
  word-break: break-all;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }

  text-overflow: ellipsis;
  white-space: nowrap;
}

body {
  // background-color: #ebebeb;
  background-image: url("./assets/bgc.jpg");
  background-size: auto;
  background-size: 100% 100%;
  background-attachment: fixed;
}
</style>

<script setup>
import { onMounted } from 'vue';
import { useMenuStore } from '@/store/menu.js';

const menuStore = useMenuStore();

onMounted(() => {
  menuStore.GenerateRoutes();
})
</script>

