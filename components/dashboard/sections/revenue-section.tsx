import {
  CheckCircle2,
  DollarSign,
  Gauge,
  MinusCircle,
  ReceiptText,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import dataQuality from "@/data/data-quality.json";
import { OrderStatusChart, RevenueComparisonChart } from "../dashboard-charts";
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
  const revenue = dataQuality.revenueGrossVsCompleted;

  return (
    <>
      <SectionHeader section={section} description={description} />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Gross All-Status Revenue"
          value={formatMoney(revenue.gross)}
          detail="Total order activity across completed, cancelled, returned, and pending statuses."
          icon={DollarSign}
          tone="warn"
        />
        <MetricCard
          label="Completed-Only Revenue"
          value={formatMoney(revenue.completedOnly)}
          detail="Use this earned revenue definition for performance reporting."
          icon={CheckCircle2}
          tone="good"
        />
        <MetricCard
          label="Revenue Gap"
          value={formatMoney(revenue.gap)}
          detail="Not final earned revenue; this gap comes from non-completed statuses."
          icon={MinusCircle}
          tone="accent"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Completed Orders Mix" value={formatPercent(dataQuality.orderStatusMix.completed)} detail="Only completed orders count as final earned revenue" icon={CheckCircle2} tone="good" />
        <MetricCard label="Cancelled Orders Mix" value={formatPercent(dataQuality.orderStatusMix.cancelled)} detail="Exclude from earned revenue" icon={XCircle} tone="warn" />
        <MetricCard label="Returned Orders Mix" value={formatPercent(dataQuality.orderStatusMix.returned)} detail={`${formatNumber(dataQuality.orderItemDuplicates.returnRows)} return rows observed`} icon={ShieldAlert} tone="warn" />
        <MetricCard label="Pending Orders Mix" value={formatPercent(dataQuality.orderStatusMix.pending)} detail="Operational pipeline, not final revenue" icon={Gauge} tone="warn" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <DashboardCard title="Order Status Mix" description="Cancelled, returned, and pending orders are separated from completed activity.">
          <OrderStatusChart data={orderStatus} presentMode={presentMode} />
        </DashboardCard>
        <DashboardCard title="Gross All-Status vs Completed-Only Revenue" description={`Rounded presentation view; exact values are listed below. The gap is ${formatMoney(revenue.gap)} (${formatPercent(revenue.gapPct)} of gross).`}>
          <RevenueComparisonChart data={revenueComparison} presentMode={presentMode} />
        </DashboardCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardCard
          title="Exact Revenue Values"
          description="Precise figures are shown for auditability, but the KPI cards stay rounded for presentation."
        >
          <DataTable
            headers={["Revenue Definition", "Exact Value"]}
            rows={[
              ["Gross All-Status Revenue", "$12,968,797.33"],
              ["Completed-Only Revenue", "$7,569,487.97"],
              ["Revenue Gap", "$5,399,309.36"],
            ]}
          />
        </DashboardCard>
        <DashboardCard
          title="Revenue Definition Guidance"
          description="Use the right number for the right decision."
        >
          <div className="space-y-4 text-sm leading-6 text-muted-foreground">
            <div className="flex gap-3 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              <p>
                Completed-Only Revenue is the earned revenue baseline and should be used for performance reporting.
              </p>
            </div>
            <div className="flex gap-3 rounded-lg border border-amber-400/25 bg-amber-400/10 p-4">
              <ReceiptText className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <p>
                Gross All-Status Revenue should be used only for total order activity. It includes cancelled, returned, and pending orders, so it is not final earned revenue.
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>

      <div className="mt-4 rounded-lg border border-amber-400/25 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
        Cancelled, returned, and pending orders should not be treated as final earned revenue. Use Completed-Only Revenue for performance reporting; use Gross All-Status Revenue only when describing total order activity.
      </div>
    </>
  );
}
