import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Plus,
  Edit,
  BarChart3,
  AlertTriangle,
  Package,
  Search,
  Trash2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Phones = () => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  // const [price, setPrice] = useState(0);
  const [date, setDate] = useState(new Date());
  const [editingPhone, setEditingPhone] = useState(null);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    color: "",
    imei: "",
    price: "",
    status: "",
  });

  useEffect(() => {
    fetchPhones();
  }, []);

  // Calculate total price of all phones
  const totalPrice = phones.reduce(
    (acc, phone) => acc + (parseFloat(phone.price) || 0),
    0
  );

  const fetchPhones = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/phones");
      setPhones(response.data);
    } catch (error) {
      console.error("Error fetching phones:", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare data: ensure price is a number and remove created_at
      const submitData = {
        ...formData,
        price: formData.price ? Number(formData.price) : null,
      };
      if (editingPhone) {
        // Prevent IMEI from being changed during edit
        submitData.imei = editingPhone.imei;
        await axios.put(
          `http://localhost:5000/api/phones/${editingPhone.id}`,
          submitData
        );
        toast.success("Phone updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/phones", submitData);
        toast.success("Phone created successfully");
      }
      setShowModal(false);
      setEditingPhone(null);
      resetForm();
      fetchPhones();
    } catch (error) {
      console.error("Error saving phone:", error);
      toast.error(error.response?.data?.error || "Failed to save phone");
    }
  };

  const handleEdit = (phone) => {
    setEditingPhone(phone);
    setFormData({
      brand: phone.brand || "",
      model: phone.model || "",
      color: phone.color || "",
      imei: phone.imei || "",
      price: phone.price || "",
      status: phone.status || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this phone?")) {
      try {
        await axios.delete(`http://localhost:5000/api/phones/${id}`);
        toast.success("Phone deleted successfully");
        fetchPhones();
      } catch (error) {
        console.error("Error deleting phone:", error);
        toast.error("Failed to delete phone");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      brand: "",
      model: "",
      color: "",
      imei: "",
      price: "",
      status: "",
    });
  };

  const openNewCustomerModal = () => {
    setEditingPhone(null);
    resetForm();
    setShowModal(true);
  };

  // Filtered phones for search
  const filteredPhones = phones.filter((phone) => {
    const term = searchTerm.toLowerCase();
    return (
      (phone.brand && phone.brand.toLowerCase().includes(term)) ||
      (phone.model && phone.model.toLowerCase().includes(term)) ||
      (phone.imei && phone.imei.toLowerCase().includes(term)) ||
      (phone.status && phone.status.toLowerCase().includes(term))
    );
  });

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
        <button
          onClick={openNewCustomerModal}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Phone</span>
        </button>
      </div>

      {/* Modal for Add/Edit Phone */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-10">
          <div className="relative top-5 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPhone ? "Edit Phone" : "Add New Phone"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Replace the form fields below with your actual phone fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Brand
                    </label>
                    <div>
                      <select
                        value={formData.brand}
                        type="text"
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        className="input-field mt-1"
                        aria-label="Choose brand"
                      >
                        <option defaultValue>Choose Brand</option>
                        <option value="Apple">Apple</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Google">Google</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Model
                    </label>
                    <select
                      value={formData.model}
                      type="text"
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      className="input-field mt-1"
                      aria-label="Choose model"
                    >
                      <option defaultValue>Choose Model</option>
                      <option value="iPhone-7">iPhone 7</option>
                      <option value="iPhone-7-Plus">iPhone 7 Plus</option>
                      <option value="iPhone-8">iPhone 8</option>
                      <option value="iPhone-8-Plus">iPhone 8 Plus</option>
                      <option value="iPhone-X">iPhone X</option>
                      <option value="iPhone-XS">iPhone XS</option>
                      <option value="iPhone-XR">iPhone XR</option>
                      <option value="iPhone-XS-Max">iPhone XS-Max</option>
                      <option value="iPhone-11">iPhone 11</option>
                      <option value="iPhone-11-Pro">iPhone 11-Pro</option>
                      <option value="iPhone-11-Pro-Max">
                        iPhone 11-Pro-Max
                      </option>
                      <option value="iPhone-12">iPhone 12</option>
                      <option value="iPhone-12-Pro">iPhone 12-Pro</option>
                      <option value="iPhone-12-Pro-Max">
                        iPhone 12-Pro-Max
                      </option>
                      <option value="iPhone-12-Mini">iPhone 12-Mini</option>
                      <option value="iPhone-13">iPhone 13</option>
                      <option value="iPhone-13-Pro">iPhone 13-Pro</option>
                      <option value="iPhone-13-Pro-Max">
                        iPhone 13-Pro-Max
                      </option>
                      <option value="iPhone-13-Mini">iPhone MiniMax</option>
                      <option value="iPhone-14">iPhone 14</option>
                      <option value="iPhone-14-Pro">iPhone 14-Pro</option>
                      <option value="iPhone-14-Pro-Max">
                        iPhone 14-Pro-Max
                      </option>
                      <option value="iPhone-14-Plus">iPhonlusro-Max</option>
                      <option value="iPhone-15">iPhone 15</option>
                      <option value="iPhone-15-Pro">iPhone 15-Pro</option>
                      <option value="iPhone-15-Pro-Max">
                        iPhone 15-Pro-Max
                      </option>
                      <option value="iPhone-15-Pro-Max">
                        iPhone 15-Pro-Max
                      </option>
                      <option value="iPhone-15-Plus">iPhone-15-Plus</option>
                      <option value="iPhone-16">iPhone-16</option>
                      <option value="iPhone-16-Pro">iPhone-16-Pro</option>
                      <option value="iPhone-16-Pro-Max">
                        iPhone-16-Pro-Max
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Color
                  </label>

                  <div>
                    <select
                      value={formData.color}
                      type="text"
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="input-field mt-1"
                      aria-label="Choose color"
                    >
                      <option defaultValue>Choose Color</option>
                      <option value="White">White</option>
                      <option value="Black">Black</option>
                      <option value="Red">Red</option>
                      <option value="Blue">Blue</option>
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    IMEI
                  </label>
                  <input
                    type="text"
                    value={formData.imei}
                    onChange={(e) =>
                      setFormData({ ...formData, imei: e.target.value })
                    }
                    className="input-field mt-1"
                    disabled={!!editingPhone}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="input-field mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>

                  <div>
                    <select
                      value={formData.status}
                      type="text"
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="input-field mt-1"
                      aria-label="Choose status"
                    >
                      <option defaultValue>Choose Status</option>
                      <option value="Available">Available</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Created At
                  </label>
                  <DatePicker
                    selected={formData.created_at}
                    className="input-field mt-1"
                    onChange={(date) =>
                      setFormData({ ...formData, created_at: date })
                    }
                  />
                  {/* <input
                    type="text"
                    value={formData.created_at}
                    onChange={(e) =>
                      setFormData({ ...formData, created_at: e.target.value })
                    }
                    className="input-field mt-1"
                  /> */}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingPhone(null);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingPhone ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Phones Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total phones entries
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {phones.length}
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
              <p className="text-sm font-medium text-gray-600">Cash in hand</p>
              <p className="text-2xl font-semibold text-gray-900">
                £{totalPrice}
                {/* {phone.filter((item) => item.price === "In Stock").length} */}
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
                £989
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
                £1090
                {/* {
                  phone.filter((item) => item.stock_status === "Out of Stock")
                    .length
                } */}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* <th className="table-header">ID</th> */}
                <th className="table-header">Model</th>
                <th className="table-header">Color</th>
                <th className="table-header">IMEI</th>
                <th className="table-header">Price</th>
                <th className="table-header">Status</th>
                <th className="table-header">Created At</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {phones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No phones found.
                  </td>
                </tr>
              ) : (
                phones
                  .filter((item) => {
                    const term = searchTerm.toLowerCase();
                    return (
                      (item.brand && item.brand.toLowerCase().includes(term)) ||
                      (item.model && item.model.toLowerCase().includes(term)) ||
                      (item.color && item.color.toLowerCase().includes(term)) ||
                      (item.imei && item.imei.toLowerCase().includes(term)) ||
                      (item.price && item.price.toLowerCase().includes(term)) ||
                      (item.status &&
                        item.status.toLowerCase().includes(term)) ||
                      (item.created_at &&
                        item.created_at.toLowerCase().includes(term))
                    );
                  })
                  .map((item) => (
                    <tr key={item.id}>
                      <td className="table-cell">
                        {item.brand} {item.model}
                      </td>
                      <td className="table-cell">{item.color}</td>
                      <td className="table-cell">{item.imei}</td>
                      <td className="table-cell">{item.price}</td>
                      <td className="table-cell">{item.status}</td>
                      <td className="table-cell">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="table-cell">
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="btn-icon ml-2"
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Phones;
