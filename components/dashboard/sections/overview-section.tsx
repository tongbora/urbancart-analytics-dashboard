import {
  BadgeCheck,
  Boxes,
  CheckCircle2,
  DollarSign,
  PackageSearch,
  ShoppingBag,
  Star,
  UsersRound,
} from "lucide-react";

import customers from "@/data/customers.json";
import dataQuality from "@/data/data-quality.json";
import overview from "@/data/overview.json";
import {
  DashboardCard,
  DataTable,
  MetricCard,
  SectionHeader,
  formatMoney,
  formatNumber,
  formatPercent,
  type SectionMeta,
} from "../shared";

export function OverviewSection({
  section,
  description,
}: {
  section: SectionMeta;
  description: string;
}) {
  return (
    <>
      <SectionHeader section={section} description={description} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Customers" value={formatNumber(overview.scale.customers)} detail={`${formatNumber(customers.scoredCustomers)} scored; ${formatNumber(customers.neverOrderedCustomers)} never ordered`} icon={UsersRound} />
        <MetricCard label="Total Orders" value={formatNumber(overview.scale.orders)} detail={`${formatNumber(overview.scale.orderItems)} order items in source data`} icon={ShoppingBag} />
        <MetricCard label="Total Products" value={formatNumber(overview.scale.products)} detail={`${overview.scale.categories} categories, ${overview.scale.countries} countries`} icon={Boxes} />
        <MetricCard label="Total Reviews" value={formatNumber(overview.scale.reviews)} detail={`${formatNumber(dataQuality.reviews.invalidRatings)} invalid ratings excluded`} icon={Star} tone="warn" />
        <MetricCard label="Completed-Only Revenue" value={formatMoney(overview.revenue.completedOnly)} detail="Earned revenue baseline after order status filtering" icon={CheckCircle2} tone="good" />
        <MetricCard label="Gross All-Status Revenue" value={formatMoney(overview.revenue.grossAllStatus)} detail={`${formatPercent(overview.revenue.gapPct)} is not final earned revenue`} icon={DollarSign} tone="warn" />
        <MetricCard label="Top Category" value={overview.topCategory.name} detail={`${formatMoney(overview.topCategory.netMargin)} net margin, ${formatPercent(overview.topCategory.marginPct)} margin`} icon={PackageSearch} tone="accent" />
        <MetricCard label="Top Customer Segment" value={overview.topSegment.name} detail={`${formatMoney(overview.topSegment.avgMonetary, false)} average monetary value`} icon={BadgeCheck} tone="accent" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <DashboardCard title="Executive Summary" description="High-level interpretation of the cleaned static data.">
          <div className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              UrbanCart has {formatNumber(overview.scale.customers)} customers,
              {` ${formatNumber(overview.scale.orders)} orders, `}
              and {formatMoney(overview.revenue.completedOnly)} in completed-only revenue across the study window.
            </p>
            <p>
              The largest reporting risk is revenue definition: gross all-status revenue is
              {` ${formatMoney(overview.revenue.grossAllStatus)}, `}
              but {formatMoney(overview.revenue.gap)} sits in cancelled, returned, or pending order status.
            </p>
            <p>
              Books & Media leads margin performance, while Champions are the highest-value customer segment. The forecast fit is directionally strong with R2 {overview.regressionR2.toFixed(3)}, but planning should use the confidence range.
            </p>
          </div>
        </DashboardCard>

        <DashboardCard title="Operating Scope" description="Breadth of data available for analysis.">
          <DataTable
            headers={["Metric", "Value"]}
            rows={[
              ["Web Sessions", formatNumber(overview.scale.webSessions)],
              ["Cities", formatNumber(overview.scale.cities)],
              ["Countries", formatNumber(overview.scale.countries)],
              ["Categories", formatNumber(overview.scale.categories)],
              ["Next-Month Forecast", formatMoney(overview.forecastNextMonth, false)],
            ]}
          />
        </DashboardCard>
      </div>
    </>
  );
}
