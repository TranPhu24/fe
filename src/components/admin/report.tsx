'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ComposedChart,
  Bar,
  Line,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { TrendingUp, Calendar } from 'lucide-react';
import { RevenueType, RawRevenueItem } from '@/lib/api/types';
import { getRevenueReport } from '@/lib/api/report';

export function AdminRevenuePage() {
  const [type, setType] = useState<RevenueType>('month');
  const [data, setData] = useState<RawRevenueItem[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (reportType: RevenueType) => {
    try {
      setLoading(true);
      setError(null);

      const res = await getRevenueReport(reportType);

      if (!res.success) {
        const message = res.message || "Không thể tải báo cáo doanh thu";
        setError(message);
        return;
      }

      setData(res.data || []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Lỗi tải báo cáo doanh thu";
      setError(message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData(type);
  }, [type]);

  const chartData = data
    .map((item) => {
      const { year, month, day, week } = item._id;
      let label = '';

      if (type === 'day') {
        label =
          month !== undefined && day !== undefined
            ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            : `${year}-??-??`;
      } else if (type === 'week') {
        label = `Tuần ${week ?? '?'} ${year}`;
      } else {
        label =
          month !== undefined
            ? `${String(month).padStart(2, '0')}/${year}`
            : `??/${year}`;
      }

      return {
        label,
        revenue: item.totalRevenue,
        orders: item.totalOrders,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const totalRevenue = data.reduce((s, i) => s + i.totalRevenue, 0);
  const totalOrders = data.reduce((s, i) => s + i.totalOrders, 0);

  return (
    <div className="p-6 w-full min-w-[80vw] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Báo cáo Doanh thu
          </h1>
          <p className="text-muted-foreground my-4">
            Theo dõi doanh thu và đơn hàng theo thời gian
          </p>
        </div>

        <Select value={type} onValueChange={(v) => setType(v as RevenueType)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Theo ngày</SelectItem>
            <SelectItem value="week">Theo tuần</SelectItem>
            <SelectItem value="month">Theo tháng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Tổng doanh thu</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toLocaleString('vi-VN')} ₫
            </div>
            <p className="text-xs text-muted-foreground">
              Trong khoảng thời gian đã chọn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Tổng đơn hàng</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOrders.toLocaleString('vi-VN')}
            </div>
            <p className="text-xs text-muted-foreground">
              Đơn hàng hoàn thành
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Doanh thu TB</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.length
                ? Math.round(totalRevenue / data.length).toLocaleString('vi-VN')
                : 0}{' '}
              ₫
            </div>
            <p className="text-xs text-muted-foreground">
              Trung bình mỗi {type === 'day' ? 'ngày' : type === 'week' ? 'tuần' : 'tháng'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className=' items-center justify-center my-4'>
        <CardHeader className='items-center justify-center' >
          <CardTitle className='text-3xl'>Doanh thu và Đơn hàng</CardTitle>
          <CardDescription>
            Biểu đồ cột thể hiện doanh thu, đường biểu diễn số đơn hàng
          </CardDescription>
        </CardHeader>

        <CardContent className="min-h-[520px] items-center justify-center">
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : chartData.length === 0 ? (
            <div className="h-96 flex items-center justify-center text-muted-foreground">
              Không có dữ liệu
            </div>
          ) : (
            <ChartContainer config={{}} className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 20, right: 40, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    angle={-30}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(v) =>
                      `${v.toLocaleString('vi-VN')} ₫`
                    }
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) =>
                          name === 'Doanh thu (₫)'
                            ? `${Number(value).toLocaleString('vi-VN')} ₫`
                            : `${value} đơn`
                        }
                      />
                    }
                  />
                  <Legend />
                  {/* Doanh thu */}
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    name="Doanh thu (₫)"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                  {/* Đơn hàng */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    name="Số đơn hàng"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
