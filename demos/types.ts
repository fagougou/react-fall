export type RouteProps<T = {}> = Partial<T> & {
  path?: string
  location?: any
}
