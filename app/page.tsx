"use client";

import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Database,
  DollarSign,
  Gauge,
  Globe2,
  LineChart,
  MapPin,
  Menu,
  Moon,
  PackageSearch,
  Presentation,
  Printer,
  ReceiptText,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  UsersRound,
  XCircle,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  CategoryMarginChart,
  CityRevenueChart,
  DeviceConversionChart,
  ForecastChart,
  MonthlyRevenueChart,
  OrderStatusChart,
  PaymentMethodChart,
  RatingLoyaltyChart,
  ReturnRateChart,
  RevenueComparisonChart,
  SegmentRevenueChart,
} from "./dashboard-charts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import customers from "@/data/customers.json";
import dataQuality from "@/data/data-quality.json";
import geography from "@/data/geography.json";
import overview from "@/data/overview.json";
import products from "@/data/products.json";
import recommendations from "@/data/recommendations.json";
import trends from "@/data/trends.json";

type SectionId =
  | "overview"
  | "questions"
  | "quality"
  | "revenue"
  | "customers"
  | "products"
  | "geography"
  | "trends"
  | "recommendations";

const sections: Array<{
  id: SectionId;
  label: string;
  eyebrow: string;
  icon: LucideIcon;
}> = [
  { id: "overview", label: "Overview", eyebrow: "Executive", icon: BarChart3 },
  {
    id: "questions",
    label: "The 3 Questions",
    eyebrow: "Leadership Answers",
    icon: BadgeCheck,
  },
  { id: "quality", label: "Data Quality", eyebrow: "Trust", icon: ShieldCheck },
  {
    id: "revenue",
    label: "Revenue & Order Status",
    eyebrow: "Revenue",
    icon: ReceiptText,
  },
  { id: "customers", label: "Customers", eyebrow: "CRM", icon: UsersRound },
  { id: "products", label: "Products & SKU", eyebrow: "Catalog", icon: PackageSearch },
  { id: "geography", label: "Geography", eyebrow: "Markets", icon: Globe2 },
  { id: "trends", label: "Trends & Forecast", eyebrow: "Planning", icon: LineChart },
  { id: "recommendations", label: "Recommendations", eyebrow: "Actions", icon: Sparkles },
];

const integer = new Intl.NumberFormat("en-US");
const money = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

function formatMoney(value: number, compact = true) {
  if (compact && Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }

  if (compact && Math.abs(value) >= 100_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }

  return money.format(value);
}

function formatNumber(value: number) {
  return integer.format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function titleCase(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function nextMonthLabel(monthIndex: number) {
  const base = new Date(Date.UTC(2022, 0, 1));
  base.setUTCMonth(base.getUTCMonth() + monthIndex);
  return base.toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  });
}

function DashboardCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  detail?: string;
  icon: LucideIcon;
  tone?: "default" | "good" | "warn" | "accent";
}) {
  const tones = {
    default: "text-muted-foreground bg-muted/50",
    good: "text-emerald-300 bg-emerald-400/10",
    warn: "text-amber-300 bg-amber-400/10",
    accent: "text-sky-300 bg-sky-400/10",
  };

  return (
    <Card className="min-h-[132px]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-normal text-foreground">
              {value}
            </p>
          </div>
          <div className={`rounded-md p-2 ${tones[tone]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        {detail ? (
          <p className="mt-3 text-sm leading-5 text-muted-foreground">{detail}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function SectionHeader({
  section,
  description,
}: {
  section: (typeof sections)[number];
  description: string;
}) {
  const Icon = section.icon;

  return (
    <div className="mb-4 flex flex-col gap-3 border-b pb-4 md:flex-row md:items-end md:justify-between">
      <div>
        <Badge variant="outline" className="border-border bg-muted/40 text-muted-foreground">
          {section.eyebrow}
        </Badge>
        <h1 className="mt-2 flex items-center gap-3 text-2xl font-semibold tracking-normal text-foreground md:text-3xl">
          <Icon className="h-6 w-6 text-primary" />
          {section.label}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: Array<Array<ReactNode>>;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function LeadershipStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <p className="text-2xl font-semibold tracking-normal text-foreground">{value}</p>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">{label}</p>
    </div>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [presentMode, setPresentMode] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const activeMeta = sections.find((section) => section.id === activeSection) ?? sections[0];
  const isLightMode = theme === "light";

  useEffect(() => {
    function syncFromHash() {
      const hash = window.location.hash.replace("#", "");
      const matched = sections.find((section) => section.id === hash);
      if (matched) setActiveSection(matched.id);
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function selectSection(sectionId: SectionId) {
    setActiveSection(sectionId);
    window.history.replaceState(null, "", `#${sectionId}`);
  }

  function printDashboard() {
    window.print();
  }

  const chartData = useMemo(() => {
    const orderStatus = Object.entries(dataQuality.orderStatusMix).map(([name, value]) => ({
      name: titleCase(name),
      value,
    }));

    const revenueComparison = [
      {
        name: "Gross All-Status Revenue",
        value: dataQuality.revenueGrossVsCompleted.gross,
      },
      {
        name: "Completed-Only Revenue",
        value: dataQuality.revenueGrossVsCompleted.completedOnly,
      },
    ];

    const forecast = trends.forecast.map((item) => ({
      ...item,
      month: nextMonthLabel(item.monthIndex),
      range: item.upper95 - item.lower95,
    }));

    const paymentByCountry = geography.paymentMixByCountry.reduce<
      Array<{
        country: string;
        bank_transfer: number;
        credit_card: number;
        debit_card: number;
        gift_card: number;
        paypal: number;
      }>
    >((rows, item) => {
      let row = rows.find((entry) => entry.country === item.country);
      if (!row) {
        row = {
          country: item.country,
          bank_transfer: 0,
          credit_card: 0,
          debit_card: 0,
          gift_card: 0,
          paypal: 0,
        };
        rows.push(row);
      }
      row[item.paymentMethod as keyof Omit<typeof row, "country">] = item.sharePct;
      return rows;
    }, []);

    const deviceByCountry = geography.deviceCountryConversion.reduce<
      Array<{ country: string; desktop: number; mobile: number; tablet: number }>
    >((rows, item) => {
      let row = rows.find((entry) => entry.country === item.country);
      if (!row) {
        row = { country: item.country, desktop: 0, mobile: 0, tablet: 0 };
        rows.push(row);
      }
      row[item.device as keyof Omit<typeof row, "country">] = item.conversionRate;
      return rows;
    }, []);

    return {
      deviceByCountry,
      forecast,
      orderStatus,
      paymentByCountry,
      revenueComparison,
    };
  }, []);

  const sectionDescriptions: Record<SectionId, string> = {
    overview:
      "A first-pass executive view across scale, revenue definition, category strength, and customer segment concentration.",
    questions:
      "Plain-English answers to the three leadership questions this project was built to resolve.",
    quality:
      "Data issues are visible but bounded; the main analytical risk is mixing all order statuses with completed-only revenue.",
    revenue:
      "Cancelled, returned, and pending orders are operational activity, not final earned revenue.",
    customers:
      "Customer value is concentrated in Champions and steady repeat buyers; star rating does not explain loyalty behavior.",
    products:
      "Category economics look usable, while SKU reconciliation gaps mean product joins need care.",
    geography:
      "City and country views are directionally useful, with a small unknown-city population to resolve.",
    trends:
      "Revenue has a clear upward trend, but the forecast should guide planning as a confidence range.",
    recommendations:
      "Prioritized next steps combine data trust fixes, customer retention work, and planning discipline.",
  };

  return (
    <main
      className={`min-h-screen bg-background text-foreground ${
        isLightMode ? "theme-light" : "theme-dark"
      } ${
        presentMode ? "present-mode text-[1.08rem]" : ""
      }`}
    >
      {presentMode ? (
        <Button
          type="button"
          className="present-mode-exit fixed right-4 top-4 z-50 shadow-lg"
          onClick={() => setPresentMode(false)}
        >
          <X className="h-4 w-4" />
          Exit Present Mode
        </Button>
      ) : null}

      <div
        className={`grid min-h-screen ${
          presentMode ? "md:grid-cols-1" : "md:grid-cols-[260px_minmax(0,1fr)]"
        }`}
      >
        <aside
          className={`border-b bg-sidebar md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r ${
            presentMode ? "hidden" : ""
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-sidebar-foreground">
                    UrbanCart Analytics
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {overview.dateRange.start} to {overview.dateRange.end}
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex gap-1.5 overflow-x-auto p-2 md:flex-1 md:flex-col md:overflow-x-visible">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <Button
                    key={section.id}
                    type="button"
                    variant="ghost"
                    className={`h-9 shrink-0 justify-start px-2.5 ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => selectSection(section.id)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="min-w-0 whitespace-nowrap text-sm">
                      {section.label}
                    </span>
                  </Button>
                );
              })}
            </nav>

            <div className="hidden border-t p-3 text-xs leading-5 text-muted-foreground md:block">
              Revenue is labeled by definition throughout: completed-only figures
              are the earned baseline.
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header
            className={`dashboard-navbar sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/90 px-3 backdrop-blur md:px-4 ${
              presentMode ? "hidden" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Menu className="h-4 w-4 text-muted-foreground md:hidden" />
              <div>
                <p className="text-sm font-medium text-foreground">{activeMeta.label}</p>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  Static JSON analytics dashboard
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge className="hidden border-emerald-400/20 bg-emerald-400/10 text-emerald-200 sm:inline-flex">
                Static snapshot · 2022–2024
              </Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-pressed={isLightMode}
                onClick={() => setTheme(isLightMode ? "dark" : "light")}
              >
                {isLightMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="hidden sm:inline">
                  {isLightMode ? "Dark Mode" : "Light Mode"}
                </span>
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={printDashboard}>
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Export / Print</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setPresentMode(true)}
              >
                <Presentation className="h-4 w-4" />
                <span className="hidden sm:inline">Present Mode</span>
              </Button>
            </div>
          </header>

          <div
            className={`screen-dashboard w-full ${
              presentMode ? "p-5 md:p-7" : "p-3 md:p-4"
            }`}
          >
            {activeSection === "overview" ? (
              <OverviewSection section={activeMeta} description={sectionDescriptions.overview} />
            ) : null}
            {activeSection === "questions" ? (
              <QuestionsSection
                section={activeMeta}
                description={sectionDescriptions.questions}
                onNavigate={selectSection}
              />
            ) : null}
            {activeSection === "quality" ? (
              <QualitySection section={activeMeta} description={sectionDescriptions.quality} />
            ) : null}
            {activeSection === "revenue" ? (
              <RevenueSection
                section={activeMeta}
                description={sectionDescriptions.revenue}
                orderStatus={chartData.orderStatus}
                revenueComparison={chartData.revenueComparison}
                presentMode={presentMode}
              />
            ) : null}
            {activeSection === "customers" ? (
              <CustomersSection
                section={activeMeta}
                description={sectionDescriptions.customers}
                presentMode={presentMode}
              />
            ) : null}
            {activeSection === "products" ? (
              <ProductsSection
                section={activeMeta}
                description={sectionDescriptions.products}
                presentMode={presentMode}
              />
            ) : null}
            {activeSection === "geography" ? (
              <GeographySection
                section={activeMeta}
                description={sectionDescriptions.geography}
                paymentByCountry={chartData.paymentByCountry}
                deviceByCountry={chartData.deviceByCountry}
                presentMode={presentMode}
              />
            ) : null}
            {activeSection === "trends" ? (
              <TrendsSection
                section={activeMeta}
                description={sectionDescriptions.trends}
                forecast={chartData.forecast}
                presentMode={presentMode}
              />
            ) : null}
            {activeSection === "recommendations" ? (
              <RecommendationsSection
                section={activeMeta}
                description={sectionDescriptions.recommendations}
              />
            ) : null}
          </div>

          <div className="print-dashboard">
            <div className="print-page">
              <OverviewSection section={sections[0]} description={sectionDescriptions.overview} />
            </div>
            <div className="print-page">
              <QuestionsSection
                section={sections[1]}
                description={sectionDescriptions.questions}
                onNavigate={() => undefined}
              />
            </div>
            <div className="print-page">
              <QualitySection section={sections[2]} description={sectionDescriptions.quality} />
            </div>
            <div className="print-page">
              <RevenueSection
                section={sections[3]}
                description={sectionDescriptions.revenue}
                orderStatus={chartData.orderStatus}
                revenueComparison={chartData.revenueComparison}
              />
            </div>
            <div className="print-page">
              <CustomersSection
                section={sections[4]}
                description={sectionDescriptions.customers}
              />
            </div>
            <div className="print-page">
              <ProductsSection
                section={sections[5]}
                description={sectionDescriptions.products}
              />
            </div>
            <div className="print-page">
              <GeographySection
                section={sections[6]}
                description={sectionDescriptions.geography}
                paymentByCountry={chartData.paymentByCountry}
                deviceByCountry={chartData.deviceByCountry}
              />
            </div>
            <div className="print-page">
              <TrendsSection
                section={sections[7]}
                description={sectionDescriptions.trends}
                forecast={chartData.forecast}
              />
            </div>
            <div className="print-page">
              <RecommendationsSection
                section={sections[8]}
                description={sectionDescriptions.recommendations}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function OverviewSection({
  section,
  description,
}: {
  section: (typeof sections)[number];
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

function QuestionsSection({
  section,
  description,
  onNavigate,
}: {
  section: (typeof sections)[number];
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

function QualitySection({
  section,
  description,
}: {
  section: (typeof sections)[number];
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

function RevenueSection({
  section,
  description,
  orderStatus,
  revenueComparison,
  presentMode,
}: {
  section: (typeof sections)[number];
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

function CustomersSection({
  section,
  description,
  presentMode,
}: {
  section: (typeof sections)[number];
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

function ProductsSection({
  section,
  description,
  presentMode,
}: {
  section: (typeof sections)[number];
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

function GeographySection({
  section,
  description,
  paymentByCountry,
  deviceByCountry,
  presentMode,
}: {
  section: (typeof sections)[number];
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

function TrendsSection({
  section,
  description,
  forecast,
  presentMode,
}: {
  section: (typeof sections)[number];
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

function RecommendationsSection({
  section,
  description,
}: {
  section: (typeof sections)[number];
  description: string;
}) {
  return (
    <>
      <SectionHeader section={section} description={description} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {recommendations.items.map((item) => (
          <Card key={item.priority} className="min-h-[230px]">
            <CardContent className="flex h-full flex-col p-4">
              <div className="flex items-start justify-between gap-3">
                <Badge className="border-primary/30 bg-primary/15 text-primary">
                  P{item.priority}
                </Badge>
                <Badge variant="outline" className="border-border bg-muted/40 text-muted-foreground">
                  {item.category}
                </Badge>
              </div>
              <h3 className="mt-5 text-base font-semibold leading-6 text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
