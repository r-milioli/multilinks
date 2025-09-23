'use client'

import Script from 'next/script'
import { useEffect } from 'react'

interface TrackingScriptsProps {
  googleAnalytics?: string
  facebookPixel?: string
  userId?: string
  pageTitle?: string
  pageUrl?: string
}

export function TrackingScripts({ 
  googleAnalytics, 
  facebookPixel, 
  userId, 
  pageTitle = 'MultiLink Page',
  pageUrl = typeof window !== 'undefined' ? window.location.href : ''
}: TrackingScriptsProps) {
  
  // Inicializar Google Analytics
  useEffect(() => {
    if (googleAnalytics && typeof window !== 'undefined') {
      // Configurar gtag
      window.dataLayer = window.dataLayer || []
      function gtag(...args: any[]) {
        window.dataLayer.push(args)
      }
      
      // Tornar gtag disponível globalmente
      ;(window as any).gtag = gtag
      
      // Configurar GA
      gtag('js', new Date())
      gtag('config', googleAnalytics, {
        page_title: pageTitle,
        page_location: pageUrl,
        custom_map: {
          custom_parameter_1: 'user_id'
        }
      })
      
      // Enviar evento de página visualizada
      gtag('event', 'page_view', {
        page_title: pageTitle,
        page_location: pageUrl,
        user_id: userId
      })
      
      console.log('📊 Google Analytics configurado:', googleAnalytics)
    }
  }, [googleAnalytics, userId, pageTitle, pageUrl])

  // Inicializar Facebook Pixel
  useEffect(() => {
    if (facebookPixel && typeof window !== 'undefined') {
      // Configurar fbq
      ;(window as any).fbq = (window as any).fbq || function(...args: any[]) {
        ;(window as any).fbq.callMethod ? (window as any).fbq.callMethod.apply((window as any).fbq, args) : (window as any).fbq.queue.push(args)
      }
      
      if (!(window as any).fbq._fbq) {
        ;(window as any).fbq._fbq = (window as any).fbq
      }
      
      ;(window as any).fbq.push = (window as any).fbq
      ;(window as any).fbq.loaded = true
      ;(window as any).fbq.version = '2.0'
      ;(window as any).fbq.queue = []
      
      // Inicializar pixel
      ;(window as any).fbq('init', facebookPixel)
      ;(window as any).fbq('track', 'PageView')
      
      console.log('📘 Facebook Pixel configurado:', facebookPixel)
    }
  }, [facebookPixel])

  return (
    <>
      {/* Google Analytics Script */}
      {googleAnalytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalytics}', {
                page_title: '${pageTitle}',
                page_location: '${pageUrl}',
                custom_map: {
                  custom_parameter_1: 'user_id'
                }
              });
            `}
          </Script>
        </>
      )}

      {/* Facebook Pixel Script */}
      {facebookPixel && (
        <>
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${facebookPixel}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${facebookPixel}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  )
}

// Funções utilitárias para tracking de eventos
export const trackEvent = {
  // Google Analytics
  gtag: (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      })
      console.log('📊 GA Event:', { action, category, label, value })
    }
  },

  // Facebook Pixel
  fbq: (eventName: string, parameters?: any) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      ;(window as any).fbq('track', eventName, parameters)
      console.log('📘 FB Event:', { eventName, parameters })
    }
  },

  // Eventos específicos do MultiLink
  linkClick: (linkId: string, linkTitle: string, linkUrl: string) => {
    trackEvent.gtag('click', 'Link', linkTitle)
    trackEvent.fbq('Lead', {
      content_name: linkTitle,
      content_category: 'Link Click',
      value: 1,
      currency: 'BRL'
    })
  },

  formSubmission: (formId: string, formTitle: string) => {
    trackEvent.gtag('conversion', 'Form', formTitle)
    trackEvent.fbq('CompleteRegistration', {
      content_name: formTitle,
      content_category: 'Form Submission',
      value: 5,
      currency: 'BRL'
    })
  },

  pageView: (pageTitle: string, pageUrl: string) => {
    trackEvent.gtag('page_view', 'Page', pageTitle)
    trackEvent.fbq('ViewContent', {
      content_name: pageTitle,
      content_category: 'Page View',
      value: 1,
      currency: 'BRL'
    })
  }
}

// Declarações de tipos globais
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
    fbq: (...args: any[]) => void
  }
}
