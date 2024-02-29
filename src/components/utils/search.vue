<template>
  <el-row>
    <el-col :span="18">
      <el-input v-model="content" :placeholder="placeholder" clearable />
    </el-col>
    <el-col :span="6">
      <el-button :icon="Search" @click="emit('doSearch', content)" type="primary">搜索</el-button>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue'
const props = defineProps({
  placeholder: String,
  size: {
    type: String,
    default: "default"
  }
})
let content = ref("");
const emit = defineEmits(["doSearch"]);
</script>

<style lang="less" scoped>

</style>