import { ref, shallowRef, computed, reactive, watch, onMounted, onUnmounted, h, defineAsyncComponent } from 'vue'
import type { Component, AsyncComponentLoader, PropType } from 'vue'

export interface DynamicComponentConfig {
  component: AsyncComponentLoader | Component
  loadingComponent?: Component
  errorComponent?: Component
  timeout?: number
  delay?: number
  suspensible?: boolean
}

export interface AsyncComponentOptions {
  loader: AsyncComponentLoader
  loadingComponent?: Component
  errorComponent?: Component
  timeout?: number
  delay?: number
  suspensible?: boolean
}

const componentRegistry = new Map<string, DynamicComponentConfig>()
const componentCache = new Map<string, Component>()

export function registerDynamicComponent(name: string, config: DynamicComponentConfig) {
  componentRegistry.set(name, config)
  componentCache.delete(name)
}

export function unregisterDynamicComponent(name: string) {
  componentRegistry.delete(name)
  componentCache.delete(name)
}

export function getAsyncComponent(name: string): Component | undefined {
  if (componentCache.has(name)) {
    return componentCache.get(name)
  }
  
  const config = componentRegistry.get(name)
  if (!config) return undefined
  
  const loader = typeof config.component === 'function' 
    ? config.component 
    : () => Promise.resolve(config.component)
  
  const asyncComponent = defineAsyncComponent({
    loader: loader as AsyncComponentLoader,
    loadingComponent: config.loadingComponent,
    errorComponent: config.errorComponent,
    timeout: config.timeout,
    delay: config.delay,
    suspensible: config.suspensible
  })
  
  componentCache.set(name, asyncComponent)
  return asyncComponent
}

export function hasComponent(name: string): boolean {
  return componentRegistry.has(name)
}

export function getRegisteredComponents(): string[] {
  return Array.from(componentRegistry.keys())
}

export function clearComponentCache() {
  componentCache.clear()
}

export function createDynamicRenderer() {
  const component = shallowRef<Component | null>(null)
  const props = ref<Record<string, any>>({})
  const events = ref<Record<string, Function>>({})
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  const setComponent = async (name: string, componentProps: Record<string, any> = {}, componentEvents: Record<string, Function> = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const asyncComponent = getAsyncComponent(name)
      if (!asyncComponent) {
        throw new Error(`Component "${name}" not found`)
      }
      
      component.value = asyncComponent
      props.value = componentProps
      events.value = componentEvents
    } catch (e) {
      error.value = e as Error
      component.value = null
    } finally {
      loading.value = false
    }
  }
  
  const clearComponent = () => {
    component.value = null
    props.value = {}
    events.value = {}
    error.value = null
  }
  
  const handleEvent = (eventName: string, ...args: any[]) => {
    const handler = events.value[eventName]
    if (handler && typeof handler === 'function') {
      handler(...args)
    }
  }
  
  return {
    component,
    props,
    events,
    loading,
    error,
    setComponent,
    clearComponent,
    handleEvent
  }
}

export function useDynamicComponent() {
  const { component, props, events, loading, error, setComponent, clearComponent, handleEvent } = createDynamicRenderer()
  
  return {
    component,
    props,
    events,
    loading,
    error,
    setComponent,
    clearComponent,
    handleEvent
  }
}

const DefaultLoading = defineAsyncComponent({
  loader: () => import('@element-plus/icons-vue').then(m => m.Loading),
})

const DefaultError = {
  props: {
    error: {
      type: Object as PropType<Error>,
      required: true
    }
  },
  render(props: { error: Error }) {
    return h('div', { class: 'text-red-500 p-4' }, [
      h('p', '组件加载失败'),
      props.error && h('p', { class: 'text-sm text-gray-500 mt-1' }, props.error.message)
    ])
  }
}

export function registerElementPlusComponents() {
  const elementPlusComponents: Record<string, string> = {
    'el-input': 'ElInput',
    'el-input-number': 'ElInputNumber',
    'el-select': 'ElSelect',
    'el-option': 'ElOption',
    'el-option-group': 'ElOptionGroup',
    'el-button': 'ElButton',
    'el-checkbox': 'ElCheckbox',
    'el-checkbox-group': 'ElCheckboxGroup',
    'el-radio': 'ElRadio',
    'el-radio-group': 'ElRadioGroup',
    'el-switch': 'ElSwitch',
    'el-slider': 'ElSlider',
    'el-date-picker': 'ElDatePicker',
    'el-time-picker': 'ElTimePicker',
    'el-cascader': 'ElCascader',
    'el-color-picker': 'ElColorPicker',
    'el-transfer': 'ElTransfer',
    'el-rate': 'ElRate',
    'el-form': 'ElForm',
    'el-form-item': 'ElFormItem',
    'el-row': 'ElRow',
    'el-col': 'ElCol'
  }
  
  for (const [componentName, exportName] of Object.entries(elementPlusComponents)) {
    registerDynamicComponent(componentName, {
      component: () => import('element-plus').then(m => (m as any)[exportName]),
      loadingComponent: h(DefaultLoading, { class: 'animate-spin' }),
      errorComponent: h(DefaultError, { error: new Error('组件加载失败') }),
      delay: 200,
      timeout: 3000
    })
  }
}
