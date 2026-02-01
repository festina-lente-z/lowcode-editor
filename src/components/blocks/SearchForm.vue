<template>
  <div class="bg-white rounded-lg p-4">
    <el-form 
      :model="formData" 
      :inline="config.layout === 'inline'"
      class="flex flex-wrap gap-4 items-end"
    >
      <template v-for="field in config.fields" :key="field.key">
        <el-form-item :label="field.label" class="mb-0">
          <el-input
            v-if="field.type === 'input'"
            v-model="formData[field.key]"
            :placeholder="field.placeholder"
            clearable
            class="w-40"
          />
          <el-select
            v-else-if="field.type === 'select'"
            v-model="formData[field.key]"
            :placeholder="field.placeholder"
            clearable
            class="w-40"
          >
            <el-option
              v-for="opt in field.options"
              :key="opt"
              :label="opt"
              :value="opt"
            />
          </el-select>
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="formData[field.key]"
            type="date"
            :placeholder="field.placeholder"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="w-40"
          />
        </el-form-item>
      </template>
      
      <div class="flex gap-2" :class="buttonWrapperClass">
        <el-button 
          v-if="config.showSearch"
          type="primary"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button 
          v-if="config.showReset"
          @click="handleReset"
        >
          重置
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { BlockSchema } from '../../types/schema.types'

const props = defineProps<{
  block: BlockSchema
}>()

const emit = defineEmits<{
  search: [data: Record<string, any>]
  reset: []
}>()

const config = computed(() => props.block.config)

const formData = ref<Record<string, any>>({})
watch(() => config.value.fields, (fields) => {
  fields?.forEach((f: any) => {
    formData.value[f.key] = ''
  })
}, { immediate: true, deep: true })

const buttonWrapperClass = computed(() => {
  const pos = config.value.buttonPosition || 'right'
  return pos === 'left' ? 'mr-auto' : pos === 'center' ? 'mx-auto' : 'ml-auto'
})

const handleSearch = () => {
  emit('search', formData.value)
}

const handleReset = () => {
  Object.keys(formData.value).forEach(key => {
    formData.value[key] = ''
  })
  emit('reset')
}
</script>
