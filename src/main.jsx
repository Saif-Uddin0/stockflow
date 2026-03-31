import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

import { router } from "./route/Routes";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />

    <ToastContainer position="top-right" autoClose={2000} />
    <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
  </QueryClientProvider>
);