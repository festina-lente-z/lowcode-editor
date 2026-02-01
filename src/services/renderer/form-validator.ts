import { ref, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export interface SchemaValidationRule {
  type: string
  value?: any
  message: string
  trigger?: string | string[]
}

export interface FieldError {
  field: string
  message: string
  trigger?: string
}

export class Validator {
  private formRef: FormInstance | null = null
  private fieldErrors = reactive<Record<string, string>>({})
  private validatingFields = new Set<string>()

  setFormRef(form: FormInstance | null) {
    this.formRef = form
  }

  schemaRulesToElementPlusRules(schemaRules: Record<string, SchemaValidationRule[]>): FormRules {
    return Object.entries(schemaRules).reduce((acc, [field, rules]) => {
      acc[field] = rules.map(rule => {
        const elementPlusRule: any = { trigger: rule.trigger || 'blur' }
        
        switch (rule.type) {
          case 'required':
            elementPlusRule.required = true
            elementPlusRule.message = rule.message
            break
          case 'stringMin':
            elementPlusRule.min = rule.value
            elementPlusRule.message = rule.message
            break
          case 'stringMax':
            elementPlusRule.max = rule.value
            elementPlusRule.message = rule.message
            break
          case 'email':
            elementPlusRule.type = 'email'
            elementPlusRule.message = rule.message
            break
          case 'pattern':
            elementPlusRule.pattern = new RegExp(rule.value)
            elementPlusRule.message = rule.message
            break
          case 'min':
            elementPlusRule.min = rule.value
            elementPlusRule.message = rule.message
            break
          case 'max':
            elementPlusRule.max = rule.value
            elementPlusRule.message = rule.message
            break
          case 'arrayMin':
            elementPlusRule.min = rule.value
            elementPlusRule.message = rule.message
            break
          case 'arrayMax':
            elementPlusRule.max = rule.value
            elementPlusRule.message = rule.message
            break
        }
        
        return elementPlusRule
      })
      return acc
    }, {} as FormRules)
  }

  async validateField(field: string): Promise<boolean> {
    if (!this.formRef) {
      this.validatingFields.delete(field)
      return false
    }

    try {
      await this.formRef.validateField(field)
      this.clearFieldError(field)
      return true
    } catch (error: any) {
      if (error?.message) {
        this.setFieldError(field, error.message)
      }
      this.validatingFields.delete(field)
      return false
    }
  }

  async validateAll(): Promise<boolean> {
    if (!this.formRef) return false

    try {
      await this.formRef.validate()
      Object.keys(this.fieldErrors).forEach(field => {
        delete this.fieldErrors[field]
      })
      return true
    } catch {
      return false
    }
  }

  resetValidation() {
    if (this.formRef) {
      this.formRef.resetFields()
    }
    Object.keys(this.fieldErrors).forEach(field => {
      delete this.fieldErrors[field]
    })
  }

  clearValidation(field?: string | string[]) {
    if (this.formRef) {
      this.formRef.clearValidate(field)
    }
    
    if (field) {
      const fields = Array.isArray(field) ? field : [field]
      fields.forEach(f => delete this.fieldErrors[f])
    }
  }

  setFieldError(field: string, message: string) {
    this.fieldErrors[field] = message
  }

  clearFieldError(field: string) {
    delete this.fieldErrors[field]
  }

  getFieldError(field: string): string | undefined {
    return this.fieldErrors[field]
  }

  hasFieldError(field: string): boolean {
    return field in this.fieldErrors
  }

  getAllFieldErrors(): FieldError[] {
    return Object.entries(this.fieldErrors).map(([field, message]) => ({
      field,
      message: String(message)
    }))
  }

  isValidating(field: string): boolean {
    return this.validatingFields.has(field)
  }

  getFieldValue(field: string): any {
    return undefined
  }

  getFieldsValue(): Record<string, any> {
    return {}
  }
}

export function createValidator(): Validator {
  return new Validator()
}

export const defaultValidator = createValidator()

export function useFormValidation() {
  const validator = createValidator()
  
  const validateField = (field: string) => validator.validateField(field)
  const validateAll = () => validator.validateAll()
  const resetValidation = () => validator.resetValidation()
  const clearValidation = (field?: string | string[]) => validator.clearValidation(field)
  const setFieldError = (field: string, message: string) => validator.setFieldError(field, message)
  const clearFieldError = (field: string) => validator.clearFieldError(field)
  const getFieldError = (field: string) => validator.getFieldError(field)
  const hasFieldError = (field: string) => validator.hasFieldError(field)
  const getAllFieldErrors = () => validator.getAllFieldErrors()

  return {
    validator,
    validateField,
    validateAll,
    resetValidation,
    clearValidation,
    setFieldError,
    clearFieldError,
    getFieldError,
    hasFieldError,
    getAllFieldErrors
  }
}
