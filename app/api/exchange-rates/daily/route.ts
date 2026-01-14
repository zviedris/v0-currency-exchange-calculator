import { type NextRequest, NextResponse } from "next/server"

const CURRENCY_NAMES: Record<string, string> = {
  USD: "ASV Dolārs",
  JPY: "Japānas Jena",
  BGN: "Bulgārijas Leva",
  CZK: "Čehijas Krona",
  DKK: "Dānijas Krona",
  GBP: "Lielbritānijas Sterliņu Mārciņa",
  HUF: "Ungārijas Forints",
  PLN: "Polijas Zlots",
  RON: "Rumānijas Leja",
  SEK: "Zviedrijas Krona",
  CHF: "Šveices Franks",
  ISK: "Islandes Krona",
  NOK: "Norvēģijas Krona",
  TRY: "Turcijas Lira",
  AUD: "Austrālijas Dolārs",
  BRL: "Brazīlijas Reāls",
  CAD: "Kanādas Dolārs",
  CNY: "Ķīnas Juaņa",
  HKD: "Honkongas Dolārs",
  IDR: "Indonēzijas Rūpija",
  ILS: "Izraēlas Šekelis",
  INR: "Indijas Rūpija",
  KRW: "Dienvidkorejas Vona",
  MXN: "Meksikas Peso",
  MYR: "Malaizijas Ringits",
  NZD: "Jaunzēlandes Dolārs",
  PHP: "Filipīnu Peso",
  SGD: "Singapūras Dolārs",
  THB: "Taizemes Bāts",
  ZAR: "Dienvidāfrikas Rands",
}

function getPreviousBusinessDay(dateStr: string): string {
  const date = new Date(dateStr)
  date.setDate(date.getDate() - 1)
  // Skip weekends
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() - 1)
  }
  return date.toISOString().split("T")[0]
}

async function fetchRatesForDate(date: string, maxRetries = 7): Promise<{ rates: any[]; actualDate: string }> {
  let currentDate = date

  for (let i = 0; i < maxRetries; i++) {
    const currencies = Object.keys(CURRENCY_NAMES).join("+")
    const url = `https://data-api.ecb.europa.eu/service/data/EXR/D.${currencies}.EUR.SP00.A?startPeriod=${currentDate}&endPeriod=${currentDate}&format=csvdata`

    const response = await fetch(url, {
      headers: { Accept: "text/csv" },
    })

    if (!response.ok) {
      currentDate = getPreviousBusinessDay(currentDate)
      continue
    }

    const csvText = await response.text()
    const lines = csvText.trim().split("\n")

    if (lines.length < 2) {
      currentDate = getPreviousBusinessDay(currentDate)
      continue
    }

    const header = lines[0].split(",")
    const currencyIndex = header.indexOf("CURRENCY")
    const obsValueIndex = header.indexOf("OBS_VALUE")

    if (currencyIndex < 0 || obsValueIndex < 0) {
      currentDate = getPreviousBusinessDay(currentDate)
      continue
    }

    const rates: any[] = []
    for (let j = 1; j < lines.length; j++) {
      const line = lines[j]
      if (!line) continue

      const columns = line.split(",")
      if (columns.length > Math.max(currencyIndex, obsValueIndex)) {
        const currency = columns[currencyIndex]
        const obsValue = columns[obsValueIndex]

        if (currency && obsValue && CURRENCY_NAMES[currency]) {
          const rate = Number.parseFloat(obsValue)
          if (!Number.isNaN(rate)) {
            rates.push({
              currency,
              name: CURRENCY_NAMES[currency],
              rate,
            })
          }
        }
      }
    }

    if (rates.length > 0) {
      return { rates, actualDate: currentDate }
    }

    currentDate = getPreviousBusinessDay(currentDate)
  }

  return { rates: [], actualDate: date }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

  try {
    const { rates: currentRates, actualDate } = await fetchRatesForDate(date)

    const previousDate = getPreviousBusinessDay(actualDate)
    const { rates: previousRates } = await fetchRatesForDate(previousDate)

    // Create map of previous rates
    const previousRatesMap = new Map(previousRates.map((r) => [r.currency, r.rate]))

    // Calculate change percentages
    const ratesWithChange = currentRates.map((rate) => {
      const prevRate = previousRatesMap.get(rate.currency)
      let change = 0
      if (prevRate) {
        change = ((rate.rate - prevRate) / prevRate) * 100
      }
      return { ...rate, change }
    })

    // Sort alphabetically by currency code
    ratesWithChange.sort((a, b) => a.currency.localeCompare(b.currency))

    return NextResponse.json({
      date,
      actualDate,
      rates: ratesWithChange,
      note: date !== actualDate ? `Dati no ${actualDate} (nedēļas nogale/svētku diena)` : null,
    })
  } catch (error) {
    console.error("[v0] Failed to fetch daily rates:", error)
    return NextResponse.json({ error: "Failed to fetch exchange rates", details: String(error) }, { status: 500 })
  }
}
