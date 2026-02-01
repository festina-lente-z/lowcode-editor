export interface ElementPlusPropMapping {
  vueProp: string
  elementPlusProp: string
  transform?: (value: any) => any
  defaultValue?: any
}

export interface ComponentPropConfig {
  props: Record<string, ElementPlusPropMapping>
  events: Record<string, string>
  slots?: Record<string, string>
}

const defaultPropMappings: Record<string, ComponentPropConfig> = {
  'el-input': {
    props: {
      modelValue: { vueProp: 'modelValue', elementPlusProp: 'model-value', defaultValue: '' },
      type: { vueProp: 'type', elementPlusProp: 'type', defaultValue: 'text' },
      placeholder: { vueProp: 'placeholder', elementPlusProp: 'placeholder' },
      disabled: { vueProp: 'disabled', elementPlusProp: 'disabled', defaultValue: false },
      readonly: { vueProp: 'readonly', elementPlusProp: 'readonly', defaultValue: false },
      clearable: { vueProp: 'clearable', elementPlusProp: 'clearable', defaultValue: false },
      showPassword: { vueProp: 'showPassword', elementPlusProp: 'show-password', defaultValue: false },
      maxlength: { vueProp: 'maxlength', elementPlusProp: 'maxlength' },
      minlength: { vueProp: 'minlength', elementPlusProp: 'minlength' },
      prefixIcon: { vueProp: 'prefixIcon', elementPlusProp: 'prefix-icon' },
      suffixIcon: { vueProp: 'suffixIcon', elementPlusProp: 'suffix-icon' },
    },
    events: {
      'update:modelValue': 'update:modelValue',
      change: 'change',
      blur: 'blur',
      focus: 'focus',
      clear: 'clear',
      input: 'input'
    }
  },
  'el-input-number': {
    props: {
      modelValue: { vueProp: 'modelValue', elementPlusProp: 'model-value' },
      min: { vueProp: 'min', elementPlusProp: 'min' },
      max: { vueProp: 'max', elementPlusProp: 'max' },
      step: { vueProp: 'step', elementPlusProp: 'step', defaultValue: 1 },
      disabled: { vueProp: 'disabled', elementPlusProp: 'disabled', defaultValue: false },
      controls: { vueProp: 'controls', elementPlusProp: 'controls', defaultValue: true },
      placeholder: { vueProp: 'placeholder', elementPlusProp: 'placeholder' },
    },
    events: {
      'update:modelValue': 'update:modelValue',
      change: 'change',
      blur: 'blur',
      focus: 'focus'
    }
  },
  'el-select': {
    props: {
      modelValue: { vueProp: 'modelValue', elementPlusProp: 'model-value' },
      multiple: { vueProp: 'multiple', elementPlusProp: 'multiple', defaultValue: false },
      disabled: { vueProp: 'disabled', elementPlusProp: 'disabled', defaultValue: false },
      placeholder: { vueProp: 'placeholder', elementPlusProp: 'placeholder' },
      clearable: { vueProp: 'clearable', elementPlusProp: 'clearable', defaultValue: false },
      filterable: { vueProp: 'filterable', elementPlusProp: 'filterable', defaultValue: false },
      allowCreate: { vueProp: 'allowCreate', elementPlusProp: 'allow-create', defaultValue: false },
      defaultFirstOption: { vueProp: 'defaultFirstOption', elementPlusProp: 'default-first-option', defaultValue: false },
    },
    events: {
      'update:modelValue': 'update:modelValue',
      change: 'change',
      blur: 'blur',
      focus: 'focus',
      clear: 'clear',
      removeTag: 'remove-tag'
    }
  },
  'el-switch': {
    props: {
      modelValue: { vueProp: 'modelValue', elementPlusProp: 'model-value' },
      disabled: { vueProp: 'disabled', elementPlusProp: 'disabled', defaultValue: false },
      activeText: { vueProp: 'activeText', elementPlusProp: 'active-text' },
      inactiveText: { vueProp: 'inactiveText', elementPlusProp: 'inactive-text' },
      activeColor: { vueProp: 'activeColor', elementPlusProp: 'active-color' },
      inactiveColor: { vueProp: 'inactiveColor', elementPlusProp: 'inactive-color' },
      inlinePrompt: { vueProp: 'inlinePrompt', elementPlusProp: 'inline-prompt', defaultValue: false },
    },
    events: {
      'update:modelValue': 'update:modelValue',
      change: 'change'
    }
  },
  'el-date-picker': {
    props: {
      modelValue: { vueProp: 'modelValue', elementPlusProp: 'model-value' },
      type: { vueProp: 'type', elementPlusProp: 'type', defaultValue: 'date' },
      disabled: { vueProp: 'disabled', elementPlusProp: 'disabled', defaultValue: false },
      placeholder: { vueProp: 'placeholder', elementPlusProp: 'placeholder' },
      startPlaceholder: { vueProp: 'startPlaceholder', elementPlusProp: 'start-placeholder' },
      endPlaceholder: { vueProp: 'endPlaceholder', elementPlusProp: 'end-placeholder' },
      format: { vueProp: 'format', elementPlusProp: 'format' },
      valueFormat: { vueProp: 'valueFormat', elementPlusProp: 'value-format' },
      clearable: { vueProp: 'clearable', elementPlusProp: 'clearable', defaultValue: true },
    },
    events: {
      'update:modelValue': 'update:modelValue',
      change: 'change',
      blur: 'blur',
      focus: 'focus'
    }
  },
  'el-checkbox': {
    props: {
      modelValue: { vueProp: 'modelValue', elementPlusProp: 'model-value' },
      label: { vueProp: 'label', elementPlusProp: 'label' },
      disabled: { vueProp: 'disabled', elementPlusProp: 'disabled', defaultValue: false },
      border: { vueProp: 'border', elementPlusProp: 'border', defaultValue: false },
      size: { vueProp: 'size', elementPlusProp: 'size' },
    },
    events: {
      'update:modelValue': 'update:modelValue',
      change: 'change'
    }
  },
  'el-radio': {
    props: {
      modelValue: { vueProp: 'modelValue', elementPlusProp: 'model-value' },
      label: { vueProp: 'label', elementPlusProp: 'label' },
      disabled: { vueProp: 'disabled', elementPlusProp: 'disabled', defaultValue: false },
      border: { vueProp: 'border', elementPlusProp: 'border', defaultValue: false },
      size: { vueProp: 'size', elementPlusProp: 'size' },
    },
    events: {
      'update:modelValue': 'update:modelValue',
      change: 'change'
    }
  }
}

