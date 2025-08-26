import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  BarChart3,
  AlertTriangle,
  Package,
  Phone,
  PhoneIcon,
  MailboxIcon,
  LucidePhone,
  SmartphoneIcon,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Phones = () => {
  const [phone, setPhone] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/phones");
      setPhone(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching phones:", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  // const getStockStatusColor = (status) => {
  //   switch (status) {
  //     case "Low Stock":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "Out of Stock":
  //       return "bg-red-100 text-red-800";
  //     default:
  //       return "bg-green-100 text-green-800";
  //   }
  // };

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
          <h1 className="text-2xl font-bold text-gray-900">Phones</h1>
          <p className="text-gray-600">Monitor your phone records status</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Phone</span>
        </button>
      </div>

      {/* Inventory Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total phones</p>
              <p className="text-2xl font-semibold text-gray-900">
                {phone.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-semibold text-gray-900">
                12
                {/* {
                  phone.filter((item) => item.stock_status === "In Stock")
                    .length
                } */}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Purchased</p>
              <p className="text-2xl font-semibold text-gray-900">
                5
                {/* {
                  phone.filter((item) => item.stock_status === "Low Stock")
                    .length
                } */}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sold</p>
              <p className="text-2xl font-semibold text-gray-900">
                7
                {/* {
                  phone.filter((item) => item.stock_status === "Out of Stock")
                    .length
                } */}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* <th className="table-header">ID</th> */}
                <th className="table-header">Brand/ Model</th>
                {/* <th className="table-header">Model</th> */}
                <th className="table-header">Color</th>
                <th className="table-header">IMEI</th>
                <th className="table-header">Price</th>
                <th className="table-header">Status</th>
                <th className="table-header">Created At</th>
                <th className="table-header">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {phone.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <SmartphoneIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.brand}
                        </div>
                        {item.model && (
                          <div className="text-xs text-gray-500">
                            {item.model}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.color}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm font-medium text-gray-900">
                      {item.imei}
                    </div>
                  </td>
                  <td className="table-cell text-sm text-gray-500">
                    {item.price}
                  </td>
                  <td className="table-cell text-sm text-gray-500">
                    {item.status}
                  </td>

                  <td className="table-cell text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>

                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button className="text-green-600 hover:text-green-900 p-1">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {phone.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No inventory found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add items to start tracking inventory.
            </p>
          </div>
        )}
      </div>

      {/* Low Stock Alerts */}
      {/* {phone.filter((item) => item.stock_status !== "In Stock").length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Stock Alerts
            </h3>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Phones;
