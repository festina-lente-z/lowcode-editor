<template>
  <div class="bg-white rounded-lg overflow-hidden">
    <el-table
      :data="tableData"
      :stripe="config.stripe"
      :border="config.border"
      :size="config.size"
      style="width: 100%"
    >
      <el-table-column
        v-if="config.showSelection"
        type="selection"
        width="55"
      />
      <el-table-column
        v-for="col in config.columns"
        :key="col.key"
        :prop="col.key"
        :label="col.title"
        :width="col.width"
        :sortable="col.sortable"
        :fixed="col.fixed !== 'none' ? col.fixed : undefined"
        :align="col.align || 'left'"
      >
        <template #default="{ row }">
          <slot :name="`col-${col.key}`" :row="row" :value="row[col.key]">
            {{ row[col.key] }}
          </slot>
        </template>
      </el-table-column>
    </el-table>
    
    <div v-if="config.showPagination" class="p-4 flex justify-end">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="config.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="100"
        layout="total, sizes, prev, pager, next, jumper"
        background
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { BlockSchema } from '../../types/schema.types'

const props = defineProps<{
  block: BlockSchema
}>()

const emit = defineEmits<{
  pageChange: [page: number, pageSize: number]
}>()

const config = computed(() => props.block.config)
const currentPage = ref(1)

const tableData = ref([
  { id: 1, name: '示例数据1', status: '启用' },
  { id: 2, name: '示例数据2', status: '禁用' },
  { id: 3, name: '示例数据3', status: '启用' },
])

onMounted(() => {
  emit('pageChange', currentPage.value, config.value.pageSize)
})
</script>
