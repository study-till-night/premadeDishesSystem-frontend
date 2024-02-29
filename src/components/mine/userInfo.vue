<template>
  <el-form :model="form" label-width="120px" label-position="top" status-icon>
    <!-- 性别 -->
    <el-form-item label="性别">
      <el-radio-group v-model="form.gender">
        <el-radio :label="0">男</el-radio>
        <el-radio :label="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 手机号 -->
    <el-form-item label="手机号">
      <el-input v-model="form.mobile" clearable placeholder="请输入手机号" />
    </el-form-item>
    <!-- 邮箱 -->
    <el-form-item label="邮箱">
      <el-input v-model="form.email" clearable placeholder="请输入邮箱" />
    </el-form-item>
    <!-- 真实姓名 -->
    <el-form-item label="真实姓名">
      <el-input v-model="form.realName" clearable placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label-position="right">
      <el-button type="primary" @click="submit()">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { getDetails, updateDetails } from '@/api/user.js';
import { reactive, onMounted } from 'vue';
import { validEmail, ValidMobile } from '@/utils/validate.js';
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user.js';

const userStore = useUserStore()
const form = reactive({
  uid: userStore.uid,
  gender: 0,
  mobile: "",
  email: "",
  realName: ""
})

onMounted(() => {
  getDetails(userStore.uid).then(({ details }) => {
    form.gender = details.gender;
    form.mobile = details.mobile;
    form.realName = details.realName;
    form.email = details.email
  })
})

const submit = () => {
  if (form.email !== "" && !validEmail(form.email)) {
    ElMessage.error("邮箱格式不规范!")
    return;
  }
  if (form.mobile !== "" && !ValidMobile(form.mobile)) {
    ElMessage.error("手机号格式不规范!")
    return;
  }

  updateDetails(form);
}
</script>

<style lang="scss" scoped></style>