class PropsMapper {
  private customMappings: Map<string, ComponentPropConfig> = new Map()

  mapProps(componentName: string, vueProps: Record<string, any>): Record<string, any> {
    const mapping = this.customMappings.get(componentName) || defaultPropMappings[componentName]
    
    if (!mapping) {
      return vueProps
    }

    return Object.entries(vueProps).reduce((acc: Record<string, any>, [key, value]) => {
      const propMapping = mapping.props[key]
      if (propMapping) {
        const propValue = propMapping.transform
          ? propMapping.transform(value)
          : value
        acc[propMapping.elementPlusProp] = propValue !== undefined ? propValue : propMapping.defaultValue
      } else {
        acc[key] = value
      }
      return acc
    }, {})
  }

  mapEvents(componentName: string, vueEvents: Record<string, string>): Record<string, string> {
    const mapping = this.customMappings.get(componentName) || defaultPropMappings[componentName]
    
    if (!mapping) {
      return vueEvents
    }

    const result: Record<string, string> = {}
    for (const [vueEvent, handler] of Object.entries(vueEvents)) {
      const eventMapping = mapping.events[vueEvent]
      if (eventMapping) {
        result[eventMapping] = handler
      } else {
        result[vueEvent] = handler
      }
    }
    return result
  }

  addComponentMapping(componentName: string, config: ComponentPropConfig) {
    this.customMappings.set(componentName, config)
  }

  removeComponentMapping(componentName: string) {
    this.customMappings.delete(componentName)
  }

  getMapping(componentName: string): ComponentPropConfig | undefined {
    return this.customMappings.get(componentName) || defaultPropMappings[componentName]
  }
}

export function createPropsMapper(): PropsMapper {
  return new PropsMapper()
}

export const defaultPropsMapper = createPropsMapper()
