<template>
  <div class="top-content">
    <h5 v-if="userStore.role !== 'provider'">收货地址</h5>
    <h5 v-else>仓库地址</h5>
    <el-button :icon="Plus" type="primary" @click="handleAddClick">新建地址</el-button>
  </div>
  <!-- 侧边抽屉 -->
  <el-drawer v-model="drawer" :title="title" :before-close="() => { drawer = false }">
    <!-- 表单 -->
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
      <el-form-item :label="userStore.role === 'provider' ? '负责人' : '收货人'" prop="userName">
        <el-input v-model="form.userName" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" />
      </el-form-item>

      <el-form-item label="省份" prop="province">
        <el-input v-model="form.province" placeholder="请输入省份" />
      </el-form-item>

      <el-form-item label="城市" prop="city">
        <el-input v-model="form.city" placeholder="请输入城市" />
      </el-form-item>

      <el-form-item label="区域" prop="district">
        <el-input v-model="form.district" placeholder="请输入区域" />
      </el-form-item>

      <el-form-item label="详细地址" prop="detail">
        <el-input v-model="form.detail" placeholder="请输入详细地址" />
      </el-form-item>
    </el-form>
    <!-- 提交 -->
    <template #footer>
      <el-button type="primary"
        @click="type === 0 ? handleEvent(ruleFormRef, add, form) : handleEvent(ruleFormRef, update, form)">{{ title
        }}</el-button>
    </template>
  </el-drawer>
  <!-- 表格主体 -->
  <div class="main-content">
    <el-table :data="address" stripe empty-text="暂未设置地址" v-loading="loading">
      <el-table-column prop="userName" :label="userStore.role === 'provider' ? '负责人' : '收货人'" width="100" />
      <el-table-column prop="province" label="省份" width="80" />
      <el-table-column prop="city" label="城市" width="80" />
      <el-table-column prop="district" label="区域" width="80" />
      <el-table-column prop="detail" label="详细地址" width="180" />
      <el-table-column prop="mobile" label="手机号" width="140" />
      <el-table-column label="操作" fixed="right" width="180">
        <template v-slot="scope">
          <el-button :icon="Edit" link type="primary" @click="handleChangeClick(scope.row)" />
          <!-- 删除按钮 -->
          <el-popconfirm title="Are you sure to delete this?" @confirm="deleteAdd(scope.row.addressId)">
            <template #reference>
              <el-button type="danger" :icon="Delete" link />
            </template>
          </el-popconfirm>

          <el-button v-if="scope.row.isDefault === false" link type="primary" size="small"
            @click="chooseDefault((scope.row.addressId))">设为默认</el-button>
          <el-button v-else link type="success" size="small"
            @click="chooseDefault((scope.row.addressId))">默认地址</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <MyPagination :pageSize="pageSize" :layout="layout" :pageTotal="total" @pageFunc="pageFunc" />
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { queryPage, add, update, del, ChooseDefault } from '@/api/address.js';
import { useUserStore } from '@/store/user.js';
import MyPagination from '@/components/utils/MyPagination.vue';
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

const userStore = useUserStore();
const ruleFormRef = ref(null);

let drawer = ref(false)
// 是新增还是修改
let type = ref(0)
let title = computed(() => {
  return type.value === 0 ? "新建收货地址" : "编辑收货地址";
})

// 地址相关
let address = reactive([]);
// 表格相关
let loading = ref(true);
let currentPage = ref(1);
let total = ref(0);
let pageSize = ref(6);
let layout = "total, prev, pager, next, jumper, ->, slot"; //分页组件会展示的功能项

// 页面初始化
const initData = () => {
  queryPage(userStore.uid, currentPage.value, pageSize.value).then((data) => {
    address.length = 0;
    address.push(...data.list);
    currentPage.value = data.currentPage;
    total.value = data.total;
    loading.value = false;
  }).catch((err) => {
    console.log(err);
  });
};
initData();


// 表单相关
const form = reactive({
  addressId: "",
  uid: userStore.uid,
  isDefault: false,
  userName: "",
  mobile: "",
  province: "",
  city: "",
  district: "",
  detail: ""
})

const rules = reactive({
  userName: [{
    required: true,
    trigger: 'blur',
  }],
  province: [{
    required: true,
    trigger: 'blur',
  }],
  city: [{
    required: true,
    trigger: 'blur',
  }],
  district: [{
    required: true,
    trigger: 'blur',
  }],
  detail: [{
    required: true,
    trigger: 'blur',
  }],
  mobile: [{
    required: true,
    trigger: 'blur',
  }]
})

// 处理新增点击事件
const handleAddClick = () => {
  type.value = 0;
  drawer.value = true;
  for (let i in form)
    if (i !== "addressId" && i !== "uid")
      form[i] = "";
}

// 处理修改点击事件
const handleChangeClick = (address) => {
  drawer.value = true;
  type.value = 1;
  for (let i in form)
    form[i] = address[i];
}

// 地址操作
const handleEvent = async (formEl, func, form) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid)
      func(form).then(() => {
        initData();
      }).catch((err) => {
        console.log(err);
      });
    else console.log(fields);
  })
}

// 删除地址
const deleteAdd = (aid) => {
  loading.value = true;
  del(aid).then(() => {
    initData();
    loading.value = false;
  }).catch((err) => {
    console.log(err);
  });
}

// 修改默认
const chooseDefault = (aid) => {
  loading.value = true;
  ChooseDefault(aid).then(() => {
    initData()
    loading.value = false;
  }).catch((err) => {
    console.log(err);
  });
}

// 处理分页
const pageFunc = (pageData) => {
  currentPage.value = pageData.pageNum;
  pageSize.value = pageData.pageSize;
  loading.value = true;
  initData();
  loading.value = false;
}
</script>

<style lang="less" scoped>
.top-content {
  margin-top: 10px;
  margin-bottom: 10px;

  h5 {
    height: 40px;
    line-height: 40px;
    margin-bottom: 20px;
    color: rgb(148, 148, 148);
    border-bottom: 1px solid #c1c1c1;
  }
}

.main-content {
  max-height: 400px;
  margin-bottom: 50px;
}
</style>