import { ref, computed, type Ref } from 'vue'

interface HistoryState<T> {
  data: T
  timestamp: number
  description: string
}

export function useHistory<T>(initialState: T) {
  const history = ref<HistoryState<T>[]>([
    { data: initialState, timestamp: Date.now(), description: 'Initial state' }
  ])
  const currentIndex = ref(0)
  const maxHistory = 50

  const currentState = computed(() => history.value[currentIndex.value].data)
  
  const canUndo = computed(() => currentIndex.value > 0)
  const canRedo = computed(() => currentIndex.value < history.value.length - 1)

  const push = (state: T, description: string = 'Change') => {
    const newHistory = history.value.slice(0, currentIndex.value + 1)
    
    if (newHistory.length >= maxHistory) {
      newHistory.shift()
      currentIndex.value--
    }
    
    newHistory.push({
      data: JSON.parse(JSON.stringify(state)),
      timestamp: Date.now(),
      description
    })
    
    history.value = newHistory
    currentIndex.value = newHistory.length - 1
  }

  const undo = (): T | null => {
    if (!canUndo.value) return null
    
    currentIndex.value--
    return JSON.parse(JSON.stringify(history.value[currentIndex.value].data))
  }

  const redo = (): T | null => {
    if (!canRedo.value) return null
    
    currentIndex.value++
    return JSON.parse(JSON.stringify(history.value[currentIndex.value].data))
  }

  const reset = (state: T, description: string = 'Reset') => {
    history.value = [{ data: JSON.parse(JSON.stringify(state)), timestamp: Date.now(), description }]
    currentIndex.value = 0
  }

  const clear = () => {
    history.value = []
    currentIndex.value = 0
  }

  return {
    history,
    currentIndex,
    currentState,
    canUndo,
    canRedo,
    push,
    undo,
    redo,
    reset,
    clear
  }
}
