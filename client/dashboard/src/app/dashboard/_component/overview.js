"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/components/ui/error";
import moment from "moment";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FileText,
  FolderKanban,
  Package,
  Handshake,
  Users,
} from "lucide-react";

import {
  useDashboardStats,
  useBlogsByCategory,
  useProductsByCategory,
  usePartnersByRegion,
  useContentGrowth,
  useRecentBlogs,
} from "@/hooks/dashboard";

// palette from the Dura Plast logo (red, orange) + warm companions
const PIE_COLORS = [
  "#d7261f",
  "#f5821f",
  "#f2b544",
  "#e2643a",
  "#b8573a",
  "#9c8f86",
];

// light background per card (soft in dark mode)
// light tints of the logo colours
const TONES = {
  blue: "bg-[#fdeceb] dark:bg-[#d7261f]/15", // red tint
  rose: "bg-[#fff1e4] dark:bg-[#f5821f]/15", // orange tint
  teal: "bg-[#fff7df] dark:bg-[#f2b544]/15", // amber tint
  sand: "bg-[#fdebe3] dark:bg-[#e2643a]/15", // coral tint
  violet: "bg-[#f4efea] dark:bg-[#9c8f86]/15", // warm stone
};

function StatCard({ title, value, icon: Icon, isLoading, tone = "blue" }) {
  return (
    <Card className={`gap-0 border-transparent p-5 ${TONES[tone]}`}>
      <div className="flex items-start justify-between">
        <span className="bg-card/80 flex size-11 items-center justify-center rounded-full shadow-sm">
          <Icon className="size-[18px]" />
        </span>
      </div>
      <div className="mt-6">
        {isLoading ? (
          <Skeleton className="h-9 w-16 rounded-full" />
        ) : (
          <div className="text-4xl font-semibold tracking-tight">
            {value ?? 0}
          </div>
        )}
        <p className="text-muted-foreground mt-1 text-sm">{title}</p>
      </div>
    </Card>
  );
}

