import { Analytics } from '@prisma/client'
import { DeviceInfo } from './common.types'

export interface CreateAnalyticsData {
  linkId?: string
  userId: string
  userAgent?: string
  ipAddress?: string
  country?: string
  device?: string
}

export interface AnalyticsWithLink extends Analytics {
  link?: {
    id: string
    title: string
    url: string
  }
}

export interface AnalyticsFilters {
  startDate?: Date
  endDate?: Date
  linkId?: string
  country?: string
  device?: string
}

export interface AnalyticsSummary {
  totalClicks: number
  totalViews: number
  uniqueVisitors: number
  topLinks: Array<{
    linkId: string
    title: string
    clicks: number
  }>
  topCountries: Array<{
    country: string
    clicks: number
  }>
  deviceBreakdown: Array<{
    device: string
    clicks: number
    percentage: number
  }>
  dailyStats: Array<{
    date: string
    clicks: number
    views: number
  }>
}

export interface ClickEvent {
  linkId: string
  userId: string
  timestamp: Date
  metadata: {
    userAgent: string
    ipAddress: string
    country?: string
    device?: DeviceInfo
  }
}

