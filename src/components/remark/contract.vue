<template>
  <!-- 顶部 -->
  <el-row>
    <el-form label-width="120px" status-icon inline>
      <el-form-item label="查看的评价类别">
        <el-radio-group v-model="type" size="large" @change="initData()">
          <el-radio-button :label="0">全部</el-radio-button>
          <el-radio-button :label="1">好评</el-radio-button>
          <el-radio-button :label="2">差评</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="默认以时间排序" />
    </el-form>
  </el-row>
  <!-- 主体 -->
  <el-empty description="暂无评价" v-if="contracts.length === 0" />
  <div class="item" v-for="item in contracts">
    <!-- 基本信息 -->
    <el-row>
      <el-col :span="2">
        <el-avatar :size="50" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
      </el-col>
      <el-col :span="4">
        <h5>{{ item.userOrg.orgName }}</h5>
        <h5>长期订单编号：{{ item.contractId }}</h5>
      </el-col>
      <el-col :span="4">
        <h5>货物名称: {{ item.productName }}</h5>
      </el-col>
      <el-col :span="4" :offset="10">
        <el-tooltip effect="dark" :content="`联系电话:${item.userOrg.chargerMobile} 联系人:${item.userOrg.chargerName}`"
          placement="top-start">
          <el-button link type="primary" :icon="ChatRound">联系对方单位</el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <!-- 评价内容 -->
    <el-row style="margin: 10px 0;">
      <el-col :offset="2">
        <h5>个性化配比需求：</h5>
        <p style="font-size: 14px;">{{ item.custom }}</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="2">
        <h5>对该个性化产品的评价：</h5>
        <p style="font-size: 14px;">{{ item.customComment }}</p>
      </el-col>
    </el-row>
  </div>
  <!-- 分页器 -->
  <MyPagination :pageSize="pageSize" :layout="layout" :pageTotal="total" @pageFunc="pageFunc" />
</template>

<script setup>
import { queryCom } from '@/api/contract.js';
import { reactive, ref, computed } from 'vue';
import MyPagination from '@/components/utils/MyPagination.vue';
import { ChatRound } from '@element-plus/icons-vue';

let contracts = reactive([]);
// 查看的评价类别
let type = ref(0);

// 分页相关
let currentPage = ref(1);
let total = ref(0);
let pageSize = ref(15);
let layout = "total, prev, pager, next, jumper, ->, slot";

const initData = () => {
  queryCom(type.value, currentPage.value, pageSize.value).then((data) => {
    console.log(data);
    contracts.length = 0;
    contracts.push(...data.contracts);
    for (let i in contracts)
      contracts[i].userOrg = data.userOrgs[i];
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
}

</script>

<style lang="less" scoped>
.item {
  width: 90%;
  padding-bottom: 20px;
  margin: 40px;
  border-bottom: 1px solid #cfcfcf;

  h5:nth-child(2) {
    font-size: 12px;
    color: #5f5f5f;
  }

  p {
    margin-top: 10px;
    text-overflow: clip;
  }
}
</style>