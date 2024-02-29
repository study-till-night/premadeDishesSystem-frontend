<template>
  <el-row @mouseenter="hidden = false">
    <el-col :span="10">
      <div class="avatur-circle">
        <el-avatar :icon="UserFilled" />
      </div>
    </el-col>
    <el-col :span="14">
      <div class="user-name">
        <h4 style="display: inline-block">{{ userStore.name }}</h4>
        <el-icon>
          <CaretBottom />
        </el-icon>
      </div>
    </el-col>
    <!-- 悬浮框 -->
    <transition name="fade">
      <DropDown :hidden="hidden" @onleave="hidden = true;" />
    </transition>
  </el-row>
</template>

<script setup>
import { UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user.js';
import { ref } from 'vue';
import DropDown from './dropDown.vue';

const userStore = useUserStore()
const hidden = ref(true);
</script>

<style lang="less" scoped>
.avatur-circle {
  // margin-top: 5px;
  margin-right: 10px;
}

.user-name {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;

  h4 {
    width: 100%;
    font-size: 14px;
    color: #e8e8e8;
    font-weight: 400;
    line-height: 40px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: -webkit-box; //弹性盒模型
    -o-text-overflow: ellipsis;
    -webkit-box-orient: vertical;
  }

  i {
    margin-left: 10px;
    color: #e8e8e8;
  }
}

.fade-enter-active,
.fade-leave-active {
  opacity: 1;
  transition: all 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

div:nth-child(1) {
  cursor: pointer;
}
</style>