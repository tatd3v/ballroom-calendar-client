export const DEFAULT_CITY_COLOR = '#EE0087'

export function getCityColor(city, palette = {}, fallback = DEFAULT_CITY_COLOR) {
  if (!city) return fallback
  return palette[city] || fallback
}

export function buildCityOptions(cities = [], palette = {}, counts = {}) {
  return cities.map((city) => ({
    name: city,
    color: getCityColor(city, palette),
    count: counts[city] || 0,
  }))
}
