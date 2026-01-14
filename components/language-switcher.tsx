"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-muted-foreground" />
      <div className="flex rounded-lg border border-border overflow-hidden">
        <Button
          variant={language === "lv" ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage("lv")}
          className="rounded-none px-3 py-1 h-8 text-xs"
        >
          LV
        </Button>
        <Button
          variant={language === "en" ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage("en")}
          className="rounded-none px-3 py-1 h-8 text-xs"
        >
          EN
        </Button>
      </div>
    </div>
  )
}
