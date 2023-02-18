import { searchVideo } from './graphQl'
import { Scene } from './types'

export function buildVideoQueue(videoIds: string[]): string {
  const prefix = `/stash/scenes/${videoIds[0]}?qs=${videoIds[0]}`
  const body = videoIds
    .slice(1)
    .map((id) => `&qs=${id}`)
    .join('')
  const suffix = '&autoplay=true&continue=true'
  return prefix + body + suffix
}

export async function getScenes({ limit = 1000 }): Promise<Scene[]> {
  const sceneResponse = await searchVideo(
    {
      per_page: limit,
      sort: 'date',
      direction: 'DESC',
    },
    {
      studios: {
        value: ['2'],
        modifier: 'INCLUDES',
        depth: 0,
      },
    }
  )

  return sceneResponse?.scenes || []
}

export function generateColorFromName(name: string): string {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const hue = hash % 360
  return `hsl(${hue}, 80%, 30%)`
}
