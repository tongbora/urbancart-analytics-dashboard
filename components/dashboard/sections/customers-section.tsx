import customers from "@/data/customers.json";
import { RatingLoyaltyChart, SegmentRevenueChart } from "../dashboard-charts";
import {
  DashboardCard,
  DataTable,
  SectionHeader,
  formatMoney,
  formatNumber,
  type SectionMeta,
} from "../shared";

export function CustomersSection({
  section,
  description,
  presentMode,
}: {
  section: SectionMeta;
  description: string;
  presentMode?: boolean;
}) {
  return (
    <>
      <SectionHeader section={section} description={description} />
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardCard title="Customer Segments" description="Customer count, revenue, and average customer value.">
          <DataTable
            headers={["Segment", "Customers", "Completed-Only Revenue", "Avg Revenue"]}
            rows={customers.segments.map((segment) => [
              segment.segment,
              formatNumber(segment.customers),
              formatMoney(segment.totalRevenue),
              formatMoney(segment.avgRevenue, false),
            ])}
          />
        </DashboardCard>
        <DashboardCard title="Revenue by Segment" description="Champions are smaller in count but high in value.">
          <SegmentRevenueChart data={customers.segments} presentMode={presentMode} />
        </DashboardCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardCard title="Top Customers" description="Top 10 customers by lifetime spend.">
          <DataTable
            headers={["Customer", "City", "Signup Date", "Lifetime Spend"]}
            rows={customers.top20Customers.slice(0, 10).map((customer) => [
              customer.name,
              customer.city,
              customer.signupDate,
              formatMoney(customer.lifetimeSpend, false),
            ])}
          />
        </DashboardCard>
        <DashboardCard title="Rating vs Loyalty" description={`Correlation with repeat purchasing is r=${customers.ratingVsLoyalty.correlation.toFixed(2)}.`}>
          <RatingLoyaltyChart data={customers.ratingVsLoyalty.byRating} presentMode={presentMode} />
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Star rating is not a strong loyalty proxy. Use RFM, order history, and completed-only spend for retention segmentation.
          </p>
        </DashboardCard>
      </div>
    </>
  );
}
