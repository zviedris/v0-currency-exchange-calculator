import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const currency = searchParams.get("currency") || "USD"
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  try {
    console.log("[v0] Fetching history for", currency, "from", startDate, "to", endDate)

    const url = `https://data-api.ecb.europa.eu/service/data/EXR/D.${currency}.EUR.SP00.A?startPeriod=${startDate}&endPeriod=${endDate}&format=csvdata`

    console.log("[v0] History URL:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "text/csv",
      },
    })

    if (!response.ok) {
      console.log("[v0] Response not OK:", response.status)
      throw new Error("Failed to fetch historical data")
    }

    const csvText = await response.text()
    console.log("[v0] Received CSV length:", csvText.length)

    const history = []

    const lines = csvText.trim().split("\n")

    if (lines.length < 2) {
      console.log("[v0] No data in CSV")
      return NextResponse.json({ currency, startDate, endDate, history: [] })
    }

    const header = lines[0].split(",")
    const timePeriodIndex = header.indexOf("TIME_PERIOD")
    const obsValueIndex = header.indexOf("OBS_VALUE")

    console.log("[v0] TIME_PERIOD index:", timePeriodIndex)
    console.log("[v0] OBS_VALUE index:", obsValueIndex)

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line) continue

      const columns = line.split(",")

      if (timePeriodIndex >= 0 && obsValueIndex >= 0 && columns.length > Math.max(timePeriodIndex, obsValueIndex)) {
        const dateValue = columns[timePeriodIndex]
        const obsValue = columns[obsValueIndex]

        if (dateValue && obsValue) {
          const rate = Number.parseFloat(obsValue)
          if (!Number.isNaN(rate)) {
            history.push({
              date: dateValue,
              rate,
            })
          }
        }
      }
    }

    console.log("[v0] Parsed history entries:", history.length)

    history.sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({
      currency,
      startDate,
      endDate,
      history,
    })
  } catch (error) {
    console.error("[v0] Failed to fetch historical data:", error)
    return NextResponse.json(
      { error: "Failed to fetch historical exchange rates", details: String(error) },
      { status: 500 },
    )
  }
}
