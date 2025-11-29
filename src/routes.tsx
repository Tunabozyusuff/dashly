import { Navigate } from "react-router-dom";
import { useRoutes } from "react-router";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import UsersPage from "./pages/UsersPage";
import PostsPage from "./pages/PostsPage";
import SignupPage from "./pages/SignupPage";
import PublicRoute from "./components/auth/PublicRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function AppRoutes() {
    const routes = useRoutes([
        {
            path: "/",
            element: <Navigate to="/login" replace />,
        },
        {
            path: "/login",
            element: (
                <PublicRoute>
                    <LoginPage />
                </PublicRoute>
            ),
        },
        {
            path: "/signup",
            element: (
                <PublicRoute>
                    <SignupPage />
                </PublicRoute>
            ),
        },
        {
            path: "/dashboard",
            element: (
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
            ),
        },
        {
            path: "/products",
            element: (
                <ProtectedRoute>
                    <ProductsPage />
                </ProtectedRoute>
            ),
        },
        {
            path: "/products/:id",
            element: (
                <ProtectedRoute>
                    <ProductDetailPage />
                </ProtectedRoute>
            ),
        },
        {
            path: "/users",
            element: (
                <ProtectedRoute>
                    <UsersPage />
                </ProtectedRoute>
            ),
        },
        {
            path: "/posts",
            element: (
                <ProtectedRoute>
                    <PostsPage />
                </ProtectedRoute>
            ),
        },
        {
            path: "*",
            element: <Navigate to="/login" replace />,
        },
    ]);

    return routes;
}
