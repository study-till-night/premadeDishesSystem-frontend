<template>
  <!-- 顶部查询 -->
  <el-row class="top-content">
    <el-col :span="4" :offset="1">
      <el-select v-model="status" class="m-2" placeholder="选择订单状态" size="large" style="margin-top: 15px;"
        @change="content = ''; initData()">
        <template #prefix>
          <h4>订单状态</h4>
        </template>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-col>
    <!-- 内容搜索 -->
    <el-col v-if="status === -1" :span="9" :offset="1" style="margin-top: 20px;">
      <search placeholder="请输入货物名称" @doSearch="doSearch" />
    </el-col>
  </el-row>

  <tableHeader :headers="headers" style="color: #e2e2e2;!important" />

  <!-- 主体部分 -->
  <div class="main-content">
    <el-empty description="暂无内容" v-if="orders.length === 0" />
    <div class="info-item" v-for="(item, index) in orders">
      <!-- 订单头 -->
      <el-row class="info-item-top">
        <!-- 日期 -->
        <el-col :span="8" :offset="1">
          <h5>提交时间:{{ format(item.createTime) }}</h5>
          <h5>更新时间:{{ format(item.updateTime) }}</h5>
        </el-col>
        <!-- 供应商名 -->
        <el-col :span="10" :offset="2">
          <el-icon>
            <User />
          </el-icon>
          <h5 class="link-info" @click="(userStore.role !== 'provider') ? viewProd(prods[index].pid) : 2">
            {{
              providers[index].orgName }}</h5>
        </el-col>
      </el-row>
      <!-- 订单详细 -->
      <el-row class="info-item-main">
        <!-- 订单编号 -->
        <el-col :span="1" :offset="1" style="font-size: 14px; line-height: 50px;">{{ item.oid }}</el-col>
        <!-- 状态 -->
        <el-col :span="3" style="margin-left: 20px;">
          <h5 style="display: inline-block;margin-right: 20px;" :class="{ 'color-1': item.status === 3 }">{{
            staStr[item.status] }}</h5>
          <!-- 订单状态查询 -->
          <el-button plain type="primary" class="m-2" @click="deliverDialog = true; orderIndex = index"
            :disabled="item.status === 0">物流追踪</el-button>
        </el-col>
        <!-- 货物图片 -->
        <el-col :span="2" :offset="1">
          <Image :src="prods[index].picturePath" width="80px" height="80px" preview="true" style="margin-top: 15px;" />
        </el-col>
        <!-- 货物信息 -->
        <el-col :span="2" class="prod-info">
          <h5 class="link-info" @click="(userStore.role !== 'provider') ? viewProd(prods[index].pid) : 2">
            {{
              prods[index].productName }}</h5>
          <h5>{{ specs[index].specName }}</h5>
        </el-col>
        <!-- 单价 -->
        <el-col :span="3">
          <h5>￥{{ (specs[index].price).toFixed(2) }}</h5>
        </el-col>
        <!-- 数量 -->
        <el-col :span="1">
          <h5>{{ item.count + prods[index].payType }}</h5>
        </el-col>
        <!-- 总价 -->
        <el-col :span="2" style="margin-left: 20px;color: red; font-weight: bold;!important">
          <h5>￥{{ (specs[index].price * item.count).toFixed(2) }}</h5>
        </el-col>
        <!-- 收货地址 -->
        <el-col :span="4">
          <h5 style="width: 100%;overflow: hidden;" :title="addName(adds[index])">{{ addName(adds[index]) }}</h5>
          <h5 style="width: 100%;overflow: hidden;">收件人: {{ (adds[index].userName) }}</h5>
          <h5 style="width: 100%;overflow: hidden;">联系电话: {{ (adds[index].mobile) }}</h5>
        </el-col>
        <!-- 操作 -->
        <el-col :span="2" style="margin: 15px 0 0 20px;">
          <!-- 客户按钮 -->
          <el-popconfirm title="确认收货吗" width="200" @confirm="updateStatus(item.oid)">
            <template #reference>
              <el-button link v-if="userStore.role !== 'provider'" :icon="CircleCheck"
                :type="item.status === 3 ? 'success' : 'primary'" :disabled="item.status !== 2">
                <div>{{ btn_str[item.status] }}</div>
              </el-button>
            </template>
          </el-popconfirm>
          <br>
          <!-- 发表评论 -->
          <el-button v-if="item.status === 3 && userStore.role !== 'provider'" link type="primary" :icon="Comment"
            @click="commentDialog = true; orderIndex = index" :disabled="item.isCommented">发表评论</el-button>
          <el-popconfirm v-if="userStore.role === 'provider'" title="确定更新吗" width="200" @confirm="updateStatus(item.oid)">
            <template #reference>
              <el-button link :type="item.status === 3 ? 'success' : 'primary'" :icon="Promotion"
                :disabled="item.status >= 2">
                <div v-if="item.status < 2">更新订单状态</div>
                <div v-else-if="item.status === 2">等待用户确认</div>
                <div v-else-if="item.status === 3">订单已完成</div>
              </el-button>
            </template>
          </el-popconfirm>
        </el-col>
      </el-row>
    </div>

    <!-- 分页器 -->
    <MyPagination :pageSize="pageSize" :layout="layout" :pageTotal="total" @pageFunc="pageFunc" />
  </div>
  <!-- 物流追踪 -->
  <el-dialog v-model="deliverDialog" title="物流追踪">
    <el-timeline>
      <el-timeline-item v-for="(activity, index) in curOrder" :key="index" :icon="activity.icon" :type="activity.type"
        size="large" :timestamp="activity.timestamp">{{ activity.content
        }}</el-timeline-item>
    </el-timeline>
  </el-dialog>

  <!-- 评论框 -->
  <el-dialog v-model="commentDialog" title="货物评价">
    <el-input type="textarea" :minlength="10" maxlength="120" show-word-limit resize='none' :rows="6" v-model="comment"
      placeholder="请输入货物评价" clearable />
    <el-row justify="center" style="margin-top:20px">
      <el-button type="primary" @click="handleComment">发表评论</el-button>
    </el-row>
  </el-dialog>
