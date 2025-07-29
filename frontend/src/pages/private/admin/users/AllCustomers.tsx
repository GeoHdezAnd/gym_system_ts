import { useQuery } from "@tanstack/react-query";
import { CustomerTable } from "../../../../components/organisms/users";
import { getMembers } from "../../../../api/MemberApi";
import {
    RiArrowLeftLine,
    RiArrowRightLine,
    RiSearchLine,
} from "react-icons/ri";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";

export default function AllCustomers() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [searchDebounce] = useDebounce(search, 1000);

    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => getMembers({ page, limit, search }),
        queryKey: ["members", page, limit, searchDebounce], // Estos campos están dentro ya que se vuelve a hacer la petición en cuanto hay cambio en esos valores
    });

    const {
        members = [],
        pagination = {
            currentPage: 1,
            pages: 1,
            total: 0,
        },
    } = data || {};

    // Controladores de paginación
    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < pagination.pages) setPage(page + 1);
        console.log("next", page);
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newList = Number(e.target.value);
        setLimit(newList);
        setPage(1); // Regresar a primera pagina al cambiar limite
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Resetear a primera pagina al buscar
    };


    return (
        <div className="container  text-white space-y-4 ">
            <>
                <h1 className="text-2xl font-semibold  mb-2">Clientes</h1>
                <p className="text-sm text-gray-300">
                    Centro de control de clientes
                </p>

                <div className="flex gap-2 mb-4 items-center">
                    <input
                        type="text"
                        placeholder="Buscar cliente por nombre, telefono, email o apellido..."
                        value={search}
                        onChange={handleSearchChange}
                        className="border text-sm border-gray-600 rounded-md p-1 px-3 bg-gray-800 text-white w-full max-w-md
               focus:outline-none focus:ring-[.5px] focus:ring-gray-600 focus:ring-opacity-50
               transition-all duration-200 ease-in-out focus:scale-[1.01]"
                    />
                    <RiSearchLine className="text-gray-600" />
                </div>
            </>
            <CustomerTable
                data={members || []}
                isLoading={isLoading}
                isError={isError}
                error={error}
            />

            <div className="grid lg:flex lg:justify-between items-center px-4 text-sm max-sm:pb-10">
                <p className="flex gap-2">
                    Mostrando {(page - 1) * limit + 1}-
                    {Math.min(page * limit, pagination.total)} de{" "}
                    {pagination.total}
                </p>

                <div className="flex justify-between lg:gap-8 pr-8">
                    <div className="flex gap-1 lg:gap-4 items-center">
                        <p className="text-gray-300">Campos por página</p>
                        <select
                            className="border border-gray-500 rounded-md bg-gray-800 text-white p-1"
                            id="limit"
                            value={limit}
                            onChange={handleLimitChange}
                        >
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 1}
                            className={`bg-gray-300/20 p-1 rounded-md drop-shadow-2xl shadow-amber-50 cursor-pointer transform-all duration-200 ${
                                page === 1
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-300/30"
                            }`}
                        >
                            <RiArrowLeftLine className="text-lg" />
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={page >= pagination.pages}
                            className={`bg-gray-300/20 p-1 rounded-md drop-shadow-2xl shadow-amber-50 cursor-pointer transform-all duration-200 ${
                                page >= pagination.pages
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-300/30"
                            }`}
                        >
                            <RiArrowRightLine className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
