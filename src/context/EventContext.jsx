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
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [calendarLimit] = useState(50); // Events that fit in calendar view
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
    async (lang = currentLang, page = 1, limit = null, append = false) => {
      // Use calendar limit for desktop, mobile limit for infinite scroll
      const actualLimit = limit || calendarLimit;
      
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setEvents([]);
        setCurrentPage(1);
        setHasMore(true);
      }
      
      try {
        const data = await eventsApi.getAll({ lang, page, limit: actualLimit });
        const normalized = Array.isArray(data.events || data) 
          ? (data.events || data).map(normalizeEvent) 
          : [];
        
        if (append) {
          setEvents(prev => [...prev, ...normalized]);
        } else {
          setEvents(normalized);
        }
        
        // Update pagination info
        if (data.pagination) {
          setHasMore(data.pagination.hasMore);
          setTotalEvents(data.pagination.total);
          setCurrentPage(data.pagination.page);
        } else {
          // Fallback for non-paginated response
          setHasMore(normalized.length < actualLimit);
          setTotalEvents(normalized.length);
          setCurrentPage(page);
        }

        // Cache only first page
        if (!append && normalized.length > 0) {
          localStorage.setItem(
            'calendar_events_cache',
            JSON.stringify(normalized),
          );
          localStorage.setItem(
            'calendar_events_cache_time',
            Date.now().toString(),
          );
        }
      } catch (error) {
        console.log('API error, checking cache...');
        const cached = localStorage.getItem('calendar_events_cache');
        if (cached && !append) {
          const parsed = JSON.parse(cached);
          setEvents(parsed.map(normalizeEvent));
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [normalizeEvent, currentLang, calendarLimit],
  );

  const loadMoreEvents = useCallback((mobileLimit = 10) => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchEvents(currentLang, nextPage, mobileLimit, true);
    }
  }, [loadingMore, hasMore, currentPage, currentLang, fetchEvents]);

  const resetEvents = useCallback(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchEvents(currentLang, 1, null, false);
  }, [currentLang, fetchEvents]);

  useEffect(() => {
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
  }, [currentLang, normalizeEvent]);

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
        loading,
        loadingMore,
        hasMore,
        currentPage,
        totalEvents,
        calendarLimit,
        loadMoreEvents,
        resetEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        refetch,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export const useEvents = () => useContext(EventContext);
