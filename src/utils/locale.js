export const getLocaleCode = (language) =>
  language === 'es' ? 'es-ES' : 'en-US'

export const changeAppLanguage = (i18n, lng) => {
  i18n.changeLanguage(lng)
  localStorage.setItem('calendar_lang', lng)
}
