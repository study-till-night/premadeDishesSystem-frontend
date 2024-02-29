<template>
  <div>
    <!-- 进度条 -->
    <el-steps :active="isCertificated" style="margin: 20px auto;" finish-status="success">
      <el-step title="填写信息" :icon="Document" />
      <el-step title="验证中" :icon="Timer" />
      <el-step title="认证成功" :icon="Checked" />
    </el-steps>
    <!-- 表单部分 -->
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="120px" label-position="top" status-icon
      style="margin-bottom: 50px;" v-loading="isCertificated === 1">
      <el-form-item label="企业名称" prop="orgName">
        <el-input v-model="form.orgName" clearable placeholder="请输入名称" :disabled="isCertificated === 3" />
      </el-form-item>
      <el-form-item label="企业地址" prop="orgAddress">
        <el-input v-model="form.orgAddress" clearable placeholder="请输入地址" :disabled="isCertificated === 3" />
      </el-form-item>
      <el-form-item label="营业执照编号" prop="licenseId">
        <el-input v-model="form.licenseId" clearable placeholder="请输入营业执照编号" :disabled="isCertificated === 3" />
      </el-form-item>
      <el-form-item label="负责人姓名" prop="chargerName">
        <el-input v-model="form.chargerName" clearable placeholder="请输入负责人姓名" :disabled="isCertificated === 3" />
      </el-form-item>
      <el-form-item label="负责人联系方式" prop="chargerMobile">
        <el-input v-model="form.chargerMobile" clearable placeholder="请输入负责人联系方式" :disabled="isCertificated === 3" />
      </el-form-item>
      <el-form-item label="企业类型">
        <el-radio-group v-model="form.orgType" :disabled="isCertificated === 3">
          <el-radio :label="0">企业</el-radio>
          <el-radio :label="1">学校</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 提交按钮 -->
      <el-row justify="end">
        <el-button v-if="isCertificated === 0" type="primary" @click="submitForm(ruleFormRef)">
          提交认证
        </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { certificate, getDetails } from '@/api/user.js';
import { useUserStore } from '@/store/user.js';
import { useMenuStore } from '@/store/menu.js';
import { Document, Timer, Checked } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';

let isCertificated = ref(0);
const userStore = useUserStore()
const menuStore = useMenuStore()

const ruleFormRef = ref(null)
const form = reactive({
  uid: userStore.uid,
  orgName: "",
  orgAddress: "",
  orgType: 0,
  licenseId: "",
  chargerName: "",
  chargerMobile: ""
})

const rules = reactive({
  orgName: [{
    required: true,
    message: '请输入名称',
    trigger: 'change',
  },],
  orgAddress: [
    {
      required: true,
      message: '请输入地址',
      trigger: 'change',
    },
  ],
  licenseId: [
    {
      required: true,
      message: '请输入营业执照编号',
      trigger: 'change',
    },
  ],
  chargerName: [
    {
      required: true,
      message: '请输入负责人姓名',
      trigger: 'change',
    },
  ],
  chargerMobile: [
    {
      required: true,
      message: '请输入负责人联系方式',
      trigger: 'change',
    },
  ],
})

const initData = () => {
  getDetails().then(({ org }) => {
    if (org) {
      isCertificated.value = 3;
      for (let i in form)
        form[i] = org[i];
    }
  })
}
initData();

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      isCertificated.value++;
      setTimeout(() => {
        certificate(form).then(() => {
          menuStore.GenerateRoutes();
          initData();
          isCertificated.value += 2;
        })
      }, 2000)
    } else console.log(fields);
  })
}
</script>

<style lang="less" scoped>
.info-item {
  display: inline-block;
  margin: 20% auto;
  color: #5d5d5d;
}
</style>