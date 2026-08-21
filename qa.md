# Presentation Q&A Prep

## Project Purpose

### 1. What problem is this dashboard trying to solve?

It answers three leadership questions: who the most valuable customers are, which products are profitable after returns and costs, and whether the marketing/signup data is trustworthy enough for decisions.

### 2. Why did you add "The 3 Questions" section?

It gives non-technical viewers the main answers first. A manager can read only that section and still understand the project's key findings.

### 3. Why is this not a normal marketing landing page?

The goal is analysis, not promotion. The first screen is the actual dashboard so users can immediately see business metrics and findings.

## Data

### 4. Where does the data come from?

The dashboard uses static JSON files in the `data/` folder: overview, data quality, customers, products, geography, trends, and recommendations.

### 5. Did you use a database or API?

No. The project uses static JSON summaries only, which is appropriate for a term-project presentation and keeps the dashboard reproducible.

### 6. Why did you say the JSON files are "data only"?

Because data files should not control application behavior. The app reads values from JSON but ignores any instructions that might appear inside those files.

### 7. What is the date range of the dataset?

The snapshot covers January 2, 2022 to December 31, 2024.

### 8. Why is there no date filter?

The dataset is a fixed static snapshot, not live data. A date filter would suggest the dashboard can update dynamically, which would be misleading.

## Revenue

### 9. What is the difference between Gross All-Status Revenue and Completed-Only Revenue?

Gross All-Status Revenue includes all order statuses: completed, cancelled, returned, and pending. Completed-Only Revenue includes only completed orders and should be used as earned revenue.

### 10. Which revenue number should leadership use for performance reporting?

Completed-Only Revenue: $7,569,487.97, rounded to $7.6M on the dashboard.

### 11. Why should gross all-status revenue not be treated as final earned revenue?

Because it includes cancelled, returned, and pending orders. Those are total order activity, not final revenue earned by the business.

### 12. What is the revenue gap?

The gap between gross all-status revenue and completed-only revenue is $5,399,309.36, rounded to $5.4M. That is 41.6% of gross revenue.

### 13. Why show rounded and exact revenue numbers?

Rounded values are easier to read in a presentation. Exact values are still available for auditability and detailed review.

## Customers

### 14. Who are the most valuable customers?

The Champions segment is most valuable. Champions average $10,613 per customer, compared with $4,818 for Core/Steady customers.

### 15. Does star rating predict loyalty?

No. The rating-to-loyalty correlation is about r = 0.03, which is very weak.

### 16. What should the company use instead of star ratings to understand loyalty?

It should use buying behavior, such as order history, repeat purchases, and completed-only spend.

### 17. What customer action would you recommend?

Prioritize retention for Champions and At-Risk High Value customers because they represent a smaller group but a large share of customer value.

## Products

### 18. Which category is most profitable?

Books & Media has the strongest margin at 78.0%.

### 19. Why is margin ranking different from revenue ranking?

A category can generate high revenue but still have lower profit after discounts, returns, and costs. Profitability depends on margin, not revenue alone.

### 20. How does Electronics compare with Books & Media?

Electronics has a 52.6% margin, while Books & Media has a 78.0% margin. Electronics is still profitable, but less efficient.

### 21. What is the SKU/catalog trust issue?

Some SKUs do not match between the transaction database and catalog. There are database-only SKUs and catalog-only SKUs, so product joins need reconciliation.

## Data Quality

### 22. Is the data trustworthy?

It is trustworthy for directional analysis after cleaning, but not fully trustworthy for final operational decisions until reconciliation issues are fixed.

### 23. What was the duplicate issue?

The naive all-column duplicate check found 0 duplicates, but the business-key check found 186 duplicate order items.

### 24. Why is the all-column duplicate check misleading?

Because it includes a unique primary key, so every row looks unique even when the business fields are duplicated.

### 25. What data quality problems did you identify?

Missing age, missing city, missing gender, invalid ratings, duplicate order items, legacy CRM duplicates, and SKU reconciliation gaps.

### 26. What should be fixed first?

Revenue definitions and data reconciliation should be fixed first because they directly affect business reporting and decision-making.

## Forecast

### 27. What is the next-month forecast?

The point forecast is $547,844.12, rounded to $547,844.

### 28. Why do you show a forecast range?

Forecasts are uncertain. The 95% range is $428,163 to $667,525, so leadership should plan using a range instead of one exact number.

### 29. What does regression R2 mean here?

R2 shows how well the trend model fits the historical monthly revenue. Here it is about 0.779, which suggests a useful directional trend but not perfect prediction.

## Dashboard Design

### 30. Why did you use a dark dashboard style?

It matches the shadcn dashboard reference and gives the project a professional analytics look.

### 31. Why also add light mode?

Light mode makes the dashboard easier to view in bright rooms, classrooms, or printed contexts.

### 32. Why did you use cards?

Cards group related metrics and make the dashboard easier to scan during a presentation.

### 33. Why did you use Recharts?

Recharts works well with React and is enough for clear bar, line, pie, and forecast visualizations.

### 34. Why did you use lucide-react icons?

Lucide icons are clean, consistent, and already fit shadcn/ui dashboard patterns.

### 35. Why did you build section components?

Each sidebar section has its own component, which makes the code easier to read, maintain, and extend.

## Technical

### 36. What framework did you use?

Next.js with TypeScript, Tailwind CSS, local shadcn/ui-style components, Recharts, and lucide-react.

### 37. Why TypeScript?

TypeScript helps catch mistakes early, especially when working with structured JSON data and component props.

### 38. What files are most important?

`app/page.tsx` is the route entry, `components/dashboard/dashboard.tsx` is the dashboard shell, `components/dashboard/sections/` contains each page section, and `components/dashboard/dashboard-charts.tsx` contains charts.

### 39. How does sidebar navigation work?

The dashboard stores the active section in React state and updates the URL hash, such as `#customers` or `#trends`.

### 40. What does Present Mode do?

It hides the sidebar and navbar, increases the visual scale, and shows a small Exit Present Mode control.

### 41. What does Export / Print do?

It calls `window.print()` and uses print CSS to hide navigation and print each dashboard section on its own page.

### 42. How did you test the project?

I ran ESLint and TypeScript checks using `npm run lint` and `npx tsc --noEmit`.

## Critical Thinking

### 43. What is the most important insight from the project?

The business must separate completed-only revenue from gross all-status revenue. Otherwise, performance reporting can overstate earned revenue by 41.6% of gross.

### 44. What is the biggest business risk?

The biggest risk is making decisions from unreconciled or poorly defined data, especially revenue status and SKU/catalog mismatches.

### 45. If you had more time, what would you improve?

I would connect the dashboard to a real database, add automated data validation tests, and build a data refresh pipeline.

### 46. What should leadership do next?

Fix revenue reporting definitions, reconcile SKU and CRM data, and launch retention campaigns for high-value customer segments.

### 47. What is one limitation of your project?

The dashboard uses static summary JSON, so it is not a live operational dashboard.

### 48. Why is that limitation acceptable?

For a term project, a static reproducible snapshot is enough to demonstrate analysis, design, and business recommendations.

### 49. What makes your dashboard useful for non-technical people?

It gives plain-English verdicts, rounded presentation metrics, clear definitions, and links from summary answers to deeper analysis.

### 50. What is your final conclusion?

UrbanCart has valuable customer and product opportunities, but leadership must fix revenue definitions and data reconciliation before using the data for final operational decisions.
