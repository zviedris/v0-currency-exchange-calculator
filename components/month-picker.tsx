"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"

interface MonthPickerProps {
  selectedYear: number
  selectedMonth: number
  onSelect: (year: number, month: number) => void
  minYear?: number
  maxYear?: number
  className?: string
  label?: string
}

export function MonthPicker({
  selectedYear,
  selectedMonth,
  onSelect,
  minYear,
  maxYear,
  className,
  label,
}: MonthPickerProps) {
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(selectedYear || new Date().getFullYear())

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const effectiveMinYear = minYear ?? currentYear - 5
  const effectiveMaxYear = maxYear ?? currentYear

  const handlePrevYear = () => {
    if (viewYear > effectiveMinYear) {
      setViewYear(viewYear - 1)
    }
  }

  const handleNextYear = () => {
    if (viewYear < effectiveMaxYear) {
      setViewYear(viewYear + 1)
    }
  }

  const handleSelectMonth = (month: number) => {
    onSelect(viewYear, month)
    setOpen(false)
  }

  const isMonthDisabled = (month: number) => {
    // Disable future months
    if (viewYear === currentYear && month > currentMonth) {
      return true
    }
    return false
  }

  const isMonthSelected = (month: number) => {
    return viewYear === selectedYear && month === selectedMonth
  }

  const { t, getMonthName } = useLanguage()

  const displayValue =
    selectedYear && selectedMonth ? `${getMonthName(selectedMonth - 1)} ${selectedYear}` : t.monthPickerPlaceholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedYear && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="p-3">
          {/* Year selector */}
          <div className="mb-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handlePrevYear}
              disabled={viewYear <= effectiveMinYear}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold">{viewYear}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleNextYear}
              disabled={viewYear >= effectiveMaxYear}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Month grid - 4x3 */}
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }, (_, i) => i).map((index) => {
              const month = index + 1
              const disabled = isMonthDisabled(month)
              const selected = isMonthSelected(month)

              return (
                <Button
                  key={month}
                  variant={selected ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-9 w-full text-sm",
                    selected && "bg-primary text-primary-foreground",
                    disabled && "cursor-not-allowed opacity-50",
                  )}
                  onClick={() => !disabled && handleSelectMonth(month)}
                  disabled={disabled}
                >
                  {getMonthName(index, true)}
                </Button>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
