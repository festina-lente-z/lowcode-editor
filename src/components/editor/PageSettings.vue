<template>
  <div class="p-4 bg-white">
    <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-primary-2 rounded-lg flex items-center justify-center">
          <Icon name="Setting" class="w-4 h-4 text-primary-8" />
        </div>
        <h3 class="font-medium text-gray-9">{{ t('panel.pageSettings') }}</h3>
      </div>
    </div>
    
    <el-form label-position="top" size="small" class="feishu-form">
      <el-form-item :label="t('panel.pageTitle')" class="feishu-form-item">
        <el-input v-model="localSettings.title" size="small" :placeholder="t('panel.pageTitlePlaceholder')" />
      </el-form-item>
      
      <el-form-item :label="t('panel.pageSubtitle')" class="feishu-form-item">
        <el-input v-model="localSettings.subtitle" size="small" :placeholder="t('panel.pageSubtitlePlaceholder')" />
      </el-form-item>
      
      <el-form-item :label="t('panel.showTitle')" class="feishu-form-item">
        <el-switch v-model="localSettings.showTitle" active-color="#165DFF" inactive-color="#E5E6EB" />
      </el-form-item>
      
      <el-form-item :label="t('panel.titleAlign')" class="feishu-form-item">
        <el-radio-group v-model="localSettings.titleAlign" class="feishu-radio-group">
          <el-radio-button value="left">{{ t('panel.alignLeft') }}</el-radio-button>
          <el-radio-button value="center">{{ t('panel.alignCenter') }}</el-radio-button>
          <el-radio-button value="right">{{ t('panel.alignRight') }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item :label="t('panel.maxWidth')" class="feishu-form-item">
        <el-select v-model="localSettings.maxWidth" size="small" class="w-full">
          <el-option :label="t('panel.widthSm')" value="sm" />
          <el-option :label="t('panel.widthMd')" value="md" />
          <el-option :label="t('panel.widthLg')" value="lg" />
          <el-option :label="t('panel.widthXl')" value="xl" />
          <el-option :label="t('panel.widthFull')" value="full" />
        </el-select>
      </el-form-item>
      
      <el-form-item :label="t('panel.padding')" class="feishu-form-item">
        <el-input-number v-model="localSettings.padding" :min="0" :max="100" size="small" controls-position="right" />
      </el-form-item>
      
      <el-form-item :label="t('panel.backgroundColor')" class="feishu-form-item">
        <el-color-picker v-model="localSettings.backgroundColor" show-alpha size="small" />
      </el-form-item>
    </el-form>
    
    
    <div class="mt-4 pt-4 border-t border-gray-3">
      <el-button 
        type="primary" 
        size="small" 
        class="w-full !bg-[#165DFF] !border-[#165DFF]" 
        @click="handleSave"
      >
        {{ t('common.apply') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '../common/Icon.vue'
import type { PageSettings as PageSettingsType } from '../../types/schema.types'

const { t } = useI18n()

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
