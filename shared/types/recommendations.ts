export interface RecommendationsList<T> {
  readonly title: string
  readonly description: string
  readonly path: string
  readonly inverted: boolean
  readonly apiUrl: string
  readonly categories: T
}
