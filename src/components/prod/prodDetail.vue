<template>
  <el-row class="prod-detail" :gutter="20">
    <!-- 货物图片 -->
    <el-col :span="8" class="prod-img">
      <Image :src="prod.picturePath" width="100%" height="350px" :preview="true" />
    </el-col>
    <!-- 信息部分 -->
    <el-col :span="14" class="prod-info">
      <h3 style="display: inline-block;">{{ prod.productName }}</h3>
      <!-- 是否支持个性化定制 -->
      <span><span style="color:red;font-weight: bold;">注:</span> 该货物<span
          v-if="!prod.customizable">不</span>允许个性化配比(只限企业批发)</span>
      <br>
      <h4 v-if="specs.length !== 0" style="color:red;margin: 10px 10px 0 0">¥{{
        (parseInt(specs[specIndex].price)).toFixed(2)
      }}</h4>

      <h4 v-else style="color:red;margin: 10px 10px 0 0">暂无价格</h4>
      <h4>库存: {{ specs[specIndex] && specs[specIndex].inventory }}</h4>

      <!-- 类型 -->
      <el-row>
        <el-col :span="5">
          <span>类别:</span>
          <span>{{
            categories[prod.categoryId - 1] && categories[prod.categoryId - 1].categoryName }}</span>
        </el-col>
        <!-- 发货地址 -->
        <el-col :span="8">
          <span>发货地址:</span>
          <span>{{ [address.province, address.city, address.district].join(" ") }}</span>
        </el-col>
      </el-row>
      <!-- 销量/运费/单位 -->
      <el-row :gutter="10" style="margin-top: 0;">
        <el-col :span="5">
          <span>销量:</span>
          <span>{{ prod.sellNum }}</span>
        </el-col>

        <el-col :span="3">
          <span>单位:</span>
          <span>{{ prod.payType }}</span>
        </el-col>

        <el-col :span="4">
          <span>运费:</span>
          <span>{{ parseInt((prod.freight)).toFixed(2) }}元</span>
        </el-col>

        <el-col :span="4">
          <span>起购量(对于校企):</span>
          <span>{{ prod.leastNum }}</span>
        </el-col>
      </el-row>
      <!-- 简介 -->
      <div>
        <span> 简介:</span>
        <p>{{ prod.abstruct }}</p>
      </div>
      <!-- 规格 -->
      <div>
        <span>规格:</span>
        <div>
          <el-empty v-if="specs.length === 0" description="暂无内容" :image-size="150" style="margin: 0 auto;" />
          <el-radio-group v-model="specIndex">
            <el-radio v-for="(item, index) in specs" :label="index" size="large" border :disabled="!item.isEnabled"
              style="margin-bottom: 15px;">{{
                item.specName }}</el-radio>
          </el-radio-group>
        </div>
      </div>

      <!-- 加入订货单 -->
      <el-row>
        <el-col :span="2">
          <span>数量</span>
        </el-col>
        <!-- 输入框 -->
        <el-col :span="6">
          <el-input-number v-model="count" :min="userStore.role === 'organization' ? prod.leastNum : 1" placeholder="购买数量"
            style="margin-top:0" :disabled="specs.length === 0 || specs[specIndex].isEnabled === false" />
        </el-col>
        <!-- 提交 -->
        <el-col :span="4">
          <el-button type="primary" @click="addToCar" :icon="ShoppingCart"
            :disabled="specs.length === 0 || specs[specIndex].isEnabled === false">
            加入进货单
          </el-button>
        </el-col>
      </el-row>

      <!-- 提出合同 -->
      <el-row v-if="userStore.role === 'organization'" style="margin-bottom: 60px;">
        <el-col :span="2">
          <span>操作:</span>
        </el-col>
        <el-col :span="4">
          <el-button :icon="Document" type="danger" @click="proposeContract">长期交易</el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, watch } from 'vue';
import { viewOne } from '@/api/prod/prodUser.js';
import { queryList } from '@/api/category.js';
import { add } from '@/api/shopCar.js';
import { useUserStore } from '@/store/user.js';
import Image from '@/components/utils/image.vue';
import { ShoppingCart, Document } from '@element-plus/icons-vue'

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 货物信息相关
let prodId = ref(route.params.pid);
let prod = reactive({});
let specs = reactive([]);
let address = reactive({})
let categories = reactive([])
let specIndex = ref(0);
let count = ref(1);

//获取当前查看的货物信息
viewOne(prodId.value).then((data) => {
  for (let i in data.detail)
    prod[i] = data.detail[i];
  if (userStore.role === 'organization')
    count.value = prod.leastNum;
  specs.push(...data.specs);

  for (let i in data.address)
    address[i] = data.address[i];
})

// 获取货物分类
queryList().then(({ data }) => {
  categories.push(...data);
})

// 添加进购物车
const addToCar = () => {
  add({ pid: prodId.value, uid: userStore.uid, count: count.value, specId: specs[specIndex.value].productSpecId })
}

// 提出合同
const proposeContract = () => {
  let routeUrl = router.resolve({
    path: "/contract",
    query: {
      pid: route.params.pid,
    }
  });
  window.open(routeUrl.href, '_blank');
}
</script>
  
<style lang="less" scoped>
@margin: 20px;
@import "../../assets/less/prodRevelent.less";

.prod-img {
  margin: @margin;
  overflow: hidden;

  .el-image {
    border-radius: 20px;
  }
}

.prod-info {
  margin-top: @margin;

  span {
    font-size: 14px;
    color: rgb(131, 131, 131);
  }

  h3 {
    margin-right: 50px;
  }

  h4 {
    display: inline-block;
  }

  div {
    margin-top: 10px;

    span:nth-child(1) {
      margin-right: 10px;
      color: rgb(131, 131, 131);
    }

    span:nth-child(2) {
      font-weight: bold;
      color: #1f1f1f;
    }
  }

  p {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>