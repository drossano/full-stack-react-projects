import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Blog } from "./pages/Blog.jsx";
import { Signup } from "./pages/Signup.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Blog />,
  },
  { path: "/signup", element: <Signup /> },
]);

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
