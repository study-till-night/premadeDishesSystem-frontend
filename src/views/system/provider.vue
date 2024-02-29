<template>
  <!-- 顶部供应商信息 -->
  <div class="top-content">
    <providerInfo :sellerId="route.params.id" :providerName="providerName">
      <el-col :span="5" style="margin-top: 20px;">
        <el-radio-group v-model="show" size="large">
          <el-radio-button label="查看货物" />
          <el-radio-button label="查看食谱" />
        </el-radio-group>
      </el-col>

      <el-col :span="4" class="right">
        <h5 :title="address">企业地址: {{ address }}</h5>
        <h5>联系电话: {{ mobile }}</h5>
      </el-col>
    </providerInfo>
  </div>
  <!-- 货物信息 -->
  <el-col v-if="show === '查看货物'" :span="16" :offset="4" style="margin-bottom: 50px; background-color: #fff;">
    <prodList :prods="prods">
      <template #page>
        <!-- 分页器 -->
        <MyPagination :pageSize="pageSize" :layout="layout" :pageTotal="total" @pageFunc="pageFunc" />
      </template>
    </prodList>
  </el-col>
  <!-- 食谱信息 -->
  <el-col v-else :span="16" :offset="4" style="margin-bottom: 50px; background-color: #fff;">
    <!-- 顶部 -->
    <el-row style="border-bottom:1px solid #cfcfcf;padding-bottom: 10px;">
      <el-col :span="4" :offset="1">
        <h4 style="padding:20px;color: #4f4f4f;">该供应商公开的食谱</h4>
      </el-col>
    </el-row>
    <!-- 食谱主体 -->
    <el-empty description="暂无发布的食谱" v-if="recipes.length === 0" />
    <el-row class="recipes" v-for="(item, index) in recipes">
      <recipeItem :recipe="item" :prod="r_prods[index]" :org="orgs[index]" @addLove="handleLove" />
    </el-row>
  </el-col>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import providerInfo from '@/components/prod/providerInfo.vue';
import prodList from '@/components/prod/prodList.vue';
import MyPagination from '@/components/utils/MyPagination.vue';
import recipeItem from '@/components/recipeItem.vue';
import { getDetails } from '@/api/user.js';
import { queryList } from '@/api/prod/prodPro.js';
import { queryPage, addLove } from '@/api/recipe.js';
import { ref, reactive } from 'vue';

const route = useRoute();
const router = useRouter();

// 显示哪个模块 0-货物 1-食谱
let show = ref("查看货物");
// 供应商信息
let address = ref("");
let mobile = ref("");
let providerName = ref("");
// 该供应商所售卖货物
const prods = reactive([]);

let recipes = reactive([])
// 食谱对应的货物
let r_prods = reactive([])
// 对应供应商
let orgs = reactive([]);
// 分页相关
let currentPage = ref(1);
let pageSize = ref(6);
let total = ref(0)
let layout = "total, prev, pager, next, jumper, ->, slot"; //分页组件会展示的功能项

// 企业信息
getDetails(route.params.id).then(({ org }) => {
  address.value = org.orgAddress;
  mobile.value = org.chargerMobile;
  providerName.value = org.orgName;
})
// 货物
queryList(route.params.id, currentPage.value, pageSize.value).then((data) => {
  prods.length = 0;
  prods.push(...data.list);
  currentPage.value = data.currentPage;
  total.value = data.total;
})
// 查询食谱
const initData = () => {
  queryPage(currentPage.value, pageSize.value, route.params.id).then((data) => {
    recipes.length = 0;
    recipes.push(...data.recipes);
    // 是否已点过赞
    for (let i in recipes)
      recipes[i].isLoved = data.isLoved[i];
    r_prods.length = 0;
    r_prods.push(...data.prods);
    orgs.length = 0;
    orgs.push(...data.orgs);
    currentPage.value = data.currentPage;
    total.value = data.total;
  })
}
initData();
// 处理分页
const pageFunc = (pageData) => {
  currentPage.value = pageData.pageNum;
  pageSize.value = pageData.pageSize;
  loading.value = true;
  initData();
}
// 点赞操作
const handleLove = (rid) => {
  addLove(rid).then(() => {
    initData();
  })
}
</script>

<style lang="less" scoped>
@import "../../assets/less/layout.less";

.right {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  h5 {
    width: 100%;
    font-weight: 500;
    overflow: hidden;
  }
}
</style>