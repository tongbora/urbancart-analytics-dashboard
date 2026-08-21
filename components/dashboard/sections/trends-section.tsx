import { AlertTriangle, Gauge, ShieldCheck, TrendingUp } from "lucide-react";

import overview from "@/data/overview.json";
import trends from "@/data/trends.json";
import { ForecastChart, MonthlyRevenueChart } from "../dashboard-charts";
import {
  DashboardCard,
  MetricCard,
  SectionHeader,
  formatMoney,
  type SectionMeta,
} from "../shared";

export function TrendsSection({
  section,
  description,
  forecast,
  presentMode,
}: {
  section: SectionMeta;
  description: string;
  forecast: Array<{
    month: string;
    forecast: number;
    lower95: number;
    upper95: number;
    range: number;
  }>;
  presentMode?: boolean;
}) {
  return (
    <>
      <SectionHeader section={section} description={description} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Forecast Next Month" value={formatMoney(overview.forecastNextMonth, false)} detail="Point estimate, not a planning commitment" icon={TrendingUp} tone="accent" />
        <MetricCard label="Forecast Lower 95%" value={formatMoney(forecast[0].lower95, false)} detail="Lower planning bound" icon={ShieldCheck} tone="good" />
        <MetricCard label="Forecast Upper 95%" value={formatMoney(forecast[0].upper95, false)} detail="Upper planning bound" icon={AlertTriangle} tone="warn" />
        <MetricCard label="Regression R2" value={trends.regression.r2.toFixed(3)} detail={`${trends.regression.monthsFitted} months fitted`} icon={Gauge} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardCard title="Monthly Revenue and Rolling 3-Month Average" description="Completed-only monthly revenue with smoothed trend line.">
          <MonthlyRevenueChart data={trends.monthly} presentMode={presentMode} />
        </DashboardCard>
        <DashboardCard title="Forecast with 95% Range" description="The shaded band represents uncertainty around the forecast.">
          <ForecastChart data={forecast} presentMode={presentMode} />
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Treat the forecast as a range, not one exact number. For the next month, planning should use {formatMoney(forecast[0].lower95, false)} to {formatMoney(forecast[0].upper95, false)} rather than only {formatMoney(forecast[0].forecast, false)}.
          </p>
        </DashboardCard>
      </div>
    </>
  );
}
