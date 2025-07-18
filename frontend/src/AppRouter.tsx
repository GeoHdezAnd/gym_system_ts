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
import AllCustomers from "./pages/private/admin/users/AllCustomers";
import CustomerEdit from "./pages/private/admin/users/CustomerEdit";
import AddMembership from "./pages/private/admin/memberships/AddMembership";
import AllMemberships from "./pages/private/admin/memberships/AllMemberships";
import { EditMembership } from "./pages/private/admin/memberships/EditMembership";
import Settings from "./pages/private/admin/Settings";

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
                        <Route path="user/add" element={<UsersAdd />} />
                        <Route
                            path="user/customer/all"
                            element={<AllCustomers />}
                        />
                        <Route
                            path="user/customer/:userId/:action"
                            element={<CustomerEdit />}
                        />
                        <Route
                            path="membership/add"
                            element={<AddMembership />}
                        />
                        <Route
                            path="membership/all"
                            element={<AllMemberships />}
                        />
                        <Route
                            path="membership/:id/edit"
                            element={<EditMembership />}
                        />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};
