<template>
  <component :is="iconName" v-if="iconName" class="w-4 h-4" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const props = defineProps<{
  name: string
}>()

const iconName = computed(() => {
  const key = props.name.charAt(0).toUpperCase() + props.name.slice(1)
  const iconMap: Record<string, any> = ElementPlusIconsVue
  return iconMap[`${key}Icon`] || iconMap[props.name] || null
})
</script>
