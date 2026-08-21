import {
  BadgeCheck,
  BarChart3,
  Globe2,
  LineChart,
  PackageSearch,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
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

export type SectionId =
  | "overview"
  | "questions"
  | "quality"
  | "revenue"
  | "customers"
  | "products"
  | "geography"
  | "trends"
  | "recommendations";

export type SectionMeta = {
  id: SectionId;
  label: string;
  eyebrow: string;
  icon: LucideIcon;
};

export const sections: SectionMeta[] = [
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

export const sectionDescriptions: Record<SectionId, string> = {
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

const integer = new Intl.NumberFormat("en-US");
const money = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

export function formatMoney(value: number, compact = true) {
  if (compact && Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }

  if (compact && Math.abs(value) >= 100_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }

  return money.format(value);
}

export function formatNumber(value: number) {
  return integer.format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function titleCase(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function nextMonthLabel(monthIndex: number) {
  const base = new Date(Date.UTC(2022, 0, 1));
  base.setUTCMonth(base.getUTCMonth() + monthIndex);
  return base.toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  });
}

export function DashboardCard({
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

export function MetricCard({
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

export function SectionHeader({
  section,
  description,
}: {
  section: SectionMeta;
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

export function DataTable({
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

export function LeadershipStat({
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
