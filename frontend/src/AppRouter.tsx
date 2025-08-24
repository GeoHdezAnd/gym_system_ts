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
import AllTrainers from "./pages/private/admin/users/AllTrainers";
import TrainerEdit from "./pages/private/admin/users/TrainerEdit";
import ClientLayout from "./components/templates/ClientLayout";
import Main from "./pages/private/customer/Main";
import UserAccount from "./pages/private/customer/UserAccount";
import SettingsClientProfile from "./pages/private/customer/SettingsClientProfile";
import Training from "./pages/private/customer/workout/Training";
import EditCoaching from "./pages/private/customer/workout/EditCoaching";
import TrainerLayout from "./components/templates/TrainerLayout";
import MainTrainer from "./pages/private/trainer/Main";
import TrainerAccount from "./pages/private/trainer/TrainerAccount";
import Coaching from "./pages/private/trainer/Coaching";
import MemberCoaching from "./pages/private/trainer/MemberCoaching";
import SettingProfile from "./pages/private/trainer/SettingProfile";
import CreateWorkOut from "./pages/private/trainer/CreateWorkOut";
import EditWorkOut from "./pages/private/trainer/EditWorkOut";

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
                            path="user/trainer/all"
                            element={<AllTrainers />}
                        />
                        <Route
                            path="user/trainer/:trainerId/:action"
                            element={<TrainerEdit />}
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

                    <Route path="/user" element={<ClientLayout />}>
                        <Route index element={<Main />} />
                        <Route path="training" element={<Training />} />
                        <Route
                            path="training/coaching"
                            element={<EditCoaching />}
                        />
                        <Route path="profile" element={<UserAccount />} />
                        <Route
                            path="profile/setting"
                            element={<SettingsClientProfile />}
                        />
                    </Route>

                    <Route path="/trainer" element={<TrainerLayout />}>
                        <Route index element={<MainTrainer />} />
                        <Route path="profile" element={<TrainerAccount />} />
                        <Route path="coaching" element={<Coaching />} />
                        <Route
                            path="coaching/:id"
                            element={<MemberCoaching />}
                        />
                        <Route
                            path="coaching/:id/create-workout"
                            element={<CreateWorkOut />}
                        />
                        <Route
                            path="coaching/:id/workout/:idWorkout"
                            element={<EditWorkOut />}
                        />
                        <Route
                            path="profile/setting"
                            element={<SettingProfile />}
                        />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};
