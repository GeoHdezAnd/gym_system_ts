import { useQuery } from "@tanstack/react-query";
import { getMemberships } from "../../../../api/MembershipApi";
import { MembershipsTable } from "../../../../components/organisms";

export default function AllMemberships() {
    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => getMemberships(),
        queryKey: ["memberships"],
    });

    return (
        <div className="container text-white space-y-4">
            <>
                <h1 className="text-2xl font-semibold  mb-2">Membresias</h1>
                <p className="text-sm text-gray-300">
                    Centro de control de membresias
                </p>
            </>
            <MembershipsTable
                data={data || []}
                isLoading={isLoading}
                isError={isError}
                error={error}
            />
        </div>
    );
}
