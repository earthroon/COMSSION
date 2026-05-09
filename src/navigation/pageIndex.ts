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
    label: 'Home',
    href: '/',
    section: 'main',
    surface: ['header', 'footer'],
    order: 0,
    description: 'Main page.',
  },
  {
    id: 'catalog',
    label: 'Catalog',
    href: '/catalog',
    section: 'main',
    surface: ['header', 'footer'],
    order: 10,
    description: 'Vehicle catalog.',
  },
] as const satisfies readonly PageIndexItem[]

export function getNavigation(surface: NavigationSurface): PageIndexItem[] {
  return [...pageIndex]
    .filter((item) => item.surface.includes(surface))
    .sort((a, b) => a.order - b.order)
}
