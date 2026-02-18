import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { useEvents } from '../context/EventContext'
import { useTheme } from '../context/ThemeContext'

export default function EventCalendar({ onEventClick, onDateSelect }) {
  const calendarRef = useRef(null)
  const { filteredEvents, cityColors } = useEvents()
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const locale = i18n.language === 'es' ? 'es' : 'en'

  const handleEventClick = (info) => {
    if (!onEventClick) return
    const rawEvent = info.event.extendedProps?.rawEvent
    onEventClick(rawEvent || info.event)
  }

  const handleDateSelect = (info) => {
    if (onDateSelect) {
      onDateSelect(info)
    }
  }

  return (
    <div className={`rounded-2xl p-3 sm:p-4 md:p-6 transition-shadow duration-300 ${
      isDark 
        ? 'bg-[#222222] border border-border-dark shadow-2xl' 
        : 'glass-strong hover:shadow-glass-lg'
    }`}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={locale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listYear'
        }}
        events={filteredEvents.map(e => {
          const color = cityColors[e.city] || e.color || '#EE0087'
          return {
            id: e.id,
            title: e.title,
            start: e.start,
            end: e.end,
            backgroundColor: isDark ? `${color}33` : color,
            borderColor: isDark ? color : 'transparent',
            textColor: isDark ? color : '#ffffff',
            extendedProps: {
              city: e.city,
              description: e.description,
              color,
              rawEvent: e,
            }
          }
        })}
        eventClick={handleEventClick}
        selectable={!!onDateSelect}
        select={handleDateSelect}
        height="auto"
        contentHeight="auto"
        aspectRatio={1.5}
        nowIndicator={true}
        dayMaxEvents={3}
        eventDisplay="block"
        displayEventTime={false}
        eventDidMount={(info) => {
          info.el.title = `${info.event.title} — ${info.event.extendedProps.city || ''}`
          if (isDark) {
            const color = info.event.extendedProps.color || '#EE0087'
            info.el.style.backgroundColor = `${color}20`
            info.el.style.color = color
            info.el.style.borderLeft = `4px solid ${color}`
            info.el.style.borderRadius = '0.5rem'
            info.el.style.fontWeight = '700'
            info.el.style.fontSize = '0.625rem'
            info.el.style.padding = '0.375rem 0.5rem'
            info.el.style.boxShadow = 'none'
          }
        }}
        views={{
          dayGridMonth: {
            titleFormat: { year: 'numeric', month: 'long' }
          },
          timeGridWeek: {
            titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
          },
          listYear: {
            titleFormat: { year: 'numeric' },
            listDayFormat: { month: 'long', day: 'numeric' },
            listDaySideFormat: { weekday: 'long' }
          }
        }}
      />
    </div>
  )
}
