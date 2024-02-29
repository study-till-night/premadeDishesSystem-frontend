<template>
  <div class="top-content">
    <h5>货物列表</h5>
    <el-button :icon="Plus" type="primary" @click="handleAddClick">上架新货物</el-button>
    <!-- 搜索 -->
    <div class="search">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <!-- 选择分类 -->
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" class="m-2" placeholder="选择分类" clearable>
            <el-option v-for="item in categorys" :key="item.categoryId" :label="item.categoryName"
              :value="item.categoryId" />
          </el-select>
        </el-form-item>
        <!-- 货物名称 -->
        <el-form-item label="货物名称">
          <el-input v-model="searchForm.content" placeholder="请输入货物名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button :icon="Search" type="primary"
            @click="searchProd(searchForm.content, searchForm.category)">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <!-- 表格主体 -->
  <div class="main-content">
    <el-table highlight-current-row :data="prods" stripe empty-text="当前无在售货物" v-loading="loading"
      @current-change="handleCurrentChange">
      <el-table-column label="货物编号" prop="pid" width="60" />
      <el-table-column prop="productName" label="名称" width="120" />
      <!-- 图片 -->
      <el-table-column label="图片" width="120">
        <template v-slot="scope">
          <!-- 设置图片 -->
          <el-upload ref="uploadRef" class="upload-demo" action="http://localhost:8089/file/uploadProImg" :headers="{
              'satoken': getToken()
            }" :limit="1" :data="{ pid: scope.row.pid }" accept="image/jpg, image/jpeg, image/png" name="img"
            :on-success="handleSuccess">
            <Image :src="scope.row.picturePath" height="80px" width="80px" />
          </el-upload>

        </template>
      </el-table-column>
      <!-- 类别 -->
      <el-table-column label="类别" width="80">
        <template v-slot="scope">
          {{ categorys[scope.row.categoryId - 1].categoryName }}
        </template>
      </el-table-column>

      <el-table-column prop="abstruct" label="简介" width="180" />
      <el-table-column prop="sellNum" label="销售量" width="80" />
      <el-table-column prop="payType" label="单位" width="60" />
      <el-table-column prop="leastNum" label="起售量(对企业)" width="80" />
      <el-table-column prop="freight" label="运费(元)" width="60" />
      <el-table-column label="开启个性化配比" width="140">
        <template v-slot="scope">
          <!-- 是否允许个性化配比 -->
          <el-switch v-model="scope.row.customizable" size="large" @change="changeCustomizable(scope.row.pid)" />
        </template>
      </el-table-column>
      <!-- 选择发货仓库 -->
      <el-table-column label="选择发货仓库" width="240">
        <template v-slot="scope">
          <el-select v-model="scope.row.address" placeholder="选择发货仓库">
            <el-option v-for="item in address" :key="item.addressId" :label="addName(item)" :value="item.addressId" />
          </el-select>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="300" fixed="right">
        <template v-slot="scope">
          <!-- 编辑 -->
          <el-button :icon="Edit" link type="primary" @click="handleChangeClick(scope.row)">编辑</el-button>
          <!-- 删除按钮 -->
          <el-popconfirm title="确定下架该商品?" @confirm="deleteProd(scope.row.pid)">
            <template #reference>
              <el-button :icon="Delete" link type="danger">下架</el-button>
            </template>
          </el-popconfirm>
          <!-- 查看评价 -->
          <el-button :icon="ChatRound" link type="success" @click="viewRemark(scope.row.pid)">查看评价</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <MyPagination :pageSize="pageSize" :layout="layout" :pageTotal="total" @pageFunc="pageFunc" />

  </div>

  <!-- 对话框 -->
  <el-dialog v-model="dialogTableVisible" :title="title">
    <el-form ref="ruleFormRef" :model="prodform" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
      <el-form-item label="货物名称" prop="productName">
        <el-input v-model="prodform.productName" placeholder="请输入货物名称" clearable />
      </el-form-item>

      <el-form-item label="货物类别" prop="categoryId">
        <el-select v-model="prodform.categoryId" class="m-2" placeholder="选择分类" clearable>
          <el-option v-for="item in categorys" :key="item.categoryId" :label="item.categoryName"
            :value="item.categoryId" />
        </el-select>
      </el-form-item>

      <el-form-item label="货物简介" prop="abstruct">
        <el-input type="textarea" maxlength="120" show-word-limit resize='none' :rows="6" v-model="prodform.abstruct"
          placeholder="请输入简介" clearable />
      </el-form-item>

      <el-form-item label="售卖单位" prop="payType">
        <el-input v-model="prodform.payType" placeholder="请输入单位" clearable />
      </el-form-item>

      <el-form-item label="起售量" prop="leastNum">
        <el-input v-model="prodform.leastNum" placeholder="请输入起售量" clearable />
      </el-form-item>

      <el-form-item label="运费" prop="freight">
        <el-input v-model="prodform.freight" placeholder="请输入运费" clearable />
      </el-form-item>
      <el-row>
        <el-col :span="4" :offset="20">
          <el-button type="primary" :icon="Edit"
            @click="type === 0 ? handleEvent(ruleFormRef, add, prodform) : handleEvent(ruleFormRef, update, prodform)">{{
              title
            }}</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { queryList, add, del, update, search, updateCustomizable } from '@/api/prod/prodPro.js';
