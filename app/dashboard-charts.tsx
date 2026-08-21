"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const colors = {
  amber: "#f59e0b",
  blue: "#60a5fa",
  green: "#34d399",
  rose: "#fb7185",
  slate: "#94a3b8",
  teal: "#2dd4bf",
};

const palette = [
  colors.blue,
  colors.teal,
  colors.amber,
  colors.green,
  colors.rose,
  colors.slate,
];

const axis = "#8b949e";
const grid = "rgba(148, 163, 184, 0.16)";

function currency(value: unknown) {
  if (typeof value !== "number") return String(value);
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

function percent(value: unknown) {
  return typeof value === "number" ? `${value.toFixed(1)}%` : String(value);
}

function compactNumber(value: unknown) {
  if (typeof value !== "number") return String(value);
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

function ChartTooltip() {
  return (
    <Tooltip
      cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
      contentStyle={{
        background: "#111113",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        borderRadius: 8,
        color: "#f4f4f5",
        boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
      }}
      labelStyle={{ color: "#f4f4f5" }}
    />
  );
}

type NameValue = {
  name: string;
  value: number;
};

type ChartSizeProps = {
  presentMode?: boolean;
};

function chartHeight(baseHeight: number, presentMode?: boolean) {
  return presentMode ? Math.round(baseHeight * 1.18) : baseHeight;
}

export function OrderStatusChart({
  data,
  presentMode,
}: {
  data: NameValue[];
} & ChartSizeProps) {
  return (
    <ResponsiveContainer width="100%" height={chartHeight(280, presentMode)}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={70}
          outerRadius={104}
          paddingAngle={3}
          isAnimationActive={false}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={palette[index % palette.length]} />
          ))}
        </Pie>
        <Tooltip formatter={percent} contentStyle={{ background: "#111113", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 8 }} />
        <Legend iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RevenueComparisonChart({
  data,
  presentMode,
}: {
  data: NameValue[];
} & ChartSizeProps) {
  return (
    <ResponsiveContainer width="100%" height={chartHeight(280, presentMode)}>
      <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={grid} vertical={false} />
        <XAxis dataKey="name" stroke={axis} tickLine={false} axisLine={false} />
        <YAxis stroke={axis} tickLine={false} axisLine={false} tickFormatter={currency} />
        <ChartTooltip />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={palette[index % palette.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

type SegmentDatum = {
  segment: string;
  customers: number;
  totalRevenue: number;
};

export function SegmentRevenueChart({
  data,
  presentMode,
}: {
  data: SegmentDatum[];
} & ChartSizeProps) {
  return (
    <ResponsiveContainer width="100%" height={chartHeight(310, presentMode)}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 20, left: 90, bottom: 8 }}>
        <CartesianGrid stroke={grid} horizontal={false} />
        <XAxis type="number" stroke={axis} tickLine={false} axisLine={false} tickFormatter={currency} />
        <YAxis dataKey="segment" type="category" stroke={axis} tickLine={false} axisLine={false} width={118} />
        <ChartTooltip />
        <Bar dataKey="totalRevenue" name="Completed-Only Revenue" fill={colors.teal} radius={[0, 6, 6, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}

type RatingDatum = {
  rating: number;
  reviewers: number;
  avgOrders: number;
};

export function RatingLoyaltyChart({
  data,
  presentMode,
}: {
  data: RatingDatum[];
} & ChartSizeProps) {
  return (
    <ResponsiveContainer width="100%" height={chartHeight(280, presentMode)}>
      <ComposedChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={grid} vertical={false} />
        <XAxis dataKey="rating" stroke={axis} tickLine={false} axisLine={false} />
        <YAxis yAxisId="orders" stroke={axis} tickLine={false} axisLine={false} domain={[3.4, 3.9]} />
        <YAxis yAxisId="reviewers" orientation="right" stroke={axis} tickLine={false} axisLine={false} tickFormatter={compactNumber} />
        <ChartTooltip />
        <Legend />
        <Bar yAxisId="reviewers" dataKey="reviewers" name="Reviewers" fill={colors.amber} radius={[6, 6, 0, 0]} isAnimationActive={false} />
        <Line yAxisId="orders" type="monotone" dataKey="avgOrders" name="Avg Orders" stroke={colors.green} strokeWidth={3} dot={{ r: 4 }} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

type CategoryMarginDatum = {
  category: string;
  netMargin: number;
  marginPct: number;
};

export function CategoryMarginChart({
  data,
  presentMode,
}: {
  data: CategoryMarginDatum[];
} & ChartSizeProps) {
  return (
    <ResponsiveContainer width="100%" height={chartHeight(300, presentMode)}>
      <ComposedChart data={data} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={grid} vertical={false} />
        <XAxis dataKey="category" stroke={axis} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
        <YAxis yAxisId="money" stroke={axis} tickLine={false} axisLine={false} tickFormatter={currency} />
        <YAxis yAxisId="pct" orientation="right" stroke={axis} tickLine={false} axisLine={false} tickFormatter={percent} />
        <ChartTooltip />
        <Legend />
        <Bar yAxisId="money" dataKey="netMargin" name="Net Margin" fill={colors.teal} radius={[6, 6, 0, 0]} isAnimationActive={false} />
        <Line yAxisId="pct" type="monotone" dataKey="marginPct" name="Margin %" stroke={colors.amber} strokeWidth={3} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

type ReturnRateDatum = {
  category: string;
  returnRate: number;
};

export function ReturnRateChart({
  data,
  presentMode,
}: {
  data: ReturnRateDatum[];
} & ChartSizeProps) {
  return (
    <ResponsiveContainer width="100%" height={chartHeight(300, presentMode)}>
      <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={grid} vertical={false} />
        <XAxis dataKey="category" stroke={axis} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
        <YAxis stroke={axis} tickLine={false} axisLine={false} tickFormatter={percent} />
        <ChartTooltip />
        <Bar dataKey="returnRate" name="Return Rate" fill={colors.rose} radius={[6, 6, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}

type CityRevenueDatum = {
  city: string;
  netRevenue: number;
};

export function CityRevenueChart({
  data,
  presentMode,
}: {
  data: CityRevenueDatum[];
} & ChartSizeProps) {
  return (
    <ResponsiveContainer width="100%" height={chartHeight(340, presentMode)}>
      <BarChart data={data.slice(0, 12)} layout="vertical" margin={{ top: 8, right: 20, left: 70, bottom: 8 }}>
        <CartesianGrid stroke={grid} horizontal={false} />
        <XAxis type="number" stroke={axis} tickLine={false} axisLine={false} tickFormatter={currency} />
        <YAxis dataKey="city" type="category" stroke={axis} tickLine={false} axisLine={false} width={92} />
        <ChartTooltip />
        <Bar dataKey="netRevenue" name="Completed-Only Revenue" fill={colors.green} radius={[0, 6, 6, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}

type MonthlyDatum = {
  month: string;
  revenue: number;
  rolling3: number;
};

export function MonthlyRevenueChart({
  data,
  presentMode,
}: {
  data: MonthlyDatum[];
} & ChartSizeProps) {
  return (
    <ResponsiveContainer width="100%" height={chartHeight(320, presentMode)}>
      <LineChart data={data} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={grid} vertical={false} />
        <XAxis dataKey="month" stroke={axis} tickLine={false} axisLine={false} minTickGap={28} />
        <YAxis stroke={axis} tickLine={false} axisLine={false} tickFormatter={currency} />
        <ChartTooltip />
        <Legend />
        <Line type="monotone" dataKey="revenue" name="Monthly Revenue" stroke={colors.blue} strokeWidth={2} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="rolling3" name="Rolling 3-Month Avg" stroke={colors.amber} strokeWidth={3} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

type ForecastDatum = {
  month: string;
  forecast: number;
  lower95: number;
  upper95: number;
  range: number;
};

export function ForecastChart({
  data,
  presentMode,
}: {
  data: ForecastDatum[];
} & ChartSizeProps) {
  return (
    <ResponsiveContainer width="100%" height={chartHeight(280, presentMode)}>
      <AreaChart data={data} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={grid} vertical={false} />
        <XAxis dataKey="month" stroke={axis} tickLine={false} axisLine={false} />
        <YAxis stroke={axis} tickLine={false} axisLine={false} tickFormatter={currency} />
        <ChartTooltip />
        <Legend />
        <Area type="monotone" dataKey="lower95" stackId="range" stroke="transparent" fill="transparent" name="Lower 95%" isAnimationActive={false} />
        <Area type="monotone" dataKey="range" stackId="range" stroke="transparent" fill={colors.blue} fillOpacity={0.22} name="95% Range" isAnimationActive={false} />
        <Line type="monotone" dataKey="forecast" name="Forecast" stroke={colors.amber} strokeWidth={3} dot={{ r: 4 }} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

type PaymentDatum = {
  country: string;
  bank_transfer: number;
  credit_card: number;
  debit_card: number;
  gift_card: number;
  paypal: number;
};

export function PaymentMethodChart({
  data,
  presentMode,
}: {
  data: PaymentDatum[];
} & ChartSizeProps) {
  const keys: Array<keyof Omit<PaymentDatum, "country">> = [
    "bank_transfer",
    "credit_card",
    "debit_card",
    "gift_card",
    "paypal",
  ];

  return (
    <ResponsiveContainer width="100%" height={chartHeight(330, presentMode)}>
      <BarChart data={data} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={grid} vertical={false} />
        <XAxis dataKey="country" stroke={axis} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
        <YAxis stroke={axis} tickLine={false} axisLine={false} tickFormatter={percent} />
        <ChartTooltip />
        <Legend />
        {keys.map((key, index) => (
          <Bar key={key} dataKey={key} stackId="payment" fill={palette[index % palette.length]} name={key.replace("_", " ")} isAnimationActive={false} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

type DeviceDatum = {
  country: string;
  desktop: number;
  mobile: number;
  tablet: number;
};

export function DeviceConversionChart({
  data,
  presentMode,
}: {
  data: DeviceDatum[];
} & ChartSizeProps) {
  return (
    <ResponsiveContainer width="100%" height={chartHeight(330, presentMode)}>
      <BarChart data={data} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={grid} vertical={false} />
        <XAxis dataKey="country" stroke={axis} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
        <YAxis stroke={axis} tickLine={false} axisLine={false} tickFormatter={percent} domain={[90, 100]} />
        <ChartTooltip />
        <Legend />
        <Bar dataKey="desktop" fill={colors.blue} radius={[4, 4, 0, 0]} isAnimationActive={false} />
        <Bar dataKey="mobile" fill={colors.green} radius={[4, 4, 0, 0]} isAnimationActive={false} />
        <Bar dataKey="tablet" fill={colors.amber} radius={[4, 4, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
