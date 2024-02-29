<template>
  <div class="main-content">
    <!-- 搜索 -->
    <el-row class="top-part">
      <el-col :span="9" :offset="1">
        <search placeholder="请输入货物名称" @doSearch="doSearch" />
      </el-col>
      <!-- 收货地址 -->
      <el-col :span="4">
        <el-select v-model="addIndex" class="m-2" placeholder="选择收货地址" style="width: 300px;">
          <template #prefix>
            <h4>收货地址</h4>
          </template>
          <el-option v-for="(item, index) in addresses" :key="item.addressId" :label="addName(item)" :value="index" />
        </el-select>
      </el-col>
    </el-row>
    <!-- 表格头 -->
    <tableHeader :headers="headers" style="margin: 0 auto; background-color: #ebebeb;width: 97%;" />
    <!-- 购物车主体 -->
    <div class="cart-main">
      <el-empty description="暂无内容" v-if="JSON.stringify(filteredData) == '{}'" />
      <!-- 每个供应商所属所有货物 -->
      <div class="pro-item" v-for="(val, key) in filteredData">
        <div class="pro-item-top">
          <!-- 供应商名称 -->
          <h5 style="cursor: pointer;" @click="viewSeller(val.sellerId)">{{ key }}</h5>
          <el-icon>
            <ArrowRightBold />
          </el-icon>
        </div>

        <!-- 每条购物表项 -->
        <el-row v-for="(item, index) in val.shopCars" :gutter="20" class="pro-item-main">
          <!-- 选择按钮 -->
          <el-col :span="1" :offset="1" style="margin-top: 30px;">
            <el-checkbox v-model="item.isChosen" size="large" @change="selectItem(val['shopCars'][index].cid)"
              :checked="item.isChosen" />
          </el-col>
          <!-- 货物图片 -->
          <el-col :span="2" style="margin-top: 10px;">
            <Image :src="val['prods'][index].picturePath" height="80px" width="80px" :preview="true" />
          </el-col>
          <!-- 货物名称\规格 -->
          <el-col :span="3" style="cursor: pointer;" @click="viewProd(val['prods'][index].pid)">
            <h5>{{ val['prods'][index].productName }}</h5>
            <h5>{{ val['specs'][index].specName }}</h5>
          </el-col>
          <!-- 单价 -->
          <el-col :span="3">
            <h5 style="font-weight: bold;text-indent: 20px;">{{ (val['specs'][index].price).toFixed(2) }}元/{{
              val['prods'][index].payType }}</h5>
          </el-col>
          <!-- 数量 -->
          <el-col :span="3">
            <h5 style="text-indent: 50px;">{{ val['shopCars'][index].count }}</h5>
          </el-col>
          <!-- 金额 -->
          <el-col :span="3">
            <h5 style="text-indent: 30px;color: #ec8c1e;font-weight: bold;"> {{ ((val['shopCars'][index].count) *
              val['specs'][index].price).toFixed(2) }}元
            </h5>
          </el-col>
          <!-- 操作 -->
          <el-col :span="3" style="margin-left:30px">
            <el-button :icon="Delete" type="danger" @click="removeItem(val['shopCars'][index].cid)">移出购货单</el-button>
          </el-col>
        </el-row>
      </div>
      <p style="height: 50px;background-color: #fff;"></p>
    </div>
    <!-- 行为框 -->
    <el-row class="cart-action">
      <!-- 全选 -->
      <el-col :span="2" style="padding: 30px;">
        <el-checkbox :indeterminate="isIndeterminate" size="large" label="全选" @change="selectEntire" v-model="checkedAll"
          :disabled="totalCnt === 0" />
      </el-col>
      <!-- 已选种类 -->
      <el-col :span="4">
        <span v-if="totalSelected !== 0" style="text-indent: 10px;border-left: 1px solid #c1c1c1;">已选种类</span>
        <span v-if="totalSelected !== 0" style="color: #ec8c1e;"> {{ totalSelected }}</span>
      </el-col>
      <!-- 总金额 -->
      <el-col :span="6" :offset="8">
        <span>当前合计(不含邮费)</span>
        <span style="font-size: 18px; color:red ; font-weight: bold;">{{ totalCost.toFixed(2) }}</span>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="large" :icon="Upload" @click="dialogTableVisible = true"
          :disabled="totalCost === 0 || addresses.length === 0">提交订单</el-button>
      </el-col>
    </el-row>
  </div>

  <!-- 确认提交订单 -->
  <el-dialog v-model="dialogTableVisible" title="提交订单" class="confirm-dialog">
    <!-- 进度条 -->
    <el-steps :active="step" align-center finish-status="success">
      <el-step title="核实订单" :icon="Document" />
      <el-step title="支付" :icon="Coin" />
      <el-step title="交易完成" :icon="Checked" />
    </el-steps>
    <!-- 主体信息 -->
    <div class="dialog-main" v-loading="step > 0">
      <div v-if="step === 0">
        <!-- 收货人信息 -->
        <h4>收货人信息</h4>
        <el-row>
          <el-col :span="4" :offset="2">{{ addresses[addIndex].userName }}</el-col>
          <el-col :span="4">{{ addresses[addIndex].mobile }}</el-col>
          <el-col :span="8">{{ addName(addresses[addIndex]) }}</el-col>
        </el-row>
        <!-- 支付方式 -->
        <h4>支付方式</h4>
        <el-row>
          <el-radio-group v-model="payType" style="margin-left:40px">
            <el-radio :label="1" size="large" border>
              <img src="https://www.ifresh1688.com/img/order/weixin_icon.png" alt="">
              微信</el-radio>
            <el-radio :label="2" size="large" border>
              <img src="https://www.ifresh1688.com/img/order/aliPay_icon.png" alt="">
              支付宝</el-radio>
          </el-radio-group>
        </el-row>
        <!-- 总金额 -->
        <el-row justify="end" style="height: 80px;">
          <el-col :span="8" class="price">
            <div>
              <span>总金额:</span>
              <span>{{ totalCost.toFixed(2) }}元</span>
            </div>
            <div>
              <span>总运费:</span>
              <span>{{ freight.toFixed(2) }}元</span>
            </div>
            <div>
              <span>应付金额:</span>
              <span style="font-size: 18px; color: red;">{{ (totalCost + freight).toFixed(2) }}元</span>
            </div>
          </el-col>
        </el-row>
        <!-- 确认按钮 -->
        <el-button type="primary" :icon="Upload" size="large" @click="submitOrder">提交订单</el-button>
      </div>
    </div>

  </el-dialog>
