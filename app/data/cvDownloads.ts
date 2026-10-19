import { profile } from './profile'

// Company-specific CVs are shared only by direct link, never in public listings.
export const publicCvDownloads = profile.cv.downloads.filter(
  (download) => download.href === '/api/cv/general.pdf'
)