import { queryList as queryC } from '@/api/category.js';
import { queryList as queryA } from '@/api/address.js';
import { useUserStore } from '@/store/user.js';
import { ElMessage } from 'element-plus'
import MyPagination from '@/components/utils/MyPagination.vue';
import { Search, Plus, Edit, Delete, Picture as IconPicture, ChatRound } from '@element-plus/icons-vue'
import { getToken } from '@/utils/auth.js';
import Image from '@/components/utils/image.vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(["selectFunc"])
const userStore = useUserStore();
const router = useRouter();

const ruleFormRef = ref(null);
const uploadRef = ref(null);
// 表格相关
let loading = ref(true);
let currentPage = ref(1);
let total = ref(0);
let pageSize = ref(5);
let layout = "total, prev, pager, next, jumper, ->, slot"; //分页组件会展示的功能项

// 搜索相关
const searchForm = reactive({
  content: "",
  category: null
})
// 货物分类
let categorys = reactive([])

// 货物相关
let prods = reactive([]);
let address = reactive([]);
// 地址拼接
let addName = computed(() => (item) => {
  return item.province + item.city + item.district + item.detail;
})
let dialogTableVisible = ref(false)
let type = ref(0);
let title = computed(() => {
  return type.value === 0 ? "新增货物" : "修改货物";
})

const prodform = reactive({
  pid: Number,
  categoryId: Number,
  sellerId: userStore.uid,
  productName: "",
  abstruct: "",
  leastNum: 0,
  payType: "",
  address: "",
  freight: Number
})

const rules = reactive({
  categoryId: [{
    required: true,
    trigger: 'blur',
  }],
  productName: [{
    required: true,
    trigger: 'blur',
  }],
  abstruct: [{
    required: true,
    trigger: 'blur',
  }],
  payType: [{
    required: true,
    trigger: 'blur',
  }],
  leastNum: [{
    required: true,
    trigger: 'blur',
  }],
  freight: [{
    required: true,
    trigger: 'blur',
  }],
})

// 初始化
const initData = () => {
  queryList(userStore.uid, currentPage.value, pageSize.value).then((data) => {
    prods.length = 0;
    prods.push(...data.list);
    currentPage.value = data.currentPage;
    total.value = data.total;
    loading.value = false;
  })
}
// 查询货物分类
queryC().then(({ data }) => {
  categorys.push(...data);
})
queryA().then(({ data }) => {
  address.push(...data);
})
initData();

// 选中一条货物
const handleCurrentChange = (prod) => {
  console.log(prod);
  if (!prod) return;
  emit("selectFunc", prod.pid);
}

// 打开对话框
const handleAddClick = () => {
  dialogTableVisible.value = true;
  type.value = 0;
  for (let i in prodform) {
    if (i !== "sellerId")
      prodform[i] = "";
  }
}

// 打开对话框
const handleChangeClick = (prod) => {
  dialogTableVisible.value = true;
  type.value = 1;
  for (let i in prodform) {
    prodform[i] = prod[i];
  }
}

// 货物操作
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
// 修改货物个性化配比许可
const changeCustomizable = (pid) => {
  updateCustomizable(pid).then(() => {
    initData();
  })
}

// 下架货物
const deleteProd = (pid) => {
  del(pid).then(() => {
    initData()
  })
}

// 搜索货物
const searchProd = (content, category) => {
  search(content, category, userStore.uid).then(({ data }) => {
    prods.length = 0;
    prods.push(...data);
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

// 图片上传成功
const handleSuccess = () => {
  ElMessage.success("上传成功");
  initData();
}

// 查看评价
const viewRemark = (id) => {
  let routeUrl = router.resolve({
    path: `/feedback`, query: {
      id
    }
  });
  window.open(routeUrl.href, '_blank');
}
</script>

<style lang="less" scoped>
@import "../../assets/less/tablePage.less";

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  // background: var(--el-fill-color-light);
  // color: var(--el-text-color-secondary);
  font-size: 30px;
}
</style>