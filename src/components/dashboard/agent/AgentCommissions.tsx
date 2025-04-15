
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatUtils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock commission data
const mockCommissions = [
  {
    id: "COM-1001",
    propertyId: "1",
    propertyTitle: "Modern Luxury Villa with Ocean View",
    salePrice: 1250000,
    commission: 37500,
    status: "paid",
    date: "2023-12-15T10:30:00Z",
  },
  {
    id: "COM-1002",
    propertyId: "3",
    propertyTitle: "Spacious Family Home in Quiet Neighborhood",
    salePrice: 685000,
    commission: 20550,
    status: "pending",
    date: "2024-01-22T14:45:00Z",
  },
  {
    id: "COM-1003",
    propertyId: "5",
    propertyTitle: "Historic Brownstone with Modern Updates",
    salePrice: 1495000,
    commission: 44850,
    status: "paid",
    date: "2024-02-10T09:15:00Z",
  },
  {
    id: "COM-1004",
    propertyId: "4",
    propertyTitle: "Waterfront Condo with Marina Views",
    salePrice: 875000,
    commission: 26250,
    status: "processing",
    date: "2024-03-05T16:20:00Z",
  },
];

const mockMonthlyData = [
  { month: "Jan", commission: 22500 },
  { month: "Feb", commission: 31500 },
  { month: "Mar", commission: 45000 },
  { month: "Apr", commission: 28500 },
  { month: "May", commission: 36750 },
  { month: "Jun", commission: 42300 },
  { month: "Jul", commission: 33900 },
  { month: "Aug", commission: 38700 },
  { month: "Sep", commission: 44850 },
  { month: "Oct", commission: 26250 },
  { month: "Nov", commission: 0 },
  { month: "Dec", commission: 0 },
];

const statusColors = {
  paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

const AgentCommissions = () => {
  const totalCommission = mockCommissions.reduce((sum, item) => sum + item.commission, 0);
  const pendingCommission = mockCommissions
    .filter(item => item.status === "pending" || item.status === "processing")
    .reduce((sum, item) => sum + item.commission, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCommission)}</div>
            <p className="text-xs text-muted-foreground">From 4 property sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendingCommission)}</div>
            <p className="text-xs text-muted-foreground">From 2 properties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalCommission / mockCommissions.length)}
            </div>
            <p className="text-xs text-muted-foreground">Per property</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Commission Trend</CardTitle>
          <CardDescription>Monthly commission earnings over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={mockMonthlyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₦${value / 1000}k`} />
                <Tooltip formatter={(value) => [formatCurrency(value), "Commission"]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="commission"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Commission Records</CardTitle>
          <CardDescription>Detailed list of all commission earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Sale Price</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCommissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell className="font-medium">{commission.id}</TableCell>
                  <TableCell>
                    <a 
                      href={`/properties/${commission.propertyId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {commission.propertyTitle}
                    </a>
                  </TableCell>
                  <TableCell>{formatCurrency(commission.salePrice)}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(commission.commission)}
                  </TableCell>
                  <TableCell>
                    {new Date(commission.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={statusColors[commission.status as keyof typeof statusColors]}
                    >
                      {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentCommissions;
