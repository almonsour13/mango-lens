'use client'

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { HeartPulse, LucideIcon, Radar, ScanQrCode, Trees } from "lucide-react"
interface MetricCards{
  title:string;
  value:string;
  icon: LucideIcon;
}
export default function MetricCards() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<MetricCards[]>([])

  useEffect(() => {
    // Simulating data fetching
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second delay
      setMetrics([
        { title: "Total Mango Trees", value: "320", icon: Trees },
        { title: "Images Analyzed", value: "1,543", icon: ScanQrCode },
        { title: "Diseases Detected", value: "287", icon: Radar },
        { title: "Healthy Trees", value: "76%", icon: HeartPulse },
      ])
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
      {loading
        ? Array(4).fill(0).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[80px]" />
              </CardContent>
            </Card>
          ))
        : metrics.map((item, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                <item.icon className="text-primary h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
          ))}
    </div>
  )
}