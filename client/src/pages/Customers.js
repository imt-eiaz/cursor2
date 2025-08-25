import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    product: "",
    repair: "",
    password: "",
    price: "",
    note: "",
    status: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/customers");
      setCustomers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCustomer) {
        await axios.put(
          `http://localhost:5000/api/customers/${editingCustomer.id}`,
          formData
        );

        toast.success("Customer updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/customers", formData);
        toast.success("Customer created successfully");
      }

      setShowModal(false);
      setEditingCustomer(null);
      resetForm();
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error(error.response?.data?.error || "Failed to save customer");
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      first_name: customer.first_name,
      last_name: customer.last_name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      product: customer.product || "",
      repair: customer.repair || "",
      password: customer.password || "",
      price: customer.price || "",
      note: customer.note || "",
      status: customer.status || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:5000/api/customers/${id}`);
        toast.success("Customer deleted successfully");
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("Failed to delete customer");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      product: "",
      repair: "",
      password: "",
      price: "",
      note: "",
      status: "",
    });
  };

  const openNewCustomerModal = () => {
    setEditingCustomer(null);
    resetForm();
    setShowModal(true);
  };

  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase();
    return (
      (customer.first_name &&
        customer.first_name.toLowerCase().includes(term)) ||
      (customer.last_name && customer.last_name.toLowerCase().includes(term)) ||
      (customer.email && customer.email.toLowerCase().includes(term)) ||
      (customer.phone && customer.phone.toLowerCase().includes(term)) ||
      (customer.address && customer.address.toLowerCase().includes(term)) ||
      (customer.product && customer.product.toLowerCase().includes(term)) ||
      (customer.repair && customer.repair.toLowerCase().includes(term)) ||
      (customer.password && customer.password.toLowerCase().includes(term)) ||
      (customer.price && customer.price.toLowerCase().includes(term)) ||
      (customer.note && customer.note.toLowerCase().includes(term)) ||
      (customer.status && customer.status.toLowerCase().includes(term))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer database</p>
        </div>
        <button
          onClick={openNewCustomerModal}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Customer</span>
        </button>
      </div>

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

      {/* Customers Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">ID</th>
                <th className="table-header">Joined</th>
                <th className="table-header">Name</th>
                <th className="table-header">Contact</th>
                <th className="table-header">Address</th>
                <th className="table-header">Product</th>
                <th className="table-header">Repair</th>
                <th className="table-header">Password</th>
                <th className="table-header">Price</th>
                <th className="table-header">Note</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell text-sm text-gray-500">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.first_name} {customer.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        {/* <Mail className="h-4 w-4 mr-2 text-gray-400" /> */}
                        {/* {customer.email} */}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    {customer.address ? (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate max-w-xs">
                          {customer.address}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No address</span>
                    )}
                  </td>

                  <td className="table-cell">{customer.product}</td>
                  <td className="table-cell">{customer.repair}</td>
                  <td className="table-cell">{customer.password}</td>
                  <td className="table-cell">{customer.price}</td>
                  <td className="table-cell">{customer.note}</td>
                  <td className="table-cell">{customer.status}</td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-primary-600 hover:text-primary-900 p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No customers found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms."
                : "Get started by creating a new customer."}
            </p>
          </div>
        )}
      </div>

      {/* Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-10">
          <div className="relative top-5 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCustomer ? "Edit Customer" : "Add New Customer"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      // required
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      className="input-field mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="text"
                    // required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input-field mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="input-field mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows="3"
                    className="input-field mt-1"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="modelName" className="form-label">
                    Product
                  </label>
                  <input
                    value={formData.product}
                    type="text"
                    className="input-field mt-1"
                    onChange={(e) =>
                      setFormData({ ...formData, product: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3  ">
                  <select
                    value={formData.repair}
                    type="text"
                    onChange={(e) =>
                      setFormData({ ...formData, repair: e.target.value })
                    }
                    className="mb-3 input-field  mt-4"
                    aria-label="Choose Repair Type"
                    // id="repairType"
                    // onChange={(e) => setType(e.target.value)}
                  >
                    <option defaultValue>Choose Repair</option>
                    <option value="Battery Replacement">
                      Battery Replacement
                    </option>
                    <option value="Display + Glass Replacement">
                      Display + Glass Replacement
                    </option>
                    <option value="Speaker Replacement">
                      Speaker Replacement
                    </option>
                    <option value="Camera Replacement">
                      Camera Replacement
                    </option>
                    <option value="Tempered Glass Replacement">
                      Tempered Glass Replacement
                    </option>
                    <option value="Button Replacement">
                      Button Replacement
                    </option>
                    <option value="Charging Port Replacement">
                      Charging Port Replacement
                    </option>
                    <option value="Body Housing Replacement">
                      Body Housing Replacement
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="modelName" className="form-label">
                    Password
                  </label>
                  <input
                    value={formData.password}
                    type="text"
                    className="input-field mt-1"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="modelName" className="form-label">
                    Price
                  </label>
                  <input
                    value={formData.price}
                    type="text"
                    className="input-field mt-1"
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="modelName" className="form-label">
                    Note
                  </label>
                  <textarea
                    value={formData.note}
                    rows="3"
                    className="input-field mt-1"
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <select
                    value={formData.status}
                    className="form-select input-field mt-1"
                    aria-label="Choose Mobile Brand"
                    id="mobileBrand"
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    // onChange={(e) => setBrand(e.target.value)}
                  >
                    <option selected>Choose status</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="PENDING">PENDING</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCustomer(null);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingCustomer ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
