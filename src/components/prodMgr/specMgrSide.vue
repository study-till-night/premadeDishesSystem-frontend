<template>
  <div class="top-content">
    <h5>规格列表</h5>
    <!-- 表单部分 -->
    <el-form ref="addFormFef" :inline="true" :model="addForm" :rules="rules" class="demo-form-inline">
      <el-form-item label="规格名称" prop="specName">
        <el-input v-model="addForm.specName" clearable placeholder="请输入名称" maxlength="20" />
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input style="width: 140px;" v-model.number="addForm.price" clearable placeholder="请输入价格" />
      </el-form-item>
      <el-form-item label="库存" prop="inventory">
        <el-input style="width: 140px;" v-model.number="addForm.inventory" clearable placeholder="请输入库存" />
      </el-form-item>
      <el-form-item>
        <el-switch v-model="addForm.isEnabled" active-text="启用" inactive-text="停用" />
      </el-form-item>
    </el-form>
    <el-button :icon="Plus" type="primary" @click="handleEvent(addFormFef, add, addForm)">添加规格</el-button>
  </div>
  <!-- 表格主体 -->
  <div class="main-content">
    <el-table :data="specs" stripe empty-text="当前货物无规格" v-loading="loading" style="margin: 0 auto;width: 80%;">
      <el-table-column prop="specName" label="规格名称" width="180" />
      <el-table-column prop="price" label="单价(元)" width="120" />
      <el-table-column prop="inventory" label="库存" width="120" />

      <el-table-column prop="isEnabled" label="操作" width="160">
        <template v-slot="scope">
          <el-button :icon="Edit" link type="primary" @click="handleChangeClick(scope.row)"></el-button>
          <!-- 删除按钮 -->
          <el-popconfirm title="Are you sure to delete this?" @confirm="deleteProd(scope.row.productSpecId)">
            <template #reference>
              <el-button :icon="Delete" link type="danger" />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>

      <el-table-column prop="isEnabled" label="是否启用" width="160">
        <template v-slot="scope">
          <el-switch @change="changeEnabled(scope.row.productSpecId)" active-text="启用" inactive-text="停用"
            v-model="scope.row.isEnabled" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <MyPagination :pageSize="pageSize" :layout="layout" :pageTotal="total" @pageFunc="pageFunc" />

  </div>
  <!-- 对话框 -->
  <el-dialog v-model="dialogTableVisible" title="编辑规格">
    <el-form ref="updateFormRef" :model="updateForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
      <el-form-item label="规格名称" prop="specName">
        <el-input v-model="updateForm.specName" placeholder="请输入规格名称" clearable />
      </el-form-item>

      <el-form-item label="价格" prop="price">
        <el-input v-model.number="updateForm.price" placeholder="请输价格称" clearable />
      </el-form-item>

      <el-form-item label="库存" prop="inventory">
        <el-input v-model.number="updateForm.inventory" placeholder="请输入库存" clearable />
      </el-form-item>

      <el-row>
        <el-col :span="4" :offset="20">
          <el-button :icon="Edit" type="primary" @click="handleEvent(updateFormRef, update, updateForm)">编辑规格</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { queryList, add, del, update, updateEnabled } from '@/api/prod/prodSpec.js';
import { reactive, watch, ref } from 'vue';
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import MyPagination from '@/components/utils/MyPagination.vue';

// 当前查看的货物id
const props = defineProps({
  pid: {
    type: Number,
    default: 0
  }
})

// 表格相关
let loading = ref(false);
let currentPage = ref(1);
let total = ref(0);
let pageSize = ref(5);
let layout = "total, prev, pager, next, jumper, ->, slot"; //分页组件会展示的功能项

// 初始化
const initData = () => {
  queryList(props.pid, currentPage.value, pageSize.value).then((data) => {
    specs.length = 0;
    specs.push(...data.list);
    console.log(specs);
    currentPage.value = data.currentPage;
    total.value = data.total;
    loading.value = false;
  }).catch((err) => {
    console.log(err);
  });
}

// 规格相关
let specs = reactive([])
let dialogTableVisible = ref(false);
const addFormFef = ref(null);
const updateFormRef = ref(null);

// 新增表格
const addForm = reactive({
  productSpecId: Number,
  pid: props.pid,
  specName: "",
  price: "",
  inventory: "",
  isEnabled: true
})

// 修改表格
const updateForm = reactive({
  productSpecId: Number,
  pid: props.pid,
  specName: "",
  price: "",
  inventory: "",
  isEnabled: true
})

const rules = reactive({
  specName: [{
    required: true,
    trigger: 'blur',
  }],
  price: [{
    required: true,
    trigger: 'blur',
  }, { type: 'number' },
  { pattern: /^([0-9]+)$/, message: "数字不合规范" }],
  inventory: [{
    required: true,
    trigger: 'blur',
  }, { type: 'number' },
  { pattern: /^([0-9]+)$/, message: "数字不合规范" }],
})

//点击时触发更新
watch(() => props.pid, (newv, oldv) => {
  currentPage.value = 1;
  addForm.pid = newv;
  initData();
})

// 切换启用状态
const changeEnabled = (sid) => {
  updateEnabled(sid).then(() => {
    initData();
  })
}
// 规格操作
const handleEvent = async (formEl, func, form) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid)
      func(form).then(() => {
        initData();
      })
    else console.log(fields);
  })
}

// 打开对话框
const handleChangeClick = (spec) => {
  dialogTableVisible.value = true;
  for (let i in updateForm)
    updateForm[i] = spec[i];
}

// 删除规格
const deleteProd = (sid) => {
  console.log(sid);
  del(sid).then(() => {
    initData()
  })
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
@import "../../assets/less/tablePage.less";
</style>