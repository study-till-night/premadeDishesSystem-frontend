<template>
  <!-- 标题 -->
  <div class="top-title">
    <h2><el-icon style="margin-right: 10px;">
        <ChatLineRound />
      </el-icon>反馈中心 <el-tooltip effect="dark" :content="tipContent" placement="bottom-end">
        <el-icon style="color:orange">
          <QuestionFilled />
        </el-icon>
      </el-tooltip>
    </h2>
    <h5>将用户的宝贵意见集中</h5>
  </div>
  <!-- 主体 -->
  <div class="main-content">
    <el-row class="inner-title">
      <el-col :span="4">
        <h5>评价列表</h5>
      </el-col>
      <el-col :span="6" :offset="14">
        <el-radio-group v-model="type" size="large" style="margin-top: 10px;">
          <el-radio-button label="货物评价" />
          <el-radio-button label="个性化配制评价" />
        </el-radio-group>
      </el-col>
    </el-row>
    <div style="margin-top: 20px;">
      <prod v-if="type === '货物评价'" />
      <contract v-else />
    </div>
  </div>
</template>

<script setup>
import { ChatLineRound, QuestionFilled } from '@element-plus/icons-vue'
import { ref } from 'vue';
import prod from '@/components/remark/prod.vue';
import contract from '@/components/remark/contract.vue';

const tipContent = "该板块用户对于货物和个性化配制成果的评价集中,便于您根据用户意见做出调整";
// 查看哪类评价
let type = ref("货物评价");
</script>

<style lang="less" scoped>
@import "../../assets/less/layout.less";

.main-content {
  width: 70%;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
}
</style>