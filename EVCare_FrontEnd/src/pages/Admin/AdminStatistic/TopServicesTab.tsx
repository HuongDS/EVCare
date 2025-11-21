import React, { useEffect, useMemo, useState } from "react";
import { DatePicker, InputNumber, List, Typography } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  type PieLabelRenderProps,
} from "recharts";
import type { TopServiceModel } from "../../../models/Statistic/TopServiceModel";
import type { Dayjs } from "dayjs";
import { getTopServices } from "../../../services/adminService";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const COLORS = ["#00ad4e", "#008f41", "#34d399", "#a7f3d0", "#6ee7b7"];

export const TopServicesTab: React.FC = () => {
  const [topN, setTopN] = useState(5);
  const [data, setData] = useState<TopServiceModel[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const fetchData = async () => {
    const [fromDate, toDate] = dateRange
      ? [dateRange[0]?.format("YYYY-MM-DD"), dateRange[1]?.format("YYYY-MM-DD")]
      : [undefined, undefined];
    const response = await getTopServices({ fromDate: fromDate, toDate: toDate, top: topN });
    setData(response?.data ?? []);
  };

  useEffect(() => {
    fetchData();
  }, [topN, dateRange]);

  const chartData = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.totalAppointments, 0);
    return data.map((item) => ({
      name: item.serviceName,
      value: item.totalAppointments,
      percentage: (item.totalAppointments / total) * 100,
    }));
  }, [data, topN]);

  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const numCx = Number(cx ?? 0);
    const numCy = Number(cy ?? 0);
    const numMidAngle = Number(midAngle ?? 0);
    const numInnerRadius = Number(innerRadius ?? 0);
    const numOuterRadius = Number(outerRadius ?? 0);
    const numPercent = Number(percent ?? 0);
    const RADIAN = Math.PI / 180;
    const radius = numInnerRadius + (numOuterRadius - numInnerRadius) * 0.5;
    const x = numCx + radius * Math.cos(-numMidAngle * RADIAN);
    const y = numCy + radius * Math.sin(-numMidAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(numPercent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="tab-pane-content">
      <div className="filter-bar">
        <RangePicker onChange={(dates) => setDateRange(dates as any)} />
        <InputNumber min={1} max={20} value={topN} onChange={(val) => setTopN(val || 5)} addonBefore="Top" />
      </div>

      <div className="split-layout">
        <div className="list-container">
          <Title level={4}>Services List (Top {topN})</Title>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<span className="list-rank-number">{index + 1}</span>}
                  title={<a>{item.serviceName}</a>}
                  description={`${item.totalAppointments} times booked`}
                />
              </List.Item>
            )}
          />
        </div>

        <div className="chart-container">
          <Title level={4}>Usage Rate</Title>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(_, name, props) => [`${props.payload.percentage.toFixed(1)}%`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