</template>

<script setup>
import { queryList, update } from '@/api/order.js';
import { add } from '@/api/prod/comment.js';
import { reactive, ref, computed } from 'vue';
import search from '@/components/utils/search.vue';
import MyPagination from '@/components/utils/MyPagination.vue';
import tableHeader from '@/components/utils/tableHeader.vue';
import Image from '@/components/utils/image.vue';
import { format } from '@/utils/dateUtils.js';
import { User, CircleCheck, Promotion, ArrowDownBold, Place, SuccessFilled, Comment } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user.js';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

const userStore = useUserStore();
const router = useRouter();
// 信息相关
let orders = reactive([]);
// 当前选中订单
let orderIndex = ref(0);
let prods = reactive([]);
let specs = reactive([]);
// 供应商
let providers = reactive([]);
// 地址
let adds = reactive([]);
// 收货地址拼接
let addName = computed(() => (item) => {
  return item.province + item.city + item.district + item.detail;
})
// 状态
let status = ref(-1);
// 状态字符串
let staStr = reactive(['未发货', '已发货', '已送达', '已确认']);
let btn_str = reactive(['订单未发货', '订单派送中', '确认收货', '订单已完成']);

let headers = reactive([
  {
    name: "订单编号", span: 2
  }, {
    name: "交易状态", span: 2
  }, {
    name: "商货信息", span: 3
  }, {
    name: "单价", span: 2
  }, {
    name: "数量", span: 1
  }, {
    name: "金额", span: 2
  }, {
    name: "收货地址", span: 3
  }, {
    name: "操作", span: 3
  }])

// 选择框选项
const options = reactive([{
  value: -1,
  label: "所有订单"
}, {
  value: 0,
  label: "未发货"
}, {
  value: 1,
  label: "已发货"
}, {
  value: 2,
  label: "已送达"
}, {
  value: 3,
  label: "已确认"
}])
// 搜索内容
let content = ref("");
// 分页相关
let currentPage = ref(0);
let pageSize = ref(6);
let total = ref(0);
let layout = "total, prev, pager, next, jumper, ->, slot"; //分页组件会展示的功能项
// 物流追踪
let deliverDialog = ref(false);
// 评论
let commentDialog = ref(false);
let comment = ref("");
// 时间线内容
const curOrder = computed(() => {
  if (orders.length === 0) return [];
  let res = [];
  if (orders[orderIndex.value].status >= 1)
    res.push({
      timestamp: format(orders[orderIndex.value].deliverTime),
      content: "供应商发货,货物配送中",
      type: "info",
      icon: ArrowDownBold,
      show: orders[orderIndex.value].status >= 1
    })
  if (orders[orderIndex.value].status >= 2)
    res.push({
      timestamp: format(orders[orderIndex.value].reachTime),
      content: "货物已送达",
      type: "primary",
      icon: Place,
      show: orders[orderIndex.value].status >= 2
    })
  if (orders[orderIndex.value].status === 3)
    res.push({
      timestamp: format(orders[orderIndex.value].confirmTime),
      content: "买家已确认收货",
      type: "success",
      icon: SuccessFilled,
      show: orders[orderIndex.value].status === 3
    })
  return res;
})
// 初始化
const initData = () => {
  queryList(status.value, content.value, currentPage.value, pageSize.value).then((data) => {
    orders.length = 0;
    orders.push(...data.orders);
    prods.length = 0;
    prods.push(...data.prods);
    specs.length = 0;
    specs.push(...data.specs);
    providers.length = 0;
    providers.push(...data.providers);
    adds.length = 0;
    adds.push(...data.addresses);
    currentPage.value = data.currentPage;
    pageSize.value = data.pageSize;
    total.value = data.total;
  })
}
initData();
// 内容搜索
const doSearch = (_content) => {
  content.value = _content;
  initData();
}
// 更新订单状态
const updateStatus = (oid) => {
  update(oid).then(() => {
    initData();
  })
}
// 发表评论
const handleComment = () => {
  if (comment.value === "") {
    ElMessage.warning("请输入评论");
    return;
  }
  ElMessageBox.confirm("评论一经发布不得删除,确定发布?", "确认").then(() => {
    const order = orders[orderIndex.value];
    const data = {
      pid: order.pid,
      oid: order.oid,
      uid: order.uid,
      content: comment.value,
    }
    add(data).then(() => {
      initData();
      commentDialog.value = false;
    })
  }).catch(() => { });
}
// 处理分页
const pageFunc = (pageData) => {
  currentPage.value = pageData.pageNum;
  pageSize.value = pageData.pageSize;
  initData();
  loading.value = false;
}

// 查看货物
const viewProd = (pid) => {
  let routeUrl = router.resolve({
    path: `/prod/${pid}`
  });
  window.open(routeUrl.href, '_blank');
}
</script>

<style lang="less" scoped>
@import "../../assets/less/layout.less";

.color-1 {
  color: rgb(21, 171, 21);
  font-weight: bold !important;
}

.link-info {
  font-weight: 500;
  font-size: 14px;

  &:hover {
    color: orange;
    cursor: pointer;
    transition: all 0.2s linear;
  }
}

.prod-info {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;

  h5 {
    width: 90%;
    overflow: hidden;
  }
}
</style>