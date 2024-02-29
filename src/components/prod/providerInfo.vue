<template>
  <el-row :gutter="20" class="prod-provider">
    <!-- 供应商图像 -->
    <el-col :span="1" :offset="1">
      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
    </el-col>
    <!-- 供应商名称 -->
    <el-col :span="6" class="provider-name">
      <h3>{{ props.providerName }}</h3>
    </el-col>
    <!-- 评价 -->
    <el-col :span="2" class="evaluate">
      <h5>信誉评分</h5>
      <span>{{ creditComputed(total1).toFixed(2) }}</span>
    </el-col>
    <el-col :span="2" class="evaluate">
      <h5>透明度</h5>
      <span>{{ otherComputed(transparency, total2).toFixed(2) }}</span>
    </el-col>
    <el-col :span="2" class="evaluate">
      <h5>创新能力 </h5>
      <span>{{ otherComputed(creativity, total3).toFixed(2) }}</span>
    </el-col>
    <!-- 右侧内容 -->
    <slot />
  </el-row>
</template>

<script setup>
import { getGrade } from '@/api/user.js';
import { ref, watch, computed } from 'vue';
import { queryList as countProd } from '@/api/prod/prodPro.js';
import { queryList as countCtr, countRecords } from '@/api/contract.js';

const props = defineProps({
  sellerId: 0,
  providerName: ""
})

// 供应商评分
let credit = ref(0);
let transparency = ref(0);
let creativity = ref(0);
// 总数
let total1 = ref(0);
let total2 = ref(0);
let total3 = ref(0);
// 对原始数据进行计算
let creditComputed = computed(() => (total) => {
  if (total === 0)
    return 5;
  return 5 * (1 - credit.value / total);
})
let otherComputed = computed(() => (num, total) => {
  if (total === 0)
    return 0;
  if (creativity.value < 0) return 0;
  return num / total * 5;
})

const initData = (val) => {
  getGrade(val).then(({ data }) => {
    credit.value = data.credit;
    transparency.value = data.transparency;
    creativity.value = data.creativity;
  })
  // 货物总数
  countProd(val, 1, 1).then(({ total }) => {
    total2.value = total;
  })
  // 长期单总数
  countCtr(-1, "", 1, 1).then(({ total }) => {
    total3.value = total;
  })
  // 发货记录总数
  countRecords(val).then(({ data }) => {
    total1.value = data;
  })
}
initData(props.sellerId);
//获取当前供应商信息
watch(() => props.sellerId, (newv) => {
  console.log(newv);
  if (newv && !(Number.isNaN(newv))) {
    initData(newv);
  }
})

</script>

<style lang="less" scoped>
@import "../../assets/less/prodRevelent.less";

.evaluate,
.provider-name {
  padding-top: 15px;
}

.provider-name {
  margin-left: 20px;

  h3 {
    height: 50px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-right: 1px solid #a1a1a1;
  }

}

.evaluate {
  h5 {
    font-weight: 400;
    color: #a1a1a1;
  }

  span {
    margin-top: 5px;
  }
}
</style>