"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, TrendingUp, TrendingDown, Info } from "lucide-react"
import { getCustomsRateDateForMonth } from "@/lib/customs-dates"
import { MonthPicker } from "@/components/month-picker"
import { useLanguage } from "@/lib/i18n/language-context"

interface ExchangeRate {
  currency: string
  name: string
  rate: number
  change?: number
}

export function ExchangeRateTable() {
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [selectedMonth, setSelectedMonth] = useState<number>(0)
  const [rates, setRates] = useState<ExchangeRate[]>([])
  const [loading, setLoading] = useState(false)
  const [rateDate, setRateDate] = useState<string>("")

  const { t, getCurrencyName } = useLanguage()

  useEffect(() => {
    const now = new Date()
    setSelectedYear(now.getFullYear())
    setSelectedMonth(now.getMonth() + 1)
  }, [])

  const fetchRates = async () => {
    if (!selectedYear || !selectedMonth) return

    setLoading(true)
    try {
      const rateDateStr = getCustomsRateDateForMonth(selectedYear, selectedMonth)
      setRateDate(rateDateStr)

      const response = await fetch(`/api/exchange-rates/daily?date=${rateDateStr}`)
      const data = await response.json()
      setRates(data.rates || [])
    } catch (error) {
      console.error("[v0] Failed to fetch rates:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      fetchRates()
    }
  }, [selectedYear, selectedMonth])

  const handleMonthSelect = (year: number, month: number) => {
    setSelectedYear(year)
    setSelectedMonth(month)
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">{t.tableTitle}</CardTitle>
        <CardDescription>{t.tableDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-w-xs space-y-2">
          <Label>{t.tableSelectMonth}</Label>
          <MonthPicker selectedYear={selectedYear} selectedMonth={selectedMonth} onSelect={handleMonthSelect} />
        </div>

        {rateDate && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span>{t.tableMonthInfo.replace("{date}", rateDate)}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="max-h-[600px] overflow-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>{t.tableCurrency}</TableHead>
                  <TableHead>{t.tableName}</TableHead>
                  <TableHead className="text-right">{t.tableRate}</TableHead>
                  <TableHead className="text-right">{t.tableChange}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      {t.tableNoData}
                    </TableCell>
                  </TableRow>
                ) : (
                  rates.map((item) => (
                    <TableRow key={item.currency}>
                      <TableCell className="font-semibold">{item.currency}</TableCell>
                      <TableCell className="text-muted-foreground">{getCurrencyName(item.currency)}</TableCell>
                      <TableCell className="text-right font-mono">{item.rate.toFixed(4)}</TableCell>
                      <TableCell className="text-right">
                        {item.change !== undefined && (
                          <span
                            className={`inline-flex items-center gap-1 ${
                              item.change > 0 ? "text-green-600" : item.change < 0 ? "text-red-600" : ""
                            }`}
                          >
                            {item.change > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : item.change < 0 ? (
                              <TrendingDown className="h-3 w-3" />
                            ) : null}
                            {item.change > 0 ? "+" : ""}
                            {item.change.toFixed(2)}%
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {rates.length > 0 && (
          <p className="text-sm text-muted-foreground">{t.tableTotal.replace("{count}", rates.length.toString())}</p>
        )}
      </CardContent>
    </Card>
  )
}
