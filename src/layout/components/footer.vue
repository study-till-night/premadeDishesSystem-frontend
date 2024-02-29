<template>
  <div class="bottom ">
    <div class="f-center home-root">
      <div class="f-center">工商亮照：<!-- --><img src="//www.rongdaufun.com/statics/images/gslz.jpeg" alt="工商亮照" title="工商亮照"
          style="width:25px;height:25px;margin-right:20px;cursor:pointer"></div>
      <span style="margin-right:20px;cursor:pointer">交易条款</span>
      <span style="margin-right:20px;cursor:pointer">入驻经营规范</span>
      <span style="margin-right:20px;cursor:pointer">交易纠纷</span>
      <span style="margin-right:20px;cursor:pointer">服务协议</span>
      <!-- <span style="margin-right:20px">版权所有：新食代（山东）运营管理有限公司
        Copyright © 2022</span><span style="margin-right:40px;cursor:pointer">客服电话: 400-998-9912</span> -->
      <span>{{ appName }} All
        Rights Reserved <!-- -->
        <!-- <span class="record-no">鲁ICP备2022015809号-3</span> -->
      </span>
    </div>
    <div class="f-center home-root" style="margin-top:5px"><span
        style="margin-right:20px;cursor:pointer">增值电信业务许可证</span><span
        style="margin-right:20px;cursor:pointer">消费者权益保护制度</span></div>
  </div>
</template>

<script setup>
const appName = import.meta.env.VITE_APP_TITLE;
</script>

<style lang="less" scoped>
.bottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 60px;
  background: #000;
  text-align: center;
  font-size: 12px;
  min-height: 36px;
  color: #fff;
}

.f-center {
  justify-content: center;
  display: flex;
  align-items: center;
}

.home-root {
  width: 100%;
  margin: 0 auto;
  // min-width: 1600px;
}
</style>