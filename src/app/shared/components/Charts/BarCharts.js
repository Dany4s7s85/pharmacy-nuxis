import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "January",
    sale: 4000,
    purchase: 2400,
    amt: 2400,
  },
  {
    name: "Februrary",
    sale: 3000,
    purchase: 1398,
    amt: 2210,
  },
  {
    name: "March",
    sale: 2000,
    purchase: 9800,
    amt: 2290,
  },
  {
    name: "April",
    sale: 2780,
    purchase: 3908,
    amt: 2000,
  },
  {
    name: "May",
    sale: 1890,
    purchase: 4800,
    amt: 2181,
  },
  {
    name: "June",
    sale: 2390,
    purchase: 3800,
    amt: 2500,
  },
  {
    name: "July",
    sale: 3490,
    purchase: 4300,
    amt: 2100,
  },
];

const BarCharts = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="purchase" fill="#8884d8" />
        <Bar dataKey="sale" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};
export default BarCharts;
