export type SampleAPIListResponse = SampleAPIItemResponse[]

export interface SampleAPIItemResponse {
  title: string
  description: string
  ingredients: string[]
  image: string
  id: number
}