</template>

<script setup>
import { queryList, updateSingle, updateEntire, del, purchase } from '@/api/shopCar.js';
import { queryList as queryAdd } from '@/api/address.js';
import { reactive, ref, computed } from 'vue';
import tableHeader from '@/components/utils/tableHeader.vue';
import search from '@/components/utils/search.vue';
import { ArrowRightBold, Delete } from '@element-plus/icons-vue'
import Image from '@/components/utils/image.vue';
import { Upload, Document, Coin, Checked } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';

const router = useRouter();

// 信息相关
let content = ref("");
// 收货地址列表
let addresses = reactive([]);
// 收货地址index
let addIndex = ref("");
// 收货地址拼接
let addName = computed(() => (item) => {
  return item.province + item.city + item.district + item.detail;
})
// 处理后的购物车列表
let filteredData = reactive({});
// 购物车总条目
let totalCnt = ref(0);
// 总金额
let totalCost = ref(0);
// 运费
let freight = ref(0);
// 一共选择了多少
let totalSelected = ref(0);
// 是否全选
let checkedAll = ref(false);
// 是否处于中间状态
let isIndeterminate = ref(true);
// 确认提交订单
let dialogTableVisible = ref(false);

// 提交订单进度
let step = ref(0);
//加载
let payType = ref(1);
//表头
let headers = reactive([{
  name: "商货信息", span: 4
}, {
  name: "单价", span: 3
}, {
  name: "数量", span: 3
}, {
  name: "金额", span: 3
}, {
  name: "操作", span: 3
}])
// 初始化
const initData = () => {
  queryList(content.value).then(({ shopCars, prods, specs, providers }) => {
    for (let key in filteredData)
      delete filteredData[key];

    let total = shopCars.length;
    totalCnt.value = total;
    // 对接口数据进行处理
    for (let i = 0; i < total; i++) {
      let name = providers[i].orgName;
      if (!(name in filteredData)) {
        filteredData[name] = { sellerId: providers[i].uid };
        // 不能连等!
        filteredData[name].shopCars = [];
        filteredData[name].prods = []
        filteredData[name].specs = [];
      }
      filteredData[name].shopCars.push(shopCars[i]);
      filteredData[name].prods.push(prods[i]);
      filteredData[name].specs.push(specs[i]);
    }
    // 处理其他数据
    let cnt = 0, sumT = 0, sumF = 0;

    for (let i in shopCars) {
      if (shopCars[i].isChosen === true) {
        cnt++;
        sumT += specs[i].price * shopCars[i].count;
        sumF += prods[i].freight;
      }
    }
    totalSelected.value = cnt;
    totalCost.value = sumT;
    freight.value = sumF;
    // 更新选择状态
    checkedAll.value = totalSelected.value === totalCnt.value;
    isIndeterminate.value = totalSelected.value > 0 && totalSelected.value < totalCnt.value;
  })
}
initData()
// 收货地址列表
queryAdd().then(({ data }) => {
  addresses.length = 0;
  if (data !== null) {
    addresses.push(...data);
    addIndex.value = 0;
  }
})
// 按内容搜索
const doSearch = (_content) => {
  content.value = _content;
  console.log(_content, content.value);
  initData();
};

