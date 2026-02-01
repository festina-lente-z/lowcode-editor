<template>
  <div 
    class="rounded-lg"
    :style="containerStyle"
    @dragover.prevent="handleContainerDragOver"
    @dragleave="handleContainerDragLeave"
    @drop="handleContainerDrop"
    :class="{ 'bg-primary-2': isDraggingOver }"
  >
    <div 
      v-if="blocks.length === 0" 
      class="py-8 text-center text-gray-5 border-2 border-dashed border-gray-3 rounded-lg"
      :class="{ 'border-primary-4': isDraggingOver }"
    >
      <Icon name="Plus" class="w-6 h-6 mx-auto mb-2" />
      <p class="text-sm">拖拽组件到这里</p>
    </div>
    <draggable
      v-else
      v-model="blockList"
      item-key="id"
      class="space-y-3 min-h-[100px]"
      ghost-class="draggable-ghost"
      group="blocks"
      animation="200"
      handle=".drag-handle"
      @end="handleDragEnd"
    >
      <template #item="{ element }">
        <BlockItem
          :block="element"
          :selected="selectedId === element.id"
          :breakpoint="breakpoint"
          @select="handleSelect"
          @update="handleUpdate"
          @remove="handleRemove"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import BlockItem from '../../editor/BlockItem.vue'
import Icon from '../../common/Icon.vue'
import type { BlockSchema, Breakpoint } from '../../../types/schema.types'
import type { BlockTemplate } from '../../../constants/template.types'

const props = defineProps<{
  block: BlockSchema
  blocks: BlockSchema[]
  selectedId: string | null
  breakpoint: Breakpoint
}>()

const emit = defineEmits<{
  select: [block: BlockSchema]
  update: [block: BlockSchema]
  remove: [id: string]
  reorder: [blocks: BlockSchema[]]
  drop: [template: BlockTemplate]
}>()

const blockList = ref<BlockSchema[]>([])
const isDraggingOver = ref(false)

watch(() => props.blocks, (newBlocks) => {
  blockList.value = [...newBlocks]
}, { immediate: true, deep: true })

const containerStyle = computed(() => ({
  backgroundColor: props.block.config.backgroundColor || undefined,
  padding: props.block.config.padding ? `${props.block.config.padding}px` : undefined,
  borderRadius: props.block.config.borderRadius ? `${props.block.config.borderRadius}px` : undefined,
}))

const handleDragOver = (event: DragEvent) => {
  isDraggingOver.value = true
  event.dataTransfer!.dropEffect = 'copy'
}

const handleDragLeave = () => {
  isDraggingOver.value = false
}

const handleDrop = (event: DragEvent) => {
  isDraggingOver.value = false
  const data = event.dataTransfer?.getData('template')
  if (data) {
    const template = JSON.parse(data) as BlockTemplate
    emit('drop', template)
  }
}

const handleContainerDragOver = (event: DragEvent) => {
  isDraggingOver.value = true
  event.dataTransfer!.dropEffect = 'copy'
}

const handleContainerDragLeave = () => {
  isDraggingOver.value = false
}

const handleContainerDrop = (event: DragEvent) => {
  isDraggingOver.value = false
  const data = event.dataTransfer?.getData('template')
  if (data) {
    const template = JSON.parse(data) as BlockTemplate
    if (template.type === 'layout') {
      return
    }
    emit('drop', template)
  }
}

const handleSelect = (block: BlockSchema) => {
  emit('select', block)
}

const handleUpdate = (block: BlockSchema) => {
  emit('update', block)
}

const handleRemove = (id: string) => {
  emit('remove', id)
}

const handleDragEnd = () => {
  emit('reorder', blockList.value)
}
</script>

<style scoped>
.draggable-ghost {
  @apply opacity-50 bg-primary-2 border-2 border-dashed border-primary-6 rounded-lg;
}
</style>
