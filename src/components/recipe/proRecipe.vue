<template>
  <!-- 顶部 -->
  <el-row style="border-bottom:1px solid #cfcfcf;padding-bottom: 10px;">
    <el-col :span="4" :offset="1">
      <h3>我公开的食谱</h3>
    </el-col>
    <el-col :span="4">
      <el-button type="primary" :icon="Plus" @click="handleAddClick">发布新的食谱</el-button>
    </el-col>
  </el-row>

  <el-empty description="暂无发布的食谱" v-if="recipes.length === 0" />
  <!-- 食谱主体 -->
  <el-row v-else class="recipes" v-for="(item, index) in recipes">
    <recipeItem :recipe="item" :prod="prods[index]" @onEdit="handleChangeClick" />
  </el-row>
  <MyPagination :pageSize="pageSize" :layout="layout" :pageTotal="total" @pageFunc="pageFunc" />

  <!-- 对话框 -->
  <el-dialog v-model="dialogTableVisible" :title="title">
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
      <el-form-item label="选择公开的货物" prop="pid">
        <el-select v-model="form.pid" class="m-2" placeholder="选择货物" clearable :disabled="type == 1">
          <el-option v-for="item in entireProds" :key="item.pid" :label="item.productName" :value="item.pid" />
        </el-select>
      </el-form-item>

      <el-form-item label="食材介绍" prop="ingredients">
        <el-input type="textarea" maxlength="120" show-word-limit resize='none' :rows="6" v-model="form.ingredients"
          placeholder="请输入食材介绍" clearable />
      </el-form-item>

      <el-form-item label="调料介绍" prop="seasoning">
        <el-input type="textarea" maxlength="120" show-word-limit resize='none' :rows="6" v-model="form.seasoning"
          placeholder="请输入调料介绍" clearable />
      </el-form-item>

      <el-form-item label="制作步骤" prop="steps">
        <el-input type="textarea" maxlength="120" show-word-limit resize='none' :rows="8" v-model="form.steps"
          placeholder="请输入制作步骤" clearable />
      </el-form-item>

      <el-form-item label="注意事项">
        <el-input type="textarea" maxlength="120" show-word-limit resize='none' :rows="8" v-model="form.tips"
          placeholder="请输入注意事项" clearable />
      </el-form-item>
      <el-form-item label="同意请勾选" v-if="type === 0" required>
        <el-checkbox v-model="accepted">我知晓发布食谱后的一切可能后果</el-checkbox>
      </el-form-item>
      <el-row>
        <el-col :span="4" :offset="20">
          <el-button type="primary" :icon="Edit"
            @click="type === 0 ? handleEvent(ruleFormRef, add, form) : handleEvent(ruleFormRef, update, form)">{{
              title
            }}</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { queryPage, add, update } from '@/api/recipe.js';
import { queryList } from '@/api/prod/prodPro.js';
import { useUserStore } from '@/store/user.js';
import { Plus, Edit } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import recipeItem from '@/components/recipeItem.vue';
import MyPagination from '@/components/utils/MyPagination.vue';

const userStore = useUserStore();
const ruleFormRef = ref(null);

let recipes = reactive([])
// 食谱对应的货物
let prods = reactive([])
// 全部货物
let entireProds = reactive([]);
// 分页相关
let currentPage = ref(1);
let total = ref(0);
let pageSize = ref(6);
let layout = "total, prev, pager, next, jumper, ->, slot"; //分页组件会展示的功能项
// 初始化
const initData = () => {
  queryPage(currentPage.value, pageSize.value, userStore.uid).then((data) => {
    recipes.length = 0;
    recipes.push(...data.recipes);
    // 是否已点过赞
    for (let i in recipes)
      recipes[i].isLoved = data.isLoved[i];
    prods.length = 0;
    prods.push(...data.prods);
    currentPage.value = data.currentPage;
    total.value = data.total;
  })
  queryList(userStore.uid, 1, 1000).then(({ list }) => {
    entireProds.length = 0;
    entireProds.push(...(list.filter((item) => {
      return !item.isOpened;
    })))
  })
}
initData();

let dialogTableVisible = ref(false);
// 是新增还是编辑
let type = ref(0);
// 是否勾选已知
let accepted = ref(false);
let title = computed(() => {
  return type.value === 0 ? "发布食谱" : "编辑食谱";
})
let form = reactive({
  pid: "",
  sellerId: userStore.uid,
  seasoning: "",
  steps: "",
  ingredients: "",
  tips: ""
})
const rules = reactive({
  pid: [{
    required: true,
    trigger: 'blur',
  }],
  seasoning: [{
    required: true,
    trigger: 'blur',
  }],
  steps: [{
    required: true,
    trigger: 'blur',
  }],
  ingredients: [{
    required: true,
    trigger: 'blur',
  }],
})
// 发布处理
const handleAddClick = () => {
  dialogTableVisible.value = true;
  type.value = 0;
  for (let i in form) {
    if (i !== "sellerId")
      form[i] = "";
  }
}

// 编辑处理
const handleChangeClick = (recipe) => {
  dialogTableVisible.value = true;
  type.value = 1;
  for (let i in recipe) {
    form[i] = recipe[i];
  }
}
// 货物操作
const handleEvent = async (formEl, func, form) => {
  if (type.value === 0) {
    ElMessageBox.confirm("食谱一经发布不得删除，确认发布？",
      '发布确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '再考虑',
        type: 'warning',
      }).then(() => {
        if (!formEl) return
        formEl.validate((valid, fields) => {
          if (valid)
            func(form).then(() => {
              initData();
              dialogTableVisible.value = false;
            })
          else console.log(fields);
        })
      }).catch();
  }
  else {
    if (!formEl) return
    formEl.validate((valid, fields) => {
      if (valid)
        func(form).then(() => {
          initData();
          dialogTableVisible.value = false;
        })
      else console.log(fields);
    })
  }
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
h3 {
  color: #4f4f4f;
}

.recipes {
  width: 100%;
  // height: 200px;
  margin: 20px auto;
  // background-color: pink;
}
</style>