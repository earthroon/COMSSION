export type NavigationSurface = 'header' | 'footer'

export type PageIndexItem = {
  id: string
  label: string
  href: string
  section: 'main'
  surface: NavigationSurface[]
  order: number
  description: string
}

export const pageIndex = [
  {
    id: 'home',
    label: '홈',
    href: '/',
    section: 'main',
    surface: ['header', 'footer'],
    order: 0,
    description: '카반하다 메인 페이지.',
  },
  {
    id: 'catalog',
    label: '차량 목록',
    href: '/catalog',
    section: 'main',
    surface: ['header', 'footer'],
    order: 10,
    description: '카반하다 차량 카탈로그.',
  },
] as const satisfies readonly PageIndexItem[]

export function getNavigation(surface: NavigationSurface): PageIndexItem[] {
  return [...pageIndex]
    .filter((item) => item.surface.includes(surface))
    .sort((a, b) => a.order - b.order)
}
