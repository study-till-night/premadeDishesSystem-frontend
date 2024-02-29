<template>
  <el-row :gutter="20">
    <!-- 货物部分 -->
    <el-col :span="16" :offset="4" style="background-color: #fff; margin-bottom: 20px;">
      <prods @selectFunc="selectFunc" />
    </el-col>
  </el-row>

  <el-row :gutter="20">
    <el-col :span="16" :offset="4" style="background-color: #fff;">
      <!-- 规格部分 -->
      <specs :pid="pid" />
    </el-col>
  </el-row>
</template>
 
<script setup>
import prods from '@/components/prodMgr/prodMgrSide.vue';
import specs from '@/components/prodMgr/specMgrSide.vue';
import { queryList } from '@/api/prod/prodPro.js';
import { ref } from 'vue';
import { useUserStore } from '@/store/user.js';

const userStore = useUserStore();

let pid = ref();
queryList(userStore.uid, 1, 1).then((res) => {
  pid.value = res.list[0].pid;
}).catch((err) => {
  console.log(err);
});

const selectFunc = (id) => {
  pid.value = id;
}
</script>

<style lang="less" scoped></style>