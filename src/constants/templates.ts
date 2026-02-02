import type { BlockTemplate, ResponsiveConfig } from './template.types'

const defaultResponsive: ResponsiveConfig = {
  visibleOn: ['xs', 'sm', 'md', 'lg', 'xl'],
  hideOn: [],
  colSpan: {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 8,
    xl: 6,
  }
}

export const layoutTemplates: BlockTemplate[] = [
  {
    id: 'single-column',
    type: 'layout',
    category: 'layout',
    name: '单列布局',
    icon: 'Column',
    description: '占满整行，适用于标题区、重要内容展示',
    defaultLayout: { colSpan: 24 },
    defaultResponsive: {
      ...defaultResponsive,
      colSpan: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 }
    },
    defaultConfig: {
      backgroundColor: 'transparent',
      padding: 16,
      borderRadius: 0,
    },
    configSchema: {
      type: 'object',
      properties: {
        backgroundColor: { type: 'string', title: '背景色' },
        padding: { type: 'number', title: '内边距' },
        borderRadius: { type: 'number', title: '圆角' },
      },
    }
  },
  {
    id: 'two-column',
    type: 'layout',
    category: 'layout',
    name: '双列布局',
    icon: 'Columns',
    description: '左右两栏，适合并排显示',
    defaultLayout: { colSpan: 24 },
    defaultResponsive: {
      ...defaultResponsive,
      colSpan: { xs: 24, sm: 24, md: 12, lg: 12, xl: 12 }
    },
    defaultConfig: {
      gap: 16,
      equalWidth: true,
    },
    configSchema: {
      type: 'object',
      properties: {
        gap: { type: 'number', title: '间距' },
        equalWidth: { type: 'boolean', title: '等宽显示' },
      }
    }
  },
  {
    id: 'two-column-mixed',
    type: 'layout',
    category: 'layout',
    name: '双栏混合布局',
    icon: 'Grid',
    description: '主次双栏，左宽右窄，适合主内容+侧边栏',
    defaultLayout: { colSpan: 24 },
    defaultResponsive: {
      ...defaultResponsive,
      colSpan: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 }
    },
    defaultConfig: {
      gap: 16,
      leftColSpan: 16,
      rightColSpan: 8,
    },
    configSchema: {
      type: 'object',
      properties: {
        gap: { type: 'number', title: '间距' },
        leftColSpan: { type: 'number', title: '左栏宽度' },
        rightColSpan: { type: 'number', title: '右栏宽度' },
      }
    }
  },
  {
    id: 'three-column',
    type: 'layout',
    category: 'layout',
    name: '三列布局',
    icon: 'Grid',
    description: '三栏分布，适合统计卡片',
    defaultLayout: { colSpan: 24 },
    defaultResponsive: {
      ...defaultResponsive,
      colSpan: { xs: 24, sm: 24, md: 8, lg: 8, xl: 8 }
    },
    defaultConfig: {
      gap: 16,
    },
    configSchema: {
      type: 'object',
      properties: {
        gap: { type: 'number', title: '间距' },
      }
    }
  },
  {
    id: 'three-column-mixed',
    type: 'layout',
    category: 'layout',
    name: '三栏混合布局',
    icon: 'Grid',
    description: '主次三栏，中宽侧窄，适合导航+主内容+侧边栏',
    defaultLayout: { colSpan: 24 },
    defaultResponsive: {
      ...defaultResponsive,
      colSpan: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 }
    },
    defaultConfig: {
      gap: 16,
      leftColSpan: 5,
      centerColSpan: 14,
      rightColSpan: 5,
    },
    configSchema: {
      type: 'object',
      properties: {
        gap: { type: 'number', title: '间距' },
        leftColSpan: { type: 'number', title: '左栏宽度' },
        centerColSpan: { type: 'number', title: '中栏宽度' },
        rightColSpan: { type: 'number', title: '右栏宽度' },
      }
    }
  },
  {
    id: 'four-column',
    type: 'layout',
    category: 'layout',
    name: '四列布局',
    icon: 'Grid',
    description: '四栏分布，适合数据卡片',
    defaultLayout: { colSpan: 24 },
    defaultResponsive: {
      ...defaultResponsive,
      colSpan: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6 }
    },
    defaultConfig: {
      gap: 16,
    },
    configSchema: {
      type: 'object',
      properties: {
        gap: { type: 'number', title: '间距' },
      }
    }
  },
]

