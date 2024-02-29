<template>
  <div class="main-content">
    <!-- 选择分类 -->
    <el-row>
      <el-col :span="3">
        <h5>选择货物类别</h5>
      </el-col>
      <el-col :span="4">
        <el-select v-model="category" class="m-2" placeholder="请选择货物分类" size="large" @change="changeParams(false)">
          <el-option v-for="item in categories" :key="item.categoryId" :label="item.categoryName"
            :value="item.categoryId" />
        </el-select>
      </el-col>
      <el-col :span="3" :offset="1">
        <h5>选择日期范围</h5>
      </el-col>
      <el-col :span="6">
        <el-radio-group v-model="days" size="large" @change="changeParams(true)">
          <el-radio-button :label="7">近7天</el-radio-button>
          <el-radio-button :label="30">近30天</el-radio-button>
          <el-radio-button :label="180">近6个月</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>

    <!-- 图标主体 -->
    <div id="diagram">

    </div>
  </div>
</template>

<script setup>
import { queryList } from '@/api/market.js';
import { queryList as querySort } from '@/api/category.js';
import { reactive, ref, onMounted } from 'vue';
import { GetTime } from '@/utils/dateUtils.js';
import * as echarts from "echarts";

let categories = reactive([]);
let category = ref("");
let days = ref(7);
// echarts配置
const option = {
  title: {
    show: true,//false
    text: "全平台分类交易额(单位:元)",//主标题文本
    textStyle: {
      color: '#aaa',//'red'，字体颜色
      fontStyle: 'normal',//'italic'(倾斜) | 'oblique'(倾斜体) ，字体风格
      fontWeight: 'normal',//'bold'(粗体) | 'bolder'(粗体) | 'lighter'(正常粗细) ，字体粗细
      fontFamily: '微软雅黑',//'sans-serif' | 'serif' | 'monospace' | 'Arial' | 'Courier New' 
      // 'Microsoft YaHei'(微软雅黑) ，文字字体
      fontSize: 18,//字体大小
      lineHeight: 24,//字体行高
    },
    textAlign: 'auto',//整体（包括 text 和 subtext）的水平对齐
    textVerticalAlign: 'auto',//整体（包括 text 和 subtext）的垂直对齐
    padding: 0,//[5,10] | [ 5,6, 7, 8] ,标题内边距
    left: '40%',//'5' | '5%'，title 组件离容器左侧的距离
    right: 'auto',//'title 组件离容器右侧的距离
    top: '20px',//title 组件离容器上侧的距离
    bottom: 'auto',//title 组件离容器下侧的距离
  },
  legend: {
    // Try 'horizontal'
    orient: 'vertical',
    right: 10,
    top: 'center',
    data: []
  },
  xAxis: {
    type: 'category',
    data: GetTime(7)
  },
  yAxis: {
    type: 'value'
  },
  series: []
}
let myChart = reactive({});

onMounted(() => {
  myChart = echarts.init(document.getElementById('diagram'));
  myChart.setOption(option);
})
// 更改参数
const changeParams = (refresh) => {
  if (refresh === true) {
    option.series.length = 0;
    option.legend.data.length = 0;
    myChart.setOption(option, true);
  }

  queryList(days.value, category.value).then(({ data }) => {
    option.xAxis.data = GetTime(days.value);
    let line = {
      data, type: 'line',
      label: { show: true, }
    };
    for (let item of categories) {
      if (item.categoryId === category.value) {
        option.legend.data.push(item.categoryName);
        line.name = item.categoryName;
        option.series.push(line);
        break;
      }
    }
    myChart.setOption(option);
  })
}

querySort().then(({ data }) => {
  categories.push(...data);
  category.value = categories[0].categoryId;
  changeParams();
})



</script>

<style lang="less" scoped>
@import "../../assets/less/layout.less";

.main-content {
  @topHeight: 60px;

  .el-row {
    height: @topHeight;
  }

  .el-col {
    margin-top: 20px;

    h5 {
      margin-left: 20px;
      line-height: @topHeight/1.8;
      color: rgb(148, 148, 148);
    }
  }

  #diagram {
    width: 100%;
    height: 500px;
  }
}
</style>