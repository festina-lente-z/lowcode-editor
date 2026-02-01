<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    class="preview-dialog"
    @close="handleClose"
  >
    <div class="preview-container" :style="{ maxHeight: `${maxHeight}px` }">
      <div v-if="!schema || !schema.properties" class="empty-preview">
        <div class="flex flex-col items-center justify-center py-16">
          <div class="w-20 h-20 bg-primary-1 rounded-2xl flex items-center justify-center mb-4">
            <Icon name="View" class="w-10 h-10 text-primary-6" />
          </div>
          <h3 class="text-lg font-medium text-gray-9 mb-2">{{ t('editor.emptyPreview') }}</h3>
          <p class="text-sm text-gray-6">{{ t('editor.emptyPreviewHint') }}</p>
        </div>
      </div>
      <el-form
        v-else
        ref="formRef"
        :model="formData"
        :label-position="labelPosition"
        :label-width="labelWidth"
        :status-icon="statusIcon"
        class="preview-form"
        @submit.prevent
      >
        <div class="space-y-4">
          <template v-for="(propSchema, key) in schema.properties" :key="key">
            <div class="form-field-group">
              <el-form-item :label="propSchema.title || key" :prop="key" class="form-item">
                <el-input
                  v-if="!propSchema.type || propSchema.type === 'string'"
                  v-model="formData[key]"
                  :placeholder="`${t('editor.inputPlaceholder')} ${propSchema.title || key}`"
                  clearable
                  class="form-input"
                />
                <el-input-number
                  v-else-if="propSchema.type === 'number' || propSchema.type === 'integer'"
                  v-model="formData[key]"
                  :min="propSchema.minimum"
                  :max="propSchema.maximum"
                  :placeholder="`${t('editor.inputPlaceholder')} ${propSchema.title || key}`"
                  controls-position="right"
                  class="form-input"
                />
                <el-switch
                  v-else-if="propSchema.type === 'boolean'"
                  v-model="formData[key]"
                  active-color="#165DFF"
                />
                <el-select
                  v-else-if="propSchema.enum"
                  v-model="formData[key]"
                  :placeholder="`${t('editor.selectPlaceholder')} ${propSchema.title || key}`"
                  clearable
                  class="form-input"
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
                  :placeholder="`${t('editor.inputPlaceholder')} ${propSchema.title || key}`"
                  :rows="3"
                  clearable
                  class="form-input"
                />
              </el-form-item>
              <p v-if="propSchema.description" class="text-xs text-gray-6 mt-1 pl-2">
                {{ propSchema.description }}
              </p>
            </div>
          </template>
        </div>
      </el-form>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" size="default">{{ cancelText }}</el-button>
        <el-button 
          v-if="showSubmit" 
          type="primary" 
          :loading="submitting"
          size="default"
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
import { useI18n } from 'vue-i18n'
import { ElMessage, type FormInstance } from 'element-plus'
import Icon from '../common/Icon.vue'

interface RendererConfig {
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string
  statusIcon?: boolean
}

const { t } = useI18n()

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
  width: '90%',
  maxHeight: 700,
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
    ElMessage.success(t('editor.submitSuccess'))
    handleClose()
  } catch (error) {
    ElMessage.warning(t('editor.submitWarning'))
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
.preview-dialog {
  border-radius: 12px;
}

.preview-container {
  padding: 24px;
  background: #F7F8FA;
  border-radius: 8px;
  overflow-y: auto;
}

.empty-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.preview-form {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

.form-field-group {
  padding: 12px;
  border-radius: 6px;
  transition: all 0.2s;
}

.form-field-group:hover {
  background: #F7F8FA;
}

.form-item :deep(.el-form-item__label) {
  font-weight: 500;
  color: #1D2129;
}

.form-input :deep(.el-input__wrapper),
.form-input :deep(.el-select__wrapper),
.form-input :deep(.el-textarea__inner) {
  border-radius: 6px;
  transition: all 0.2s;
}

.form-input :deep(.el-input__wrapper:hover),
.form-input :deep(.el-select__wrapper:hover) {
  box-shadow: 0 0 0 1px #165DFF inset;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background: #F7F8FA;
  margin: -24px -24px 0;
  border-radius: 0 0 8px 8px;
}
</style>
