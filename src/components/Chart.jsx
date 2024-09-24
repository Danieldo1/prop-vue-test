
import {useMemo} from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Chart = ({ data }) => {

    const chartData = useMemo(() => {
        const statusCount = data.reduce((acc, item) => {
          acc[item.Status] = (acc[item.Status] || 0) + 1;
          return acc;
        }, {});
    
        return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
      }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      <Legend iconType="circle"  verticalAlign="bottom" align="center"  />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Chart;