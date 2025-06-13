import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./lib/context/auth-provider";
import AuthLayout from "./components/templates/AuthLayout";
import Login from "./pages/public/Login";
import Dashboard from "./pages/private/admin/Dashboard";
import DashboardLayout from "./components/templates/DashboardLayout";
import Register from "./pages/public/Register";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import ConfirmAccount from "./pages/public/ConfirmAccount";
import UsersAdd from "./pages/private/admin/users/UsersAdd";
import AllUsers from "./pages/private/admin/users/AllUsers";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<AuthLayout />}>
                        <Route index element={<Login />} />
                        <Route path="/sign-up" element={<Register />} />
                        <Route
                            path="/confirm-account/:token"
                            element={<ConfirmAccount />}
                        />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                        <Route
                            path="/reset-password/:token"
                            element={<ResetPassword />}
                        />
                    </Route>
                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="users/add" element={<UsersAdd />} />
                        <Route path="users/all" element={<AllUsers />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};
