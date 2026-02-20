import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Heart,
  Share2,
  CalendarDays,
  MapPin,
  Clock,
  Star,
  ExternalLink,
} from 'lucide-react';
import {
  formatDateWithLocale,
  formatTimeWithMeridiem,
  parseDateOnlyToLocal,
} from '../utils/time';
import { slugify, getEventUrl, findEventBySlug } from '../utils/slugify';
import CustomLoader from '../components/ui/CustomLoader';

export default function EventDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { events, loading, cityColors } = useEvents();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Extract event slug from URL parameters
  const eventSlug = params.eventSlug;

  // Local getCityBadge function
  const getCityBadge = (city) => {
    const color = cityColors?.[city];
    const style = color
      ? {
          backgroundColor: `${color}22`,
          color: color,
          borderColor: `${color}55`,
        }
      : undefined;

    return (
      <span
        className="px-2 py-0.5 rounded text-xs font-semibold uppercase border"
        style={style}
      >
        {city}
      </span>
    );
  };

  // Find event by slug
  useEffect(() => {
    if (events.length > 0 && eventSlug) {
      const foundEvent = findEventBySlug(eventSlug, events);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        navigate('/calendar');
      }
    }
  }, [events, eventSlug, navigate]);

  // Handle like toggle
  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Handle image gallery navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (event?.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (event?.images?.length || 1)) %
        (event?.images?.length || 1),
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-ink/50 flex items-center justify-center">
        <CustomLoader size="large" text={t('mobile.loading')} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white dark:bg-ink/50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink/70 dark:text-white/70 mb-4">
            {t('mobile.eventNotFound', 'Event not found')}
          </p>
          <Link
            to="/calendar"
            className="text-primary hover:text-primary/80 font-medium"
          >
            {t('mobile.backToCalendar', 'Back to Calendar')}
          </Link>
        </div>
      </div>
    );
  }

  const cityColor = cityColors[event.city] || '#EE0087';
  const images = event.images || [event.imageUrl].filter(Boolean);
  const heroImage = images[currentImageIndex] || null;
  const dateSource = event.start || event.date;
  const parsedDate = dateSource ? parseDateOnlyToLocal(dateSource) : null;

  const quickInfo = [
    {
      id: 'date',
      icon: CalendarDays,
      label: t('event.date', 'Date'),
      value: parsedDate
        ? formatDateWithLocale(dateSource, i18n.language)
        : t('mobile.dateTBA', 'Date TBD'),
    },
    {
      id: 'time',
      icon: Clock,
      label: t('event.time', 'Time'),
      value: event.time
        ? formatTimeWithMeridiem(event.time)
        : t('mobile.timeTBA', 'Time TBD'),
      helper: t('mobile.localTimezone', 'Local time'),
    },
    {
      id: 'venue',
      icon: MapPin,
      label: t('event.venue', 'Venue'),
      value: event.location || t('mobile.locationTBA', 'Location TBD'),
      helper: event.city,
    },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-ink dark:text-white">
      {/* Hero */}
      <section className="relative h-[45vh] lg:h-[60vh] overflow-hidden">
        {heroImage ? (
          <img
            src={heroImage}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-lavender/30 to-primary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/10" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 sm:p-6">
          <button
            onClick={() => navigate('/')}
            className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-12 pb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 text-white">
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-[0.3em] bg-white/15">
                {event.city}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                {event.title}
              </h1>
              <p className="text-white/80 max-w-2xl text-sm sm:text-base">
                {event.description?.slice(0, 160) ||
                  t('mobile.aboutEvent', 'Event details')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-ink/60 dark:text-white/60">
          <Link to="/" className="hover:text-primary font-medium">
            {t('calendar.title')}
          </Link>
          <span>/</span>
          <span className="text-ink sparing dark:text-white font-semibold truncate">
            {event.title}
          </span>
        </nav>

        {/* Page Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink dark:text-white mb-4">
            {t('mobile.eventDetails', 'Event Details')}
          </h1>
          <p className="text-lg text-ink/70 dark:text-white/70 max-w-3xl">
            {t(
              'mobile.eventDetailsDescription',
              'Complete information about the event including date, time, location, and organizer details.',
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-ink/60 border border-lavender/20 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              {quickInfo.map((info) => (
                <div key={info.id} className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-ink/60 dark:text-white/50">
                      {info.label}
                    </p>
                    <p className="text-lg font-bold text-ink dark:text-white">
                      {info.value}
                    </p>
                    {info.helper && (
                      <p className="text-xs text-ink/60 dark:text-white/50">
                        {info.helper}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <section>
                <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                  <span className="w-2 h-8 rounded-full bg-primary" />
                  {t('mobile.venueGallery', 'Venue Gallery')}
                </h3>
                <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-none w-64 aspect-video rounded-xl overflow-hidden snap-start border transition-all ${
                        index === currentImageIndex
                          ? 'border-primary shadow-lg'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${event.title}-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {event.description && (
              <section className="bg-white dark:bg-ink/60 rounded-2xl border border-lavender/20 dark:border-white/10 p-6 lg:p-8 shadow-sm">
                <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                  <span className="w-2 h-8 rounded-full bg-primary" />
                  {t('mobile.aboutEvent', 'About this event')}
                </h3>
                <p className="text-ink/80 dark:text-white/70 leading-relaxed text-base">
                  {event.description}
                </p>
              </section>
            )}

            <section>
              <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                <span className="w-2 h-8 rounded-full bg-primary" />
                {t('mobile.location', 'Location')}
              </h3>
              <div className="rounded-2xl overflow-hidden border border-lavender/20 dark:border-white/10 shadow-sm">
                <div className="h-64 w-full bg-lavender/20 dark:bg-ink/40 relative">
                  <MapPin className="absolute inset-0 m-auto w-12 h-12 text-primary/60" />
                </div>
                <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-ink/70">
                  <div className="text-sm text-ink/70 dark:text-white/70 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location || event.city}</span>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${event.location || ''}, ${event.city}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary font-semibold text-sm hover:underline"
                  >
                    {t('mobile.openInMaps', 'Open in Google Maps')}
                  </a>
                </div>
              </div>
            </section>

            {event.organizerName && (
              <section className="bg-lavender/20 dark:bg-white/5 border border-primary/10 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black"
                    style={{ backgroundColor: cityColor }}
                  >
                    {event.organizerName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-ink/60 dark:text-white/50 font-bold">
                      {t('mobile.eventOrganizer', 'Organizer')}
                    </p>
                    <p className="text-lg font-bold">{event.organizerName}</p>
                  </div>
                </div>
                <button className="text-primary font-semibold text-sm hover:text-primary/80">
                  {t('mobile.follow', 'Follow')}
                </button>
              </section>
            )}
          </div>

          {/* Right Column */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="bg-white dark:bg-ink/70 border border-lavender/20 dark:border-white/10 rounded-2xl shadow-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-ink/50 dark:text-white/50 font-bold">
                    {t('mobile.eventDetails', 'Event Details')}
                  </p>
                  <p className="text-2xl font-black text-ink dark:text-white">
                    {event.title}
                  </p>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  {t('mobile.liveEvent', 'Live')}
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-semibold">{quickInfo[0].value}</p>
                    <p className="text-ink/60 dark:text-white/60">
                      {quickInfo[0].helper}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-semibold">
                      {event.location ||
                        t('mobile.locationTBA', 'Location TBD')}
                    </p>
                    <p className="text-ink/60 dark:text-white/60">
                      {event.city}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/calendar')}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
                >
                  {t('mobile.backToCalendar', 'Back to Calendar')}
                </button>
                <button
                  onClick={handleShare}
                  className="w-full bg-lavender/30 text-primary font-semibold py-3 rounded-xl hover:bg-lavender/50 transition"
                >
                  {t('mobile.shareEvent', 'Share event')}
                </button>
              </div>
            </div>

            {event.organizerName && (
              <div className="bg-white dark:bg-ink/70 border border-lavender/20 dark:border-white/10 rounded-2xl p-6 space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-ink/50 dark:text-white/50 font-bold">
                  {t('mobile.contactOrganizer', 'Contact')}
                </p>
                <p className="text-lg font-bold">{event.organizerName}</p>
                <p className="text-sm text-ink/60 dark:text-white/60">
                  {t(
                    'mobile.organizerDescription',
                    'Connect with the organizer for additional details or partnership opportunities.',
                  )}
                </p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
