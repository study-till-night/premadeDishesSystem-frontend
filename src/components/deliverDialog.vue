<template>
  <el-dialog v-model="deliverDialog" :title='provider ? "进行发货" : "发货记录"' @close="emit('closeDialog')">
    <!-- 时间线 -->
    <el-timeline>
      <el-timeline-item v-for="(activity, index) in dates" :key="index" :timestamp="activity">
        {{ index === 0 ? "本次发货时间" : "下次发货时间" }}
      </el-timeline-item>
    </el-timeline>

    <el-row>
      <!-- 发货信息 -->
      <el-col :span="12">
        <el-row>
          <el-col :span="12" :offset="1">
            <h4>已发货次数:</h4>
          </el-col>
          <el-col :span="9">
            <h4>{{ contract.deliverTimes }}</h4>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="1">
            <h4>本次周期内是否发货:</h4>
          </el-col>
          <el-col :span="9">
            <h4>{{ disabled ? Date.parse(contract.startTime) > Date.now() ? "未到起始时间" : "已发货" : "未发货" }}</h4>
          </el-col>
        </el-row>
        <!-- 发货数量 -->
        <el-row>
          <el-col :span="12" :offset="1">
            <h4>发货数量:</h4>
          </el-col>
          <el-col :span="9">
            <h4>{{ contract.productNum }} 件</h4>
          </el-col>
        </el-row>
        <!-- 收货地址 -->
        <el-row>
          <el-col :span="12" :offset="1">
            <h4>收货地址:</h4>
          </el-col>
          <el-col :span="9">
            <h4>{{ address }}</h4>
          </el-col>
        </el-row>
        <!-- 订单有效期限至 -->
        <el-row>
          <el-col :span="12" :offset="1">
            <h4>订单有效期限至:</h4>
          </el-col>
          <el-col :span="9">
            <h4>{{ lastDate }}</h4>
          </el-col>
        </el-row>

      </el-col>
      <!-- 发货记录 -->
      <el-col :span="12">
        <el-table :data="records" style="width: 100%" empty-text="无发货记录" max-height="250">
          <el-table-column prop="times" label="发货序号" width="80" />
          <el-table-column prop="create_time" label="发货时间" width="160">
            <template v-slot="scope">
              {{ format(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="isLate" label="是否迟发货" width="100">
            <template v-slot="scope">
              {{ scope.row.isLate ? "是" : "否" }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 确认按钮 -->
    <el-row justify="end" v-if="provider">
      <el-button type="primary" :disabled="disabled" :icon="Compass" @click="delivery(props.currentId, dates[0]).then(() => {
        initData(props.currentId);
      })">进行本周期发货</el-button>
    </el-row>
  </el-dialog>
</template>

<script setup>
import { ref, watch, reactive, computed } from 'vue';
import { queryOne, delivery } from '@/api/contract.js';
import { getDetails } from '@/api/user.js';
import { nextDate, format } from '@/utils/dateUtils.js';
import { Compass } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user.js';

const userStore = useUserStore();

const emit = defineEmits(['closeDialog']);
const props = defineProps({
  deliverDialog: false,
  currentId: "",
  provider: Boolean
})

let deliverDialog = ref(false);
// 监控对话框
watch(() => props.deliverDialog, () => {
  deliverDialog.value = true;
})
// 当前订单
let contract = reactive({});
// 发货记录
let records = reactive([]);
// 本次及下次发货日期
let dates = reactive([]);
let address = ref("")
// 初始化
const initData = (newv) => {
  queryOne(newv).then((data) => {
    for (let i in data.contract)
      contract[i] = data.contract[i];
    records.length = 0;
    records.push(...data.records);
    console.log(records);
    dates.length = 0;
    dates.push(...nextDate(contract.startTime, contract.frequency));
    getDetails(contract.uid1).then(({ org }) => {
      address.value = org.orgAddress;
    })
  })
}
// 新窗口初始化
watch(() => props.currentId, (newv) => {
  initData(newv);
})
// 本次是否发货
let disabled = computed(() => {
  let updateTime = Date.parse(contract.updateTime);
  let curTime = Date.parse(new Date(dates[0]));
  return updateTime > curTime || curTime > Date.now();
})
// 最后有效期
let lastDate = computed(() => {
  let oneDay = 24 * 3600 * 1000;
  let start = Date.parse(contract.startTime);
  let tem = new Date(start + oneDay * contract.validityTime);
  return [tem.getFullYear(), tem.getMonth() + 1, tem.getDate()].join("-");
})

</script>

<style lang="less" scoped>
.el-row {
  margin: 20px 0;
}
</style>