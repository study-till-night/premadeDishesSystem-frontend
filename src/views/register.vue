<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <h2>{{ appName }}</h2>
      <!-- 注册表单区域 -->
      <el-form label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item>
          <el-input v-model="loginForm.userName" placeholder="用户名" clearable maxlength="11" show-word-limit />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item>
          <el-input v-model="loginForm.password" placeholder="密码" type="password" clearable show-password />
        </el-form-item>
        <el-form-item>
          <el-input v-model="loginForm.confirmPassword" placeholder="确认密码" type="password" clearable show-password />
        </el-form-item>

        <!-- 角色选择 -->
        <el-row justify="center">
          <el-form-item>
            <el-radio-group v-model="loginForm.role" size="large">
              <el-radio label="普通用户" border>普通用户</el-radio>
              <el-radio label="供应商" border @click="dialogVisible = true">供应商</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>

        <!-- 按钮区域 -->
        <el-row justify="center">
          <el-form-item class="login_btn">
            <el-button color="#626aef" @click="doRegister(ruleFormRef)" size="large" :icon="UserFilled">注册</el-button>
            <el-button type="info"
              @click="loginForm.userName = loginForm.password = loginForm.confirmPassword = ''; loginForm.role = '普通用户'"
              size="large" :icon="Edit">清空</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
  <!-- 认证对话框 -->
  <el-dialog v-model="dialogVisible">
    <el-form ref="ruleFormRef" :model="orgForm" :rules="rules" label-width="120px" label-position="top" status-icon
      style="margin-bottom: 50px;">
      <el-form-item label="企业名称" prop="orgName">
        <el-input v-model="orgForm.orgName" clearable placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="企业地址" prop="orgAddress">
        <el-input v-model="orgForm.orgAddress" clearable placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="营业执照编号" prop="licenseId">
        <el-input v-model="orgForm.licenseId" clearable placeholder="请输入营业执照编号" />
      </el-form-item>
      <el-form-item label="负责人姓名" prop="chargerName">
        <el-input v-model="orgForm.chargerName" clearable placeholder="请输入负责人姓名" />
      </el-form-item>
      <el-form-item label="负责人联系方式" prop="chargerMobile">
        <el-input v-model="orgForm.chargerMobile" clearable placeholder="请输入负责人联系方式" />
      </el-form-item>
      <!-- 确定按钮 -->
      <el-row justify="end">
        <el-button size="large" type="primary" @click="dialogVisible = false">
          确定
        </el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { useUserStore } from '@/store/user.js';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue';
import { Edit, UserFilled } from '@element-plus/icons-vue';
import { ValidMobile } from '@/utils/validate.js';

const appName = import.meta.env.VITE_APP_TITLE;
const router = useRouter();
const userStore = useUserStore();
const ruleFormRef = ref(null)

// 用户表单
const loginForm = reactive({
  userName: "",
  password: "",
  confirmPassword: "",
  role: "普通用户"
})
// 企业认证表单
let dialogVisible = ref(false);
const orgForm = reactive({
  uid: "",
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

// 执行注册
const doRegister = async (elForm) => {

  let userName = loginForm.userName;
  let password = loginForm.password
  let confirmPassword = loginForm.confirmPassword;
  let role = loginForm.role === "普通用户" ? 0 : 2;

  if (userName === "" || password === "") {
    ElMessage.error("请输入完整信息!")
    return;
  }
  if (password !== confirmPassword) {
    ElMessage.error("密码不一致!");
    return;
  }
  if (ValidMobile(userName) === false) {
    ElMessage.error("用户名须为11位手机号码!");
    return;
  }
  const submit = () => {
    // 执行注册
    userStore.Register(userName, password, role, orgForm).then(() => {
      router.push({
        path: "/login",
        query: {
          userName
        }
      })
    })
  }
  // 验证企业表单合法性
  if (role === 2)
    await elForm.validate((valid, fields) => {
      if (!valid)
        ElMessage.error("企业信息不完整");
      else {
        submit();
      }
    })
  else submit();
}
</script>

<style lang="less" scoped>
.login_container {
  background-image: url("../assets/login_bgp.png");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  height: 100vh;
}

.login_box {
  // 宽450像素
  width: 450px;
  // 高300像素
  height: 400px;
  // 背景颜色
  background-color: #fff;
  // 圆角边框3像素
  border-radius: 3px;
  // 绝对定位
  position: absolute;
  // 距离左则50%
  left: 50%;
  // 上面距离50%
  top: 50%;
  // 进行位移，并且在横轴上位移-50%，纵轴也位移-50%
  transform: translate(-50%, -50%);

  border-radius: 10px;

  h2 {
    margin-top: 90px;
    text-align: center;
    color: #b2d6dd;
    font-family: 'Times New Roman', Times, serif;
  }
}

.avatar_box {
  // 盒子高度130像素
  height: 130px;
  // 宽度130像素
  width: 130px;
  // 边框线1像素 实线
  border: 1px solid #eee;
  // 圆角
  border-radius: 50%;
  // 内padding
  padding: 10px;
  // 添加阴影 向外扩散10像素 颜色ddd
  box-shadow: 0 0 10px #ddd;
  // 绝对定位
  position: absolute;
  // 距离左则
  left: 50%;
  // 位移
  transform: translate(-50%, -50%);
  // 背景
  background-color: #fff;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}


.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.login_btn {
  // 设置弹性布局
  display: flex;
  // 横轴上尾部对齐
  justify-content: center;
}
</style>