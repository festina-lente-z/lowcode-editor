export type MessageType = 'event' | 'request' | 'response' | 'broadcast'

export interface ComponentMessage {
  type: MessageType
  from: string
  to: string
  payload: any
  timestamp: number
  requestId?: string
}

export interface CommunicationChannel {
  channelId: string
  componentId: string
  handlers: Map<string, Set<EventHandler>>
  messageHistory: ComponentMessage[]
}

export type EventHandler = (payload: any) => void

class MessageBus {
  private channels: Map<string, CommunicationChannel> = new Map()
  private channelId: string = ''
  private messageHistory: ComponentMessage[] = []
  private handlers: Map<string, Set<EventHandler>> = new Map()
  private maxHistorySize: number = 100

  register(componentId: string): CommunicationChannel {
    const channel: CommunicationChannel = {
      channelId: `channel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      componentId,
      handlers: new Map(),
      messageHistory: []
    }
    
    this.channels.set(componentId, channel)
    this.channelId = channel.channelId
    
    return channel
  }

  unregister(componentId: string) {
    this.channels.delete(componentId)
    if (this.channelId) {
      const channel = this.channels.get(this.channelId)
      if (!channel) {
        this.channelId = ''
      }
    }
  }

  send(to: string, payload: any, type: MessageType = 'event'): void {
    const message: ComponentMessage = {
      type,
      from: this.channelId,
      to,
      payload,
      timestamp: Date.now()
    }
    
    if (this.channels.has(to)) {
      this.processMessage(message, this.channels.get(to)!)
    }
    
    this.addToHistory(message)
  }

  broadcast(payload: any, type: MessageType = 'event'): void {
    this.channels.forEach((channel, componentId) => {
      if (channel.channelId !== this.channelId) {
        this.send(componentId, payload, type)
      }
    })
  }

  on(event: string, handler: EventHandler): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler)
    
    return () => this.off(event, handler)
  }

  once(event: string, handler: EventHandler): () => void {
    const wrapper: EventHandler = (payload) => {
      handler(payload)
      this.off(event, wrapper)
    }
    return this.on(event, wrapper)
  }

  off(event: string, handler?: EventHandler) {
    if (!handler) {
      this.handlers.delete(event)
      return
    }
    
    const handlers = this.handlers.get(event)
    if (handlers) {
      handlers.delete(handler)
      if (handlers.size === 0) {
        this.handlers.delete(event)
      }
    }
  }

  async request(to: string, payload: any, timeout: number = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const timer = setTimeout(() => {
        this.off(requestId)
        reject(new Error('Request timeout'))
      }, timeout)
      
      this.on(requestId, (response: any) => {
        clearTimeout(timer)
        this.off(requestId)
        resolve(response.payload)
      })
      
      this.send(to, { ...payload, requestId }, 'request')
    })
  }

  private processMessage(message: ComponentMessage, channel: CommunicationChannel) {
    channel.messageHistory.push(message)
    
    const eventHandlers = this.handlers.get(message.to)
    if (eventHandlers) {
      eventHandlers.forEach(handler => {
        try {
          handler(message.payload)
        } catch (error) {
          console.error('Error in message handler:', error)
        }
      })
    }

    if (message.type === 'request') {
      this.send(message.from, { requestId: message.payload.requestId }, 'response')
    }

    while (channel.messageHistory.length > this.maxHistorySize) {
      channel.messageHistory.shift()
    }
  }

  private addToHistory(message: ComponentMessage) {
    this.messageHistory.push(message)
    while (this.messageHistory.length > this.maxHistorySize) {
      this.messageHistory.shift()
    }
  }

  getMessageHistory(componentId?: string): ComponentMessage[] {
    if (componentId) {
      const channel = this.channels.get(componentId)
      return channel?.messageHistory || []
    }
    return [...this.messageHistory]
  }

  getRegisteredChannels(): string[] {
    return Array.from(this.channels.keys())
  }

  clearHistory() {
    this.messageHistory = []
    this.channels.forEach(channel => {
      channel.messageHistory = []
    })
  }
}

export const messageBus = new MessageBus()

export function useMessageBus() {
  const register = (componentId: string) => messageBus.register(componentId)
  const unregister = (componentId: string) => messageBus.unregister(componentId)
  const send = (to: string, payload: any, type?: MessageType) => messageBus.send(to, payload, type)
  const broadcast = (payload: any, type?: MessageType) => messageBus.broadcast(payload, type)
  const on = (event: string, handler: EventHandler) => messageBus.on(event, handler)
  const once = (event: string, handler: EventHandler) => messageBus.once(event, handler)
  const off = (event: string, handler?: EventHandler) => messageBus.off(event, handler)
  const request = (to: string, payload: any, timeout?: number) => messageBus.request(to, payload, timeout)

  return {
    register,
    unregister,
    send,
    broadcast,
    on,
    once,
    off,
    request
  }
}
