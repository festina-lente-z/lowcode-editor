<template>
  <div class="bg-white rounded-lg p-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-medium text-gray-8">{{ config.title || '公告' }}</h3>
    </div>
    
    <el-carousel
      v-if="announcements.length > 0"
      :autoplay="config.autoPlay"
      :interval="config.interval"
      :indicator-position="'none'"
      :type="config.effect === 'card' ? 'card' : undefined"
      height="120px"
    >
      <el-carousel-item v-for="item in announcements" :key="item.id">
        <div class="h-full p-3 bg-gray-1 rounded flex items-center">
          <Icon name="Notification" class="w-5 h-5 text-primary-6 mr-3" />
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-8 truncate">{{ item.title }}</p>
            <p class="text-xs text-gray-6 mt-1">{{ item.date }}</p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    
    <div v-else class="h-24 flex items-center justify-center text-gray-6">
      <Icon name="Bell" class="w-8 h-8 mb-2" />
      <p class="text-sm">暂无公告</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BlockSchema } from '../../types/schema.types'

const props = defineProps<{
  block: BlockSchema
}>()

const config = computed(() => props.block.config)

const announcements = ref([
  { id: 1, title: '系统将于今晚22:00进行维护', date: '2026-01-29' },
  { id: 2, title: '新功能已上线，欢迎体验', date: '2026-01-28' },
  { id: 3, title: '春节放假通知', date: '2026-01-27' },
])
</script>
