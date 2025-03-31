"use client"

import * as React from "react"

export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full h-full">{children}</div>
}

export const Chart = ({ data, children }: { data: any[]; children: React.ReactNode }) => {
  return (
    <svg viewBox="0 0 600 400">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { data })
        }
        return null
      })}
    </svg>
  )
}

export const ChartTooltip = ({ content }: { content: React.ReactNode }) => {
  return <>{content}</>
}

export const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="bg-background border border-border rounded-md p-2 shadow-md">
      <p className="text-sm font-medium">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

export const ChartLegend = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex">{children}</div>
}

export const ChartLegendItem = ({ name, color }: { name: string; color: string }) => {
  return (
    <div className="flex items-center mr-4">
      <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: color }}></div>
      <span>{name}</span>
    </div>
  )
}

export const ChartGrid = () => {
  const horizontalLines = [0, 25, 50, 75, 100]

  return (
    <>
      {horizontalLines.map((value, index) => {
        const y = 400 - (value / 100) * 300
        return (
          <line
            key={index}
            x1="0"
            y1={y}
            x2="600"
            y2={y}
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="5,5"
            className="text-muted-foreground/20"
          />
        )
      })}
    </>
  )
}

export const ChartLine = ({
  data,
  dataKey,
  stroke,
  strokeWidth,
}: { data: any[]; dataKey: string; stroke: string; strokeWidth: number }) => {
  if (!data || data.length < 2) return null

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 600
      const y = 400 - (item[dataKey] / Math.max(...data.map((d) => d[dataKey]))) * 300
      return `${x},${y}`
    })
    .join(" ")

  return <polyline points={points} stroke={stroke} strokeWidth={strokeWidth} fill="none" />
}

export const ChartArea = ({
  data,
  dataKey,
  fill,
  fillOpacity,
}: { data: any[]; dataKey: string; fill: string; fillOpacity: number }) => {
  if (!data || data.length < 2) return null

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 600
      const y = 400 - (item[dataKey] / Math.max(...data.map((d) => d[dataKey]))) * 300
      return `${x},${y}`
    })
    .join(" ")

  const firstPointX = 0
  const lastPointX = 600
  const bottomY = 400

  const polygonPoints = `${firstPointX},${bottomY} ${points} ${lastPointX},${bottomY}`

  return <polygon points={polygonPoints} fill={fill} fillOpacity={fillOpacity} />
}

export const ChartXAxis = ({ data, dataKey }: { data: any[]; dataKey: string }) => {
  if (!data || data.length === 0) return null

  return (
    <>
      {data.map((item, index) => {
        const x = (index / (data.length - 1)) * 600
        return (
          <text
            key={index}
            x={x}
            y="390"
            textAnchor="middle"
            fontSize="12"
            fill="currentColor"
            className="text-xs text-muted-foreground"
          >
            {item[dataKey]}
          </text>
        )
      })}
    </>
  )
}

export const ChartYAxis = () => {
  const values = [0, 25, 50, 75, 100]

  return (
    <>
      {values.map((value, index) => {
        const y = 400 - (value / 100) * 300
        return (
          <text
            key={index}
            x="10"
            y={y}
            textAnchor="start"
            dominantBaseline="middle"
            fontSize="12"
            fill="currentColor"
            className="text-xs text-muted-foreground"
          >
            {value}%
          </text>
        )
      })}
    </>
  )
}

export const ChartBar = ({
  data,
  dataKey,
  fill,
  radius,
}: { data: any[]; dataKey: string; fill: string; radius: number[] }) => {
  if (!data || data.length === 0) return null

  const maxValue = Math.max(...data.map((d) => d[dataKey]))

  return (
    <>
      {data.map((item, index) => {
        const x = (index / data.length) * 600 + 600 / data.length / 2 - 15
        const height = (item[dataKey] / maxValue) * 300
        const y = 400 - height
        const width = 30

        return <rect key={index} x={x} y={y} width={width} height={height} fill={fill} rx={radius[0]} ry={radius[0]} />
      })}
    </>
  )
}

