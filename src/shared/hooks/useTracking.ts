'use client'

import { useCallback } from 'react'
import { trackEvent } from '@/shared/components/TrackingScripts'

export function useTracking() {
  const trackLinkClick = useCallback((linkId: string, linkTitle: string, linkUrl: string) => {
    trackEvent.linkClick(linkId, linkTitle, linkUrl)
  }, [])

  const trackFormSubmission = useCallback((formId: string, formTitle: string) => {
    trackEvent.formSubmission(formId, formTitle)
  }, [])

  const trackPageView = useCallback((pageTitle: string, pageUrl: string) => {
    trackEvent.pageView(pageTitle, pageUrl)
  }, [])

  const trackCustomEvent = useCallback((action: string, category: string, label?: string, value?: number) => {
    trackEvent.gtag(action, category, label, value)
  }, [])

  const trackFbEvent = useCallback((eventName: string, parameters?: any) => {
    trackEvent.fbq(eventName, parameters)
  }, [])

  return {
    trackLinkClick,
    trackFormSubmission,
    trackPageView,
    trackCustomEvent,
    trackFbEvent
  }
}