export default function Overview() {
  const stats = useDashboardStats();
  const blogsByCategory = useBlogsByCategory();
  const productsByCategory = useProductsByCategory();
  const partnersByRegion = usePartnersByRegion();
  const contentGrowth = useContentGrowth(12);
  const recentBlogs = useRecentBlogs(5);

  const firstError = [
    stats,
    blogsByCategory,
    productsByCategory,
    partnersByRegion,
    contentGrowth,
    recentBlogs,
  ].find((q) => q.isError);

  if (firstError) return <ErrorMessage error={firstError.error} />;

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          title="Blogs"
          tone="blue"
          value={stats.data?.blogs}
          icon={FileText}
          isLoading={stats.isLoading}
        />
        <StatCard
          title="Categories"
          tone="rose"
          value={stats.data?.categories}
          icon={FolderKanban}
          isLoading={stats.isLoading}
        />
        <StatCard
          title="Products"
          tone="teal"
          value={stats.data?.products}
          icon={Package}
          isLoading={stats.isLoading}
        />
        <StatCard
          title="Channel Partners"
          tone="sand"
          value={stats.data?.partners}
          icon={Handshake}
          isLoading={stats.isLoading}
        />
        <StatCard
          title="Users"
          tone="violet"
          value={stats.data?.users}
          icon={Users}
          isLoading={stats.isLoading}
        />
      </div>

      {/* Content growth */}
      <Card className="gap-0 p-0">
        <div className="flex flex-wrap items-start justify-between gap-4 p-6 pb-2">
          <div>
            <h3 className="text-lg font-semibold">Content growth</h3>
            <p className="text-muted-foreground text-sm">
              Blogs and product pages created per month (last 12 months)
            </p>
          </div>
          {!contentGrowth.isLoading && (
            <div className="flex gap-2">
              <TotalPill
                color="#d7261f"
                label="Blogs"
                value={sumOf(contentGrowth.data, "blogs")}
              />
              <TotalPill
                color="#f5821f"
                label="Products"
                value={sumOf(contentGrowth.data, "products")}
              />
            </div>
          )}
        </div>
        <div className="px-3 pb-4">
          {contentGrowth.isLoading ? (
            <Skeleton className="m-3 h-72 rounded-2xl" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={contentGrowth.data}
                margin={{ top: 16, right: 16, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gBlogs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d7261f" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#d7261f" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gProducts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f5821f" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#f5821f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="4 6"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={AXIS_TICK}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={AXIS_TICK}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ stroke: "var(--border)", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="blogs"
                  name="Blogs"
                  stroke="#d7261f"
                  strokeWidth={2.5}
                  fill="url(#gBlogs)"
                  activeDot={{ r: 5, strokeWidth: 3, stroke: "var(--card)" }}
                />
                <Area
                  type="monotone"
                  dataKey="products"
                  name="Products"
                  stroke="#f5821f"
                  strokeWidth={2.5}
                  fill="url(#gProducts)"
                  activeDot={{ r: 5, strokeWidth: 3, stroke: "var(--card)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="gap-0 p-6">
          <h3 className="mb-5 text-lg font-semibold">Blogs by category</h3>
          {blogsByCategory.isLoading ? (
            <Skeleton className="h-48 rounded-2xl" />
          ) : (
            <CategoryBars
              rows={blogsByCategory.data}
              color="#d7261f"
              unit="blog"
            />
          )}
        </Card>

        <Card className="gap-0 p-6">
          <h3 className="mb-5 text-lg font-semibold">Products by category</h3>
          {productsByCategory.isLoading ? (
            <Skeleton className="h-48 rounded-2xl" />
          ) : (
            <CategoryBars
              rows={productsByCategory.data}
              color="#f5821f"
              unit="product"
            />
          )}
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Partners by region */}
        <Card className="gap-0 p-6">
          <h3 className="mb-5 text-lg font-semibold">
            Channel partners by region
          </h3>
          {partnersByRegion.isLoading ? (
            <Skeleton className="h-60 rounded-2xl" />
          ) : !partnersByRegion.data?.length ? (
            <EmptyState text="No partners yet." />
          ) : (
            <RegionDonut rows={partnersByRegion.data} />
          )}
        </Card>

        {/* Recent blogs */}
        <Card className="gap-0 p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent blogs</h3>
          {recentBlogs.isLoading ? (
            <Skeleton className="h-60 rounded-2xl" />
          ) : !recentBlogs.data?.length ? (
            <EmptyState text="No blogs yet." />
          ) : (
            <ul className="divide-border/70 divide-y">
              {recentBlogs.data.map((blog) => (
                <li key={blog.id} className="flex items-center gap-3 py-3">
                  <span className="bg-accent text-accent-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                    {(blog.title || "?").charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{blog.title}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {blog.category_title || "No category"}
                    </p>
                  </div>
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {moment(blog.created_at).format("DD MMM YYYY")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

// ================= chart pieces =================
const AXIS_TICK = { fontSize: 12, fill: "var(--muted-foreground)" };

const sumOf = (rows = [], key) =>
  rows.reduce((total, row) => total + (Number(row?.[key]) || 0), 0);

function TotalPill({ color, label, value }) {
  return (
    <span className="bg-muted flex items-center gap-2 rounded-full px-3 py-1.5 text-sm">
      <span className="size-2.5 rounded-full" style={{ background: color }} />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </span>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover min-w-36 rounded-2xl border px-4 py-3 text-sm shadow-lg">
      {label && <p className="mb-1.5 font-medium">{label}</p>}
      {payload.map((item) => (
        <p key={item.dataKey ?? item.name} className="flex items-center gap-2">
          <span
            className="size-2.5 rounded-full"
            style={{ background: item.color || item.payload?.fill }}
          />
          <span className="text-muted-foreground">{item.name}</span>
          <span className="ml-auto font-semibold">{item.value}</span>
        </p>
      ))}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="text-muted-foreground flex h-48 items-center justify-center rounded-2xl border border-dashed text-sm">
      {text}
    </div>
  );
}

// Horizontal bars as a list: full names, count and share
function CategoryBars({ rows = [], color, unit }) {
  if (!rows?.length) return <EmptyState text={`No ${unit}s yet.`} />;
  const total = sumOf(rows, "product_count") || 1;
  const max = Math.max(...rows.map((r) => Number(r.product_count) || 0), 1);

  return (
    <ul className="space-y-4">
      {rows.map((row) => {
        const count = Number(row.product_count) || 0;
        return (
          <li key={row.category_name} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate font-medium capitalize">
                {(row.category_name || "Uncategorised").toLowerCase()}
              </span>
              <span className="text-muted-foreground shrink-0">
                <span className="text-foreground font-semibold">{count}</span>{" "}
                {unit}
                {count === 1 ? "" : "s"} · {Math.round((count / total) * 100)}%
              </span>
            </div>
            <div className="bg-muted h-2.5 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(count / max) * 100}%`,
                  background: `linear-gradient(90deg, ${color}, #f5821f)`,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// Donut with the total in the middle and a legend list
function RegionDonut({ rows }) {
  const total = sumOf(rows, "partner_count");
  return (
    <div className="grid items-center gap-6 sm:grid-cols-[200px_1fr]">
      <div className="relative mx-auto size-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={rows}
              dataKey="partner_count"
              nameKey="region"
              innerRadius={66}
              outerRadius={96}
              paddingAngle={3}
              cornerRadius={6}
              stroke="none"
            >
              {rows.map((_, index) => (
                <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold">{total}</span>
          <span className="text-muted-foreground text-xs">partners</span>
        </div>
      </div>

      <ul className="space-y-2">
        {rows.map((row, index) => (
          <li
            key={row.region}
            className="flex items-center gap-2.5 text-sm"
          >
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: PIE_COLORS[index % PIE_COLORS.length] }}
            />
            <span className="truncate capitalize">
              {(row.region || "Other").toLowerCase()}
            </span>
            <span className="text-muted-foreground ml-auto shrink-0">
              <span className="text-foreground font-medium">
                {row.partner_count}
              </span>{" "}
              · {Math.round((Number(row.partner_count) / (total || 1)) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
