<template>
  <div class="h-screen flex flex-col bg-[#F7F8FA]">
    <header class="h-14 bg-white border-b border-[#E5E6EB] flex items-center px-6 shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-[#165DFF] rounded-lg flex items-center justify-center">
          <Icon name="Grid" class="w-5 h-5 text-white" />
        </div>
        <h1 class="text-lg font-semibold text-[#1D2129]">{{ t('editor.title') }}</h1>
        <span class="text-xs text-[#86909C] px-2 py-0.5 bg-[#F7F8FA] rounded-full">{{ currentBreakpointLabel }}</span>
      </div>
      
      <div class="flex-1" />
      
      <div class="flex items-center gap-3">
        <LanguageSwitcher />
        <el-button size="small" @click="handlePreview" class="!border-[#E5E6EB] !text-[#4E5969]">
          <Icon name="View" class="mr-1 w-4 h-4" />{{ t('common.preview') }}
        </el-button>
        <el-button size="small" type="primary" @click="handleSave" class="!bg-[#165DFF] !border-[#165DFF]">
          <Icon name="Check" class="mr-1 w-4 h-4" />{{ t('common.save') }}
        </el-button>
      </div>
    </header>
    
    <div class="flex-1 flex overflow-hidden">
      <aside class="w-64 bg-white border-r border-[#E5E6EB] flex flex-col shrink-0">
        <div class="p-4 border-b border-[#E5E6EB]">
          <h3 class="text-sm font-medium text-[#4E5969] uppercase tracking-wide">{{ t('panel.components') }}</h3>
        </div>
        <div class="flex-1 overflow-y-auto p-3">
          <LayoutPanel 
            :templates="layoutTemplates"
            type="layout"
            @drop="handleTemplateDrop"
          />
        </div>
        <div class="p-4 border-t border-[#E5E6EB]">
          <h3 class="text-sm font-medium text-[#4E5969] uppercase tracking-wide mb-3">{{ t('panel.widgets') }}</h3>
          <LayoutPanel 
            :templates="componentTemplates"
            type="component"
            @drop="handleTemplateDrop"
          />
        </div>
      </aside>
      
      <main class="flex-1 overflow-auto p-6 bg-[#F7F8FA]">
        <div class="max-w-5xl mx-auto">
          <div v-if="blocks.length === 0" class="bg-white rounded-xl shadow-sm border border-[#E5E6EB] p-12 text-center">
            <div class="w-16 h-16 bg-[#F0F5FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Plus" class="w-8 h-8 text-[#165DFF]" />
            </div>
            <h3 class="text-lg font-medium text-[#1D2129] mb-2">{{ t('editor.empty.title') }}</h3>
            <p class="text-[#86909C] mb-6">{{ t('editor.empty.description') }}</p>
            <div class="flex justify-center gap-3">
              <el-button type="primary" @click="handleAddLayout">
                <Icon name="Layout" class="mr-1 w-4 h-4" />{{ t('editor.empty.addLayout') }}
              </el-button>
              <el-button @click="handleAddComponent">
                <Icon name="Component" class="mr-1 w-4 h-4" />{{ t('editor.empty.addWidget') }}
              </el-button>
            </div>
          </div>
          
          <div v-else class="space-y-4">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-lg font-medium text-[#1D2129]">{{ pageSettings.title }}</h2>
              <div class="flex items-center gap-2">
                <el-button size="small" text type="primary" @click="handleAddBlock">
                  <Icon name="Plus" class="w-4 h-4 mr-1" />添加区块
                </el-button>
              </div>
            </div>
            
            <LayoutCanvas
              :blocks="blocks"
              :selected-id="selectedBlockId"
              :breakpoint="currentBreakpoint"
              @select="handleBlockSelect"
              @update="handleBlockUpdate"
              @remove="handleBlockRemove"
              @reorder="handleBlockReorder"
              @drop="handleTemplateDrop"
              @add-to-layout="handleAddToLayout"
            />
          </div>
        </div>
      </main>
      
      <aside v-if="selectedBlock || showPageSettings" class="w-80 bg-white border-l border-[#E5E6EB] overflow-auto shrink-0">
        <PropertyPanel
          v-if="selectedBlock"
          :block="selectedBlock"
          @update="handleBlockUpdate"
          @close="selectedBlockId = null"
        />
        <PageSettings 
          v-else
          :settings="pageSettings"
          @update="handlePageSettingsUpdate"
        />
      </aside>
    </div>

    <PreviewDialog
      v-model="showPreview"
      :title="t('common.preview')"
      :schema="previewSchema"
      :initial-data="previewData"
      width="90%"
      :max-height="700"
      @submit="handlePreviewSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
import LanguageSwitcher from '../common/LanguageSwitcher.vue'
import LayoutPanel from './LayoutPanel.vue'
import LayoutCanvas from './LayoutCanvas.vue'
import PropertyPanel from './PropertyPanel.vue'
import PageSettings from './PageSettings.vue'
import PreviewDialog from './PreviewDialog.vue'
import Icon from '../common/Icon.vue'
import { layoutTemplates, componentTemplates } from '../../constants/templates'
import type { BlockSchema, PageSettings as PageSettingsType, Breakpoint, JSONSchema } from '../../types/schema.types'
import type { BlockTemplate } from '../../constants/template.types'

const { t } = useI18n()

const maxWidthMap: Record<string, string> = {
  sm: '540px',
  md: '720px',
  lg: '960px',
  xl: '1140px',
  '2xl': '1320px',
  full: '100%',
}

const activeTab = ref('layout')
const selectedBlockId = ref<string | null>(null)
const showPageSettings = ref(false)
const windowWidth = ref(window.innerWidth)
const showPreview = ref(false)
const previewData = ref<Record<string, any>>({})

const pageSettings = ref<PageSettingsType>({
  title: '我的工作台',
  subtitle: '欢迎使用低代码编辑器',
  showTitle: true,
  titleAlign: 'center',
  padding: 16,
  backgroundColor: '#ffffff',
  maxWidth: 'xl',
})

const blocks = ref<BlockSchema[]>([])

const selectedBlock = computed(() => 
  blocks.value.find(b => b.id === selectedBlockId.value)
)

const currentBreakpoint = computed<Breakpoint>(() => {
  const width = windowWidth.value
  if (width < 480) return 'xs'
  if (width < 576) return 'sm'
  if (width < 768) return 'md'
  if (width < 992) return 'lg'
  return 'xl'
})

const currentBreakpointLabel = computed(() => {
  const labels: Record<Breakpoint, string> = {
    xs: '手机 (<480px)',
    sm: '小屏 (576px)',
    md: '平板 (768px)',
    lg: '桌面 (992px)',
    xl: '大屏 (1200px+)',
  }
  return labels[currentBreakpoint.value]
})

const previewSchema = computed<Record<string, any> | null>(() => {
  if (blocks.value.length === 0) return null

  const properties: Record<string, any> = {}
  
  blocks.value
    .filter(block => block.enabled && block.config)
    .forEach(block => {
      const config = block.config
      if (config.schema) {
        properties[block.id] = config.schema
      } else {
        properties[block.id] = {
          type: 'string',
          title: block.name,
          ...config
        }
      }
    })

  return {
    type: 'object',
    title: pageSettings.value.title,
    properties
  }
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const handleTemplateDrop = (template: any, targetBlockId?: string) => {
  if (targetBlockId) {
    const layoutBlock = blocks.value.find(b => b.id === targetBlockId)
    if (layoutBlock && layoutBlock.type === 'layout') {
      const newBlock: BlockSchema = {
        id: `block-${uuidv4().slice(0, 8)}`,
        type: template.type,
        blockType: template.id,
        name: template.name,
        order: (layoutBlock.blocks?.length || 0),
        enabled: true,
        layout: { ...template.defaultLayout },
        config: { ...template.defaultConfig },
        responsive: template.defaultResponsive,
      }
      const newBlocks = layoutBlock.blocks ? [...layoutBlock.blocks, newBlock] : [newBlock]
      handleBlockUpdate({ ...layoutBlock, blocks: newBlocks })
      selectedBlockId.value = newBlock.id
      ElMessage.success(`已添加${template.name}`)
      return
    }
  }
  
  const newBlock: BlockSchema = {
    id: `block-${uuidv4().slice(0, 8)}`,
    type: template.type,
    blockType: template.id,
    name: template.name,
    order: blocks.value.length,
    enabled: true,
    layout: { ...template.defaultLayout },
    config: { ...template.defaultConfig },
    responsive: template.defaultResponsive,
  }
  
  blocks.value.push(newBlock)
  selectedBlockId.value = newBlock.id
  ElMessage.success(`已添加${template.name}`)
}

const handleAddToLayout = (template: any, layoutBlockId: string) => {
  handleTemplateDrop(template, layoutBlockId)
}

const handleBlockSelect = (block: BlockSchema) => {
  selectedBlockId.value = block.id
  showPageSettings.value = false
}

const handleBlockUpdate = (block: BlockSchema) => {
  const index = blocks.value.findIndex(b => b.id === block.id)
  if (index !== -1) {
    blocks.value[index] = block
  }
}

const handleBlockRemove = (blockId: string) => {
  blocks.value = blocks.value.filter(b => b.id !== blockId)
  if (selectedBlockId.value === blockId) {
    selectedBlockId.value = null
  }
}

const handleBlockReorder = (newBlocks: BlockSchema[]) => {
  blocks.value = newBlocks.map((block, index) => ({ ...block, order: index }))
}

const handlePageSettingsUpdate = (settings: PageSettingsType) => {
  pageSettings.value = settings
}

const handleAddBlock = () => {
  activeTab.value = 'layout'
  ElMessage.info('请从左侧选择要添加的组件')
}

const handleAddLayout = () => {
  if (layoutTemplates.length > 0) {
    handleTemplateDrop(layoutTemplates[0])
  }
}

const handleAddComponent = () => {
  if (componentTemplates.length > 0) {
    handleTemplateDrop(componentTemplates[0])
  }
}

const handlePreview = () => {
  showPreview.value = true
  previewData.value = {}
}

const handlePreviewSubmit = (data: Record<string, any>) => {
  console.log('Preview submit:', data)
  ElMessage.success('预览数据提交成功')
}

const handleSave = () => {
  ElMessage.success('保存成功')
}
</script>
