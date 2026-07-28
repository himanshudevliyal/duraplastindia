"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/components/ui/error";
import moment from "moment";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

const PIE_COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
];

function StatCard({ title, value, icon: Icon, isLoading }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{value ?? 0}</div>
        )}
      </CardContent>
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
    <div className="mt-4 space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          title="Blogs"
          value={stats.data?.blogs}
          icon={FileText}
          isLoading={stats.isLoading}
        />
        <StatCard
          title="Categories"
          value={stats.data?.categories}
          icon={FolderKanban}
          isLoading={stats.isLoading}
        />
        <StatCard
          title="Products"
          value={stats.data?.products}
          icon={Package}
          isLoading={stats.isLoading}
        />
        <StatCard
          title="Channel Partners"
          value={stats.data?.partners}
          icon={Handshake}
          isLoading={stats.isLoading}
        />
        <StatCard
          title="Users"
          value={stats.data?.users}
          icon={Users}
          isLoading={stats.isLoading}
        />
      </div>

      {/* Content growth */}
      <Card>
        <CardHeader>
          <CardTitle>Content growth</CardTitle>
          <CardDescription>
            Blogs and product pages created per month (last 12 months)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contentGrowth.isLoading ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={contentGrowth.data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="blogs"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="products"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Blogs by category */}
        <Card>
          <CardHeader>
            <CardTitle>Blogs by category</CardTitle>
          </CardHeader>
          <CardContent>
            {blogsByCategory.isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={blogsByCategory.data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="category_name"
                    width={110}
                    fontSize={12}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="product_count"
                    name="Blogs"
                    fill="#6366f1"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Products by category */}
        <Card>
          <CardHeader>
            <CardTitle>Products by category</CardTitle>
          </CardHeader>
          <CardContent>
            {productsByCategory.isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={productsByCategory.data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="category_name"
                    width={110}
                    fontSize={12}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="product_count"
                    name="Products"
                    fill="#22c55e"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Partners by region */}
        <Card>
          <CardHeader>
            <CardTitle>Channel partners by region</CardTitle>
          </CardHeader>
          <CardContent>
            {partnersByRegion.isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : !partnersByRegion.data?.length ? (
              <p className="text-muted-foreground text-sm">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={partnersByRegion.data}
                    dataKey="partner_count"
                    nameKey="region"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {partnersByRegion.data.map((_, index) => (
                      <Cell
                        key={index}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent blogs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent blogs</CardTitle>
          </CardHeader>
          <CardContent>
            {recentBlogs.isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!recentBlogs.data?.length ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-muted-foreground text-center"
                      >
                        No blogs yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentBlogs.data.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell className="font-medium">
                          {blog.title}
                        </TableCell>
                        <TableCell>
                          {blog.category_title ? (
                            <Badge variant="secondary">
                              {blog.category_title}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-right">
                          {moment(blog.created_at).format("DD/MM/YYYY")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
