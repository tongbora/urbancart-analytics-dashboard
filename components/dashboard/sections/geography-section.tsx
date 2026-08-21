import geography from "@/data/geography.json";
import {
  CityRevenueChart,
  DeviceConversionChart,
  PaymentMethodChart,
} from "../dashboard-charts";
import {
  DashboardCard,
  DataTable,
  SectionHeader,
  formatMoney,
  formatNumber,
  type SectionMeta,
} from "../shared";

export function GeographySection({
  section,
  description,
  paymentByCountry,
  deviceByCountry,
  presentMode,
}: {
  section: SectionMeta;
  description: string;
  paymentByCountry: Array<{
    country: string;
    bank_transfer: number;
    credit_card: number;
    debit_card: number;
    gift_card: number;
    paypal: number;
  }>;
  deviceByCountry: Array<{ country: string; desktop: number; mobile: number; tablet: number }>;
  presentMode?: boolean;
}) {
  return (
    <>
      <SectionHeader section={section} description={description} />
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <DashboardCard title="Revenue by City" description="Top cities by completed-only revenue.">
          <CityRevenueChart data={geography.cityRevenue} presentMode={presentMode} />
        </DashboardCard>
        <DashboardCard title="Payment Method Mix by Country" description="Share of orders by payment method.">
          <PaymentMethodChart data={paymentByCountry} presentMode={presentMode} />
        </DashboardCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardCard title="Device Conversion by Country" description="Conversion rate by desktop, mobile, and tablet.">
          <DeviceConversionChart data={deviceByCountry} presentMode={presentMode} />
        </DashboardCard>
        <DashboardCard title="City Detail" description="Revenue per customer helps separate scale from quality.">
          <DataTable
            headers={["City", "Completed-Only Revenue", "Active Customers", "Revenue / Customer"]}
            rows={geography.cityRevenue.slice(0, 8).map((city) => [
              city.city,
              formatMoney(city.netRevenue),
              formatNumber(city.activeCustomers),
              formatMoney(city.revenuePerCustomer, false),
            ])}
          />
        </DashboardCard>
      </div>
    </>
  );
}
