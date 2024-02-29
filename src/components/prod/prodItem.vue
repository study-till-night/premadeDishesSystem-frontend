<template>
  <!-- 货物图片 -->
  <el-row style="background-color: #dbdbdb;">
    <Image :src="prod.picturePath" height='180px' width='100%' :preview="true" />
  </el-row>
  <div class="bottom-content">
    <!-- 货物名称 -->
    <div class="prod-name">
      {{ prod.productName }}
    </div>
    <!-- 货物种类 -->
    <div class="prod-cate">
      {{ categories[prod.categoryId - 1] && categories[prod.categoryId - 1].categoryName }}
    </div>
    <!-- 简介 -->
    <div class="prod-abs">
      简介:{{ prod.abstruct }}
    </div>
    <!-- 销量 -->
    <div class="prod-sellNum">
      销售量 {{ prod.sellNum }} {{ prod.payType }}
    </div>
    <el-row>
      <el-button type="warning" plain @click="viewProd(prod.pid)" style="width: 90%; margin-left: 10px;">了解新品</el-button>
    </el-row>
  </div>
</template>

<script setup>
import Image from '@/components/utils/image.vue';
import { queryList } from '@/api/category.js';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  prod: {}
})

const categories = reactive([]);
// 获取货物列表
queryList().then(({ data }) => {
  categories.length = 0;
  categories.push(...data)
})

// 查看货物
const viewProd = (pid) => {
  let routeUrl = router.resolve({
    path: `/prod/${pid}`
  });
  window.open(routeUrl.href, '_blank');
}
</script>

<style lang="less" scoped>
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #b5b5b5;
  font-size: 30px;
  font-weight: 400;
}

.bottom-content {
  border-radius: 5px;
  height: 50%;
  border: 1px solid #c9c9c9;
  border-top: 0;
}

.prod {

  &-name {
    width: 100%;
    height: 30px;
    margin-bottom: 5px;
    text-indent: 10px;
    line-height: 40px;
    font-size: 17px;
    font-weight: 500;

    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &-cate,
  &-abs {
    width: 100%;
    height: 20px;
    margin-bottom: 5px;
    text-indent: 10px;
    line-height: 20px;
    font-size: 14px;
    color: #707070;
  }

  &-abs {
    font-size: 12px;

    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &-sellNum {
    height: 20px;
    margin-bottom: 10px;
    text-indent: 10px;
    font-size: 16px;
  }
}
</style>