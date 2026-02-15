import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { eventsApi } from '../services/api'
import { translateEvents } from '../services/translationService'

const EventContext = createContext(null)

const CITIES = ['Bogota', 'Cali', 'Medellin', 'Ibague']

const CITY_COLORS = {
  Bogota: '#ED0086',
  Cali: '#F25823',
  Medellin: '#8AAF1E',
  Ibague: '#7C91E0',
}

const SOURCE_LANG = 'es'

export function EventProvider({ children }) {
  const [rawEvents, setRawEvents] = useState([])
  const [translatedEvents, setTranslatedEvents] = useState([])
  const [cities, setCities] = useState(CITIES)
  const [cityColors, setCityColors] = useState(CITY_COLORS)
  const [selectedCity, setSelectedCity] = useState('all')
  const [loading, setLoading] = useState(true)
  const [translating, setTranslating] = useState(false)
  const { i18n } = useTranslation()
  const currentLang = i18n.language
  const translationRef = useRef(0)

  const fetchEvents = async () => {
    try {
      const data = await eventsApi.getAll()
      const normalized = Array.isArray(data)
        ? data.map(event => ({
            ...event,
            date: event.date || event.start || ''
          }))
        : []
      setRawEvents(normalized)
      // Only cache if we have real data
      if (normalized.length > 0) {
        localStorage.setItem('calendar_events_cache', JSON.stringify(normalized))
        localStorage.setItem('calendar_events_cache_time', Date.now().toString())
      } else {
        // Clear cache if database is empty
        localStorage.removeItem('calendar_events_cache')
        localStorage.removeItem('calendar_events_cache_time')
      }
    } catch (error) {
      console.log('API error, checking cache...')
      const cached = localStorage.getItem('calendar_events_cache')
      if (cached) {
        const parsedCache = JSON.parse(cached)
        // Only use cache if it's recent (less than 1 hour old)
        const cacheTime = localStorage.getItem('calendar_events_cache_time')
        if (cacheTime && (Date.now() - parseInt(cacheTime)) < 3600000) {
          setRawEvents(parsedCache)
        } else {
          // Clear old cache
          localStorage.removeItem('calendar_events_cache')
          localStorage.removeItem('calendar_events_cache_time')
          setRawEvents([])
        }
      } else {
        setRawEvents([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    eventsApi.getCities().then(data => {
      setCities(data.cities)
      setCityColors(data.colors)
    }).catch(() => {})
  }, [])

  // Auto-translate events when language or rawEvents change
  useEffect(() => {
    const runTranslation = async () => {
      const requestId = ++translationRef.current
      if (currentLang === SOURCE_LANG || rawEvents.length === 0) {
        setTranslatedEvents(rawEvents)
        setTranslating(false)
        return
      }
      setTranslating(true)
      try {
        const translated = await translateEvents(rawEvents, SOURCE_LANG, currentLang)
        // Only apply if this is still the latest request
        if (requestId === translationRef.current) {
          setTranslatedEvents(translated)
        }
      } catch {
        if (requestId === translationRef.current) {
          setTranslatedEvents(rawEvents)
        }
      } finally {
        if (requestId === translationRef.current) {
          setTranslating(false)
        }
      }
    }
    runTranslation()
  }, [currentLang, rawEvents])

  const events = translatedEvents

  const addEvent = async (event) => {
    try {
      const newEvent = await eventsApi.create(event)
      setRawEvents(prev => [...prev, newEvent])
      return newEvent
    } catch (error) {
      throw error
    }
  }

  const updateEvent = async (id, updates) => {
    try {
      const updated = await eventsApi.update(id, updates)
      setRawEvents(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e))
    } catch (error) {
      throw error
    }
  }

  const deleteEvent = async (id) => {
    try {
      await eventsApi.delete(id)
      setRawEvents(prev => prev.filter(e => e.id !== id))
    } catch (error) {
      throw error
    }
  }

  const filteredEvents = selectedCity === 'all' 
    ? events 
    : events.filter(e => e.city === selectedCity)

  return (
    <EventContext.Provider value={{
      events,
      rawEvents,
      filteredEvents,
      cities,
      cityColors,
      selectedCity,
      setSelectedCity,
      addEvent,
      updateEvent,
      deleteEvent,
      loading,
      translating,
      refetch: fetchEvents
    }}>
      {children}
    </EventContext.Provider>
  )
}

export const useEvents = () => useContext(EventContext)
