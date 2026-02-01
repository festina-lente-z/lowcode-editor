<template>
  <el-dropdown @command="handleCommand">
    <span class="flex items-center gap-1 cursor-pointer px-2 py-1 rounded hover:bg-gray-2">
      <span class="text-sm">{{ currentLabel }}</span>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh-CN" :disabled="locale === 'zh-CN'">中文</el-dropdown-item>
        <el-dropdown-item command="en" :disabled="locale === 'en'">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const locales = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en', label: 'English' },
]

const current = computed(() => 
  locales.find(l => l.value === locale.value) || locales[0]
)

const currentLabel = computed(() => current.value.label)

const handleCommand = (value: string) => {
  locale.value = value
  localStorage.setItem('locale', value)
}
</script>
