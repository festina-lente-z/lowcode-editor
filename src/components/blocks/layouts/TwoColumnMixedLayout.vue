<template>
  <div 
    class="rounded-lg flex gap-4"
    :style="containerStyle"
    @dragover.prevent="handleContainerDragOver"
    @dragleave="handleContainerDragLeave"
    @drop="handleContainerDrop"
    :class="{ 'bg-primary-2': isDraggingOver }"
  >
    <div 
      v-if="blocks.length === 0" 
      class="flex-1 flex flex-col items-center justify-center text-gray-6"
    >
      <div class="w-12 h-12 bg-gray-2 rounded-xl flex items-center justify-center mb-3">
        <Icon name="Plus" class="w-6 h-6 text-gray-5" />
      </div>
      <p class="text-sm text-gray-7">拖拽组件到这里</p>
    </div>
    
    <template v-else>
      <div 
        class="min-h-[100px]"
        :style="{ flex: `0 0 ${config.leftColSpan}fr` }"
      >
        <draggable
          v-model="leftBlockList"
          item-key="id"
          class="space-y-3"
          ghost-class="draggable-ghost"
          group="blocks"
          animation="200"
          handle=".drag-handle"
          @end="handleLeftDragEnd"
          @change="handleLeftDragChange"
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
      
      <div 
        class="min-h-[100px]"
        :style="{ flex: `0 0 ${config.rightColSpan}fr` }"
      >
        <draggable
          v-model="rightBlockList"
          item-key="id"
          class="space-y-3"
          ghost-class="draggable-ghost"
          group="blocks"
          animation="200"
          handle=".drag-handle"
          @end="handleRightDragEnd"
          @change="handleRightDragChange"
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

const config = computed(() => props.block.config)
const isDraggingOver = ref(false)

const leftBlockList = ref<BlockSchema[]>([])
const rightBlockList = ref<BlockSchema[]>([])

watch(() => props.blocks, (newBlocks) => {
  const mid = Math.floor(newBlocks.length / 2)
  leftBlockList.value = newBlocks.slice(0, mid)
  rightBlockList.value = newBlocks.slice(mid)
}, { immediate: true, deep: true })

const containerStyle = computed(() => ({
  backgroundColor: props.block.config.backgroundColor || undefined,
  padding: props.block.config.gap ? `${props.block.config.gap}px` : undefined,
}))

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

const handleLeftDragEnd = () => {
  const allBlocks = [...leftBlockList.value, ...rightBlockList.value]
  const reordered = allBlocks.map((block, index) => ({ ...block, order: index }))
  emit('reorder', reordered)
}

const handleLeftDragChange = (event: any) => {
  if (event.added) {
    const allBlocks = [...leftBlockList.value, ...rightBlockList.value]
    const reordered = allBlocks.map((block, index) => ({ ...block, order: index }))
    emit('reorder', reordered)
  }
}

const handleRightDragEnd = () => {
  const allBlocks = [...leftBlockList.value, ...rightBlockList.value]
  const reordered = allBlocks.map((block, index) => ({ ...block, order: index }))
  emit('reorder', reordered)
}

const handleRightDragChange = (event: any) => {
  if (event.added) {
    const allBlocks = [...leftBlockList.value, ...rightBlockList.value]
    const reordered = allBlocks.map((block, index) => ({ ...block, order: index }))
    emit('reorder', reordered)
  }
}
</script>

<style scoped>
.draggable-ghost {
  @apply opacity-50 bg-primary-2 border-2 border-dashed border-primary-6 rounded-lg;
}
</style>
