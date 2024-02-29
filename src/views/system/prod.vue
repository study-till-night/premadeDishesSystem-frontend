<template>
  <!-- 顶部供应商信息 -->
  <div class="top-content">
    <providerInfo :sellerId="sellerId" :providerName="providerName">
      <el-col :span="2" :offset="6">
        <el-button :icon="Pointer" type="primary" plain style="margin-top: 20px;"
          @click="viewSeller(sellerId)">查看供应商</el-button>
      </el-col>
    </providerInfo>
  </div>

  <!-- 主体信息 -->
  <div class="main-content">
    <detail />
  </div>

  <!-- 评论区 -->
  <div class="comment">
    <comment />
  </div>
</template>

<script setup>
import providerInfo from '@/components/prod/providerInfo.vue';
import detail from '@/components/prod/prodDetail.vue';
import comment from '@/components/prod/comment.vue';
import { Pointer } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router';
import { viewOne } from '@/api/prod/prodUser.js';
import { ref } from 'vue';

const router = useRouter();
const route = useRoute();

let sellerId = ref(0);
let providerName = ref("")
// 获取货物对于供应商id
viewOne(route.params.pid).then(({ provider }) => {
  sellerId.value = provider.uid;
  providerName.value = provider.orgName;
})
// 查看供应商
const viewSeller = (uid) => {
  let routeUrl = router.resolve({
    path: `/provider/${uid}`
  });
  window.open(routeUrl.href, '_blank');
}
</script>

<style lang="less" scoped>
@import "../../assets/less/layout.less";

.comment {
  width: 75%;
  margin: 0 auto;
  margin-bottom: 30px;
  background-color: #fff;
}
</style>