import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import { Input, Spacer } from '@nextui-org/react'
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import {
  buildVideoQueue,
  generateColorFromName,
  getScenes
} from 'utils/stashUtils'
import { Scene } from 'utils/types'
import { parseDate } from 'utils/utils'

type Props = {
  scenes: Scene[]
}

function Calendar({ scenes }: Props) {
  type Event = {
    title: string
    start?: string | Date
    end?: string | Date
    url?: string
  }

  const [parsedEvents, setParsedEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (!scenes) return
    const parsed: {
      [key: string]: {
        [key: string]: {
          id: string
          title: string
          performer: string
          start?: string
          url?: string
          duration?: number
        }[]
      }
    } = {}

    for (const scene of scenes) {
      const { title, id, date, url, performers, files } = scene
      if (!date) continue

      const performer = performers[0]

      if (!performer) continue

      const duration = files[0]?.duration

      if (!parsed[date]) {
        parsed[date] = {}
      }

      if (!parsed[date][performer.name]) {
        parsed[date][performer.name] = []
      }

      parsed[date][performer.name].push({
        title,
        performer: performer.name,
        start: date,
        url,
        id,
        duration,
      })
    }

    const parsedEvents: {
      title: string
      date?: string | Date
      start?: string | Date
      end?: string | Date
      url?: string
      backgroundColor?: string
      borderColor?: string
    }[] = []

    for (const date in parsed) {
      for (const performer in parsed[date]) {
        const scenes = parsed[date][performer]
        const start = parseDate(scenes[0].start)

        if (scenes.length === 1) {
          parsedEvents.push({
            ...scenes[0],
            title: performer,
            date,
            url: buildVideoQueue([scenes[0].id]),
            backgroundColor: generateColorFromName(performer),
            borderColor: generateColorFromName(performer),
          })
        } else {
          parsedEvents.push({
            title: `${performer} (${scenes.length} scenes)`,
            date,
            start,
            end: new Date(
              start.getTime() +
                scenes.reduce((acc, cur) => acc + (cur.duration ?? 0), 0) * 1000
            ),
            url: buildVideoQueue(scenes.map((s) => s.id)),
            backgroundColor: generateColorFromName(performer),
            borderColor: generateColorFromName(performer),
          })
        }
      }
    }

    setParsedEvents(parsedEvents)
  }, [scenes])

  useEffect(() => {
    if (!parsedEvents) return

    if (filter === '') {
      setFilteredEvents(parsedEvents)
      return
    }

    const filteredEvents = parsedEvents.filter((event) => {
      return event.title.toLowerCase().includes(filter.toLowerCase())
    })

    setFilteredEvents(filteredEvents)
  }, [parsedEvents, filter])

  return (
    <div className='m-4'>
      <Spacer y={2} />
      <Input
        labelPlaceholder='Search'
        width='100%'
        onChange={(event) => {
          setFilter(event.target.value)
        }}
      />
      <Spacer y={1} />
      <FullCalendar
        height={'90vh'}
        plugins={[dayGridPlugin, interactionPlugin]}
        eventDisplay='block'
        nextDayThreshold={{
          hours: 2,
          minutes: 0,
          seconds: 0,
        }}
        dayMaxEventRows={5}
        dayPopoverFormat={{
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }}
        displayEventTime={false}
        eventClick={(info) => {
          if (info.event.url) {
            info.jsEvent.preventDefault()
            window.open(info.event.url, '_blank')
          }
        }}
        events={filteredEvents ?? []}
      />
    </div>
  )
}

export default Calendar

export const getStaticProps: GetStaticProps<Props> = async () => {
  const scenes = await getScenes({})

  return {
    props: {
      scenes,
    },
  }
}
