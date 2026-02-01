<template>
  <div 
    class="rounded-lg p-4 transition-shadow"
    :class="cardClass"
    :style="cardStyle"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-7 mb-1">{{ config.title }}</p>
        <p class="text-2xl font-semibold text-gray-10">
          {{ displayValue }}
          <span v-if="config.suffix" class="text-sm font-normal text-gray-6 ml-1">{{ config.suffix }}</span>
        </p>
      </div>
      <div 
        class="w-10 h-10 rounded-lg flex items-center justify-center"
        :class="iconBgClass"
      >
        <Icon :name="config.icon || 'DataLine'" class="w-5 h-5" :class="iconClass" />
      </div>
    </div>
    <div v-if="config.trend !== 'none'" class="mt-2 flex items-center gap-1">
      <Icon 
        :name="trendIcon" 
        class="w-4 h-4"
        :class="trendClass"
      />
      <span class="text-sm" :class="trendClass">{{ config.trendValue || '-' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../common/Icon.vue'
import type { BlockSchema } from '../../types/schema.types'

const props = defineProps<{
  block: BlockSchema
}>()

const config = computed(() => props.block.config)

const displayValue = computed(() => {
  const value = 1234
  const precision = config.value.precision || 0
  return value.toFixed(precision)
})

const cardClass = computed(() => {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary-1 border border-primary-2',
    success: 'bg-success-1 border border-success-2',
    warning: 'bg-warning-1 border border-warning-2',
    error: 'bg-error-1 border border-error-2',
  }
  return colorMap[config.value.color] || 'bg-primary-1 border border-primary-2'
})

const iconBgClass = computed(() => {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary-2',
    success: 'bg-success-2',
    warning: 'bg-warning-2',
    error: 'bg-error-2',
  }
  return colorMap[config.value.color] || 'bg-primary-2'
})

const iconClass = computed(() => {
  const colorMap: Record<string, string> = {
    primary: 'text-primary-6',
    success: 'text-success-6',
    warning: 'text-warning-6',
    error: 'text-error-6',
  }
  return colorMap[config.value.color] || 'text-primary-6'
})

const trendIcon = computed(() => {
  return config.value.trend === 'up' ? 'TrendCharts' : 
         config.value.trend === 'down' ? 'TrendCharts' : 'Minus'
})

const trendClass = computed(() => {
  const map: Record<string, string> = {
    up: 'text-success-6',
    down: 'text-error-6',
  }
  return map[config.value.trend] || 'text-gray-6'
})

const cardStyle = computed(() => ({
  backgroundColor: config.value.backgroundColor || undefined,
  borderRadius: config.value.borderRadius ? `${config.value.borderRadius}px` : undefined,
}))
</script>
