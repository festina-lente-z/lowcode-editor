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
    
    <el-form label-position="top" size="small" class="feishu-form">
      <el-form-item label="启用状态" class="feishu-form-item">
        <el-switch v-model="localBlock.enabled" active-color="#165DFF" inactive-color="#E5E6EB" />
      </el-form-item>
      
      <el-form-item label="占位列数" class="feishu-form-item">
        <el-slider 
          v-model="localBlock.layout.colSpan" 
          :min="1" 
          :max="24" 
          :marks="{ 6: '1/4', 12: '1/2', 24: '整行' }"
          :step-stops="[6, 12, 18, 24]"
        />
      </el-form-item>
      
      <template v-for="(value, key) in localBlock.config" :key="key">
        <el-form-item :label="getFieldLabel(key)" class="feishu-form-item">
          <el-input 
            v-if="typeof value === 'string' && key !== 'color' && key !== 'layout' && key !== 'source'"
            v-model="localBlock.config[key]"
            :placeholder="String(value)"
            size="small"
          />
          <el-select 
            v-else-if="key === 'color'"
            v-model="localBlock.config[key]"
            size="small"
          >
            <el-option label="主色" value="primary" />
            <el-option label="成功" value="success" />
            <el-option label="警告" value="warning" />
            <el-option label="错误" value="error" />
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
          />
        </el-form-item>
      </template>
      
      <el-divider class="my-4" />
      
      <h4 class="font-medium text-gray-7 mb-3 flex items-center gap-2">
        <Icon name="Mobile" class="w-4 h-4" />
        响应式配置
      </h4>
      
      <el-form-item label="各断点列数" class="feishu-form-item">
        <div class="grid grid-cols-5 gap-2">
          <div v-for="bp in breakpoints" :key="bp.name" class="text-center">
            <label class="block text-xs text-gray-6 mb-1">{{ bp.label }}</label>
            <el-input-number 
              v-model="localBlock.responsive.colSpan[bp.name]" 
              :min="1" 
              :max="24" 
              size="small"
              controls-position="right"
            />
          </div>
        </div>
      </el-form-item>
    </el-form>
    
    <div class="mt-4 pt-4 border-t border-gray-3 flex gap-2">
      <el-button type="primary" size="small" class="flex-1 !bg-[#165DFF] !border-[#165DFF]" @click="handleSave">
        应用
      </el-button>
      <el-button size="small" @click="handleReset">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Icon from '../common/Icon.vue'
import type { BlockSchema, Breakpoint } from '../../types/schema.types'

const props = defineProps<{
  block: BlockSchema
}>()

const emit = defineEmits<{
  update: [block: BlockSchema]
  close: []
}>()

const breakpoints: { name: Breakpoint; label: string }[] = [
  { name: 'xs', label: '手机' },
  { name: 'sm', label: '平板' },
  { name: 'md', label: '笔记本' },
  { name: 'lg', label: '桌面' },
  { name: 'xl', label: '大屏' },
]

const localBlock = ref<BlockSchema>({ ...props.block })

watch(() => props.block, (newBlock) => {
  localBlock.value = { ...newBlock }
}, { deep: true })

const getFieldLabel = (key: string): string => {
  const labelMap: Record<string, string> = {
    title: '标题',
    subtitle: '副标题',
    icon: '图标',
    trend: '趋势',
    trendValue: '趋势值',
    suffix: '后缀',
    precision: '小数位数',
    gap: '间距',
    autoPlay: '自动播放',
    interval: '播放间隔',
    maxItems: '最大数量',
    showPagination: '显示分页',
    pageSize: '每页条数',
    stripe: '斑马纹',
    border: '边框',
    showRedList: '显示红榜',
    showBlackList: '显示黑榜',
    defaultTab: '默认标签',
    showOrder: '显示排名',
    showTrend: '显示趋势',
    categories: '分类列表',
    columns: '列数',
    showCategory: '显示分类',
    showImage: '显示图片',
    showDate: '显示日期',
    showSummary: '显示摘要',
    layout: '布局方式',
    links: '链接列表',
    showIcon: '显示图标',
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
