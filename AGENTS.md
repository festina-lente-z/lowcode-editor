# AGENTS.md

This document provides guidelines for agentic coding agents operating in this repository.

## Project Overview

Lowcode Editor - A Vue 3 + TypeScript low-code page editor with drag-and-drop functionality, Element Plus UI components, and Tailwind CSS styling.

## Build Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production (runs TypeScript check + Vite build)
pnpm build

# Preview production build
pnpm preview
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all files (`.ts`, `.tsx`, `.vue` with `<script lang="ts">`)
- Enable `strict: true` in TypeScript configuration
- Use explicit types for function parameters and return values
- Avoid `any` type - use `unknown` or proper types instead
- Use `Record<K, V>` for object maps instead of `{ [key: string]: V }`
- Use `string | null` instead of `String` or nullable string wrapper types

### Vue Components

- Use Composition API with `<script setup lang="ts">`
- Import Vue APIs explicitly: `import { ref, computed, onMounted } from 'vue'`
- Use kebab-case for component file names: `LayoutEditor.vue`
- Define component props with TypeScript interfaces
- Use `defineEmits<{ (e: 'eventName', payload: Type): void }>()` pattern
- Use `defineProps<{ propName: PropType }>()` pattern

### Imports

- Group imports in this order: Vue → Vue ecosystem → Third-party → Internal
- Use absolute imports with `@` alias for internal imports (`@/components/...`)
- Use relative imports for same-level imports (`./Component.vue`)
- Use named imports: `import { ElMessage } from 'element-plus'`
- Use namespace imports for icon libraries: `import * as ElementPlusIconsVue from '@element-plus/icons-vue'`
- Avoid default exports except for Vue components

### Naming Conventions

- **Components**: PascalCase (`LayoutEditor`, `PropertyPanel`)
- **Variables/functions**: camelCase (`handleBlockUpdate`, `currentBreakpoint`)
- **Constants**: UPPER_SNAKE_CASE for config maps (`maxWidthMap`)
- **Types/Interfaces**: PascalCase (`PageSchema`, `BlockTemplate`)
- **Files**: kebab-case for non-component files (`schema.types.ts`)
- **CSS classes**: kebab-case (Tailwind utility classes)

### Tailwind CSS

- Use Tailwind utility classes for all styling
- Custom colors defined in `tailwind.config.js` under `colors`:
  - `primary-8`: `#165DFF` (primary brand color)
  - `gray-1` to `gray-10`: Grayscale palette
  - `text-primary`, `text-secondary`, `text-tertiary`: Text hierarchy
  - `bg-page`, `bg-container`, `bg-hover`: Background variants
  - `border-light`, `border-base`, `border-dark`: Border variants
- Use arbitrary values sparingly: `bg-[#F7F8FA]`
- Use `w-`, `h-` prefixes for dimensions, `text-` for font sizes
- Use `flex`, `grid` for layouts, `gap-*` for spacing
- Use responsive prefixes: `md:`, `lg:`, `xl:` for breakpoints

### Color Palette

- Primary: `#165DFF` (primary-8)
- Background: `#F7F8FA` (gray-1)
- Borders: `#E5E6EB` (gray-3)
- Text Primary: `#1D2129` (gray-10)
- Text Secondary: `#4E5969` (gray-9)
- Text Tertiary: `#86909C` (gray-5)

### Breakpoints

Defined in Tailwind config (matching Element Plus):
- `xs`: < 480px
- `sm`: < 576px
- `md`: < 768px
- `lg`: < 992px
- `xl`: ≥ 1200px

### Error Handling

- Use `ElMessage` from Element Plus for user notifications
- Wrap async operations in try/catch blocks
- Log errors appropriately: `console.error('Operation failed:', error)`
- Use TypeScript null checks for optional properties

### File Structure

```
src/
├── api/           # API layer
├── components/
│   ├── blocks/    # Block components
│   ├── common/    # Shared/reusable components
│   └── editor/    # Editor-specific components
├── composables/   # Vue composables
├── constants/     # Constants and templates
├── locales/       # i18n translations
├── services/      # Business logic services
├── stores/        # Pinia stores
├── styles/        # Global styles
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── views/         # Page components
├── App.vue
└── main.ts
```

### Key Type Definitions

Located in `src/types/schema.types.ts`:
- `PageSchema`: Full page configuration
- `BlockSchema`: Individual block definition
- `PageSettings`: Page metadata and settings
- `PageLayout`: Layout configuration
- `Breakpoint`: Responsive breakpoint type
- `BlockTemplate`: Template for drag-and-drop

### Common Patterns

1. **Block operations**: Blocks use UUID-based IDs via `uuid` package
2. **State management**: Use `ref` for reactive state, `computed` for derived state
3. **Event handling**: Prefix handlers with `handle` (`handleBlockSelect`)
4. **Vue i18n**: Use `useI18n()` composable, keys like `t('editor.title')`

### Alias Configuration

- `@` → `src/` (e.g., `@/components/editor/LayoutEditor.vue`)
- `@renderer` → `../lowcode-renderer` (external renderer package)

### Development Notes

- No test framework configured currently
- No linting configured (consider adding ESLint + Prettier)
- Element Plus components use `el-` prefix
- Custom Icon component wraps `@element-plus/icons-vue`
- Element Plus theme customized via `src/styles/element-theme.css`
