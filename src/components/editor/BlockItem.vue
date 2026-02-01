<template>
  <div 
    class="relative p-4 bg-white border-2 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-lg hover:-translate-y-0.5"
    :class="[
      selected ? 'border-primary-8 shadow-lg ring-2 ring-primary-3 ring-offset-2' : 'border-gray-3 hover:border-primary-5'
    ]"
    @click="$emit('select', block)"
  >
    <div class="absolute top-2 right-2 flex gap-1 transition-all duration-200 z-10" :class="showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'">
      <button 
        class="p-1.5 rounded-lg hover:bg-primary-1 drag-handle cursor-move bg-white border border-gray-3 shadow-md transition-all hover:border-primary-4" 
        title="拖拽排序"
        @click.stop
      >
        <Icon name="Operation" class="w-4 h-4 text-gray-6 transition-colors hover:text-primary-6" />
      </button>
      <button 
        class="p-1.5 rounded-lg hover:bg-error-1 bg-white border border-gray-3 shadow-md transition-all hover:border-error-4" 
        title="删除"
        @click.stop="$emit('remove', block.id)"
      >
        <Icon name="Delete" class="w-4 h-4 text-error-6 transition-colors" />
      </button>
    </div>
    
    <div class="flex items-center gap-3 mb-3">
      <div 
        class="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
        :class="selected ? 'bg-primary-2 scale-110' : 'bg-primary-1'"
      >
        <Icon 
          :name="getBlockIcon(block.blockType)" 
          class="w-5 h-5 text-primary-8 transition-all"
          :class="selected ? 'scale-110' : ''"
        />
      </div>
      <span class="font-medium text-sm text-gray-9">{{ block.name }}</span>
      <el-tag 
        v-if="!block.enabled" 
        type="info" 
        size="small" 
        class="ml-auto"
        effect="plain"
      >
        已禁用
      </el-tag>
    </div>
    
    <div class="flex items-center gap-4 text-xs text-gray-6 mb-3">
      <span class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-1">
        <Icon name="Column" class="w-3.5 h-3.5" />
        {{ block.layout.colSpan }}/24
      </span>
      <span class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-1">
        <Icon name="Mobile" class="w-3.5 h-3.5" />
        {{ getBreakpointLabel() }}
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()
const showActions = computed(() => props.selected)

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

const getBreakpointLabel = (): string => {
  const breakpointMap: Record<string, string> = {
    xs: t('editor.responsive.xs'),
    sm: t('editor.responsive.sm'),
    md: t('editor.responsive.md'),
    lg: t('editor.responsive.lg'),
    xl: t('editor.responsive.xl'),
  }
  return breakpointMap[props.breakpoint] || props.breakpoint
}

const handleDrop = (template: any) => {
  if (template.type === 'layout') {
    return
  }
  emit('addToLayout', template, props.block.id)
}
</script>
