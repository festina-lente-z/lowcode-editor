export interface ResponsiveConfig {
  visibleOn: string[]
  hideOn: string[]
  colSpan: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
  }
}

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
  configSchema: Record<string, any>
  preview?: string
}
