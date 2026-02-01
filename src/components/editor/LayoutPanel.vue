<template>
  <div 
    class="grid grid-cols-2 gap-2 overflow-y-auto"
    :class="{ 'bg-primary-2': isDraggingOver }"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div
      v-for="template in templates"
      :key="template.id"
      class="p-3 bg-white border border-gray-3 rounded-lg cursor-move transition-all hover:border-primary-8 hover:bg-primary-1 hover:shadow-feishu group"
      :class="{ 'border-primary-8 bg-primary-1 shadow-feishu': isDragging === template.id }"
      draggable="true"
      @dragstart="handleDragStart($event, template)"
      @dragend="handleDragEnd"
    >
      <div class="flex flex-col items-center text-center">
        <div class="w-10 h-10 bg-gray-2 rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary-2 transition-colors">
          <Icon :name="template.icon" class="w-5 h-5 text-gray-7 group-hover:text-primary-8" />
        </div>
        <span class="text-xs text-gray-9 group-hover:text-primary-8 font-medium">{{ template.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { BlockTemplate } from '../../constants/template.types'

const props = defineProps<{
  templates: BlockTemplate[]
  type: 'layout' | 'component'
}>()

const emit = defineEmits<{
  drop: [template: BlockTemplate]
}>()

const isDragging = ref<string | null>(null)
const isDraggingOver = ref(false)

const handleDragStart = (event: DragEvent, template: BlockTemplate) => {
  isDragging.value = template.id
  event.dataTransfer?.setData('template', JSON.stringify(template))
  event.dataTransfer!.effectAllowed = 'copy'
}

const handleDragEnd = () => {
  isDragging.value = null
  isDraggingOver.value = false
}

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
</script>