export const componentTemplates: BlockTemplate[] = [
  {
    id: 'stat-card',
    type: 'component',
    category: 'function',
    name: '统计卡片',
    icon: 'DataLine',
    description: '展示单个统计数据',
    defaultLayout: { colSpan: 6 },
    defaultResponsive: {
      ...defaultResponsive,
      colSpan: { xs: 24, sm: 12, md: 12, lg: 6, xl: 6 }
    },
    defaultConfig: {
      title: '标题',
      dataKey: 'value',
      icon: 'TrendCharts',
      trend: 'none',
      trendValue: '',
      color: 'primary',
      suffix: '',
      precision: 0,
    },
    configSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', title: '标题' },
        dataKey: { type: 'string', title: '数据字段' },
        icon: { type: 'string', title: '图标' },
        trend: { 
          type: 'string', 
          title: '趋势',
          enum: ['up', 'down', 'none']
        },
        trendValue: { type: 'string', title: '趋势值' },
        color: { 
          type: 'string', 
          title: '颜色',
          enum: ['primary', 'success', 'warning', 'error']
        },
        suffix: { type: 'string', title: '后缀' },
        precision: { type: 'number', title: '小数位数' },
      }
    }
  },
  {
    id: 'search-form',
    type: 'component',
    category: 'function',
    name: '搜索表单',
    icon: 'Search',
    description: '提供搜索和筛选功能',
    defaultLayout: { colSpan: 24 },
    defaultResponsive: {
      ...defaultResponsive,
      colSpan: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 }
    },
    defaultConfig: {
      fields: [
        { type: 'input', key: 'keyword', label: '关键词', placeholder: '请输入关键词' }
      ],
      showReset: true,
      showSearch: true,
      layout: 'inline',
      buttonPosition: 'right',
    },
    configSchema: {
      type: 'object',
      properties: {
        fields: {
          type: 'array',
          title: '搜索字段',
          items: {
            type: 'object',
            properties: {
              type: { 
                type: 'string', 
                title: '字段类型',
                enum: ['input', 'select', 'date', 'daterange']
              },
              key: { type: 'string', title: '字段key' },
              label: { type: 'string', title: '标签' },
              placeholder: { type: 'string', title: '占位符' },
              options: { type: 'array', title: '选项' },
            }
          }
        },
        showReset: { type: 'boolean', title: '显示重置按钮' },
        showSearch: { type: 'boolean', title: '显示搜索按钮' },
        layout: { 
          type: 'string', 
          title: '布局方式',
          enum: ['inline', 'stacked']
        },
        buttonPosition: {
          type: 'string',
          title: '按钮位置',
          enum: ['left', 'center', 'right']
        }
      }
    }
  },
  {
    id: 'data-table',
    type: 'component',
    category: 'data',
    name: '数据表格',
    icon: 'Grid',
    description: '展示列表数据，支持排序分页',
    defaultLayout: { colSpan: 24 },
    defaultResponsive: {
      ...defaultResponsive,
      colSpan: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 }
    },
    defaultConfig: {
      columns: [
        { key: 'id', title: 'ID', width: 80, sortable: false },
        { key: 'name', title: '名称', width: 120, sortable: true },
        { key: 'status', title: '状态', width: 100, sortable: false },
      ],
      showPagination: true,
      pageSize: 10,
      showSelection: false,
      stripe: true,
      border: true,
      size: 'medium',
    },
    configSchema: {
      type: 'object',
      properties: {
        columns: {
          type: 'array',
          title: '表格列',
          items: {
            type: 'object',
            properties: {
              key: { type: 'string', title: '字段key' },
              title: { type: 'string', title: '列标题' },
              width: { type: 'number', title: '宽度' },
              sortable: { type: 'boolean', title: '可排序' },
              fixed: { 
                type: 'string', 
                title: '固定列',
                enum: ['left', 'right', 'none']
              },
              align: {
                type: 'string',
                title: '对齐',
                enum: ['left', 'center', 'right']
              }
            }
          }
        },
        showPagination: { type: 'boolean', title: '显示分页' },
        pageSize: { type: 'number', title: '每页条数' },
        showSelection: { type: 'boolean', title: '显示勾选' },
        stripe: { type: 'boolean', title: '斑马纹' },
        border: { type: 'boolean', title: '边框' },
        size: {
          type: 'string',
          title: '尺寸',
          enum: ['small', 'medium', 'large']
        }
      }
    }
  },
  {
    id: 'announcement-carousel',
    type: 'component',
    category: 'media',
    name: '公告轮播',
    icon: 'Notification',
    description: '滚动展示公告信息',
    defaultLayout: { colSpan: 24 },
    defaultResponsive: {
      ...defaultResponsive,
      colSpan: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 }
    },
    defaultConfig: {
      autoPlay: true,
      interval: 3000,
      showControls: true,
      showIndicators: true,
      maxItems: 5,
      effect: 'slide',
    },
    configSchema: {
      type: 'object',
      properties: {
        autoPlay: { type: 'boolean', title: '自动播放' },
        interval: { type: 'number', title: '播放间隔(ms)' },
        showControls: { type: 'boolean', title: '显示控制按钮' },
        showIndicators: { type: 'boolean', title: '显示指示器' },
        maxItems: { type: 'number', title: '最大显示数' },
        effect: {
          type: 'string',
          title: '切换效果',
          enum: ['slide', 'fade', 'card']
        }
      }
    }
  },
  {
    id: 'ranking-board',
    type: 'component',
    category: 'data',
    name: '排行榜',
    icon: 'TrendCharts',
    description: '红黑榜排行榜展示',
    defaultLayout: { colSpan: 12 },
    defaultResponsive: {
      ...defaultResponsive,
      colSpan: { xs: 24, sm: 24, md: 12, lg: 12, xl: 12 }
    },
    defaultConfig: {
      showRedList: true,
      showBlackList: true,
      defaultTab: 'red',
      maxItems: 10,
      showOrder: true,
      showTrend: true,
    },
    configSchema: {
      type: 'object',
      properties: {
        showRedList: { type: 'boolean', title: '显示红榜' },
        showBlackList: { type: 'boolean', title: '显示黑榜' },
        defaultTab: { 
          type: 'string', 
          title: '默认标签',
          enum: ['red', 'black']
        },
        maxItems: { type: 'number', title: '显示条数' },
        showOrder: { type: 'boolean', title: '显示排名' },
        showTrend: { type: 'boolean', title: '显示趋势' }
      }
    }
  },
  {
    id: 'hyperlink-wall',
    type: 'component',
    category: 'media',
    name: '超链接墙',
    icon: 'Link',
    description: '分类展示外部链接',
    defaultLayout: { colSpan: 24 },
    defaultResponsive: {
      ...defaultResponsive,
      colSpan: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 }
    },
    defaultConfig: {
      categories: ['常用', '工具', '资源'],
      maxItemsPerCategory: 6,
      columns: 4,
      openInNewTab: true,
      showCategory: true,
      layout: 'grid',
    },
    configSchema: {
      type: 'object',
      properties: {
        categories: { type: 'array', title: '分类列表' },
        maxItemsPerCategory: { type: 'number', title: '每分类最大数' },
        columns: { type: 'number', title: '列数' },
        openInNewTab: { type: 'boolean', title: '新窗口打开' },
        showCategory: { type: 'boolean', title: '显示分类' },
        layout: {
          type: 'string',
          title: '布局方式',
          enum: ['grid', 'list', 'card']
        }
      }
    }
  },
]

export const allTemplates = [...layoutTemplates, ...componentTemplates]
