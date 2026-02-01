import { ref, reactive, computed, shallowRef, triggerRef, customRef } from 'vue'

const globalState = reactive({
  formData: {} as Record<string, any>,
  userInfo: {} as Record<string, any>,
  appConfig: {} as Record<string, any>,
  theme: 'light' as 'light' | 'dark',
  locale: 'zh-CN' as string,
  loading: false,
  notifications: [] as Array<{ id: string; type: string; message: string; duration?: number }>
})

const stateConfigs = new Map<string, {
  value: any
  subscribers: Set<(value: any) => void>
  config: {
    name: string
    defaultValue: any
    persistence: boolean
    syncAcrossTabs: boolean
  }
}>()

export function createSharedState<T>(name: string, defaultValue: T, options: {
  persistence?: boolean
  syncAcrossTabs?: boolean
} = {}): {
  value: import('vue').Ref<T>
  set: (value: T) => void
  update: (fn: (prev: T) => T) => void
  subscribe: (callback: (value: T) => void) => () => void
  reset: () => void
} {
  if (!stateConfigs.has(name)) {
    stateConfigs.set(name, {
      value: defaultValue,
      subscribers: new Set(),
      config: {
        name,
        defaultValue,
        persistence: options.persistence || false,
        syncAcrossTabs: options.syncAcrossTabs || false
      }
    })
    
    if (options.persistence) {
      try {
        const saved = localStorage.getItem(`shared-${name}`)
        if (saved) {
          stateConfigs.get(name)!.value = JSON.parse(saved)
        }
      } catch (e) {
        console.error('Failed to load persisted state:', e)
      }
    }
  }
  
  const config = stateConfigs.get(name)!
  
  const getValue = () => config.value as T
  const setValue = (value: T) => {
    config.value = value
    if (config.config.persistence) {
      try {
        localStorage.setItem(`shared-${name}`, JSON.stringify(value))
      } catch (e) {
        console.error('Failed to persist state:', e)
      }
    }
    config.subscribers.forEach(subscriber => subscriber(value))
  }
  
  return {
    value: computed({
      get: getValue,
      set: setValue
    }) as import('vue').Ref<T>,
    set: setValue,
    update: (fn: (prev: T) => T) => setValue(fn(getValue())),
    subscribe: (callback: (value: T) => void) => {
      config.subscribers.add(callback)
      callback(getValue())
      return () => config.subscribers.delete(callback)
    },
    reset: () => setValue(config.config.defaultValue as T)
  }
}

export const formData = createSharedState<Record<string, any>>('formData', {}, {
  persistence: false
})

export const userInfo = createSharedState<Record<string, any>>('userInfo', {}, {
  persistence: true,
  syncAcrossTabs: true
})

export const appConfig = createSharedState<Record<string, any>>('appConfig', {}, {
  persistence: true
})

export const theme = createSharedState<'light' | 'dark'>('theme', 'light', {
  persistence: true,
  syncAcrossTabs: true
})

export const locale = createSharedState<string>('locale', 'zh-CN', {
  persistence: true
})

export const loading = createSharedState<boolean>('loading', false)

export const notifications = createSharedState<Array<{ id: string; type: string; message: string; duration?: number }>>(
  'notifications',
  []
)

export function notify(type: 'success' | 'warning' | 'error' | 'info', message: string, duration: number = 3000) {
  const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  notifications.update(list => [
    ...list,
    { id, type, message, duration }
  ])
  
  if (duration > 0) {
    setTimeout(() => {
      notifications.update(list => list.filter(n => n.id !== id))
    }, duration)
  }
  
  return id
}

export function dismissNotification(id: string) {
  notifications.update(list => list.filter(n => n.id !== id))
}

export function clearAllNotifications() {
  notifications.set([])
}

export function getState<T>(name: string): T | undefined {
  const config = stateConfigs.get(name)
  return config ? config.value as T : undefined
}

export function getAllStates(): Record<string, any> {
  const result: Record<string, any> = {}
  stateConfigs.forEach((config, name) => {
    result[name] = config.value
  })
  return result
}

export function resetAllStates() {
  stateConfigs.forEach((config) => {
    config.value = config.config.defaultValue
    config.subscribers.forEach(subscriber => subscriber(config.config.defaultValue))
  })
}

export function useSharedState() {
  return {
    formData,
    userInfo,
    appConfig,
    theme,
    locale,
    loading,
    notifications,
    notify,
    dismissNotification,
    clearAllNotifications,
    createSharedState,
    getState,
    getAllStates,
    resetAllStates
  }
}
