// Utility funkcijas Savienības Muitas kodeksa valūtas kursu noteikšanai
// Kurss tiek publicēts katra mēneša priekšpēdējā trešdienā
// un izmantots visu nākamo mēnesi

/**
 * Atrod mēneša priekšpēdējo trešdienu
 * @param year Gads
 * @param month Mēnesis (1-12)
 * @returns Datums formātā YYYY-MM-DD
 */
export function getSecondToLastWednesday(year: number, month: number): string {
  // Iegūstam pēdējo mēneša dienu
  const lastDay = new Date(year, month, 0)
  const lastDayOfMonth = lastDay.getDate()

  const wednesdays: number[] = []

  // Atrodam visas trešdienas mēnesī (3 = trešdiena)
  for (let day = 1; day <= lastDayOfMonth; day++) {
    const date = new Date(year, month - 1, day)
    if (date.getDay() === 3) {
      wednesdays.push(day)
    }
  }

  // Atgriežam priekšpēdējo trešdienu (ja ir tikai 1, tad to)
  const targetDay = wednesdays.length >= 2 ? wednesdays[wednesdays.length - 2] : wednesdays[0]
  const targetDate = new Date(year, month - 1, targetDay)

  return targetDate.toISOString().split("T")[0]
}

/**
 * Atrod kursa datumu, kas attiecas uz doto mēnesi saskaņā ar muitas noteikumiem
 * Mēnesim X izmanto iepriekšējā mēneša (X-1) priekšpēdējo trešdienu
 * @param year Gads
 * @param month Mēnesis (1-12)
 * @returns Kursa datums formātā YYYY-MM-DD
 */
export function getCustomsRateDate(year: number, month: number): string {
  // Izmanto iepriekšējā mēneša priekšpēdējo trešdienu
  let prevMonth = month - 1
  let prevYear = year

  if (prevMonth === 0) {
    prevMonth = 12
    prevYear = year - 1
  }

  return getSecondToLastWednesday(prevYear, prevMonth)
}

/**
 * Atrod kursa datumu pašreizējam mēnesim
 * @returns Kursa datums formātā YYYY-MM-DD
 */
export function getCurrentCustomsRateDate(): string {
  const now = new Date()
  return getCustomsRateDate(now.getFullYear(), now.getMonth() + 1)
}

/**
 * Atrod kursa datumu konkrētam mēnesim
 * Alias funkcija priekš getCustomsRateDate
 * @param year Gads
 * @param month Mēnesis (1-12)
 * @returns Kursa datums formātā YYYY-MM-DD
 */
export function getCustomsRateDateForMonth(year: number, month: number): string {
  return getCustomsRateDate(year, month)
}

/**
 * Ģenerē mēnešu sarakstu attēlošanai (pēdējie 60 mēneši = 5 gadi)
 * @returns Masīvs ar mēnešu datiem
 */
export function getMonthsList(): Array<{ year: number; month: number; label: string; rateDate: string }> {
  const months: Array<{ year: number; month: number; label: string; rateDate: string }> = []
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const monthNames = [
    "Janvāris",
    "Februāris",
    "Marts",
    "Aprīlis",
    "Maijs",
    "Jūnijs",
    "Jūlijs",
    "Augusts",
    "Septembris",
    "Oktobris",
    "Novembris",
    "Decembris",
  ]

  // Sākam no pašreizējā mēneša un ejam 60 mēnešus atpakaļ
  for (let i = 0; i < 60; i++) {
    let month = currentMonth - i
    let year = currentYear

    while (month <= 0) {
      month += 12
      year -= 1
    }

    const rateDate = getCustomsRateDate(year, month)
    const label = `${monthNames[month - 1]} ${year}`

    months.push({ year, month, label, rateDate })
  }

  return months
}
