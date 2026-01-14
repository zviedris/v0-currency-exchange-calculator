export type Language = "lv" | "en"

export const translations = {
  lv: {
    // Header
    title: "Valūtas kursu kalkulators",
    subtitle: "Eiropas Centrālās bankas dati",

    // Tabs
    tabConverter: "Konvertors",
    tabRates: "Dienas kursi",
    tabChart: "Grafiks",

    // Info Section
    infoText:
      "Saskaņā ar Eiropas Parlamenta un Padomes 2013.gada 9.oktobra Regulas Nr.952/2013 (Savienības Muitas kodekss) 53.panta 1.punkta a) apakšpunktu, preces muitas vērtības noteikšanai tiek izmantots Eiropas Centrālās Bankas (ECB) valūtas maiņas kurss, kurš publicēts katra mēneša priekšpēdējā trešdienā un tiek izmantots visu nākamo mēnesi.",
    infoReferences: "Noderīgas atsauces:",
    referenceVID: "VID - Valūtas konvertācija",
    referenceECB: "ECB - Euro foreign exchange reference rates",
    referenceXE: "XE - Historical Rates Tables",

    // Converter
    converterTitle: "Valūtas konvertors",
    converterDescription: "Aprēķiniet valūtas maiņas kursu (vienmēr pret EUR)",
    converterMonthInfo: "Izmanto muitas kursu no {date} (izvēlētā mēneša priekšpēdējā trešdiena)",
    converterSelectMonth: "Mēnesis kuram aprēķināt kursu",
    converterFrom: "No valūtas",
    converterTo: "Uz valūtu",
    converterAmount: "Summa",
    converterResult: "Rezultāts",
    converterRate: "Kurss",
    converterSwap: "Samainīt virzienu",
    converterPlaceholder: "Ievadiet summu",

    // Exchange Rate Table
    tableTitle: "Mēneša valūtas kursi",
    tableDescription: "Apskatiet visus ECB valūtas kursus konkrētajam mēnesim (saskaņā ar SMK)",
    tableSelectMonth: "Izvēlieties mēnesi",
    tableMonthInfo: "Izmanto kursu no {date} (iepriekšējā mēneša priekšpēdējā trešdiena)",
    tableCurrency: "Valūta",
    tableName: "Nosaukums",
    tableRate: "Kurss (pret EUR)",
    tableChange: "Izmaiņas",
    tableNoData: "Nav pieejamu datu šim datumam",
    tableTotal: "Kopā: {count} valūtas",

    // Chart
    chartTitle: "Muitas valūtas kursa grafiks",
    chartDescription: "Apskatiet valūtas kursa izmaiņas pa mēnešiem (līdz 5 gadiem, saskaņā ar SMK)",
    chartCurrency: "Valūta",
    chartStartMonth: "Sākuma mēnesis",
    chartEndMonth: "Beigu mēnesis",
    chartShowButton: "Parādīt grafiku",
    chartLoading: "Ielādē...",
    chartEmpty: 'Izvēlieties parametrus un nospiediet "Parādīt grafiku"',
    chartRateLabel: "{currency}/EUR kurss",
    chartShowData: "Parādīt datu tabulu",
    chartHideData: "Slēpt datu tabulu",
    chartExportPDF: "Eksportēt PDF",
    chartPeriod: "Periods",
    chartDataCount: "{count} periodi",

    // Month Picker
    monthPickerPlaceholder: "Izvēlieties mēnesi",

    // Footer
    footerText: "Dati no Eiropas Centrālās bankas (ECB) | Atjaunināti reāllaikā",

    // Currency Names
    currencies: {
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
      ISK: "Īslandes Krona",
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
      EUR: "Eiro",
    },

    // Month Names
    months: {
      short: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jūn", "Jūl", "Aug", "Sep", "Okt", "Nov", "Dec"],
      full: [
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
      ],
    },
  },
  en: {
    // Header
    title: "Currency Exchange Calculator",
    subtitle: "European Central Bank Data",

    // Tabs
    tabConverter: "Converter",
    tabRates: "Daily Rates",
    tabChart: "Chart",

    // Info Section
    infoText:
      "In accordance with Article 53(1)(a) of Regulation (EU) No 952/2013 of the European Parliament and of the Council (Union Customs Code), the European Central Bank (ECB) exchange rate published on the penultimate Wednesday of each month is used for determining the customs value of goods and is applied throughout the following month.",
    infoReferences: "Useful References:",
    referenceVID: "VID - Currency Conversion",
    referenceECB: "ECB - Euro foreign exchange reference rates",
    referenceXE: "XE - Historical Rates Tables",

    // Converter
    converterTitle: "Currency Converter",
    converterDescription: "Calculate exchange rates (always against EUR)",
    converterMonthInfo: "Using customs rate from {date} (penultimate Wednesday of selected month)",
    converterSelectMonth: "Month for rate calculation",
    converterFrom: "From Currency",
    converterTo: "To Currency",
    converterAmount: "Amount",
    converterResult: "Result",
    converterRate: "Rate",
    converterSwap: "Swap direction",
    converterPlaceholder: "Enter amount",

    // Exchange Rate Table
    tableTitle: "Monthly Exchange Rates",
    tableDescription: "View all ECB exchange rates for the specific month (according to UCC)",
    tableSelectMonth: "Select month",
    tableMonthInfo: "Using rate from {date} (penultimate Wednesday of previous month)",
    tableCurrency: "Currency",
    tableName: "Name",
    tableRate: "Rate (vs EUR)",
    tableChange: "Change",
    tableNoData: "No data available for this date",
    tableTotal: "Total: {count} currencies",

    // Chart
    chartTitle: "Customs Exchange Rate Chart",
    chartDescription: "View exchange rate changes by month (up to 5 years, according to UCC)",
    chartCurrency: "Currency",
    chartStartMonth: "Start Month",
    chartEndMonth: "End Month",
    chartShowButton: "Show Chart",
    chartLoading: "Loading...",
    chartEmpty: 'Select parameters and press "Show Chart"',
    chartRateLabel: "{currency}/EUR rate",
    chartShowData: "Show data table",
    chartHideData: "Hide data table",
    chartExportPDF: "Export PDF",
    chartPeriod: "Period",
    chartDataCount: "{count} periods",

    // Month Picker
    monthPickerPlaceholder: "Select month",

    // Footer
    footerText: "Data from European Central Bank (ECB) | Updated in real-time",

    // Currency Names
    currencies: {
      USD: "US Dollar",
      JPY: "Japanese Yen",
      BGN: "Bulgarian Lev",
      CZK: "Czech Koruna",
      DKK: "Danish Krone",
      GBP: "British Pound Sterling",
      HUF: "Hungarian Forint",
      PLN: "Polish Zloty",
      RON: "Romanian Leu",
      SEK: "Swedish Krona",
      CHF: "Swiss Franc",
      ISK: "Icelandic Króna",
      NOK: "Norwegian Krone",
      TRY: "Turkish Lira",
      AUD: "Australian Dollar",
      BRL: "Brazilian Real",
      CAD: "Canadian Dollar",
      CNY: "Chinese Yuan",
      HKD: "Hong Kong Dollar",
      IDR: "Indonesian Rupiah",
      ILS: "Israeli Shekel",
      INR: "Indian Rupee",
      KRW: "South Korean Won",
      MXN: "Mexican Peso",
      MYR: "Malaysian Ringgit",
      NZD: "New Zealand Dollar",
      PHP: "Philippine Peso",
      SGD: "Singapore Dollar",
      THB: "Thai Baht",
      ZAR: "South African Rand",
      EUR: "Euro",
    },

    // Month Names
    months: {
      short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      full: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
  },
}

export type TranslationKeys = typeof translations.lv
