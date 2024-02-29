<template>
  <div class="recipe-item">
    <el-row>
      <!-- 货物图片 -->
      <el-col :span="5">
        <Image :src="props.prod.picturePath" height='180px' width='180px' :preview="true" />
        <div v-if="userStore.role !== 'provider' && route.path.includes('/provider') === false">
          <h5 style="font-size: 14px;">供应商:</h5>
          <h5>{{ org.orgName }}</h5>
          <el-button link :icon="Pointer" type="primary" style="margin-top: 10px;" plain
            @click="viewSeller(org.uid)">查看供应商</el-button>
        </div>
      </el-col>
      <el-col :span="19" class="item-info">
        <h5>菜品名称: <span style="font-weight: 500;">{{ prod.productName }}</span>
        </h5>
        <p><span>食材原料:</span> {{ recipe.ingredients }}</p>
        <p><span>所需辅料:</span> {{ recipe.seasoning }}</p>
        <p><span>制作步骤:</span> {{ recipe.steps }}</p>
        <p><span>注意事项:</span> {{ recipe.tips === "" ? "无" : recipe.tips }}</p>
        <!-- 操作 -->
        <el-row justify="end">
          <!-- 供应方按钮 -->
          <div v-if="userStore.role === 'provider'">
            <el-button :icon="Edit" type="primary" plain @click="emits('onEdit', recipe)">编辑食谱</el-button>
            <el-badge :value="recipe.love" class="item">
              <el-icon style="color:orange;font-size: 30px;">
                <Star />
              </el-icon>
            </el-badge>
          </div>
          <!-- 需求方按钮 -->
          <div v-else>
            <el-button plain type="primary" @click="viewProd(prod.pid)">购买该菜品</el-button>
            <el-badge :value="recipe.love" class="item">
              <el-button plain type="warning" :icon="recipe.isLoved ? StarFilled : Star"
                @click="emits('addLove', recipe.rid)" :disabled="recipe.isLoved" />
            </el-badge>
          </div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import Image from '@/components/utils/image.vue';
import { useUserStore } from '@/store/user.js';
import { useRouter, useRoute } from 'vue-router';
import { Pointer, Star, StarFilled, Edit } from '@element-plus/icons-vue'

const userStore = useUserStore();
const router = useRouter()
const route = useRoute();

const props = defineProps({
  recipe: {},
  prod: {},
  org: {}
})
const emits = defineEmits(["onEdit", "addLove"])

// 查看货物
const viewProd = (pid) => {
  let routeUrl = router.resolve({
    path: `/prod/${pid}`
  });
  window.open(routeUrl.href, '_blank');
}
// 查看货物
const viewSeller = (uid) => {
  let routeUrl = router.resolve({
    path: `/provider/${uid}`
  });
  window.open(routeUrl.href, '_blank');
}
</script>

<style lang="less" scoped>
.recipe-item {
  width: 100%;
  height: 300px;
  padding: 20px;
  border: 1px solid #cfcfcf;

  h5 {
    color: #4f4f4f;
  }
}

.item-info {
  p {
    width: 100%;
    max-height: 40px;
    margin: 20px 0 20px 0;
    overflow: scroll;
    text-overflow: clip;
    color: #4f4f4f;
    font-size: 16px;
    word-wrap: break-word;

    span {
      font-weight: bold;
    }
  }
}

.el-row {
  button {
    margin: 0 5px;
  }
}
</style>