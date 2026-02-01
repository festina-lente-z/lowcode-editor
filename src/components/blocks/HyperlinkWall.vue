<template>
  <div class="bg-white rounded-lg p-4">
    <template v-for="category in categories" :key="category.name">
      <div v-if="config.showCategory" class="mb-3">
        <h4 class="text-sm font-medium text-gray-8 flex items-center gap-2">
          <Icon name="Folder" class="w-4 h-4 text-primary-6" />
          {{ category.name }}
        </h4>
      </div>
      
      <div 
        class="grid gap-2"
        :style="{ gridTemplateColumns: `repeat(${config.columns || 4}, minmax(0, 1fr))` }"
      >
        <a
          v-for="link in category.links"
          :key="link.url"
          :href="link.url"
          :target="config.openInNewTab ? '_blank' : '_self'"
          class="flex items-center gap-2 p-2 rounded hover:bg-gray-2 transition-colors group"
        >
          <Icon 
            :name="link.icon || 'Link'" 
            class="w-4 h-4 text-gray-6 group-hover:text-primary-6" 
          />
          <span class="text-sm text-gray-7 group-hover:text-gray-8 truncate">
            {{ link.label }}
          </span>
        </a>
      </div>
    </template>
    
    <div v-if="categories.length === 0" class="text-center py-8 text-gray-6">
      <Icon name="Link" class="w-8 h-8 mb-2" />
      <p class="text-sm">暂无链接</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '../common/Icon.vue'
import type { BlockSchema } from '../../types/schema.types'

const props = defineProps<{
  block: BlockSchema
}>()

const config = computed(() => props.block.config)

const categories = ref([
  {
    name: '常用',
    links: [
      { label: '工作台', url: '/dashboard', icon: 'Grid' },
      { label: '审批中心', url: '/approval', icon: 'Check' },
      { label: '消息', url: '/messages', icon: 'Bell' },
      { label: '个人中心', url: '/profile', icon: 'User' },
    ]
  },
  {
    name: '工具',
    links: [
      { label: '日历', url: '/calendar', icon: 'Calendar' },
      { label: '计算器', url: '/calculator', icon: 'Calculator' },
      { label: '便签', url: '/notes', icon: 'Notebook' },
      { label: '地图', url: '/map', icon: 'Location' },
    ]
  }
])
</script>
