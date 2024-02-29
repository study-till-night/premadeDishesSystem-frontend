<template>
  <el-image class="image-self" :src="props.src" fit="fill" :preview-src-list="props.preview && [props.src]" title="查看大图">
    <template #error>
      <div class="image-slot">
        <el-icon><icon-picture /></el-icon>
      </div>
    </template>
  </el-image>
</template>

<script setup>
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { computed } from 'vue';
const props = defineProps({
  preview: true,
  src: String,
  height: "",
  width: ""
})

let _height = computed(() => {
  return props.height;
});
let _width = computed(() => {
  return props.width;
});

</script>

<style lang="less" scoped>
@height: v-bind(_height);
@width: v-bind(_width);

.image-self {
  width: @width;
  height: @height;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #b5b5b5;
  background-color: #dddddd;
  font-size: 30px;
  font-weight: 400;
}
</style>