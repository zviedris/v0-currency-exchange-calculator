import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const from = searchParams.get("from") || "EUR"
  const to = searchParams.get("to") || "USD"
  const amount = Number.parseFloat(searchParams.get("amount") || "1")
  const date = searchParams.get("date")

  try {
    console.log("[v0] Converting from", from, "to", to, "amount", amount, "date", date)

    const buildUrl = (currency: string) => {
      const baseUrl = `https://data-api.ecb.europa.eu/service/data/EXR/D.${currency}.EUR.SP00.A`
      if (date) {
        return `${baseUrl}?startPeriod=${date}&endPeriod=${date}&format=csvdata`
      }
      return `${baseUrl}?lastNObservations=1&format=csvdata`
    }

    let finalRate = 1
    let result = amount

    if (from === "EUR" && to === "EUR") {
      finalRate = 1
      result = amount
    } else if (from === "EUR" && to !== "EUR") {
      const url = buildUrl(to)
      const response = await fetch(url, { headers: { Accept: "text/csv" } })

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate for " + to)
      }

      const csvText = await response.text()
      const lines = csvText.trim().split("\n")

      if (lines.length > 1) {
        const header = lines[0].split(",")
        const obsValueIndex = header.indexOf("OBS_VALUE")
        const columns = lines[1].split(",")

        if (obsValueIndex >= 0 && columns.length > obsValueIndex) {
          finalRate = Number.parseFloat(columns[obsValueIndex])
          result = amount * finalRate
        }
      }
    } else if (from !== "EUR" && to === "EUR") {
      const url = buildUrl(from)
      const response = await fetch(url, { headers: { Accept: "text/csv" } })

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate for " + from)
      }

      const csvText = await response.text()
      const lines = csvText.trim().split("\n")

      if (lines.length > 1) {
        const header = lines[0].split(",")
        const obsValueIndex = header.indexOf("OBS_VALUE")
        const columns = lines[1].split(",")

        if (obsValueIndex >= 0 && columns.length > obsValueIndex) {
          const rate = Number.parseFloat(columns[obsValueIndex])
          finalRate = 1 / rate
          result = amount * finalRate
        }
      }
    } else {
      const fromUrl = buildUrl(from)
      const toUrl = buildUrl(to)

      const [fromResponse, toResponse] = await Promise.all([
        fetch(fromUrl, { headers: { Accept: "text/csv" } }),
        fetch(toUrl, { headers: { Accept: "text/csv" } }),
      ])

      if (!fromResponse.ok || !toResponse.ok) {
        throw new Error("Failed to fetch exchange rates")
      }

      const fromCsv = await fromResponse.text()
      const toCsv = await toResponse.text()

      const fromLines = fromCsv.trim().split("\n")
      const toLines = toCsv.trim().split("\n")

      if (fromLines.length > 1 && toLines.length > 1) {
        const fromHeader = fromLines[0].split(",")
        const toHeader = toLines[0].split(",")
        const fromObsIndex = fromHeader.indexOf("OBS_VALUE")
        const toObsIndex = toHeader.indexOf("OBS_VALUE")

        const fromColumns = fromLines[1].split(",")
        const toColumns = toLines[1].split(",")

        if (
          fromObsIndex >= 0 &&
          toObsIndex >= 0 &&
          fromColumns.length > fromObsIndex &&
          toColumns.length > toObsIndex
        ) {
          const fromRate = Number.parseFloat(fromColumns[fromObsIndex])
          const toRate = Number.parseFloat(toColumns[toObsIndex])

          finalRate = toRate / fromRate
          result = amount * finalRate
        }
      }
    }

    console.log("[v0] Conversion result:", result, "rate:", finalRate)

    return NextResponse.json({
      from,
      to,
      amount,
      rate: finalRate,
      result,
      date,
    })
  } catch (error) {
    console.error("[v0] Exchange rate conversion error:", error)
    return NextResponse.json({ error: "Failed to convert currency", details: String(error) }, { status: 500 })
  }
}
