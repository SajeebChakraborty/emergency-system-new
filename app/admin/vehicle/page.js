"use client";
import axiosClient from "@/app/axiosClient";

import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
function Vehicle() {
    const [vehicle, setVehicleList] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterData, setFilterData] = useState([]);

    const fetchData = async () => {
        try {
            const { data } = await axiosClient.get("vehicle");

            let resData = [];
            if (data && data.result) {
                data.result.map((item) => {
                    let tDeta = {
                        "agency": item.agency && item.agency.name,
                        "vehicle_ID": item.vehicle_id,
                        "capacity": item.capacity,
                        "brand_name": item.brand_name,
                        "body_type": item.brand_type,
                        "armoured": item.armouted,
                        "fuel_type": item.fuel_type,
                        _id: item._id,
                    };

                    resData.push(tDeta);
                });
                setFilterData(resData);
                setVehicleList(resData);
            }
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        getData();
    }, [searchQuery, sortOrder, sortBy]);

    const handleSort = (key) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(key);
            setSortOrder("asc");
        }
    };

    function getData() {
        let searchData = searchByNameSimilar(vehicle, searchQuery, [
            "agency",
            "vehicle_ID",
            "capacity",
            "brand_name",
            "body_type",
            "armoured",
            "fuel_type",
        ]);
        const sortedData = [...searchData].sort((a, b) => {
            if (
                typeof a[sortBy] === "string" &&
                typeof b[sortBy] === "string"
            ) {
                return sortOrder === "asc"
                    ? a[sortBy].localeCompare(b[sortBy])
                    : b[sortBy].localeCompare(a[sortBy]);
            } else {
                return sortOrder === "asc"
                    ? a[sortBy] - b[sortBy]
                    : b[sortBy] - a[sortBy];
            }
        });

        setFilterData(sortedData);
    }

    function searchByNameSimilar(array, searchTerm, columns) {
        let _data = [];

        for (var i = 0; i < columns.length; i++) {
            let tData = array.filter((item) =>
                item[columns[i]]
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
            if (tData.length > 0) {
                _data = tData;
                break;
            }
        }

        return _data;
    }

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    function setScortActiveClass(key) {
        if (key === sortBy) {
            return sortOrder;
        }
    }

    let head = (
        <tr className="has-sorting">
            <th
                onClick={() => handleSort("agency")}
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${setScortActiveClass(
                    "agency"
                )}`}
            >
                Agency
            </th>
            <th
                onClick={() => handleSort("vehicle_ID")}
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${setScortActiveClass(
                    "vehicle_ID"
                )}`}
            >
                Vehicle ID
            </th>
            <th
                onClick={() => handleSort("capacity")}
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${setScortActiveClass(
                    "capacity"
                )}`}
            >
                Capacity
            </th>
            <th
                onClick={() => handleSort("brand_name")}
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${setScortActiveClass(
                    "brand_name"
                )}`}
            >
                brand name
            </th>
            <th
                onClick={() => handleSort("body_type")}
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${setScortActiveClass(
                    "body_type"
                )}`}
            >
                bbody type
            </th>
            <th
                onClick={() => handleSort("armoured")}
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${setScortActiveClass(
                    "armoured"
                )}`}
            >
                armoured
            </th>
            <th
                onClick={() => handleSort("fuel_type")}
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${setScortActiveClass(
                    "fuel_type"
                )}`}
            >
                fuel type
            </th>
            <th
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider no-sort`}
            >
                Action
            </th>
        </tr>
    );

    const body = (
        <>
            {Array.isArray(filterData) &&
                filterData.map((item, index) => (
                    <tr key={index}>

                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <div className='flex'>
                                <div className='ml-3'>
                                    <p className='text-gray-900 whitespace-no-wrap'>
                                        {item.agency && item.agency.name}
                                    </p>
                                </div>
                            </div>
                        </td>

                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <p className='text-gray-900 whitespace-no-wrap'>
                                {item.vehicle_id}
                            </p>

                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <div className='flex'>

                                <div className='ml-3'>
                                    <p className='text-gray-900 whitespace-no-wrap'>
                                        {item.capacity}
                                    </p>

                                </div>
                            </div>
                        </td>

                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <p className='text-gray-900 whitespace-no-wrap'>
                                {item.brand_name}
                            </p>
                            {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                            {/*    USD*/}
                            {/*</p>*/}
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <p className='text-gray-900 whitespace-no-wrap'>
                                {item.brand_type}
                            </p>
                            {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                            {/*    USD*/}
                            {/*</p>*/}
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <p className='text-gray-900 whitespace-no-wrap'>
                                {item.armouted}
                            </p>
                            {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                            {/*    USD*/}
                            {/*</p>*/}
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <p className='text-gray-900 whitespace-no-wrap'>
                                {item.fuel_type}
                            </p>
                            {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                            {/*    USD*/}
                            {/*</p>*/}
                        </td>

                        <td
                            className='relative px-5 py-5 border-b border-gray-200 bg-white text-sm'
                            style={{ whiteSpace: "nowrap" }}
                        >
                            <Link
                                href={{
                                    pathname: "/admin/vehicle/edit",
                                    query: { id: item._id },
                                }}
                                className='px-4 py-2 mx-2 bg-main text-white rounded'
                            >
                                {" "}
                                Edit
                            </Link>
                            <button
                                onClick={async () => {
                                    // Show a confirmation alert
                                    const confirmed = window.confirm(
                                        "Are you sure you want to delete?"
                                    );

                                    if (confirmed) {
                                        // Make a DELETE request to your API to mark the question as deleted
                                        try {
                                            await axiosClient.delete(
                                                `vehicle/${item._id}`,
                                                {
                                                    method: "DELETE",
                                                    headers: {
                                                        "Content-Type":
                                                            "application/json",
                                                    },
                                                }
                                            );
                                            Swal.fire({
                                                title: "success",
                                                text: "Successfully Deleted",
                                                icon: "success",
                                                // confirmButtonText: 'Cool'
                                            });

                                            //setMessage('Delete successfully');
                                            // Remove the deleted question from the state
                                            //setData(data => data.filter(item => item._id !== val._id));
                                            fetchData();
                                        } catch (error) {
                                            console.error(
                                                "Error deleting question:",
                                                error
                                            );
                                        }
                                    }
                                }}
                                className='px-4 py-2 mx-2 bg-red-500 text-white rounded hover:bg-red-600'
                            >
                                Delete
                            </button>
                            {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                            {/*    000004*/}
                            {/*</p>*/}
                        </td>
                    </tr>
                ))}
        </>
    );

    return (
        <div className='flex h-screen overflow-hidden'>
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                <main>
                    <div className='container mx-auto px-4 sm:px-8'>
                        <div className='py-8'>
                            <div className='flex gap-5 flex-wrap items-center justify-between'>
                                <h2 className='text-2xl font-semibold leading-tight'>
                                    Vehicle
                                </h2>

                                <div className='relative w-full sm:w-80 flex items-center h-12 rounded-md focus-within:shadow-lg bg-white overflow-hidden'>
                                <div className='grid place-items-center h-full w-12 text-gray-300 hover:text-indigo-400'>
                                    <button type='submit'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            className='h-6 w-6'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'
                                        >
                                            <path
                                                className='transition'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <input
                                    className='peer h-full w-full outline-none text-sm text-gray-700 pr-2'
                                    type='text'
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder='Search something..'
                                />
                            </div>
                            </div>
                            {/* Table */}
                            <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
                                <div className='inline-block min-w-full shadow-md rounded-lg overflow-hidden border-lite'>
                                    <div className='table-wrap'>
                                        <table className='min-w-full leading-normal'>
                                            <thead>{head}</thead>
                                            <tbody>{body}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Vehicle;
