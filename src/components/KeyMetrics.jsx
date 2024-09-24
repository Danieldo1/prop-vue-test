
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KeyMetrics = ({ data }) => {
  const totalStock = data.reduce((sum, item) => sum + parseInt(item.Qty || 0), 0);
  const totalValue = data.reduce((sum, item) => sum + parseInt(item.Value || 0), 0);
  const averagePrice = totalStock !== 0 ? totalValue / totalStock : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Общий объем запасов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStock}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Общее количество единиц товаров</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Средняя цена товара</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₽ {averagePrice.toFixed(2)} </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyMetrics;