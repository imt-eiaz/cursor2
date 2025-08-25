import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ShoppingCart,
  DollarSign,
  Calendar,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/sales");
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-600">
            Track your transactions and sales history
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>New Sale</span>
        </button>
      </div>

      {/* Sales Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Transaction</th>
                <th className="table-header">Customer</th>
                <th className="table-header">Item</th>
                <th className="table-header">Quantity</th>
                <th className="table-header">Total</th>
                <th className="table-header">Date</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          #{sale.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    {sale.first_name && sale.last_name ? (
                      <div className="text-sm text-gray-900">
                        {sale.first_name} {sale.last_name}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Walk-in customer
                      </span>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">
                      {sale.item_name || "Unknown Item"}
                    </div>
                    {sale.sku && (
                      <div className="text-xs text-gray-500 font-mono">
                        {sale.sku}
                      </div>
                    )}
                  </td>
                  <td className="table-cell text-sm text-gray-900">
                    {sale.quantity}
                  </td>
                  <td className="table-cell">
                    <div className="text-sm font-semibold text-green-600">
                      £{sale.total_amount}
                    </div>
                    <div className="text-xs text-gray-500">
                      @£{sale.unit_price} each
                    </div>
                  </td>
                  <td className="table-cell text-sm text-gray-500">
                    {new Date(sale.sale_date).toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button className="text-green-600 hover:text-green-900 p-1">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sales.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No sales found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by recording your first sale.
            </p>
          </div>
        )}
      </div>

      {/* Sales Summary */}
      {sales.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sales.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  £
                  {sales
                    .reduce(
                      (sum, sale) => sum + parseFloat(sale.total_amount),
                      0
                    )
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Today's Sales
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {
                    sales.filter((sale) => {
                      const today = new Date().toDateString();
                      const saleDate = new Date(sale.sale_date).toDateString();
                      return today === saleDate;
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
