"use client";

import {
  Menu,
  Moon,
  Presentation,
  Printer,
  Sun,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import dataQuality from "@/data/data-quality.json";
import geography from "@/data/geography.json";
import overview from "@/data/overview.json";
import trends from "@/data/trends.json";
import {
  CustomersSection,
  GeographySection,
  OverviewSection,
  ProductsSection,
  QualitySection,
  QuestionsSection,
  RecommendationsSection,
  RevenueSection,
  TrendsSection,
} from "./sections";
import {
  nextMonthLabel,
  sectionDescriptions,
  sections,
  titleCase,
  type SectionId,
  type SectionMeta,
} from "./shared";

type DashboardChartData = {
  deviceByCountry: Array<{ country: string; desktop: number; mobile: number; tablet: number }>;
  forecast: Array<{
    month: string;
    forecast: number;
    lower95: number;
    upper95: number;
    range: number;
  }>;
  orderStatus: Array<{ name: string; value: number }>;
  paymentByCountry: Array<{
    country: string;
    bank_transfer: number;
    credit_card: number;
    debit_card: number;
    gift_card: number;
    paypal: number;
  }>;
  revenueComparison: Array<{ name: string; value: number }>;
};

function DashboardSection({
  chartData,
  onNavigate,
  presentMode,
  section,
}: {
  chartData: DashboardChartData;
  onNavigate: (sectionId: SectionId) => void;
  presentMode?: boolean;
  section: SectionMeta;
}) {
  const description = sectionDescriptions[section.id];

  switch (section.id) {
    case "overview":
      return <OverviewSection section={section} description={description} />;
    case "questions":
      return (
        <QuestionsSection
          section={section}
          description={description}
          onNavigate={onNavigate}
        />
      );
    case "quality":
      return <QualitySection section={section} description={description} />;
    case "revenue":
      return (
        <RevenueSection
          section={section}
          description={description}
          orderStatus={chartData.orderStatus}
          revenueComparison={chartData.revenueComparison}
          presentMode={presentMode}
        />
      );
    case "customers":
      return (
        <CustomersSection
          section={section}
          description={description}
          presentMode={presentMode}
        />
      );
    case "products":
      return (
        <ProductsSection
          section={section}
          description={description}
          presentMode={presentMode}
        />
      );
    case "geography":
      return (
        <GeographySection
          section={section}
          description={description}
          paymentByCountry={chartData.paymentByCountry}
          deviceByCountry={chartData.deviceByCountry}
          presentMode={presentMode}
        />
      );
    case "trends":
      return (
        <TrendsSection
          section={section}
          description={description}
          forecast={chartData.forecast}
          presentMode={presentMode}
        />
      );
    case "recommendations":
      return <RecommendationsSection section={section} description={description} />;
  }
}

export default function Dashboard() {
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

  const chartData = useMemo<DashboardChartData>(() => {
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
      DashboardChartData["paymentByCountry"]
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
      DashboardChartData["deviceByCountry"]
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

  return (
    <main
      className={`min-h-screen bg-background text-foreground ${
        isLightMode ? "theme-light" : "theme-dark"
      } ${presentMode ? "present-mode text-[1.08rem]" : ""}`}
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
                <Image
                  src="/favicon.ico"
                  alt="UrbanCart Analytics logo"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-md object-cover"
                  unoptimized
                />
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
                    className={`h-9 shrink-0 cursor-pointer justify-start px-2.5 ${
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
              <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
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
            <DashboardSection
              chartData={chartData}
              onNavigate={selectSection}
              presentMode={presentMode}
              section={activeMeta}
            />
          </div>

          <div className="print-dashboard">
            {sections.map((section) => (
              <div key={section.id} className="print-page">
                <DashboardSection
                  chartData={chartData}
                  onNavigate={() => undefined}
                  section={section}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
