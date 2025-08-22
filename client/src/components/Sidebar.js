import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Smartphone,
  Wrench,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    {
      path: "/",
      name: "Dashboard",
      icon: Home,
      description: "Overview and analytics",
    },
    {
      path: "/customers",
      name: "Customers",
      icon: Users,
      description: "Manage customer database",
    },
    {
      path: "/items",
      name: "Items",
      icon: Package,
      description: "Products and services",
    },
    {
      path: "/sales",
      name: "Sales",
      icon: ShoppingCart,
      description: "Track transactions",
    },
    {
      path: "/inventory",
      name: "Inventory",
      icon: BarChart3,
      description: "Stock management",
    },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Smartphone className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              PhoneBox Gadgets
            </h2>
            <p className="text-sm text-gray-500">Repair & Accessories</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 group ${
                    isActive
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-700">
                    {item.description}
                  </div>
                </div>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 px-4 py-3 text-gray-600">
            <Wrench className="h-5 w-5" />
            <div>
              <div className="font-medium text-sm">Professional Service</div>
              <div className="text-xs text-gray-500">
                Quality repairs guaranteed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
