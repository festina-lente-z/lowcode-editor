export interface PageSchema {
  id: string
  name: string
  description?: string
  version: string
  createdAt: string
  updatedAt: string
  settings: PageSettings
  blocks: BlockSchema[]
  layout: PageLayout
}

export interface PageSettings {
  title: string
  subtitle?: string
  showTitle: boolean
  titleAlign: 'left' | 'center' | 'right'
  padding: number
  backgroundColor: string
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export interface PageLayout {
  type: 'fixed' | 'fluid'
  containerWidth: number
  columns: number
  columnGap: number
  rowGap: number
}

export interface BlockSchema {
  id: string
  type: 'layout' | 'component'
  blockType: string
  name: string
  order: number
  enabled: boolean
  layout: {
    colSpan: number
    colOffset?: number
    align?: 'left' | 'center' | 'right'
  }
  config: Record<string, any>
  responsive: ResponsiveConfig
  styles?: Record<string, string>
}

export interface ResponsiveConfig {
  visibleOn: Breakpoint[]
  hideOn: Breakpoint[]
  colSpan: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
  }
}

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface BlockTemplate {
  id: string
  type: 'layout' | 'component'
  category: 'layout' | 'function' | 'data' | 'media'
  name: string
  icon: string
  description: string
  defaultLayout: {
    colSpan: number
    colOffset?: number
  }
  defaultResponsive: ResponsiveConfig
  defaultConfig: Record<string, any>
  configSchema: JSONSchema
  preview?: string
}

export interface JSONSchema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean'
  title?: string
  description?: string
  properties?: Record<string, JSONSchema>
  items?: JSONSchema | JSONSchema[]
  enum?: any[]
  required?: string[]
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string
}
