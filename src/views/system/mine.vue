<template>
  <el-row>
    <!-- 侧边栏 -->
    <el-col :span="4" :offset="4">
      <sideBar @onHandleSelect="onHandleSelect" />
    </el-col>
    <el-col :span="12">
      <div class="main-content">
        <Address v-if="showIndex === 0" />
        <userInfo v-if="showIndex === 1" />
        <certificate v-if="showIndex === 2" />
        <MyData v-if="showIndex === 3" />
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import sideBar from 'cmp/mine/sideBar.vue';
import Address from 'cmp/mine/address.vue';
import userInfo from 'cmp/mine/userInfo.vue';
import certificate from 'cmp/mine/certificate.vue';
import MyData from '../../components/mine/myData.vue';
import { ref } from 'vue';

let showIndex = ref(0);

const onHandleSelect = (index) => {
  showIndex.value = index;
}
</script>

<style lang="less" scoped>
.main-content {
  margin-left: 15px;
  margin-top: 50px;
  padding: 10px 80px 10px 30px;
  background-color: #fff;
  box-shadow: 0 0 10px 5px #8a8a8a;
}
</style>