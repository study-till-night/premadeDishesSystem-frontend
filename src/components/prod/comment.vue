<template>
  <el-row class="inner-title ">
    <el-col :span="4">
      <h5>评论列表</h5>
    </el-col>
    <el-col :span="6" :offset="14">
      <el-radio-group v-model="type" size="large" style="margin-top: 10px;" @change="initData()">
        <el-radio-button label="默认排序" />
        <el-radio-button label="时间排序" />
      </el-radio-group>
    </el-col>
  </el-row>
  <el-empty description="暂无评论" v-if="comments.length === 0" />

  <div class="item" v-for="(item, index) in comments">
    <Item :comment="item" @addLove="handleAddLove" />
  </div>
  <!-- 分页器 -->
  <MyPagination :pageSize="pageSize" :layout="layout" :pageTotal="total" @pageFunc="pageFunc" />
</template>

<script setup>
import Item from '../commentItem.vue';
import MyPagination from '@/components/utils/MyPagination.vue';
import { queryPage, addLove } from '@/api/prod/comment.js';
import { useRoute } from 'vue-router';
import { reactive, ref, computed } from 'vue';

const route = useRoute();
// 评论集合
let comments = reactive([]);
// 赞数排序还是时间排序
let type = ref("默认排序");
let typeCom = computed(() => {
  return type.value === "默认排序" ? 0 : 1;
})
// 分页相关
let currentPage = ref(1);
let total = ref(0);
let pageSize = ref(15);
let layout = "total, prev, pager, next, jumper, ->, slot";

// 初始化
const initData = () => {
  queryPage(route.params.pid, typeCom.value, currentPage.value, pageSize.value)
    .then((data) => {
      comments.length = 0;
      comments.push(...data.comments);
      for (let i in comments) {
        comments[i].userName = data.userNames[i];
        comments[i].isLoved = data.isLoved[i];
      }
      currentPage.value = data.currentPage;
      total.value = data.total;
    })
}
initData();

// 处理分页
const pageFunc = (pageData) => {
  currentPage.value = pageData.pageNum;
  pageSize.value = pageData.pageSize;
  initData();
  loading.value = false;
}
// 处理点赞
const handleAddLove = (cid) => {
  addLove(cid).then(() => {
    initData();
  })
}
</script>

<style lang="less" scoped>
@import url("../../assets/less/layout.less");

.item {
  width: 80%;
  margin: 20px auto;
  border-bottom: 1px solid #bdbdbd;
}
</style>