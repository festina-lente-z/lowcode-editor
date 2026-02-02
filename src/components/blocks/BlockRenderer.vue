<template>
  <component 
    :is="componentMap[block.blockType]" 
    v-if="componentMap[block.blockType]"
    :block="block"
    :blocks="childBlocks"
    :selected-id="selectedId"
    :breakpoint="breakpoint"
    class="h-full"
    @select="handleSelect"
    @update="handleUpdate"
    @remove="handleRemove"
    @reorder="handleReorder"
    @drop="handleDrop"
  />
  <div v-else class="p-4 bg-gray-1 rounded text-center text-gray-6">
    <Icon name="Warning" class="w-8 h-8 mb-2 mx-auto" />
    <p>未知组件类型: {{ block.blockType }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue'
import type { BlockSchema, Breakpoint } from '../../types/schema.types'
import StatCard from './StatCard.vue'
import SearchForm from './SearchForm.vue'
import DataTable from './DataTable.vue'
import AnnouncementCarousel from './AnnouncementCarousel.vue'
import RankingBoard from './RankingBoard.vue'
import HyperlinkWall from './HyperlinkWall.vue'
import SingleColumnLayout from './layouts/SingleColumnLayout.vue'
import TwoColumnMixedLayout from './layouts/TwoColumnMixedLayout.vue'
import ThreeColumnMixedLayout from './layouts/ThreeColumnMixedLayout.vue'
import Icon from '../common/Icon.vue'

const props = defineProps<{
  block: BlockSchema
  blocks?: BlockSchema[]
  selectedId?: string | null
  breakpoint?: Breakpoint
}>()

const emit = defineEmits<{
  select: [block: BlockSchema]
  update: [block: BlockSchema]
  remove: [id: string]
  reorder: [blocks: BlockSchema[]]
  drop: [template: BlockTemplate, layoutBlockId?: string]
}>()

const childBlocks = computed(() => {
  if (props.blocks) return props.blocks
  return props.block.blocks || []
})

const handleSelect = (block: BlockSchema) => {
  emit('select', block)
}

const handleUpdate = (block: BlockSchema) => {
  emit('update', block)
}

const handleRemove = (id: string) => {
  emit('remove', id)
}

const handleReorder = (blocks: BlockSchema[]) => {
  const updatedBlock = { ...props.block, blocks }
  emit('update', updatedBlock)
}

const handleDrop = (template: BlockTemplate) => {
  emit('drop', template, props.block.id)
}

const handleAddToLayout = (template: BlockTemplate, layoutBlockId: string) => {
  emit('drop', template, layoutBlockId)
}

const componentMap: Record<string, any> = markRaw({
  'stat-card': StatCard,
  'search-form': SearchForm,
  'data-table': DataTable,
  'announcement-carousel': AnnouncementCarousel,
  'ranking-board': RankingBoard,
  'hyperlink-wall': HyperlinkWall,
  'single-column': SingleColumnLayout,
  'two-column-mixed': TwoColumnMixedLayout,
  'three-column-mixed': ThreeColumnMixedLayout,
})
</script>
