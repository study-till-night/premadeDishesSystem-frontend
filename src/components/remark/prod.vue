<template>
  <!-- 顶部 -->
  <el-row>
    <el-form label-width="120px" status-icon inline>
      <el-form-item label="货物名称">
        <el-select v-model="currentId" placeholder="选择要查看的货物" clearable
          @change="currentId !== '' ? initData(currentId) : 0">
          <el-option v-for="item in entireProds" :key="item.pid" :label="item.productName" :value="item.pid" />
        </el-select>
      </el-form-item>
      <el-form-item label="默认以时间排序" />
    </el-form>
  </el-row>

  <el-empty description="暂无评论" v-if="comments.length === 0" />
  <!-- 评价 -->
  <div class="item" v-for="item in comments">
    <Item :comment="item" />
  </div>
  <!-- 分页器 -->
  <MyPagination :pageSize="pageSize" :layout="layout" :pageTotal="total" @pageFunc="pageFunc" />
</template>

<script setup>
import { queryPage as queryC } from '@/api/prod/comment.js';
import { queryList as queryP } from '@/api/prod/prodPro.js';
import { ref, reactive } from 'vue';
import Item from '../commentItem.vue';
import { useUserStore } from '@/store/user.js';
import MyPagination from '@/components/utils/MyPagination.vue';
import { useRoute } from 'vue-router';

const userStore = useUserStore();
const route = useRoute();

// 供应商所有货物
let entireProds = reactive([]);
let currentId = ref("");
// 货物对应评论
let comments = reactive([]);
// 分页相关
let currentPage = ref(1);
let total = ref(0);
let pageSize = ref(15);
let layout = "total, prev, pager, next, jumper, ->, slot";

// 获取货物列表
queryP(userStore.uid, 1, 1000).then(({ list }) => {
  entireProds.push(...list);
})

const initData = (id) => {
  queryC(id, 1, currentPage.value, pageSize.value).then((data) => {
    comments.length = 0;
    comments.push(...data.comments);
    for (let i in comments)
      comments[i].userName = data.userNames[i];

    currentPage.value = data.currentPage;
    total.value = data.total;
  })
}
if (route.query.id)
  initData(route.query.id);
// 处理分页
const pageFunc = (pageData) => {
  currentPage.value = pageData.pageNum;
  pageSize.value = pageData.pageSize;
  initData();
}
</script>

<style lang="less" scoped>
.item {
  width: 90%;
  margin: 40px;
}
</style>