<template>
  <!-- 顶部 -->
  <el-row style="border-bottom:1px solid #cfcfcf;padding-bottom: 10px;">
    <el-col :span="4" :offset="1">
      <h3>全网公开的食谱</h3>
    </el-col>
  </el-row>
  <el-empty description="暂无发布的食谱" v-if="recipes.length === 0" />

  <!-- 食谱主体 -->
  <el-row class="recipes" v-for="(item, index) in recipes">
    <recipeItem :recipe="item" :prod="prods[index]" :org="orgs[index]" @addLove="handleLove" />
  </el-row>
  <MyPagination :pageSize="pageSize" :layout="layout" :pageTotal="total" @pageFunc="pageFunc" />
</template>

<script setup>
import { reactive, ref } from 'vue';
import { queryPage, addLove } from '@/api/recipe.js';
import recipeItem from '@/components/recipeItem.vue';
import MyPagination from '@/components/utils/MyPagination.vue';

let recipes = reactive([])
// 食谱对应的货物
let prods = reactive([])
// 对应供应商
let orgs = reactive([]);
// 分页相关
let currentPage = ref(1);
let total = ref(0);
let pageSize = ref(6);
let layout = "total, prev, pager, next, jumper, ->, slot"; //分页组件会展示的功能项
// 初始化
const initData = () => {
  queryPage(currentPage.value, pageSize.value).then((data) => {
    recipes.length = 0;
    recipes.push(...data.recipes);
    // 是否已点过赞
    for (let i in recipes)
      recipes[i].isLoved = data.isLoved[i];
    prods.length = 0;
    prods.push(...data.prods);
    orgs.length = 0;
    orgs.push(...data.orgs);
    currentPage.value = data.currentPage;
    total.value = data.total;
  })
}
initData();

// 点赞操作
const handleLove = (rid) => {
  addLove(rid).then(() => {
    initData();
  })
}
// 处理分页
const pageFunc = (pageData) => {
  currentPage.value = pageData.pageNum;
  pageSize.value = pageData.pageSize;
  loading.value = true;
  initData();
  loading.value = false;
}
</script>

<style lang="less" scoped>
h3 {
  color: #4f4f4f;
}
</style>