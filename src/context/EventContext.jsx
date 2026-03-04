import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { eventsApi } from '../services/api';
import { translationCache, translationMetrics, backendIntegration } from '../services/translationService';
import useMobile from '../hooks/useMobile';

const EventContext = createContext(null);

const SOURCE_LANG = 'es' // Matches backend SOURCE_LANG

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
  const [futureEventsCount, setFutureEventsCount] = useState(0);
  const [upcomingCountsByCity, setUpcomingCountsByCity] = useState({});
  const [calendarLimit] = useState(50); // Events that fit in calendar view
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const isMobile = useMobile();
  const mobileRef = useRef(isMobile);
  
  // Update ref when isMobile changes
  useEffect(() => {
    mobileRef.current = isMobile;
  }, [isMobile]);

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
      // Use calendar limit for desktop, 10 for mobile initial load
      const actualLimit = limit || (mobileRef.current ? 10 : calendarLimit);
      const startTime = Date.now()

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setEvents([]);
        setCurrentPage(1);
        setHasMore(true);
      }

      try {
        // Check cache first for instant response
        const cacheKey = translationCache.getEventsKey(lang, 'all', page);
        const cachedData = translationCache.get(cacheKey, true); // Use backend TTL

        if (cachedData && !append) {
          // Use cached data immediately
          translationMetrics.trackCacheHit(cacheKey, 'backend');
          setEvents(cachedData.events);
          setHasMore(cachedData.hasMore);
          setTotalEvents(cachedData.total);
          setCurrentPage(cachedData.page);
          setLoading(false);

          // Track cache performance
          const duration = Date.now() - startTime;
          translationMetrics.trackBackendCall('/events', duration, cachedData.events.length);
          return;
        }

        // Build API URL with language parameter (backend integration)
        const apiUrl = backendIntegration.buildApiUrl('/api/events', lang, { 
          limit: actualLimit,
          page: page 
        });

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const normalized = Array.isArray(data.events || data)
          ? (data.events || data).map(normalizeEvent)
          : [];

        // Cache the results with backend TTL
        const cacheData = {
          events: normalized,
          hasMore: data.pagination?.hasMore || normalized.length < actualLimit,
          total: data.pagination?.total || normalized.length,
          page: data.pagination?.page || page,
          lang: lang,
          timestamp: Date.now()
        };
        translationCache.set(cacheKey, cacheData, true); // Use backend TTL

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

        // Cache only first page in localStorage (legacy support)
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

        // Track backend performance
        const duration = Date.now() - startTime;
        translationMetrics.trackBackendCall('/events', duration, normalized.length);
        translationMetrics.trackCacheMiss(cacheKey, 'backend');

      } catch (error) {
        console.error('Failed to fetch events:', error);

        // Fallback to localStorage cache
        const cached = localStorage.getItem('calendar_events_cache');
        if (cached && !append) {
          const parsedCache = JSON.parse(cached);
          setEvents(parsedCache.map(normalizeEvent));
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

  const fetchFutureEventsCount = useCallback(async () => {
    try {
      const data = await eventsApi.getFutureCount();
      setFutureEventsCount(data.count || 0);
    } catch (error) {
      console.error('Failed to fetch future events count:', error);
      setFutureEventsCount(0);
    }
  }, []);

  const fetchUpcomingCountsByCity = useCallback(async () => {
    try {
      const data = await eventsApi.getUpcomingCountsByCity();
      setUpcomingCountsByCity(data || {});
    } catch (error) {
      console.error('Failed to fetch upcoming counts by city:', error);
      setUpcomingCountsByCity({});
    }
  }, []);

  useEffect(() => {
    fetchEvents(currentLang);
    fetchFutureEventsCount();
    fetchUpcomingCountsByCity();
  }, [fetchEvents, currentLang, fetchFutureEventsCount, fetchUpcomingCountsByCity]);

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
        futureEventsCount,
        upcomingCountsByCity,
        calendarLimit,
        loadMoreEvents,
        resetEvents,
        fetchEvents,
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
