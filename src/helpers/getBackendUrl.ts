export const getBackendUrl = () => {
  return import.meta.env.VITE_API_BASE_URL.replace(/api\/(v[0-9.]+)?/, '')
}
