<template>
  <!-- 角色信息 -->
  <el-row>
    <el-col :span="6">
      <el-avatar :icon="UserFilled" />
    </el-col>
    <el-col :span="12">
      <h5>{{ userStore.name }}</h5>
    </el-col>
  </el-row>
  <!-- 侧边菜单 -->
  <el-menu default-active="0" class="el-menu-vertical-demo" @select="handleSelect"
    style="box-shadow: 0 0 10px 5px #8a8a8a;">
    <el-menu-item index="0">
      <template #title>地址管理</template>
      <el-icon>
        <Location />
      </el-icon>
    </el-menu-item>
    <el-menu-item index="1">
      <template #title>个人信息</template>
      <el-icon>
        <UserFilled />
      </el-icon>
    </el-menu-item>
    <el-menu-item index="2">
      <template #title>企业认证</template>
      <el-icon>
        <Promotion />
      </el-icon>
    </el-menu-item>
    <el-menu-item index="3" v-if="userStore.role === 'provider'">
      <template #title>我的数据</template>
      <el-icon>
        <DataAnalysis />
      </el-icon>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { Location, UserFilled, Promotion, DataAnalysis } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/user.js';

defineProps({
  showIndex: {
    type: Number,
    default: 0
  }
})

const emits = defineEmits(["onHandleSelect"])
const userStore = useUserStore()

const handleSelect = (key) => {
  emits("onHandleSelect", parseInt(key))
}
</script>

<style lang="less" scoped>
span {
  margin-bottom: 10px;
}

h5 {
  font-size: 16px;
  font-weight: 600;
  line-height: 40px;
  color: #e3e3e3;
}
</style>