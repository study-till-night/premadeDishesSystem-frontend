<template>
  <el-row>
    <el-col :span="4">
      <el-icon>
        <Food />
      </el-icon>
    </el-col>
    <el-col :span="20">
      <h2>{{ appName }}</h2>
    </el-col>
  </el-row>
</template>

<script setup>
import { Food } from '@element-plus/icons-vue'
const appName = import.meta.env.VITE_APP_TITLE;

</script>

<style lang="less" scoped>
i {
  display: inline-block;
  margin-right: -40px;
  color: #ffd04b;
  font-size: 40px;
  line-height: 56px;
}

h2 {
  text-indent: 20px;
  text-align: left;
  font-family: italic, Georgia, serif;
  color: #ffd04b;
  line-height: 20px;
}
</style>