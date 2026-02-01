<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    @close="handleClose"
  >
    <div class="preview-container" :style="{ maxHeight: `${maxHeight}px`, overflow: 'auto' }">
      <div v-if="!schema || !schema.properties" class="empty-preview">
        <el-empty description="暂无内容可预览" />
      </div>
      <el-form
        v-else
        ref="formRef"
        :model="formData"
        :label-position="labelPosition"
        :label-width="labelWidth"
        :status-icon="statusIcon"
        @submit.prevent
      >
        <template v-for="(propSchema, key) in schema.properties" :key="key">
          <el-form-item :label="propSchema.title || key" :prop="key">
            <el-input
              v-if="!propSchema.type || propSchema.type === 'string'"
              v-model="formData[key]"
              :placeholder="`请输入${propSchema.title || key}`"
              clearable
            />
            <el-input-number
              v-else-if="propSchema.type === 'number' || propSchema.type === 'integer'"
              v-model="formData[key]"
              :min="propSchema.minimum"
              :max="propSchema.maximum"
              :placeholder="`请输入${propSchema.title || key}`"
            />
            <el-switch
              v-else-if="propSchema.type === 'boolean'"
              v-model="formData[key]"
            />
            <el-select
              v-else-if="propSchema.enum"
              v-model="formData[key]"
              :placeholder="`请选择${propSchema.title || key}`"
              clearable
            >
              <el-option
                v-for="(val, idx) in propSchema.enum"
                :key="idx"
                :label="(propSchema.examples && propSchema.examples[idx]) ? String(propSchema.examples[idx]) : String(val)"
                :value="val"
              />
            </el-select>
            <el-input
              v-else
              v-model="formData[key]"
              type="textarea"
              :placeholder="`请输入${propSchema.title || key}`"
              :rows="3"
            />
          </el-form-item>
        </template>
      </el-form>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">{{ cancelText }}</el-button>
        <el-button 
          v-if="showSubmit" 
          type="primary" 
          :loading="submitting"
          @click="handleSubmit"
        >
          {{ submitText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'

interface RendererConfig {
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string
  statusIcon?: boolean
}

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  width?: string
  maxHeight?: number
  schema?: Record<string, any> | null
  initialData?: Record<string, any>
  showSubmit?: boolean
  submitText?: string
  cancelText?: string
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
}>(), {
  title: '页面预览',
  width: '800px',
  maxHeight: 600,
  showSubmit: true,
  submitText: '提交',
  cancelText: '关闭',
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showClose: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:form-data', data: Record<string, any>): void
  (e: 'submit', data: Record<string, any>): void
  (e: 'change', field: string, value: any): void
  (e: 'close'): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formRef = ref<FormInstance | null>(null)
const formData = ref<Record<string, any>>({})
const submitting = ref(false)

const labelPosition = computed(() => props.schema?.labelPosition || 'right')
const labelWidth = computed(() => props.schema?.labelWidth || '120px')
const statusIcon = computed(() => props.schema?.statusIcon !== false)

watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.value = { ...newData }
  }
}, { immediate: true })

watch(visible, (newVisible) => {
  if (newVisible && props.schema) {
    formData.value = props.initialData ? { ...props.initialData } : {}
  }
})

const handleSubmit = async () => {
  submitting.value = true
  
  try {
    await formRef.value?.validate()
    emit('submit', { ...formData.value })
    ElMessage.success('提交成功')
    handleClose()
  } catch (error) {
    ElMessage.warning('请完善表单信息')
  } finally {
    submitting.value = false
  }
}

const handleClose = () => {
  visible.value = false
  emit('close')
}
</script>

<style scoped>
.preview-container {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;
}

.empty-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
