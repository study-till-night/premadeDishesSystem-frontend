<template>
  <el-row>
    <el-col :span="16" :offset="4" class="prod-list">
      <prodList :prods="prods">
        <template #top-content>
          <!-- 搜索栏 -->
          <searchItem placeholder="请输入货物名称" @doSearch="searchProd" class="prod-select" />
        </template>

        <template #page>
          <!-- 分页器 -->
          <MyPagination :pageSize="pageSize" :layout="layout" :pageTotal="total" @pageFunc="pageFunc" />
        </template>
      </prodList>
    </el-col>
  </el-row>
  <el-backtop :right="100" :bottom="100" :visibility-height="180"/>
</template>

<script setup>
import prodList from '@/components/prod/prodList.vue';
import { recommend, search } from '@/api/prod/prodUser.js';
import { reactive, ref } from 'vue';
import MyPagination from '@/components/utils/MyPagination.vue';
import searchItem from '@/components/utils/search.vue';

let prods = reactive([]);
let content = ref("");
let currentPage = ref(1);
let pageSize = ref(16);
let total = ref(0)
let layout = "total, prev, pager, next, jumper, ->, slot"; //分页组件会展示的功能项

// 初始化
const initData = () => {
  recommend(pageSize.value).then(({ data }) => {
    console.log(data);
    prods.length = 0;
    prods.push(...data);
    currentPage.value = 1;
    total.value = prods.length;
  })
}

initData();

// 搜索货物
const searchProd = (_content) => {
  content.value = _content;

  search(content.value, currentPage.value, pageSize.value).then((data) => {
    prods.length = 0;
    prods.push(...data.list);
    currentPage.value = data.currentPage;
    total.value = data.total;
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
@import "../assets/less/prodRevelent.less";
</style>