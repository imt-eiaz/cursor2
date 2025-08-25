import React, { useState, useEffect } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    items: 0,
    sales: 0,
    revenue: 0,
    lowStock: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch customers count
      const customersResponse = await axios.get(
        "http://localhost:5000/api/customers"
      );

      // Fetch items count
      const itemsResponse = await axios.get("http://localhost:5000/api/items");

      // Fetch recent sales
      const salesResponse = await axios.get("http://localhost:5000/api/sales");

      // Fetch inventory summary
      const inventoryResponse = await axios.get(
        "http://localhost:5000/api/inventory/summary"
      );

      // Fetch low stock items
      const lowStockResponse = await axios.get(
        "http://localhost:5000/api/inventory/low-stock"
      );

      // Calculate revenue from sales
      const totalRevenue = salesResponse.data.reduce(
        (sum, sale) => sum + parseFloat(sale.total_amount),
        0
      );

      setStats({
        customers: customersResponse.data.length,
        items: itemsResponse.data.length,
        sales: salesResponse.data.length,
        revenue: totalRevenue,
        lowStock: inventoryResponse.data.summary.low_stock,
      });

      setRecentSales(salesResponse.data.slice(0, 5));
      setLowStockItems(lowStockResponse.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to PhoneBox Gadgets - Your phone repair management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={stats.customers}
          icon={Users}
          color="bg-green-500"
          subtitle="Registered customers"
        />
        <StatCard
          title="Total Items"
          value={stats.items}
          icon={Package}
          color="bg-green-500"
          subtitle="Products & services"
        />
        <StatCard
          title="Total Sales"
          value={stats.sales}
          icon={ShoppingCart}
          color="bg-green-500"
          subtitle="Completed transactions"
        />
        <StatCard
          title="Total Revenue"
          value={`£${stats.revenue.toFixed(2)}`}
          icon={DollarSign}
          color="bg-green-500"
          subtitle="Total earnings"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Recent Sales
            </h3>
          </div>
          <div className="p-6">
            {recentSales.length > 0 ? (
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {sale.item_name || "Unknown Item"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {sale.first_name} {sale.last_name} • {sale.quantity}x
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        £{sale.total_amount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(sale.sale_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent sales</p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Low Stock Alerts
            </h3>
          </div>
          <div className="p-6">
            {lowStockItems.length > 0 ? (
              <div className="space-y-4">
                {lowStockItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-red-600">
                        Current: {item.quantity} • Min: {item.min_stock_level}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                All items are well stocked
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
            <div className="text-center">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Customer</p>
              <p className="text-xs text-gray-500">Register new customer</p>
            </div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
            <div className="text-center">
              <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Item</p>
              <p className="text-xs text-gray-500">
                Create new product/service
              </p>
            </div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
            <div className="text-center">
              <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">New Sale</p>
              <p className="text-xs text-gray-500">Record a transaction</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
