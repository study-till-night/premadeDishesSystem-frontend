<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="#545c64"
      text-color="#e8e8e8" active-text-color="#ffd04b" :router="true" @select="handleSelect">
      <div v-for="item in menuStore.menu">
        <div v-if="item.meta.hidden == false">
          <!-- 非商品分类菜单 -->
          <el-menu-item :index="`/${item.path}`" v-if="item.name !== 'sort'">
            <template #title>{{ item.meta.title }}</template>
          </el-menu-item>
          <!-- 子目录 -->
          <el-sub-menu v-else :index="item.path">
            <template #title>{{ item.meta.title }}</template>
            <el-menu-item v-for="(subItem, index) in categories" :index="`/sort/${index + 1}`">
              <template #title>{{ subItem }}</template>
            </el-menu-item>
          </el-sub-menu>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script setup>
import { useMenuStore } from '@/store/menu.js';
import { ref, onMounted } from 'vue';
import { queryList } from '@/api/category.js';

const menuStore = useMenuStore();
const activeIndex = ref(sessionStorage.getItem("menuIndex") || (menuStore.menu[0] && "/" + menuStore.menu[0].path));
let categories = [];

//初始化商品分类
onMounted(() => {
  queryList().then(({ data }) => {
    data.forEach(item => {
      categories.push(item.categoryName);
    })
  }).catch((err) => {
    console.log(err);
  });
})

const handleSelect = (key, keyPath) => {
  sessionStorage.setItem("menuIndex", key);
}
</script>

<style lang="less" scoped>
.el-menu-item {
  font-size: 16px;
  letter-spacing: 2px;
}

div:nth-child(1) {
  height: 100%;
}
</style>