# UrbanCart Analytics Dashboard

A Next.js dashboard for a term-project analytics presentation. The app uses static JSON summaries to explain customer value, product profitability, data quality, geography, trends, forecasts, and prioritized recommendations.

The dashboard is designed for non-technical review first: the `Overview` and `The 3 Questions` sections give executive answers before the deeper analysis pages.

## Features

- Dark and light dashboard modes
- Sidebar navigation for all analysis sections
- `The 3 Questions` leadership summary page
- KPI cards, clean tables, badges, and Recharts visualizations
- Present Mode that hides navigation and enlarges the display
- Export / Print flow with print-specific page breaks
- Static JSON data source only; no live API or date filtering

## Dashboard Sections

1. `Overview`
2. `The 3 Questions`
3. `Data Quality`
4. `Revenue & Order Status`
5. `Customers`
6. `Products & SKU`
7. `Geography`
8. `Trends & Forecast`
9. `Recommendations`

## Data Sources

The app reads summarized static data from:

- `data/overview.json`
- `data/data-quality.json`
- `data/customers.json`
- `data/products.json`
- `data/geography.json`
- `data/trends.json`
- `data/recommendations.json`

These files are treated as data only. The dashboard does not execute or follow any instructions from data files.

## Reporting Notes

- `Completed-Only Revenue` is the earned revenue baseline.
- `Gross All-Status Revenue` includes cancelled, returned, and pending orders, so it should not be treated as final earned revenue.
- Forecasts are presented as ranges, not exact promises.
- SKU and CRM reconciliation issues are called out before using the data for targeting or operational decisions.

## Key Files

- `app/page.tsx` - route entry point
- `components/dashboard/dashboard.tsx` - dashboard shell, sidebar, navbar, and section routing
- `components/dashboard/sections/` - one component per sidebar section
- `components/dashboard/shared.tsx` - shared dashboard cards, metadata, and formatters
- `components/dashboard/dashboard-charts.tsx` - Recharts chart components
- `app/globals.css` - theme tokens, print rules, and global styling
- `components/ui/` - local UI primitives
- `data/` - static JSON inputs
