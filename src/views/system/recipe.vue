<template>
  <!-- 标题 -->
  <div class="top-title">
    <h2><el-icon style="margin-right: 10px;">
        <Dish />
      </el-icon>食谱广场 <el-tooltip effect="dark" :content="tipContent" placement="bottom-end">
        <el-icon style="color:orange">
          <QuestionFilled />
        </el-icon>
      </el-tooltip>
    </h2>
    <h5>为您提供透明的预制菜制作流程</h5>
  </div>
  <!-- 主体 -->
  <div class="main-content">
    <userRecipe v-if="userStore.role !== 'provider'" />
    <proRecipe v-else />
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user.js';
import userRecipe from '@/components/recipe/userRecipe.vue';
import proRecipe from '@/components/recipe/proRecipe.vue';
import { Dish, QuestionFilled } from '@element-plus/icons-vue'

const userStore = useUserStore();

// 提示语
const tipContent = "食谱广场所有内容均有供应商发布" +
  "供应商出于自愿将旗下某一菜品食材与制作工艺等公开, 其会获得相应的透明度积分, 公开的信息可供需求方参考"

</script>

<style lang="less" scoped>
@import "../../assets/less/layout.less";

.main-content {
  width: 70%;
  margin: 0 auto;
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
}
</style>