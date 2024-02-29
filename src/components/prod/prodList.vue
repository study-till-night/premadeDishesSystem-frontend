<template>
  <!-- 列表上方部分 -->
  <slot name="top-content" />
  <!-- 货物列表部分 -->
  <el-row :gutter="5">
    <div class="top-content">
      <h5>货物列表</h5>
    </div>

    <el-empty description="暂无内容" :image-size="200" v-if="props.prods.length === 0"
      style="width: 90%;margin: 0 auto;background-color: #fff;" />

    <el-col v-else v-for="item in props.prods" :span="5" :offset="1" class="prod-item">
      <prodItem :prod="item" />
    </el-col>

  </el-row>

  <!-- 分页器 -->
  <el-row>
    <slot name="page" />
  </el-row>
</template>

<script setup>
import prodItem from './prodItem.vue';

const props = defineProps({
  prods: {
    type: Array,
    default: []
  }
})
</script>

<style lang="less" scoped>
@import "../../assets/less/tablePage.less";

.prod-item {
  width: 100%;
  height: 360px;
  margin: 20px;
  cursor: pointer;
}
</style>