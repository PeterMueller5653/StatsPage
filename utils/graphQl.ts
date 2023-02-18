import { SearchVideoResponse } from './types'

export async function searchVideo(
  filter: {
    q?: string
    page?: number
    per_page?: number
    sort?: string
    direction?: string
  } = {},
  sceneFilter: {
    [key: string]: any
    studios?: {
      depth?: number
      modifier?: string
      value?: string[]
    }
  } = {}
): Promise<SearchVideoResponse | null> {
  const parsedFilter = {
    q: '',
    page: 1,
    per_page: 25,
    sort: 'created_at',
    direction: 'DESC',
    ...filter,
  }
  return await fetch('http://localhost:3000/api/graphql', {
    headers: {
      accept: '*/*',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      operationName: 'FindScenes',
      variables: {
        filter: parsedFilter,
        scene_filter: sceneFilter,
      },
      query: `query FindScenes($filter: FindFilterType, $scene_filter: SceneFilterType, $scene_ids: [Int!]) {
                  findScenes(filter: $filter, scene_filter: $scene_filter, scene_ids: $scene_ids) {
                    count
                    filesize
                    duration
                    scenes {
                      ...SlimSceneData
                      __typename
                    }
                    __typename
                  }
                }
                
                fragment SlimSceneData on Scene {
                  id
                  title
                  details
                  url
                  date
                  rating
                  o_counter
                  organized
                  interactive
                  interactive_speed
                  files {
                    ...VideoFileData
                    __typename
                  }
                  paths {
                    screenshot
                    preview
                    stream
                    webp
                    vtt
                    chapters_vtt
                    sprite
                    funscript
                    interactive_heatmap
                    caption
                    __typename
                  }
                  scene_markers {
                    id
                    title
                    seconds
                    primary_tag {
                      id
                      name
                      __typename
                    }
                    __typename
                  }
                  galleries {
                    id
                    files {
                      path
                      __typename
                    }
                    title
                    __typename
                  }
                  studio {
                    id
                    name
                    image_path
                    __typename
                  }
                  movies {
                    movie {
                      id
                      name
                      front_image_path
                      __typename
                    }
                    scene_index
                    __typename
                  }
                  tags {
                    id
                    name
                    __typename
                  }
                  performers {
                    id
                    name
                    gender
                    favorite
                    image_path
                    __typename
                  }
                  stash_ids {
                    endpoint
                    stash_id
                    __typename
                  }
                  __typename
                }
                
                fragment VideoFileData on VideoFile {
                  id
                  path
                  size
                  duration
                  video_codec
                  audio_codec
                  width
                  height
                  frame_rate
                  bit_rate
                  fingerprints {
                    type
                    value
                    __typename
                  }
                  __typename
                }
                `,
    }),
    method: 'POST',
  })
    .then((res) => res.json())
    .then((json: any) => {
      console.log(json)
      return json?.data?.findScenes
    })
    .catch((err) => {
      console.log(err)
      return null
    })
}
