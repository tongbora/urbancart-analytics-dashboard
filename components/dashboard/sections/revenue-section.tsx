import { CheckCircle2, Gauge, ShieldAlert, XCircle } from "lucide-react";

import dataQuality from "@/data/data-quality.json";
import { OrderStatusChart, RevenueComparisonChart } from "../dashboard-charts";
import {
  DashboardCard,
  MetricCard,
  SectionHeader,
  formatMoney,
  formatNumber,
  formatPercent,
  type SectionMeta,
} from "../shared";

export function RevenueSection({
  section,
  description,
  orderStatus,
  revenueComparison,
  presentMode,
}: {
  section: SectionMeta;
  description: string;
  orderStatus: Array<{ name: string; value: number }>;
  revenueComparison: Array<{ name: string; value: number }>;
  presentMode?: boolean;
}) {
  return (
    <>
      <SectionHeader section={section} description={description} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Completed Orders Mix" value={formatPercent(dataQuality.orderStatusMix.completed)} detail="Only completed orders count as final earned revenue" icon={CheckCircle2} tone="good" />
        <MetricCard label="Cancelled Orders Mix" value={formatPercent(dataQuality.orderStatusMix.cancelled)} detail="Exclude from earned revenue" icon={XCircle} tone="warn" />
        <MetricCard label="Returned Orders Mix" value={formatPercent(dataQuality.orderStatusMix.returned)} detail={`${formatNumber(dataQuality.orderItemDuplicates.returnRows)} return rows observed`} icon={ShieldAlert} tone="warn" />
        <MetricCard label="Pending Orders Mix" value={formatPercent(dataQuality.orderStatusMix.pending)} detail="Operational pipeline, not final revenue" icon={Gauge} tone="warn" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <DashboardCard title="Order Status Mix" description="Cancelled, returned, and pending orders are separated from completed activity.">
          <OrderStatusChart data={orderStatus} presentMode={presentMode} />
        </DashboardCard>
        <DashboardCard title="Gross All-Status vs Completed-Only Revenue" description={`The gap is ${formatMoney(dataQuality.revenueGrossVsCompleted.gap)} (${formatPercent(dataQuality.revenueGrossVsCompleted.gapPct)} of gross).`}>
          <RevenueComparisonChart data={revenueComparison} presentMode={presentMode} />
        </DashboardCard>
      </div>

      <div className="mt-4 rounded-lg border border-amber-400/25 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
        Cancelled, returned, and pending orders should not be treated as final earned revenue. Use Completed-Only Revenue for performance reporting; use Gross All-Status Revenue only when describing total order activity.
      </div>
    </>
  );
}
