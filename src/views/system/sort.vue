<template>
  <el-row>
    <el-col :span="16" :offset="4" class="prod-list">
      <prodList :prods="prods">
        <template #top-content>
          <!-- 货物类别栏 -->
          <el-row class="prod-select">
            <el-form inline>
              <el-form-item>
                <el-icon>
                  <Search />
                </el-icon>
                <span>货物类别</span>
              </el-form-item>

              <el-form-item>
                <el-select v-model="selectEdCate" @change="router.push(`/sort/${selectEdCate}`);" class="m-2"
                  placeholder="请选择货物类别" size="large">
                  <el-option v-for="item in categories" :key="item.categoryId" :label="item.categoryName"
                    :value="item.categoryId" />
                </el-select>
              </el-form-item>
            </el-form>

          </el-row>
        </template>

        <template #page>
          <!-- 分页器 -->
          <MyPagination :pageSize="pageSize" :layout="layout" :pageTotal="total" @pageFunc="pageFunc" />
        </template>
      </prodList>
    </el-col>
  </el-row>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, watch, reactive } from 'vue';
import prodList from '@/components/prod/prodList.vue';
import MyPagination from '@/components/utils/MyPagination.vue';
import { queryList, queryBySort } from '@/api/category.js';
import { Search } from '@element-plus/icons-vue'

const route = useRoute();
const router = useRouter()

// 类别相关
let selectEdCate = ref("")
let curCate = ref(parseInt(route.params.id));
let categories = reactive([])

// 货物相关
let prods = reactive([]);
let currentPage = ref(1);
let pageSize = ref(16);
let total = ref(0)
let layout = "total, prev, pager, next, jumper, ->, slot"; //分页组件会展示的功能项

// 获取货物分类
queryList().then(({ data }) => {
  categories.push(...data);
})

//监听路由参数变化
watch(
  () => router.currentRoute.value,
  () => {
    curCate.value = route.params.id;
    if (!curCate.value) return;
    // 进入页面加载
    queryBySort(curCate.value, currentPage.value, pageSize.value).then((data) => {
      // if (data.msg === '404') {
      //   router.replace('/404');
      //   return;
      // }
      prods.length = 0;
      prods.push(...data.list);
      currentPage.value = data.currentPage;
      pageSize.value = data.pageSize;
      total.value = data.total;
    }).catch((err) => {
      console.log(err);
    });
  },
  { immediate: true }
)

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
@import "../../assets/less/prodRevelent.less";
</style>