<template>
  <div class="bg-white rounded-lg overflow-hidden">
    <el-tabs v-model="activeTab" class="h-full">
      <el-tab-pane 
        v-if="config.showRedList" 
        :label="tabRedLabel" 
        name="red"
      >
        <div class="p-3 space-y-2">
          <div 
            v-for="(item, index) in redList" 
            :key="index"
            class="flex items-center gap-3 p-2 rounded bg-success-1"
          >
            <span 
              v-if="config.showOrder"
              class="w-6 h-6 rounded-full bg-success-6 text-white text-xs flex items-center justify-center"
            >
              {{ index + 1 }}
            </span>
            <span class="flex-1 text-sm text-gray-8">{{ item.name }}</span>
            <span class="text-xs text-gray-6">{{ item.score }}</span>
          </div>
          <div v-if="redList.length === 0" class="text-center py-8 text-gray-6">
            暂无红榜数据
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane 
        v-if="config.showBlackList" 
        :label="tabBlackLabel" 
        name="black"
      >
        <div class="p-3 space-y-2">
          <div 
            v-for="(item, index) in blackList" 
            :key="index"
            class="flex items-center gap-3 p-2 rounded bg-error-1"
          >
            <span 
              v-if="config.showOrder"
              class="w-6 h-6 rounded-full bg-error-6 text-white text-xs flex items-center justify-center"
            >
              {{ index + 1 }}
            </span>
            <span class="flex-1 text-sm text-gray-8">{{ item.name }}</span>
            <span class="text-xs text-gray-6">{{ item.score }}</span>
          </div>
          <div v-if="blackList.length === 0" class="text-center py-8 text-gray-6">
            暂无黑榜数据
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BlockSchema } from '../../types/schema.types'

const props = defineProps<{
  block: BlockSchema
}>()

const config = computed(() => props.block.config)
const activeTab = ref(config.value.defaultTab || 'red')

const tabRedLabel = computed(() => `红榜${config.value.showOrder ? '(TOP)' : ''}`)
const tabBlackLabel = computed(() => `黑榜${config.value.showOrder ? '(TOP)' : ''}`)

const redList = ref([
  { name: '张三 - 业绩达成率120%', score: '+20分' },
  { name: '李四 - 客户满意度最高', score: '+18分' },
  { name: '王五 - 创新项目获奖', score: '+15分' },
])

const blackList = ref([
  { name: '赵六 - 迟到3次', score: '-10分' },
  { name: '钱七 - 客户投诉', score: '-15分' },
])
</script>
