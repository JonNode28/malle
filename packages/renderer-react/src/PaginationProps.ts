export interface PaginationProps {
  skip: number,
  take: number,
  count?: number,
  onChange: (skip: number, take: number) => void
}