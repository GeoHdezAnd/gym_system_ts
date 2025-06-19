import { CustomerTable } from "../../../../components/organisms";

export default function AllCustomers() {
    return (
        <div className="container mx-auto p-6 max-w-6xl text-white space-y-6">
            <div>
                <h1 className="text-2xl font-semibold  mb-2">Usuarios</h1>
                <p className="text-sm text-gray-300">
                    Centro de control de clientes
                </p>
            </div>
            <CustomerTable />
        </div>
    );
}
