<template>
  <!-- 供应商评分 -->
  <el-row class="grade" justify="center">
    <el-col :span="6">
      <h5>迟发货次数: </h5>
      <span>{{ grade.credit }}</span>
    </el-col>
    <el-col :span="6">
      <h5>公开食谱份数: </h5>
      <span>{{ grade.transparency }}</span>
    </el-col>
    <el-col :span="6">
      <h5>优秀创新次数: </h5>
      <span>{{ grade.creativity }}</span>
    </el-col>
  </el-row>
  <el-row class="inner-title" style="border: 0;">
    <el-col :span="4">
      <h5>交易数据</h5>
    </el-col>
  </el-row>
  <div class="trade-data">
    <!-- 长期订单份数 -->
    <el-row style="margin-bottom: 20px;">
      <el-col :span="7">
        <h5>已签订的长期订单份数：</h5>
      </el-col>
      <el-col :span="2"><span> {{ contractCount }}</span></el-col>
    </el-row>
    <!-- 零售/批发交易额 -->
    <el-form label-width="120px" status-icon inline>
      <el-form-item label="选择时间范围">
        <el-radio-group v-model="days" size="large" @change="initData()">
          <el-radio-button :label="-1">全部</el-radio-button>
          <el-radio-button :label="7">近7天</el-radio-button>
          <el-radio-button :label="30">近30天</el-radio-button>
          <el-radio-button :label="180">近180天</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="4">
        <h5>成交量:</h5>
      </el-col>
      <el-col :span="2"><span> {{ orderCount }}</span></el-col>
      <el-col :span="4">
        <h5>总收益:</h5>
      </el-col>
      <el-col :span="2"><span> {{ income }}元</span></el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { getMyData } from '../../api/user.js';
// 查询天数
let days = ref(-1);
let grade = reactive({});
let contractCount = ref(0);
let orderCount = ref(0);
let income = ref(0);

const initData = () => {
  getMyData(days.value).then((data) => {
    console.log(data);
    for (let i in data.grade)
      grade[i] = data.grade[i];
    contractCount.value = data.contractCount;
    orderCount.value = data.orderCount;
    income.value = data.income;
  })
}
initData();

</script>

<style lang="less" scoped>
@import url("../../assets/less/layout.less");

h5 {
  color: rgb(148, 148, 148);
}

.grade {
  border-bottom: 1px solid #b5b5b5;
  padding-bottom: 10px;

  span {
    display: block;
    width: 50%;
    text-align: center;
  }
}

.trade-data {
  margin-bottom: 20px;

  h5 {
    color: #4f4f4f;
    text-indent: 20px;
  }

  span {
    display: block;
    height: 100%;
    font-size: 16px;
  }
}
</style>