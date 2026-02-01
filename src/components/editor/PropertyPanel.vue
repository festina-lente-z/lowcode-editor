<template>
  <div class="p-4 bg-white">
    <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-primary-2 rounded-lg flex items-center justify-center">
          <Icon name="Setting" class="w-4 h-4 text-primary-8" />
        </div>
        <h3 class="font-medium text-gray-9">{{ block.name }}</h3>
      </div>
      <button class="p-1.5 rounded-md hover:bg-gray-2 transition-colors" @click="$emit('close')">
        <Icon name="Close" class="w-4 h-4 text-gray-6" />
      </button>
    </div>
    
    <el-collapse v-model="activePanels" class="property-collapse">
      <el-collapse-item name="basic" :title="t('panel.basicSettings')">
        <el-form label-position="top" size="small">
          <el-form-item :label="t('panel.enabled')">
            <el-switch 
              v-model="localBlock.enabled" 
              active-color="#165DFF" 
              inactive-color="#E5E6EB"
              :active-text="t('panel.enabled')"
              :inactive-text="t('panel.disabled')"
            />
          </el-form-item>
          
          <el-form-item :label="t('panel.columnSpan')">
            <div class="w-full">
              <el-slider 
                v-model="localBlock.layout.colSpan" 
                :min="1" 
                :max="24" 
                :marks="columnMarks"
                :step-stops="[6, 12, 18, 24]"
                :show-tooltip="true"
              />
              <div class="text-xs text-gray-6 mt-2 text-center">
                {{ localBlock.layout.colSpan }} / 24 {{ t('panel.columns') }}
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      
      <el-collapse-item name="config" :title="t('panel.componentConfig')">
        <el-form label-position="top" size="small">
          <template v-for="(value, key) in localBlock.config" :key="key">
            <el-form-item :label="getFieldLabel(key)">
              <el-input 
                v-if="typeof value === 'string' && key !== 'color' && key !== 'layout' && key !== 'source'"
                v-model="localBlock.config[key]"
                :placeholder="String(value)"
                size="small"
                clearable
              />
              <el-select 
                v-else-if="key === 'color'"
                v-model="localBlock.config[key]"
                size="small"
              >
                <el-option :label="t('panel.colorPrimary')" value="primary" />
                <el-option :label="t('panel.colorSuccess')" value="success" />
                <el-option :label="t('panel.colorWarning')" value="warning" />
                <el-option :label="t('panel.colorError')" value="error" />
              </el-select>
              <el-switch 
                v-else-if="typeof value === 'boolean'"
                v-model="localBlock.config[key]"
                active-color="#165DFF"
                inactive-color="#E5E6EB"
              />
              <el-input-number
                v-else-if="typeof value === 'number'"
                v-model="localBlock.config[key]"
                size="small"
                :min="0"
                :max="100"
                controls-position="right"
              />
            </el-form-item>
          </template>
        </el-form>
      </el-collapse-item>
      
      <el-collapse-item name="responsive" :title="t('panel.responsive')">
        <el-form label-position="top" size="small">
          <el-form-item :label="t('panel.columnSpanByBreakpoint')">
            <div class="grid grid-cols-5 gap-3">
              <div v-for="bp in breakpoints" :key="bp.name" class="text-center">
                <div class="flex items-center gap-1 justify-center mb-2">
                  <Icon name="Mobile" class="w-3 h-3 text-gray-6" />
                  <label class="text-xs text-gray-6">{{ bp.label }}</label>
                </div>
                <el-input-number 
                  v-model="localBlock.responsive.colSpan[bp.name]" 
                  :min="1" 
                  :max="24" 
                  size="small"
                  controls-position="right"
                  class="w-full"
                />
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    
    <div class="mt-4 pt-4 border-t border-gray-3 flex gap-2">
      <el-button 
        type="primary" 
        size="small" 
        class="flex-1 !bg-[#165DFF] !border-[#165DFF]" 
        @click="handleSave"
      >
        {{ t('common.apply') }}
      </el-button>
      <el-button size="small" @click="handleReset">{{ t('common.reset') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '../common/Icon.vue'
import type { BlockSchema, Breakpoint } from '../../types/schema.types'

const props = defineProps<{
  block: BlockSchema
}>()

const emit = defineEmits<{
  update: [block: BlockSchema]
  close: []
}>()

const { t } = useI18n()
const activePanels = ref(['basic'])

const breakpoints: { name: Breakpoint; label: string }[] = [
  { name: 'xs', label: t('editor.responsive.xs') },
  { name: 'sm', label: t('editor.responsive.sm') },
  { name: 'md', label: t('editor.responsive.md') },
  { name: 'lg', label: t('editor.responsive.lg') },
  { name: 'xl', label: t('editor.responsive.xl') },
]

const localBlock = ref<BlockSchema>({ ...props.block })

const columnMarks = computed(() => ({
  6: '1/4',
  12: '1/2',
  18: '3/4',
  24: '整行'
}))

watch(() => props.block, (newBlock) => {
  localBlock.value = { ...newBlock }
}, { deep: true })

const getFieldLabel = (key: string): string => {
  const labelMap: Record<string, string> = {
    title: t('panel.title'),
    subtitle: t('panel.subtitle'),
    icon: t('panel.icon'),
    trend: t('panel.trend'),
    trendValue: t('panel.trendValue'),
    suffix: t('panel.suffix'),
    precision: t('panel.precision'),
    gap: t('panel.gap'),
    autoPlay: t('panel.autoPlay'),
    interval: t('panel.interval'),
    maxItems: t('panel.maxItems'),
    showPagination: t('panel.showPagination'),
    pageSize: t('panel.pageSize'),
    stripe: t('panel.stripe'),
    border: t('panel.border'),
    showRedList: t('panel.showRedList'),
    showBlackList: t('panel.showBlackList'),
    defaultTab: t('panel.defaultTab'),
    showOrder: t('panel.showOrder'),
    showTrend: t('panel.showTrend'),
    categories: t('panel.categories'),
    columns: t('panel.columns'),
    showCategory: t('panel.showCategory'),
    showImage: t('panel.showImage'),
    showDate: t('panel.showDate'),
    showSummary: t('panel.showSummary'),
    layout: t('panel.layout'),
    links: t('panel.links'),
    showIcon: t('panel.showIcon'),
  }
  return labelMap[key] || key
}

const handleSave = () => {
  emit('update', localBlock.value)
}

const handleReset = () => {
  localBlock.value = { ...props.block }
}
</script>
