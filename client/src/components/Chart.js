import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const Chart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        width={800}
        height={400}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="minValue"
          stroke="blue"
          name="Min Value"
        />
        <Line
          type="monotone"
          dataKey="maxValue"
          stroke="red"
          name="Max Value"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
