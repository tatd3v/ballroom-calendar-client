import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { eventsApi } from '../services/api';

const EventContext = createContext(null);

const SOURCE_LANG = 'es';

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityColors, setCityColors] = useState({});
  const [selectedCity, setSelectedCity] = useState('all');
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const normalizeEvent = useCallback((event) => {
    const dateValue = event.date || event.start || '';
    return {
      ...event,
      date: dateValue,
      start: event.start || dateValue,
      end: event.end ?? null,
    };
  }, []);

  const fetchEvents = useCallback(
    async (lang = currentLang) => {
      setLoading(true);
      try {
        const data = await eventsApi.getAll({ lang });
        const normalized = Array.isArray(data) ? data.map(normalizeEvent) : [];
        setEvents(normalized);

        if (normalized.length > 0) {
          localStorage.setItem(
            'calendar_events_cache',
            JSON.stringify(normalized),
          );
          localStorage.setItem(
            'calendar_events_cache_time',
            Date.now().toString(),
          );
        } else {
          // Clear cache if database is empty
          localStorage.removeItem('calendar_events_cache');
          localStorage.removeItem('calendar_events_cache_time');
        }
      } catch (error) {
        console.log('API error, checking cache...');
        const cached = localStorage.getItem('calendar_events_cache');
        if (cached) {
          const parsedCache = JSON.parse(cached);
          // Only use cache if it's recent (less than 1 hour old)
          const cacheTime = localStorage.getItem('calendar_events_cache_time');
          if (cacheTime && Date.now() - parseInt(cacheTime) < 3600000) {
            setEvents(parsedCache);
          } else {
            // Clear old cache
            localStorage.removeItem('calendar_events_cache');
            localStorage.removeItem('calendar_events_cache_time');
            setEvents([]);
          }
        } else {
          setEvents([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [currentLang, normalizeEvent],
  );

  useEffect(() => {
    fetchEvents(currentLang);
  }, [fetchEvents, currentLang]);

  useEffect(() => {
    eventsApi
      .getCities()
      .then((data) => {
        setCities(Array.isArray(data.cities) ? data.cities : []);
        setCityColors(data.colors || {});
      })
      .catch(() => {});
  }, []);

  const cityCounts = useMemo(() => {
    if (!Array.isArray(events)) return {}
    return events.reduce((acc, event) => {
      if (!event?.city) return acc
      acc[event.city] = (acc[event.city] || 0) + 1
      return acc
    }, {})
  }, [events])

  const refetch = useCallback(
    () => fetchEvents(currentLang),
    [fetchEvents, currentLang],
  );

  const addEvent = async (event) => {
    try {
      const newEvent = await eventsApi.create(event);
      setEvents((prev) => [...prev, normalizeEvent(newEvent)]);
      return newEvent;
    } catch (error) {
      throw error;
    }
  };

  const updateEvent = async (id, updates) => {
    try {
      const updated = await eventsApi.update(id, updates);
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? normalizeEvent({ ...e, ...updated }) : e)),
      );
    } catch (error) {
      throw error;
    }
  };

  const deleteEvent = async (id) => {
    try {
      await eventsApi.delete(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      throw error;
    }
  };

  const filteredEvents =
    selectedCity === 'all'
      ? events
      : events.filter((e) => e.city === selectedCity);

  return (
    <EventContext.Provider
      value={{
        events,
        filteredEvents,
        cities,
        cityColors,
        cityCounts,
        selectedCity,
        setSelectedCity,
        addEvent,
        updateEvent,
        deleteEvent,
        loading,
        refetch,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export const useEvents = () => useContext(EventContext);
