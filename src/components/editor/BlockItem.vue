<template>
  <div 
    class="relative p-4 bg-white border-2 rounded-lg transition-all cursor-pointer group hover:shadow-feishu"
    :class="[
      selected ? 'border-primary-8 bg-primary-1 shadow-feishu' : 'border-gray-3 hover:border-primary-6'
    ]"
    @click="$emit('select', block)"
  >
    <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
      <button 
        class="p-1.5 rounded-md hover:bg-gray-2 drag-handle cursor-move bg-white border border-gray-3 shadow-sm" 
        title="拖拽排序"
      >
        <Icon name="Operation" class="w-4 h-4 text-gray-6" />
      </button>
      <button 
        class="p-1.5 rounded-md hover:bg-error-1 bg-white border border-gray-3 shadow-sm" 
        title="删除"
        @click.stop="$emit('remove', block.id)"
      >
        <Icon name="Delete" class="w-4 h-4 text-error-6" />
      </button>
    </div>
    
    <div class="flex items-center gap-2 mb-3">
      <div class="w-8 h-8 bg-primary-2 rounded-lg flex items-center justify-center">
        <Icon :name="getBlockIcon(block.blockType)" class="w-4 h-4 text-primary-8" />
      </div>
      <span class="font-medium text-sm text-gray-9">{{ block.name }}</span>
      <el-tag v-if="!block.enabled" type="info" size="small" class="ml-auto">已禁用</el-tag>
    </div>
    
    <div class="flex items-center gap-4 text-xs text-gray-6 mb-3">
      <span class="flex items-center gap-1">
        <Icon name="Column" class="w-3.5 h-3.5" />
        {{ block.layout.colSpan }}/24 列
      </span>
      <span class="flex items-center gap-1">
        <Icon name="Mobile" class="w-3.5 h-3.5" />
        {{ block.responsive?.default || 'xl' }}
      </span>
    </div>
    
    <BlockRenderer 
      v-if="block.type === 'layout'" 
      :block="block"
      :blocks="block.blocks || []"
      :selected-id="selectedId"
      :breakpoint="breakpoint"
      class="mt-3"
      @select="$emit('select', $event)"
      @update="$emit('update', $event)"
      @remove="$emit('remove', $event)"
      @reorder="$emit('reorder', $event)"
      @drop="handleDrop"
    />
    <BlockRenderer 
      v-else 
      :block="block" 
      class="mt-3" 
    />
  </div>
</template>

<script setup lang="ts">
import Icon from '../common/Icon.vue'
import BlockRenderer from '../blocks/BlockRenderer.vue'
import type { BlockSchema, Breakpoint } from '../../types/schema.types'

const props = defineProps<{
  block: BlockSchema
  selected: boolean
  breakpoint: Breakpoint
  selectedId?: string | null
}>()

const emit = defineEmits<{
  select: [block: BlockSchema]
  update: [block: BlockSchema]
  remove: [id: string]
  reorder: [blocks: BlockSchema[]]
  addToLayout: [template: any, layoutBlockId: string]
}>()

const getBlockIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    'single-column': 'Column',
    'two-column': 'Columns',
    'three-column': 'Grid',
    'four-column': 'Grid',
    'stat-card': 'DataLine',
    'search-form': 'Search',
    'data-table': 'Grid',
    'announcement-carousel': 'Notification',
    'ranking-board': 'TrendCharts',
    'hyperlink-wall': 'Link',
    'news-card': 'Reading',
    'quick-links': 'Star',
  }
  return iconMap[type] || 'Grid'
}

const handleDrop = (template: any) => {
  if (template.type === 'layout') {
    return
  }
  emit('addToLayout', template, props.block.id)
}
</script>
