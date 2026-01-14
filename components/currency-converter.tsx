"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, Loader2 } from "lucide-react"
import { getCurrentCustomsRateDate, getCustomsRateDateForMonth } from "@/lib/customs-dates"
import { MonthPicker } from "@/components/month-picker"
import { useLanguage } from "@/lib/i18n/language-context"

const getCurrencies = (getCurrencyName: (code: string) => string) => [
  { code: "USD", name: getCurrencyName("USD") },
  { code: "GBP", name: getCurrencyName("GBP") },
  { code: "JPY", name: getCurrencyName("JPY") },
  { code: "CHF", name: getCurrencyName("CHF") },
  { code: "PLN", name: getCurrencyName("PLN") },
  { code: "SEK", name: getCurrencyName("SEK") },
  { code: "NOK", name: getCurrencyName("NOK") },
  { code: "DKK", name: getCurrencyName("DKK") },
  { code: "CZK", name: getCurrencyName("CZK") },
  { code: "HUF", name: getCurrencyName("HUF") },
  { code: "RON", name: getCurrencyName("RON") },
  { code: "BGN", name: getCurrencyName("BGN") },
  { code: "TRY", name: getCurrencyName("TRY") },
  { code: "AUD", name: getCurrencyName("AUD") },
  { code: "CAD", name: getCurrencyName("CAD") },
  { code: "CNY", name: getCurrencyName("CNY") },
]

export function CurrencyConverter() {
  const { t, getCurrencyName } = useLanguage()
  const OTHER_CURRENCIES = getCurrencies(getCurrencyName)

  const [amount, setAmount] = useState<string>("100")
  const [direction, setDirection] = useState<"fromEur" | "toEur">("fromEur")
  const [otherCurrency, setOtherCurrency] = useState<string>("USD")
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [rate, setRate] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [selectedMonth, setSelectedMonth] = useState<number>(0)
  const [customsDate, setCustomsDate] = useState<string>("")

  useEffect(() => {
    const now = new Date()
    setSelectedYear(now.getFullYear())
    setSelectedMonth(now.getMonth() + 1)
    const rateDate = getCurrentCustomsRateDate()
    setCustomsDate(rateDate)
  }, [])

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const rateDate = getCustomsRateDateForMonth(selectedYear, selectedMonth)
      setCustomsDate(rateDate)
    }
  }, [selectedYear, selectedMonth])

  const convert = async () => {
    setLoading(true)
    try {
      const from = direction === "fromEur" ? "EUR" : otherCurrency
      const to = direction === "fromEur" ? otherCurrency : "EUR"
      const response = await fetch(
        `/api/exchange-rates/convert?from=${from}&to=${to}&amount=${amount}&date=${customsDate}`,
      )
      const data = await response.json()
      setResult(data.result)
      setRate(data.rate)
    } catch (error) {
      console.error("[v0] Currency conversion error:", error)
    } finally {
      setLoading(false)
    }
  }

  const swap = () => {
    setDirection(direction === "fromEur" ? "toEur" : "fromEur")
    setResult(null)
  }

  const handleMonthSelect = (year: number, month: number) => {
    setSelectedYear(year)
    setSelectedMonth(month)
  }

  useEffect(() => {
    if (amount && otherCurrency) {
      convert()
    }
  }, [otherCurrency, direction, customsDate])

  const fromCurrency = direction === "fromEur" ? "EUR" : otherCurrency
  const toCurrency = direction === "fromEur" ? otherCurrency : "EUR"

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">{t.converterTitle}</CardTitle>
        <CardDescription>
          {t.converterDescription}
          {customsDate && (
            <span className="mt-2 block text-xs text-muted-foreground">
              {t.converterMonthInfo.replace("{date}", customsDate)}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>{t.converterSelectMonth}</Label>
          <MonthPicker selectedYear={selectedYear} selectedMonth={selectedMonth} onSelect={handleMonthSelect} />
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr,auto,1fr]">
          {/* From Currency */}
          <div className="space-y-3">
            <Label>{t.converterFrom}</Label>
            {direction === "fromEur" ? (
              <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 font-medium">
                EUR - {getCurrencyName("EUR")}
              </div>
            ) : (
              <Select value={otherCurrency} onValueChange={setOtherCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OTHER_CURRENCIES.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div>
              <Label htmlFor="amount">{t.converterAmount}</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onBlur={convert}
                className="mt-1"
                placeholder={t.converterPlaceholder}
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex items-end pb-2">
            <Button
              variant="outline"
              size="icon"
              onClick={swap}
              className="h-10 w-10 bg-transparent"
              aria-label={t.converterSwap}
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          {/* To Currency */}
          <div className="space-y-3">
            <Label>{t.converterTo}</Label>
            {direction === "toEur" ? (
              <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 font-medium">
                EUR - {getCurrencyName("EUR")}
              </div>
            ) : (
              <Select value={otherCurrency} onValueChange={setOtherCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OTHER_CURRENCIES.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div>
              <Label>{t.converterResult}</Label>
              <div className="mt-1 flex h-10 items-center rounded-md border border-input bg-muted px-3 text-lg font-semibold">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : result !== null ? (
                  `${result.toFixed(2)} ${toCurrency}`
                ) : (
                  "—"
                )}
              </div>
            </div>
          </div>
        </div>

        {rate && (
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">{t.converterRate}</p>
            <p className="text-lg font-semibold">
              1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
