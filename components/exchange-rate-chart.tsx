"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Loader2 } from "lucide-react"
import { getCustomsRateDateForMonth } from "@/lib/customs-dates"
import { MonthPicker } from "@/components/month-picker"
import { useLanguage } from "@/lib/i18n/language-context"

const getCurrencies = (getCurrencyName: (code: string) => string) => [
  { code: "USD", name: getCurrencyName("USD") },
  { code: "JPY", name: getCurrencyName("JPY") },
  { code: "BGN", name: getCurrencyName("BGN") },
  { code: "CZK", name: getCurrencyName("CZK") },
  { code: "DKK", name: getCurrencyName("DKK") },
  { code: "GBP", name: getCurrencyName("GBP") },
  { code: "HUF", name: getCurrencyName("HUF") },
  { code: "PLN", name: getCurrencyName("PLN") },
  { code: "RON", name: getCurrencyName("RON") },
  { code: "SEK", name: getCurrencyName("SEK") },
  { code: "CHF", name: getCurrencyName("CHF") },
  { code: "ISK", name: getCurrencyName("ISK") },
  { code: "NOK", name: getCurrencyName("NOK") },
  { code: "TRY", name: getCurrencyName("TRY") },
  { code: "AUD", name: getCurrencyName("AUD") },
  { code: "BRL", name: getCurrencyName("BRL") },
  { code: "CAD", name: getCurrencyName("CAD") },
  { code: "CNY", name: getCurrencyName("CNY") },
  { code: "HKD", name: getCurrencyName("HKD") },
  { code: "IDR", name: getCurrencyName("IDR") },
  { code: "ILS", name: getCurrencyName("ILS") },
  { code: "INR", name: getCurrencyName("INR") },
  { code: "KRW", name: getCurrencyName("KRW") },
  { code: "MXN", name: getCurrencyName("MXN") },
  { code: "MYR", name: getCurrencyName("MYR") },
  { code: "NZD", name: getCurrencyName("NZD") },
  { code: "PHP", name: getCurrencyName("PHP") },
  { code: "SGD", name: getCurrencyName("SGD") },
  { code: "THB", name: getCurrencyName("THB") },
  { code: "ZAR", name: getCurrencyName("ZAR") },
]

export function ExchangeRateChart() {
  const { t, getCurrencyName, getMonthName } = useLanguage()
  const ALL_CURRENCIES = getCurrencies(getCurrencyName)

  const [currency, setCurrency] = useState<string>("USD")
  const [startYear, setStartYear] = useState<number>(0)
  const [startMonth, setStartMonth] = useState<number>(0)
  const [endYear, setEndYear] = useState<number>(0)
  const [endMonth, setEndMonth] = useState<number>(0)
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    setEndYear(currentYear)
    setEndMonth(currentMonth)

    if (currentMonth === 1) {
      setStartYear(currentYear - 1)
      setStartMonth(1)
    } else {
      setStartYear(currentYear - 1)
      setStartMonth(currentMonth)
    }
  }, [])

  const fetchChartData = async () => {
    if (!startYear || !startMonth || !endYear || !endMonth) return

    setLoading(true)
    try {
      const months: Array<{ year: number; month: number }> = []
      let currentYear = startYear
      let currentMonth = startMonth

      while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
        months.push({ year: currentYear, month: currentMonth })
        currentMonth++
        if (currentMonth > 12) {
          currentMonth = 1
          currentYear++
        }
      }

      const chartDataPromises = months.map(async (m) => {
        try {
          const rateDate = getCustomsRateDateForMonth(m.year, m.month)
          const response = await fetch(`/api/exchange-rates/convert?from=EUR&to=${currency}&amount=1&date=${rateDate}`)
          const data = await response.json()
          return {
            date: `${getMonthName(m.month - 1, true)} ${m.year}`,
            rate: data.rate || 0,
          }
        } catch (error) {
          console.error(`[v0] Failed to fetch rate for ${m.month}/${m.year}:`, error)
          return { date: `${getMonthName(m.month - 1, true)} ${m.year}`, rate: 0 }
        }
      })

      const results = await Promise.all(chartDataPromises)
      setChartData(results)
    } catch (error) {
      console.error("[v0] Failed to fetch chart data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartMonthSelect = (year: number, month: number) => {
    setStartYear(year)
    setStartMonth(month)
  }

  const handleEndMonthSelect = (year: number, month: number) => {
    setEndYear(year)
    setEndMonth(month)
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">{t.chartTitle}</CardTitle>
        <CardDescription>{t.chartDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="chart-currency">{t.chartCurrency}</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="chart-currency" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_CURRENCIES.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t.chartStartMonth}</Label>
              <MonthPicker selectedYear={startYear} selectedMonth={startMonth} onSelect={handleStartMonthSelect} />
            </div>

            <div className="space-y-2">
              <Label>{t.chartEndMonth}</Label>
              <MonthPicker selectedYear={endYear} selectedMonth={endMonth} onSelect={handleEndMonthSelect} />
            </div>
          </div>
        </div>

        <Button onClick={fetchChartData} className="w-full md:w-auto" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.chartLoading}
            </>
          ) : (
            t.chartShowButton
          )}
        </Button>

        {chartData.length > 0 && (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#1e40af"
                  strokeWidth={2}
                  dot={false}
                  name={t.chartRateLabel.replace("{currency}", currency)}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartData.length === 0 && !loading && (
          <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">{t.chartEmpty}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
