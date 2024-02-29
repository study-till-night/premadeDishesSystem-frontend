<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <h2>{{ appName }}</h2>
      <!-- 登录表单区域 -->
      <el-form label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item>
          <el-input v-model="form.userName" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item>
          <el-input v-model="form.password" placeholder="密码" type="password" clearable show-password></el-input>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-row justify="center">
          <el-form-item class="login_btn">
            <el-button type="primary" @click="doLogin" size="large" :icon="UserFilled">登录</el-button>
            <el-button color="#626aef" @click="router.push('/register')" size="large" :icon="UserFilled">注册</el-button>
            <el-button type="info" @click="form.userName = form.password = ''" size="large" :icon="Edit">清空</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user.js';
import { useMenuStore } from '@/store/menu.js';
import { useRouter, useRoute } from 'vue-router';
import { reactive } from 'vue';
import { ElMessage } from 'element-plus'
import { Edit, UserFilled } from '@element-plus/icons-vue';

const appName = import.meta.env.VITE_APP_TITLE;
const router = useRouter();
const route = useRoute()
const userStore = useUserStore();
const menuStore = useMenuStore();

const form = reactive({
  userName: route.query.userName || "18013383582" ,
  password: "t128129"
})

const doLogin = () => {
  if (form.userName === "" || form.password === "") {
    ElMessage.error("请输入完整信息")
    return;
  }
  userStore.DoLogin(form.userName, form.password).then((res) => {
    menuStore.GenerateRoutes().then((res) => {
      console.log("进入回调");
      userStore.role === "provider" ? router.push("/prodManage") : router.push("/index");
      ElMessage.success("登录成功")
    },)
  })
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
  height: 300px;
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
