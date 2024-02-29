<template>
  <el-row class="table-header" :gutter="20">
    <el-col :span="4" />
    <el-col v-for="item in headers" :span="item.span">
      <h5>{{ item.name }}</h5>
    </el-col>
  </el-row>
</template>

<script setup>
const props = defineProps({
  headers: Array
})
</script>

<style lang="less" scoped>
.table-header {
  height: 40px;

  h5 {
    line-height: 40px;
    // color: #e2e2e2;
    font-size: 14px;
    font-weight: 400;
  }
}
</style>