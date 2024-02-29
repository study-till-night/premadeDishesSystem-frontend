<template>
  <div class="drop-down" v-if="hidden === false" @mouseleave="emit('onleave');">
    <el-row class="drop-down-up">
      <el-col :span="10">身份</el-col>
      <el-col :span="14">{{ roleName }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="16" class="drop-down-left">
        <el-row>
          <el-col :span="8">
            <el-avatar :icon="UserFilled" />
          </el-col>
          <el-col :span="16">
            <span class="user-name" style="display: inline-block">{{ userStore.name }}</span>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" @click="handleExit" class="drop-down-right">退出</el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user.js';
import { UserFilled } from '@element-plus/icons-vue'
import { logout } from '@/api/login.js';
import { useRouter } from 'vue-router';
import { removeToken } from '@/utils/auth.js';

const router = useRouter()
const userStore = useUserStore()
const roleName = userStore.role === "common_user" ? "普通用户" : userStore.role === "organization" ? "校企" : "供应商";

const props = defineProps({
  hidden: { type: Boolean, default: true }
})
const emit = defineEmits(['onleave'])

const handleExit = () => {
  logout().then(() => {
    removeToken();
    sessionStorage.removeItem("menuIndex")
    router.push("/login");
  })
}

</script>

<style lang="less" scoped>
.drop-down {
  position: fixed;
  top: 60px;
  right: 1%;
  width: 240px;
  height: 100px;
  color: rgb(102, 102, 102);
  background-color: #f8f8f8;
  border-radius: 5%;
  box-shadow: 0 0 20px #b2b2b2;
  z-index: 1;

  &-right {
    font-size: 14px;
    line-height: 60px;

    &:hover {
      color: orange;
    }
  }

  &-left {
    height: 60%;
    margin-top: 10px;
    font-size: 14px;
    border-right: solid 2px rgb(214, 214, 214);
  }

  &-up {
    height: 40%;
    font-size: 14px;
    line-height: 40px;
    border-bottom: solid 1px rgb(214, 214, 214);
  }
}

.user-name {
  height: 100%;
  max-width: 100%;
  line-height: 40px;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: -webkit-box; //弹性盒模型
  -webkit-box-orient: vertical;
  -webkit-text-overflow: ellipsis;
}
</style>