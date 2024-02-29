<template>
  <el-row style="height: 56px;overflow: hidden;">
    <el-col :span="4">
      <NavIcon />
    </el-col>
    <el-col :span="14">
      <Menu />
    </el-col>
    <el-col :span="1">
      <el-icon>
        <DataAnalysis />
      </el-icon>
    </el-col>
    <el-col :span="2">
      <h5 @click="router.push('/market')">全平台数据</h5>
    </el-col>
    <el-col :span="3">
      <Avatur />
    </el-col>
  </el-row>
</template>

<script setup>
import NavIcon from './navIcon.vue';
import Avatur from './avatur.vue';
import Menu from './menu.vue';
import { DataAnalysis } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style lang="less" scoped>
.el-row {
  align-items: center;
}

i {
  display: inline-block;
  color: #e8e8e8;
  margin: 10px -40px 0 0;
  font-size: 20px;
}

h5 {
  display: inline-block;
  margin-left: -40px;
  color: #e8e8e8;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    color: orange;
    cursor: pointer;
    transition: all 0.2s linear;
  }
}
</style>