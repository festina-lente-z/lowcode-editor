<template>
  <div 
    class="p-4 min-h-[200px] transition-all duration-200"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    :class="containerClass"
  >
    <div v-if="blocks.length === 0" class="h-40 flex flex-col items-center justify-center">
      <div 
        class="w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-all duration-200"
        :class="isDraggingOver ? 'bg-primary-2 scale-110' : 'bg-gray-2'"
      >
        <Icon 
          name="Plus" 
          class="w-7 h-7 transition-all duration-200"
          :class="isDraggingOver ? 'text-primary-6' : 'text-gray-5'" 
        />
      </div>
      <p 
        class="text-sm transition-all duration-200"
        :class="isDraggingOver ? 'text-primary-6 font-medium' : 'text-gray-7'"
      >
        {{ dropHint }}
      </p>
    </div>
    
    <draggable
      v-else
      v-model="blockList"
      item-key="id"
      class="space-y-3"
      ghost-class="draggable-ghost"
      drag-class="draggable-drag"
      chosen-class="draggable-chosen"
      animation="300"
      handle=".drag-handle"
      group="blocks"
      @end="handleDragEnd"
      @change="handleDragChange"
    >
      <template #item="{ element }">
        <BlockItem
          :block="element"
          :selected="selectedId === element.id"
          :breakpoint="breakpoint"
          @select="handleBlockSelect"
          @update="handleBlockUpdate"
          @remove="handleBlockRemove"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import draggable from 'vuedraggable'
import BlockItem from './BlockItem.vue'
import Icon from '../common/Icon.vue'
import type { BlockSchema, Breakpoint } from '../../types/schema.types'
import type { BlockTemplate } from '../../constants/template.types'

const props = defineProps<{
  blocks: BlockSchema[]
  selectedId: string | null
  breakpoint: Breakpoint
}>()

const emit = defineEmits<{
  select: [block: BlockSchema]
  update: [block: BlockSchema]
  remove: [id: string]
  reorder: [blocks: BlockSchema[]]
  drop: [template: BlockTemplate, layoutBlockId?: string]
  addToLayout: [template: BlockTemplate, layoutBlockId: string]
}>()

const blockList = ref<BlockSchema[]>([])
const isDraggingOver = ref(false)
const isExternalDrop = ref(false)

const containerClass = computed(() => ({
  'bg-gradient-to-r from-primary-1 to-primary-2 border-2 border-dashed border-primary-4 rounded-xl scale-[1.02]': isDraggingOver.value,
  'bg-transparent': !isDraggingOver.value
}))

const dropHint = computed(() => {
  return isDraggingOver.value ? '松开鼠标添加组件' : '从左侧拖拽组件到这里'
})

watch(() => props.blocks, (newBlocks) => {
  if (!isExternalDrop.value) {
    const sorted = [...newBlocks].sort((a, b) => a.order - b.order)
    blockList.value = sorted
  }
}, { immediate: true, deep: true })

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
    isExternalDrop.value = true
    const template = JSON.parse(data) as BlockTemplate
    emit('drop', template)
    setTimeout(() => { isExternalDrop.value = false }, 100)
  }
}

const handleAddToLayout = (template: BlockTemplate, layoutBlockId: string) => {
  emit('addToLayout', template, layoutBlockId)
}

const handleBlockSelect = (block: BlockSchema) => {
  emit('select', block)
}

const handleBlockUpdate = (block: BlockSchema) => {
  emit('update', block)
}

const handleBlockRemove = (id: string) => {
  emit('remove', id)
}

const handleDragEnd = () => {
  const reordered = blockList.value.map((block, index) => ({ ...block, order: index }))
  emit('reorder', reordered)
}

const handleDragChange = (event: any) => {
  if (event.added) {
    const reordered = blockList.value.map((block, index) => ({ ...block, order: index }))
    emit('reorder', reordered)
  }
}
</script>

<style scoped>
.draggable-ghost {
  @apply opacity-50 bg-primary-2 border-2 border-dashed border-primary-6;
}

.draggable-drag {
  @apply opacity-100 rotate-2 scale-105 shadow-lg;
}

.draggable-chosen {
  @apply ring-2 ring-primary-5 ring-offset-2;
}
</style>
