import { createBrowserRouter } from "react-router";

// Layouts
import Root   from "../layout/Root";
import Auth   from "../layout/Auth";

// Private route guard
import PrivateRoute from "./PrivateRoute";

// Dashboard
import Dashboard from "../pages/Dashboard/Dashboard";

// Product Pages
import ProductList from "../pages/Products/ProductList";
import AddProduct  from "../pages/Products/AddProduct";

// Category Pages
import CategoryList from "../pages/Categories/CategoryList";

// Order Pages
import OrderList    from "../pages/Orders/OrderList";
import CreateOrder  from "../pages/Orders/CreateOrder";

// Restock
import RestockQueue from "../pages/Restock/RestockQueue";

// Auth Pages
import Login  from "../pages/Authentication/Login";
import Signup from "../pages/Authentication/Signup";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Root />
      </PrivateRoute>
    ),
    children: [
      { index: true,            element: <Dashboard /> },
      { path: "products",       element: <ProductList /> },
      { path: "add-product",    element: <AddProduct /> },
      { path: "categories",     element: <CategoryList /> },
      { path: "orders",         element: <OrderList /> },
      { path: "create-order",   element: <CreateOrder /> },
      { path: "restock",        element: <RestockQueue /> },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      { path: "login",  element: <Login /> },
      { path: "signup", element: <Signup /> },
    ],
  },
]);