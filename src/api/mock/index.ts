import { v4 as uuidv4 } from 'uuid'

interface PageDTO {
  id: string
  name: string
  description?: string
  schema: string
  status: 'draft' | 'published'
  version: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

const pages: Map<string, PageDTO> = new Map()

const samplePage: PageDTO = {
  id: 'page-demo-001',
  name: '示例页面',
  description: '这是一个示例页面',
  schema: JSON.stringify({
    settings: {
      title: '数据仪表盘',
      subtitle: '实时数据概览',
      showTitle: true,
      titleAlign: 'center',
      padding: 16,
      backgroundColor: '#ffffff',
      maxWidth: 'xl',
    },
    blocks: [],
  }),
  status: 'published',
  version: '1.0.0',
  createdBy: 'admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}
pages.set(samplePage.id, samplePage)

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function incrementVersion(version: string): string {
  const parts = version.split('.').map(Number)
  parts[1]++
  return parts.join('.')
}

export const mockApi = {
  async getPages(params: { page?: number; pageSize?: number; keyword?: string } = {}) {
    await delay(300)
    const allPages = Array.from(pages.values())
    const filtered = params.keyword
      ? allPages.filter(p => p.name.includes(params.keyword!))
      : allPages
    const start = ((params.page || 1) - 1) * (params.pageSize || 10)
    const items = filtered.slice(start, start + (params.pageSize || 10))
    return {
      success: true,
      data: items,
      total: filtered.length,
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      timestamp: Date.now(),
    }
  },
  
  async getPage(id: string) {
    await delay(200)
    const page = pages.get(id)
    if (!page) {
      return { success: false, data: null, message: '页面不存在', timestamp: Date.now() }
    }
    return { success: true, data: page, timestamp: Date.now() }
  },
  
  async createPage(data: { name: string; description?: string; schema: string }) {
    await delay(300)
    const now = new Date().toISOString()
    const page: PageDTO = {
      id: `page-${uuidv4().slice(0, 8)}`,
      name: data.name,
      description: data.description,
      schema: data.schema,
      status: 'draft',
      version: '1.0.0',
      createdBy: 'current-user',
      createdAt: now,
      updatedAt: now,
    }
    pages.set(page.id, page)
    return { success: true, data: page, message: '创建成功', timestamp: Date.now() }
  },
  
  async updatePage(id: string, data: Partial<PageDTO>) {
    await delay(300)
    const page = pages.get(id)
    if (!page) {
      return { success: false, data: null, message: '页面不存在', timestamp: Date.now() }
    }
    const updated: PageDTO = {
      ...page,
      ...data,
      updatedAt: new Date().toISOString(),
      version: incrementVersion(page.version),
    }
    pages.set(id, updated)
    return { success: true, data: updated, message: '更新成功', timestamp: Date.now() }
  },
  
  async deletePage(id: string) {
    await delay(200)
    if (!pages.has(id)) {
      return { success: false, data: null, message: '页面不存在', timestamp: Date.now() }
    }
    pages.delete(id)
    return { success: true, data: null, message: '删除成功', timestamp: Date.now() }
  },
}
