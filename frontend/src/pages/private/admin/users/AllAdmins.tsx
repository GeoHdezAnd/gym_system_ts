import { useQuery } from "@tanstack/react-query";
import { getAllAdmins } from "../../../../api/AdminApi";
import { AdminTable } from "../../../../components/organisms/admin";

export default function AllAdmins() {
    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => getAllAdmins(),
        queryKey: ["admins"],
    });

    return (
        <div className="container  text-white space-y-4 ">
            <>
                <h1 className="text-2xl font-semibold  mb-2">
                    Administradores
                </h1>
                <p className="text-sm text-gray-300">
                    Centro de control de administradores
                </p>

                <AdminTable
                    data={data || []}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                />
            </>
        </div>
    );
}
