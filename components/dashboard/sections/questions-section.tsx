import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import customers from "@/data/customers.json";
import dataQuality from "@/data/data-quality.json";
import products from "@/data/products.json";
import trends from "@/data/trends.json";
import {
  LeadershipStat,
  SectionHeader,
  formatMoney,
  formatNumber,
  formatPercent,
  type SectionId,
  type SectionMeta,
} from "../shared";

export function QuestionsSection({
  section,
  description,
  onNavigate,
}: {
  section: SectionMeta;
  description: string;
  onNavigate: (sectionId: SectionId) => void;
}) {
  const champions =
    customers.segments.find((segment) => segment.segment === "Champions") ??
    customers.segments[0];
  const coreSteady =
    customers.segments.find((segment) => segment.segment === "Core/Steady") ??
    customers.segments[0];
  const booksMedia =
    products.categoryMargin.find((category) => category.category === "Books & Media") ??
    products.categoryMargin[0];
  const electronics =
    products.categoryMargin.find((category) => category.category === "Electronics") ??
    products.categoryMargin[0];
  const nextForecast = trends.forecast[0];

  return (
    <>
      <SectionHeader section={section} description={description} />
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>
              Who are our most valuable customers, and what drives loyalty or churn?
            </CardTitle>
            <Badge className="mt-2 border-sky-400/20 bg-sky-400/10 text-sky-300">
              Champions drive outsized value; star rating does not predict loyalty
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="max-w-5xl text-sm leading-6 text-muted-foreground">
              The most valuable customers are Champions: they spend far more per customer than the steady core audience. Loyalty should be judged by buying behavior, not review stars, because rating barely moves with repeat ordering. Retention work should prioritize Champions and high-value at-risk customers instead of treating every satisfied reviewer as loyal.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <LeadershipStat
                value={formatMoney(champions.avgRevenue, false)}
                label="Champions avg revenue / customer"
              />
              <LeadershipStat
                value={formatMoney(coreSteady.avgRevenue, false)}
                label="Core/Steady avg revenue / customer"
              />
              <LeadershipStat
                value={`r = ${customers.ratingVsLoyalty.correlation.toFixed(2)}`}
                label="Rating-to-loyalty correlation"
              />
            </div>
            <div className="mt-4">
              <Button type="button" variant="outline" onClick={() => onNavigate("customers")}>
                See full analysis →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Which products and categories are actually profitable after returns, discounts,
              and costs?
            </CardTitle>
            <Badge className="mt-2 border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              Yes, but margin ranking is not the same as revenue ranking
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="max-w-5xl text-sm leading-6 text-muted-foreground">
              Books & Media is the strongest category after returns, discounts, and costs. Electronics still contributes profit, but its margin is much thinner, so it should not be managed like the highest-margin categories. The forecast is useful for planning, but leadership should treat it as a range rather than one promised number.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <LeadershipStat
                value={formatPercent(booksMedia.marginPct)}
                label="Books & Media margin"
              />
              <LeadershipStat
                value={formatPercent(electronics.marginPct)}
                label="Electronics margin"
              />
              <LeadershipStat
                value={formatMoney(nextForecast.forecast, false)}
                label={`${formatMoney(nextForecast.lower95, false)}–${formatMoney(nextForecast.upper95, false)} next-month range`}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => onNavigate("products")}>
                See full analysis →
              </Button>
              <Button type="button" variant="ghost" onClick={() => onNavigate("trends")}>
                See forecast detail →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Is the marketing/signup data trustworthy enough for business decisions?
            </CardTitle>
            <Badge className="mt-2 border-amber-400/25 bg-amber-400/10 text-amber-300">
              Not yet — reconciliation needed first
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="max-w-5xl text-sm leading-6 text-muted-foreground">
              The cleaned data is good enough for directional learning, but not yet strong enough for final targeting or revenue reporting without safeguards. The raw checks can be misleading: one duplicate method says there are none, while the business-key check finds real duplicates. Revenue also changes materially depending on whether pending, returned, and cancelled orders are included, so definitions must be fixed before leaders use the numbers operationally.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <LeadershipStat
                value={`${dataQuality.orderItemDuplicates.naiveAllColumnCheck} → ${formatNumber(dataQuality.orderItemDuplicates.businessKeyCheck)}`}
                label="Duplicate order-item count after corrected check"
              />
              <LeadershipStat
                value={formatPercent(dataQuality.revenueGrossVsCompleted.gapPct)}
                label="Gross vs completed-only revenue gap"
              />
            </div>
            <div className="mt-4">
              <Button type="button" variant="outline" onClick={() => onNavigate("quality")}>
                See full analysis →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
