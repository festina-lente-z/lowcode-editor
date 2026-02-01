import { createI18n } from 'vue-i18n'
import en from './en.json'
import zh from './zh.json'

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh-CN',
  fallbackLocale: 'en',
  messages: {
    'zh-CN': zh,
    'en': en,
  },
})

export default i18n
