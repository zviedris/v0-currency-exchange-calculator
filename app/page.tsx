"use client"
import { CurrencyConverter } from "@/components/currency-converter"
import { ExchangeRateTable } from "@/components/exchange-rate-table"
import { ExchangeRateChart } from "@/components/exchange-rate-chart"
import { Landmark, Info, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function Home() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-3 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Information Section */}
        <Alert className="mb-6 bg-primary/5 border-primary/20">
          <Info className="h-5 w-5 text-primary" />
          <AlertDescription className="mt-2 space-y-3">
            <div>
              <p className="text-sm text-foreground leading-relaxed">{t.infoText}</p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.infoReferences}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.vid.gov.lv/lv/valutas-konvertacija"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t.referenceVID}
                </a>
                <a
                  href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t.referenceECB}
                </a>
                <a
                  href="https://www.xe.com/currency-tables/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t.referenceXE}
                </a>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="converter" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="converter" className="text-sm md:text-base py-3">
              {t.tabConverter}
            </TabsTrigger>
            <TabsTrigger value="rates" className="text-sm md:text-base py-3">
              {t.tabRates}
            </TabsTrigger>
            <TabsTrigger value="chart" className="text-sm md:text-base py-3">
              {t.tabChart}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="converter" className="space-y-4">
            <CurrencyConverter />
          </TabsContent>

          <TabsContent value="rates" className="space-y-4">
            <ExchangeRateTable />
          </TabsContent>

          <TabsContent value="chart" className="space-y-4">
            <ExchangeRateChart />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>{t.footerText}</p>
        </footer>
      </div>
    </main>
  )
}
