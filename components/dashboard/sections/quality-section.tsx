import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  MapPin,
  UsersRound,
  XCircle,
} from "lucide-react";

import dataQuality from "@/data/data-quality.json";
import {
  DashboardCard,
  DataTable,
  MetricCard,
  SectionHeader,
  formatNumber,
  formatPercent,
  type SectionMeta,
} from "../shared";

export function QualitySection({
  section,
  description,
}: {
  section: SectionMeta;
  description: string;
}) {
  return (
    <>
      <SectionHeader section={section} description={description} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Missing Age" value={formatPercent(dataQuality.missingValues.ageMissingPct)} detail="Customer records without age" icon={AlertTriangle} tone="warn" />
        <MetricCard label="Missing City" value={formatPercent(dataQuality.missingValues.cityMissingPct)} detail="Regional targeting blind spot" icon={MapPin} tone="warn" />
        <MetricCard label="Missing Gender" value={formatPercent(dataQuality.missingValues.genderMissingPct)} detail="Avoid demographic targeting until resolved" icon={UsersRound} tone="warn" />
        <MetricCard label="Invalid Ratings" value={formatNumber(dataQuality.reviews.invalidRatings)} detail={`Excluded from ${formatNumber(dataQuality.reviews.totalReviews)} reviews`} icon={XCircle} tone="warn" />
        <MetricCard label="Duplicate Order Items" value={formatNumber(dataQuality.orderItemDuplicates.businessKeyCheck)} detail="Business-key duplicates removed before analysis" icon={ClipboardList} tone="warn" />
        <MetricCard label="Cleaned CRM Rows" value={formatNumber(dataQuality.legacyCrm.cleanedRows)} detail={`${formatNumber(dataQuality.legacyCrm.duplicatesRemoved)} legacy rows removed`} icon={CheckCircle2} tone="good" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DashboardCard title="SKU Reconciliation" description="Catalog joins need explicit reconciliation flags.">
          <DataTable
            headers={["SKU Group", "Count", "Interpretation"]}
            rows={[
              ["Shared SKUs", formatNumber(dataQuality.skuReconciliation.sharedSkus), "Usable for database-to-catalog joins"],
              ["Database-Only SKUs", formatNumber(dataQuality.skuReconciliation.databaseOnlySkus), "Present in transactions but absent from catalog"],
              ["Catalog-Only SKUs", formatNumber(dataQuality.skuReconciliation.catalogOnlySkus), "Present in catalog but absent from transactions"],
            ]}
          />
        </DashboardCard>

        <DashboardCard title="Trust Assessment" description="Whether this dataset is decision-ready.">
          <div className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              The dataset is trustworthy for directional analysis after cleaning: duplicate business-key order items were removed, invalid ratings are isolated, and CRM duplicate rows were cleaned.
            </p>
            <p>
              It is not safe to treat every raw field as production-grade. Revenue reporting must use completed-only revenue for earned performance, and SKU-based product analysis should disclose the {formatNumber(dataQuality.skuReconciliation.databaseOnlySkus + dataQuality.skuReconciliation.catalogOnlySkus)} unmatched SKUs.
            </p>
            <div className="rounded-lg border border-amber-400/25 bg-amber-400/10 p-4 text-amber-100">
              The all-column duplicate check reports {dataQuality.orderItemDuplicates.naiveAllColumnCheck}, but the business-key check finds {formatNumber(dataQuality.orderItemDuplicates.businessKeyCheck)} duplicates. Use the business rule, not the primary-key artifact.
            </div>
          </div>
        </DashboardCard>
      </div>
    </>
  );
}
