import { RenderResult } from '../../types'

export function render(context: any): RenderResult {
  return {
    sh: 'mkdir -p _dist/media && cp media _dist/media',
  }
}
