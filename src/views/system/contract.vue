<template>
  <!-- 顶部查询 -->
  <el-row class="top-content">
    <el-col :span="6" :offset="1">
      <el-select v-model="status" class="m-2" placeholder="选择长期单状态" size="large" style="margin-top: 15px;width: 260px;"
        @change="content = ''; initData()">
        <template #prefix>
          <h4>长期单状态</h4>
        </template>
        <el-option v-for=" item  in  options " :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-col>
    <!-- 内容搜索 -->
    <el-col v-if="status === -1" :span="9" :offset="1" style="margin-top: 20px;">
      <search placeholder="请输入货物名称" @doSearch="doSearch" />
    </el-col>
  </el-row>

  <!-- 主体部分 -->
  <div class="main-content">
    <div class="inner-title">
      <h5>长期单列表</h5>
    </div>
    <el-empty description="暂无内容" v-if="contracts.length === 0" />
    <el-table v-else :data="contracts" style="width: 90% ;margin:0 auto">
      <el-table-column label="订单编号" prop="contractId" width="60" />
      <el-table-column label="状态" width="110">
        <template v-slot="scope">
          <span :class="{ 'color-1': scope.row.status === 2, 'color-2': scope.row.status === 3 }">{{
            staStr[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="货物名称" width="180" />
      <!-- 企业信息 -->
      <el-table-column label="对方企业名" width="180">
        <template v-slot="scope">
          <!-- :content='`企业地址:${scope.row.userOrg.orgAddress}  联系电话:${scope.row.userOrg.chargerMobile}`' -->
          <el-popover placement="top-start" title="企业信息" :width="300" trigger="hover">
            <template #reference>
              <div style="cursor: pointer;;" @click=" providerDetail(scope.row.uid2)">{{ scope.row.userOrg.orgName }}
              </div>
            </template>
            <p>{{ `企业地址:${scope.row.userOrg.orgAddress} ` }}</p>
            <p>{{ `联系电话:${scope.row.userOrg.chargerMobile} ` }}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="productNum" label="数量" width="80" />
      <el-table-column prop="price" label="价格(元)" width="120" />
      <el-table-column label="起始日期" width="120">
        <template v-slot="scope">
          {{ dateFormat(scope.row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="validityTime" label="有效期(天)" width="120" />
      <el-table-column prop="frequency" label="送货频率(天)" width="120" />
      <el-table-column label="个性化需求" width="150">
        <template v-slot="scope">
          <!-- 查看个性化需求 -->
          <el-popover placement="top-start" title="个性化需求" width="300" trigger="click"
            :content="scope.row.custom === '' ? '无' : scope.row.custom">
            <template #reference>
              <el-button type="primary" link plain>查看</el-button>
            </template>
          </el-popover>
          <!-- 评价 -->
          <el-button v-if="userStore.role === 'organization' && scope.row.status === 2" type="success" link plain
            :icon="ChatDotRound" @click=" handleCommentOpen(scope.row)" :disabled="scope.row.custom === ''">{{
              scope.row.customGrade !== null ? "已评价" : "评价" }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label=" 拒绝原因" width="200">
        <template v-slot="scope">
          <span v-if="scope.row.refuseReason">{{ refuseStr[scope.row.refuseReason] }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column fixed="right" label="操作" width="340">
        <template v-slot="scope">
          <!-- 商议 -->
          <el-button link type="primary" :icon="EditPen" @click=" handleDiscuss(scope.row)"
            :disabled="disabled(scope.row.status)">商议</el-button>
          <!-- 成交 -->
          <el-popconfirm title="确定成交吗" width="200" @confirm=" decide(scope.row.contractId, 1); initData()">
            <template #reference>
              <el-button type="success" :icon="Select" link :disabled="disabled(scope.row.status)">成交</el-button>
            </template>
          </el-popconfirm>
          <!-- 拒绝按钮 -->
          <el-popconfirm width="200" title="确定拒绝该长期单吗" @confirm=" refuseDialog = true">
            <template #reference>
              <el-button type="danger" :icon="CloseBold" link :disabled="disabled(scope.row.status)">拒绝</el-button>
            </template>
          </el-popconfirm>
          <!-- 发货 -->
          <span v-if="scope.row.status === 2">
            <el-button v-if="outOfDate" link type="primary" :icon="Position"
              @click=" deliverDialogVis = true; currentId = scope.row.contractId">
              {{ userStore.role === "provider" ? "进行发货" : "发货记录" }}</el-button>
            <h5 v-else class="color-1">订单已完成有效期内配送</h5>
          </span>
          <!-- 拒绝理由 -->
          <el-dialog v-model="refuseDialog" title="拒绝长期单">
            <h4 style="margin-bottom: 20px;">请选择拒绝理由</h4>
            <el-select v-model="refuseIndex" placeholder="请选择拒绝理由" size="large">
              <el-option v-for="( item, index ) in  refuseStr " :key="index" :label="item" :value="index" />
            </el-select>
            <el-row justify="end">
              <el-button type="danger" @click=" decide(scope.row.contractId, 2, refuseIndex); initData()">确定拒绝</el-button>
            </el-row>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <MyPagination :pageSize="pageSize" :layout="layout" :pageTotal="total" @pageFunc="pageFunc" />
  </div>
  <!-- 编辑框 -->
  <el-dialog v-model="editDialog" :title="title">
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
      <!-- 货物名称 -->
      <el-form-item label="货物名称" prop="pName">
        <el-input v-model="form.productName" placeholder="请输入货物名称" clearable disabled />
      </el-form-item>
      <!-- 价格 -->
      <el-form-item label="期望价格" prop="price">
        <el-input v-model.number="form.price" placeholder="请输入期望价格" clearable />
      </el-form-item>
      <!-- 数量 -->
      <el-form-item label="发货数量" prop="productNum">
        <el-input v-model.number="form.productNum" placeholder="请输入发货数量" clearable />
      </el-form-item>
      <!-- 起效日期 -->
      <el-form-item label="起效日期" prop="startTime">
        <el-date-picker v-model="form.startTime" type="date" placeholder="选择起效日期" :disabled-date="disabledDate"
          :disabled="userStore.role === 'provider'" />
      </el-form-item>
      <!-- 有效期 -->
      <el-form-item label="订单有效期" prop="validityTime">
        <el-input v-model.number="form.validityTime" placeholder="请输入有效期(天)" clearable />
      </el-form-item>
      <!-- 送货频率 -->
      <el-form-item label="送货频率" prop="frequency">
        <el-input v-model.number="form.frequency" placeholder="请输入送货频率(天)" clearable />
      </el-form-item>
      <!-- 送货频率 -->
      <el-form-item label="个性化配比">
        <el-input :disabled="customizable === false || userStore.role === 'provider'" v-model="form.custom"
          type="textarea" resize="none" show-word-limit maxlength="250" :rows="4" placeholder="尽可能详细描述个性化需求(如果有该方面需求)"
          clearable />
      </el-form-item>
      <!-- 确认按钮 -->
      <el-row>
        <el-col :span="4" :offset="19">
          <el-button type="primary" :icon="Edit" @click="
            type === 0 ? handleEvent(ruleFormRef, propose, form) :
              handleEvent(ruleFormRef, discuss, { cid: form.contractId, time: form.validityTime, num: form.productNum, price: form.price, freq: form.frequency, pid: route.query.pid })
            ">{{
    title }}</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>

  <!-- 发货框 -->
  <deliverDialog :deliverDialog="deliverDialogVis" :provider="userStore.role === 'provider'" :currentId="currentId"
    @closeDialog=" deliverDialogVis = false" />

  <!-- 评价框 -->
  <el-dialog v-model="commentDialog" title="个性化配比评价">
    <el-form label-width="120px" status-icon>
      <el-form-item label="选择星数">
        <el-slider v-model="grade" :step="1" show-stops :max="5" :min="1" :disabled="hasCommented" />
      </el-form-item>
      <el-form-item label="个性化配比评价">
        <el-input type="textarea" maxlength="60" show-word-limit resize='none' :rows="3" v-model="comment"
          placeholder="请输入评价" clearable :disabled="hasCommented" />
      </el-form-item>
      <el-row justify="center">
        <el-button type="primary" @click="handleComment" :disabled="hasCommented">提交评价</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { queryList, propose, discuss, decide, comment as doComment } from '@/api/contract.js';
import { viewOne } from '@/api/prod/prodUser.js';
import { reactive, ref, computed } from 'vue';
import search from '@/components/utils/search.vue';
import MyPagination from '@/components/utils/MyPagination.vue';
import deliverDialog from '@/components/deliverDialog.vue';
import { useRoute, useRouter } from 'vue-router';
import { Edit, CloseBold, EditPen, Select, Position, ChatDotRound } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user.js';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const ruleFormRef = ref(null)

// 信息相关
let contracts = reactive([]);
// 搜素内容
let content = ref("");

// 合同状态
let status = ref(-1);
// 是否轮到自己处理
let disabled = computed(() => (sta) => {
  let role = userStore.role;
  return sta >= 2 || (role === 'provider' && sta === 1) || (role === 'organization' && sta === 0)
})
let dateFormat = computed(() => (date) => {
  date = new Date(date);
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join(
    "-"
  )
})
// 订单是否处于有效期内
let outOfDate = computed(() => (start, duration) => {
  let oneDay = 24 * 3600 * 1000;
  let base = Date.parse(new Date());
  return (Date.parse(start) + duration * oneDay) > base;
})

// 状态字符化
let staStr = ['等待供应商回复', '等待需求方回复', '已签订', '已拒绝'];
// 拒绝理由字符画
let refuseStr = ['价格过高/低', '无法满足订单量需求', '无法满足个性化配比需求', '配送周期不合理', '其它原因'];
let refuseIndex = ref(0);

let customizable = ref(true);

// 选择框选项
const options = reactive([{
  value: -1,
  label: "所有长期订单"
}, {
  value: 0,
  label: "等待供应商回复"
}, {
  value: 1,
  label: "等待需求方回复"
}, {
  value: 2,
  label: "已成交"
}, {
  value: 3,
  label: "已放弃"
}])
// 分页相关
let currentPage = ref(0);
let pageSize = ref(4);
let total = ref(0);
let layout = "total, prev, pager, next, jumper, ->, slot"; //分页组件会展示的功能项

// 表单相关
let type = ref(0);
// 编辑对话框
let editDialog = ref('pid' in route.query ? true : false);
// 拒绝对话框
let refuseDialog = ref(false);
// 评价对话框
let commentDialog = ref(false);
let grade = ref(0);
let comment = ref("");
// 发货对话框
let deliverDialogVis = ref(false);
let currentId = ref(0);
// 是否已评价
let hasCommented = computed(() => {
  for (let item of contracts)
    if (item.contractId === currentId.value)
      return item.customComment !== null;
})
let title = computed(() => {
  return type.value === 0 ? "提出长期需求" : "商议长期需求";
})

let form = reactive({
  contractId: "",
  pid: route.query.pid || "",
  productName: "",
  startTime: new Date(),
  validityTime: "",
  frequency: "",
  price: "",
  productNum: "",
  custom: ""
})
const rules = reactive({
  price: [{
    required: true,
    trigger: 'blur',
  }, { type: 'number' },
  { pattern: /^([0-9]+)$/, message: "数字不合规范" }],
  productNum: [{
    required: true,
    trigger: 'blur',
  }, { type: 'number' },
  { pattern: /^([0-9]+)$/, message: "数字不合规范" }],
  validityTime: [{
    required: true,
    trigger: 'blur',
  }, { type: 'number' },
  { pattern: /^([0-9]+)$/, message: "数字不合规范" }],
  frequency: [{
    required: true,
    trigger: 'blur',
  }, { type: 'number' },
  { pattern: /^([0-9]+)$/, message: "数字不合规范" },
  ],
  startTime: [{
    required: true,
    trigger: 'blur',
  }]
})
// 限定只能选今天之后日期
const disabledDate = (time) => {
  return time.getTime() < Date.now();
}

// 初始化
const initData = () => {
  queryList(status.value, content.value, currentPage.value, pageSize.value).then((data) => {
    contracts.length = 0;
    contracts.push(...data.contracts);
    for (let i in data.contracts)
      contracts[i].userOrg = data.userOrgs[i];

    currentPage.value = data.currentPage;
    pageSize.value = data.pageSize;
    total.value = data.total;
  })
  if (route.query.pid)
    viewOne(route.query.pid).then(({ detail }) => {
      if (!detail.customizable)
        customizable.value = false;
      form.productName = detail.productName;
    })
}
initData();
// 内容搜索
const doSearch = (_content) => {
  content.value = _content;
  initData();
}
// 提出合同或商议合同
const handleEvent = async (formEl, func, _form) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid)
      func(_form).then(() => {
        initData();
        editDialog.value = false;
      })
    else console.log(fields);
  })
}
// 商议
const handleDiscuss = (contract) => {
  type.value = 1;
  editDialog.value = true;
  for (let i in form)
    form[i] = contract[i];
}
// 打开评价
const handleCommentOpen = (row) => {
  commentDialog.value = true;
  currentId.value = row.contractId;
  grade.value = row.customGrade || 0;
  comment.value = row.customComment || "";
}
// 处理分页
const pageFunc = (pageData) => {
  currentPage.value = pageData.pageNum;
  pageSize.value = pageData.pageSize;
  loading.value = true;
  initData();
  loading.value = false;
}
// 查看供应商详细信息
const providerDetail = (sellerId) => {
  if (userStore.role !== 'provider')
    router.push(`/provider/${sellerId}`);
}
// 提交评价
const handleComment = () => {
  doComment(currentId.value, grade.value, comment.value).then(() => {
    initData();
  })
}
</script>

<style lang="less" scoped>
@import "../../assets/less/layout.less";

.color {
  &-1 {
    font-weight: bold;
    color: rgb(21, 171, 21);
  }

  &-2 {
    font-weight: bold;
    color: red;
  }
}
</style>