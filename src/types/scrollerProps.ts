interface ScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  averageHeight: number
  element: React.ReactType
  length?: number
  onFetch?(event?: {page?: number, push(data: []): void}): void
  upperRender?(): JSX.Element
  source: [] | undefined
}

export default ScrollerProps;