// 选择某一条
const selectItem = (cid) => {
  updateSingle(cid).then(() => {
    initData();
  })
}
// 全选/取消全选
const selectEntire = () => {
  updateEntire().then(() => {
    initData();
    isIndeterminate.value = false;
  })
}
// 移除某一条
const removeItem = (cid) => {
  del(cid).then(() => {
    initData();
  })
}
// 提交订单
const submitOrder = () => {
  // 到支付步骤
  step.value++;
  setTimeout(() => {
    purchase(addresses[addIndex.value].addressId).then(() => {
      // 到支付成功步骤
      step.value += 2;
      initData();
      // 关闭窗口
      setTimeout(() => {
        payType.value = 1;
        step.value = 0;
        dialogTableVisible.value = false;
      }, 2000);
    })
  }, 2000);
}

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
@import "../../assets/less/layout.less";

.main-content {
  position: relative;
}

.top-part {
  height: 60px;
  padding-top: 12px;
  background-color: #fff;
}

.cart-main {
  width: 100%;
  padding: 20px;
  height: 600px;
  overflow: scroll;
  background-color: #fff;
}

.pro-item {
  width: 100%;
  margin: 10px auto;
  border: 1px solid #c7c7c7;

  h5 {
    font-weight: 500;
    font-size: 14px;
    color: #393939;
  }

  .pro-item-top {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #c7c7c7;

    h5 {
      display: inline-block;
      padding-left: 20px;
      line-height: 40px;
    }

    i {
      display: inline-block;
      font-size: 12px;
      line-height: 40px;
      margin-left: 5px;
    }
  }

  .pro-item-main {
    height: 101px;

    h5 {
      margin-top: 20px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    button {
      margin-top: 20px;
    }
  }
}

.cart-action {
  position: absolute;
  bottom: -30px;
  width: 100%;
  height: 91px;
  box-shadow: 0 -2px 10px 1px rgb(152, 152, 152);
  background-color: #fff;
  z-index: 1;

  span {
    display: inline-block;
    height: 45px;
    margin: 30px 0;
    margin-right: 10px;
    line-height: 40px;
    font-size: 14px;
    color: #555555;
  }

  button {
    margin-top: 25px;
  }
}

.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}

.confirm-dialog {
  position: relative;
  overflow: scroll;

  button {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }

  .dialog-main {
    height: 450px;
    margin-top: 20px;

    h4 {
      width: 100%;
      height: 40px;
      margin: 40px 0 30px 0;
      line-height: 40px;
      border-bottom: 1px solid #b6b6b6;
    }

    img {
      display: inline-block;
      vertical-align: middle;
      height: 20px;
      width: 20px;
    }

    .el-col {
      overflow: hidden;
    }

    .price>div {
      margin: 15px 0;

      span:nth-child(2) {
        float: right;
        margin-left: 60px;
        font-weight: bold;
      }
    }
  }
}
</style>