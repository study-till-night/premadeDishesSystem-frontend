<template>
  <div>
    <router-view v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </router-view>
  </div>
</template>

<script setup>

</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  opacity: 1;
  transition: all 0.5s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>