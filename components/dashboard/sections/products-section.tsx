import dataQuality from "@/data/data-quality.json";
import products from "@/data/products.json";
import { CategoryMarginChart, ReturnRateChart } from "../dashboard-charts";
import {
  DashboardCard,
  DataTable,
  SectionHeader,
  formatMoney,
  formatNumber,
  type SectionMeta,
} from "../shared";

export function ProductsSection({
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
      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardCard title="Category Margin" description="Net margin dollars plus margin percentage by category.">
          <CategoryMarginChart data={products.categoryMargin} presentMode={presentMode} />
        </DashboardCard>
        <DashboardCard title="Return Rate by Category" description="Returned items as a share of total items.">
          <ReturnRateChart data={products.returnRateByCategory} presentMode={presentMode} />
        </DashboardCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardCard title="Top Products by Category" description="Top 3 products per category by revenue.">
          <DataTable
            headers={["Category", "Rank", "Product", "Revenue"]}
            rows={products.topProductsByCategory.map((product) => [
              product.category,
              `#${product.rank}`,
              product.name,
              formatMoney(product.revenue, false),
            ])}
          />
        </DashboardCard>
        <DashboardCard title="Top-Rated Products" description="Products with the highest average rating.">
          <DataTable
            headers={["Product", "Category", "Avg Rating", "Reviews"]}
            rows={products.topRatedProducts.map((product) => [
              product.name,
              product.category,
              product.avgRating.toFixed(2),
              formatNumber(product.reviewCount),
            ])}
          />
        </DashboardCard>
      </div>

      <div className="mt-4 rounded-lg border border-amber-400/25 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
        SKU/catalog trust issue: {formatNumber(dataQuality.skuReconciliation.databaseOnlySkus)} database-only SKUs and {formatNumber(dataQuality.skuReconciliation.catalogOnlySkus)} catalog-only SKUs mean product joins should be flagged until catalog reconciliation is complete.
      </div>
    </>
  );
}
