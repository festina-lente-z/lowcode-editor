export type SchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null'

export interface JSONSchema {
  type?: SchemaType | SchemaType[]
  title?: string
  description?: string
  default?: any
  enum?: any[]
  required?: string[]
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  format?: string
  pattern?: string
  properties?: Record<string, JSONSchema>
  items?: JSONSchema | JSONSchema[]
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean
  examples?: any[]
  [key: string]: any
}

export interface FormField {
  key: string
  label: string
  description?: string
  component: string
  props: Record<string, any>
  events: Record<string, string>
  rules: ValidationRule[]
  children?: FormField[]
  colSpan?: number
}

export interface ValidationRule {
  type: string
  value?: any
  message: string
  trigger?: string | string[]
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
}

export interface ComponentMappingRule {
  schemaType: SchemaType
  schemaFormat?: string
  componentName: string
  defaultProps?: Record<string, any>
  propTransform?: (schema: JSONSchema) => Record<string, any>
  eventTransform?: (schema: JSONSchema) => Record<string, string>
}

const defaultComponentMapping: ComponentMappingRule[] = [
  { schemaType: 'string', componentName: 'el-input' },
  { schemaType: 'string', schemaFormat: 'email', componentName: 'el-input' },
  { schemaType: 'string', schemaFormat: 'date', componentName: 'el-date-picker' },
  { schemaType: 'string', schemaFormat: 'time', componentName: 'el-time-picker' },
  { schemaType: 'number', componentName: 'el-input-number' },
  { schemaType: 'integer', componentName: 'el-input-number' },
  { schemaType: 'boolean', componentName: 'el-switch' },
  { schemaType: 'array', componentName: 'el-select' },
]

class SchemaMapper {
  private mappingRules: ComponentMappingRule[]
  private customMapping: Map<string, ComponentMappingRule> = new Map()

  constructor(mappingRules: ComponentMappingRule[] = defaultComponentMapping) {
    this.mappingRules = mappingRules
  }

  findComponentMapping(schema: JSONSchema): ComponentMappingRule {
    const type = Array.isArray(schema.type) ? schema.type[0] : schema.type
    
    if (!type) {
      return { schemaType: 'string', componentName: 'el-input' }
    }
    
    const customKey = `${type}${schema.format ? `:${schema.format}` : ''}`
    if (this.customMapping.has(customKey)) {
      return this.customMapping.get(customKey)!
    }
    
    return this.mappingRules.find(rule => 
      rule.schemaType === type && 
      (!rule.schemaFormat || rule.schemaFormat === schema.format)
    ) || { schemaType: type, componentName: 'el-input' }
  }

  addMappingRule(rule: ComponentMappingRule) {
    const key = `${rule.schemaType}${rule.schemaFormat ? `:${rule.schemaFormat}` : ''}`
    this.customMapping.set(key, rule)
    if (!this.mappingRules.includes(rule)) {
      this.mappingRules.push(rule)
    }
  }

  removeMappingRule(schemaType: string, schemaFormat?: string) {
    const key = `${schemaType}${schemaFormat ? `:${schemaFormat}` : ''}`
    this.customMapping.delete(key)
  }

  schemaToFormField(schema: JSONSchema, key: string): FormField {
    const mapping = this.findComponentMapping(schema)
    
    let props: Record<string, any> = {}
    if (mapping.propTransform) {
      props = mapping.propTransform(schema)
    } else if (mapping.defaultProps) {
      props = { ...mapping.defaultProps }
    }

    if (schema.enum) {
      props.options = schema.enum.map((value, index) => ({
        label: (schema.examples && Array.isArray(schema.examples) && schema.examples[index]) ? String(schema.examples[index]) : String(value),
        value
      }))
    }

    if (schema.type === 'array' && schema.items && !Array.isArray(schema.items)) {
      if (schema.items.enum) {
        const itemsSchema = schema.items as JSONSchema
        props.options = schema.items.enum.map((value, index) => ({
          label: (itemsSchema.examples && Array.isArray(itemsSchema.examples) && itemsSchema.examples[index]) ? String(itemsSchema.examples[index]) : String(value),
          value
        }))
      }
    }

    const events: Record<string, string> = mapping.eventTransform 
      ? mapping.eventTransform(schema) 
      : {
          'update:modelValue': 'update:modelValue',
        }

    return {
      key,
      label: schema.title || this.formatKeyToLabel(key),
      description: schema.description,
      component: mapping.componentName,
      props,
      events,
      rules: this.generateValidationRules(schema, key),
      children: schema.type === 'object' && schema.properties
        ? this.mapObjectProperties(schema.properties)
        : undefined,
      colSpan: 24
    }
  }

  mapObjectProperties(properties: Record<string, JSONSchema>): FormField[] {
    return Object.entries(properties).map(([key, schema]) => 
      this.schemaToFormField(schema, key)
    )
  }

  generateValidationRules(schema: JSONSchema, fieldName: string): ValidationRule[] {
    const rules: ValidationRule[] = []

    if (schema.required?.includes(fieldName)) {
      rules.push({
        type: 'required',
        message: `${schema.title || fieldName}是必填项`,
        trigger: 'blur'
      })
    }

    switch (schema.type) {
      case 'string':
        if (schema.minLength) {
          rules.push({
            type: 'stringMin',
            value: schema.minLength,
            message: `${schema.title || fieldName}长度至少${schema.minLength}字符`,
            trigger: 'blur'
          })
        }
        if (schema.maxLength) {
          rules.push({
            type: 'stringMax',
            value: schema.maxLength,
            message: `${schema.title || fieldName}长度最多${schema.maxLength}字符`,
            trigger: 'blur'
          })
        }
        if (schema.pattern) {
          rules.push({
            type: 'pattern',
            value: schema.pattern,
            message: `${schema.title || fieldName}格式不正确`,
            trigger: 'blur'
          })
        }
        if (schema.format === 'email') {
          rules.push({
            type: 'email',
            message: `请输入有效的邮箱地址`,
            trigger: 'blur'
          })
        }
        break

      case 'number':
      case 'integer':
        if (schema.minimum !== undefined) {
          rules.push({
            type: 'min',
            value: schema.minimum,
            message: `${schema.title || fieldName}最小值为${schema.minimum}`,
            trigger: 'blur'
          })
        }
        if (schema.maximum !== undefined) {
          rules.push({
            type: 'max',
            value: schema.maximum,
            message: `${schema.title || fieldName}最大值为${schema.maximum}`,
            trigger: 'blur'
          })
        }
        break

      case 'array':
        if (schema.minItems) {
          rules.push({
            type: 'arrayMin',
            value: schema.minItems,
            message: `至少选择${schema.minItems}个选项`,
            trigger: 'change'
          })
        }
        if (schema.maxItems) {
          rules.push({
            type: 'arrayMax',
            value: schema.maxItems,
            message: `最多选择${schema.maxItems}个选项`,
            trigger: 'change'
          })
        }
        break
    }

    return rules
  }

  private formatKeyToLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  schemaToFormFields(schema: JSONSchema): FormField[] {
    if (schema.type !== 'object' || !schema.properties) {
      return []
    }

    return this.mapObjectProperties(schema.properties)
  }
}

export function createSchemaMapper(mappingRules?: ComponentMappingRule[]): SchemaMapper {
  return new SchemaMapper(mappingRules)
}

export const defaultMapper = createSchemaMapper()
