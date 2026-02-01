<template>
  <div class="p-4 bg-white">
    <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-primary-2 rounded-lg flex items-center justify-center">
          <Icon name="Setting" class="w-4 h-4 text-primary-8" />
        </div>
        <h3 class="font-medium text-gray-9">页面设置</h3>
      </div>
    </div>
    
    <el-form label-position="top" size="small" class="feishu-form">
      <el-form-item label="页面标题" class="feishu-form-item">
        <el-input v-model="localSettings.title" size="small" placeholder="输入页面标题" />
      </el-form-item>
      
      <el-form-item label="副标题" class="feishu-form-item">
        <el-input v-model="localSettings.subtitle" size="small" placeholder="输入副标题" />
      </el-form-item>
      
      <el-form-item label="显示标题" class="feishu-form-item">
        <el-switch v-model="localSettings.showTitle" active-color="#165DFF" inactive-color="#E5E6EB" />
      </el-form-item>
      
      <el-form-item label="标题对齐" class="feishu-form-item">
        <el-radio-group v-model="localSettings.titleAlign" class="feishu-radio-group">
          <el-radio-button value="left">左对齐</el-radio-button>
          <el-radio-button value="center">居中</el-radio-button>
          <el-radio-button value="right">右对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="最大宽度" class="feishu-form-item">
        <el-select v-model="localSettings.maxWidth" size="small" class="w-full">
          <el-option label="小 (540px)" value="sm" />
          <el-option label="中 (720px)" value="md" />
          <el-option label="大 (960px)" value="lg" />
          <el-option label="超大 (1140px)" value="xl" />
          <el-option label="全宽" value="full" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="内边距" class="feishu-form-item">
        <el-input-number v-model="localSettings.padding" :min="0" :max="100" size="small" controls-position="right" />
      </el-form-item>
      
      <el-form-item label="背景色" class="feishu-form-item">
        <el-color-picker v-model="localSettings.backgroundColor" show-alpha size="small" />
      </el-form-item>
    </el-form>
    
    <div class="mt-4 pt-4 border-t border-gray-3">
      <el-button type="primary" size="small" class="w-full !bg-[#165DFF] !border-[#165DFF]" @click="handleSave">
        应用
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Icon from '../common/Icon.vue'
import type { PageSettings as PageSettingsType } from '../../types/schema.types'

const props = defineProps<{
  settings: PageSettingsType
}>()

const emit = defineEmits<{
  update: [settings: PageSettingsType]
}>()

const localSettings = ref<PageSettingsType>({ ...props.settings })

watch(() => props.settings, (newSettings) => {
  localSettings.value = { ...newSettings }
}, { deep: true })

const handleSave = () => {
  emit('update', localSettings.value)
}
</script>

<style scoped>
.feishu-form-item {
  margin-bottom: 16px;
}

.feishu-form-item :deep(.el-form-item__label) {
  font-size: 13px;
  color: #4E5969;
  font-weight: 500;
}

.feishu-radio-group {
  display: flex;
  width: 100%;
}

.feishu-radio-group .el-radio-button {
  flex: 1;
}

.feishu-radio-group .el-radio-button__inner {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #E5E6EB;
  box-shadow: none;
}

.feishu-radio-group .el-radio-button__original:checked + .el-radio-button__inner {
  background-color: #165DFF;
  border-color: #165DFF;
}
</style>
