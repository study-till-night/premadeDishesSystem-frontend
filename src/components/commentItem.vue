<template>
  <!-- 用户信息 -->
  <el-row>
    <el-col :span="2">
      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
    </el-col>
    <el-col :span="4">
      <h5>{{ (comment.userName).substr(0, 3) + "*****" + (comment.userName).substr(8, 3) }}</h5>
      <h5>{{ format(comment.createTime) }}</h5>
    </el-col>
    <el-col :span="2" :offset="16" v-if="userStore.role === 'provider'">
      <el-tooltip effect="dark" :content="`联系电话:${comment.userName}`" placement="top-start">
        <el-button link type="primary" :icon="ChatRound">联系用户</el-button>
      </el-tooltip>
    </el-col>
  </el-row>
  <!-- 评论内容 -->
  <p>{{ (comment.content) }}</p>
  <!-- 点赞数 -->
  <el-row justify="end" style="margin-bottom: 10px;" v-if="userStore.role !== 'provider'">
    <el-badge :value="comment.love" class="item">
      <el-button plain type="warning" :icon="comment.isLoved ? StarFilled : Star" :disabled="comment.isLoved"
        @click="emits('addLove', comment.cid)" />
    </el-badge>
  </el-row>
</template>

<script setup>
import { format } from '@/utils/dateUtils.js';
import { Star, StarFilled, ChatRound } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user.js';

const userStore = useUserStore();

const props = defineProps({
  comment: {}
})
const emits = defineEmits(['addLove'])
</script>

<style lang="less" scoped>
h5:nth-child(2) {
  font-size: 12px;
  color: #5f5f5f;
}

p {
  width: 100%;
  overflow: scroll;
  text-overflow: clip;
  word-break: break-all;
  font-size: 14px;
  margin: 10px;
}
</style>