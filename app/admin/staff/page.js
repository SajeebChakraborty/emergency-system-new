"use client";
import axiosClient from "@/app/axiosClient";

import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Staff() {
    const [staff, setStaffList] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(5);
    const [sortBy, setSortBy] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterData, setFilterData] = useState([]);

    const fetchData = async () => {
        try {
            const { data } = await axiosClient.get("staff");
            let resData = [];
            if (data && data.result) {
                data.result.map((item) => {
                    let tDeta = {
                        photo: item.staff_photo ? item.staff_photo : '',
                        name: item.name,
                        agency : item.agency && item.agency.name,
                        role : item.staff_role,
                        status: item.user.status,
                        classification: item.classification,
                        gender: item.gender,
                        _id: item._id,
                        _user_id: item.user._id,
                    };

                    resData.push(tDeta);
                });
                setFilterData(resData);
                setStaffList(resData);
            }
        } catch (error) {
            console.error("Error fetching drivers:", error);
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
        let searchData = searchByNameSimilar(staff, searchQuery, [
            "name",
            "agency",
            "staff_role",
            "status",
            "classification",
            "gender",
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

    const indexOfLastItem = currentPage * perPage;
    const indexOfFirstItem = indexOfLastItem - perPage;
    const currentItems =
        Array.isArray(staff) && staff.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    let head = (
        <tr className='has-sorting'>
            <th
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider no-sort`}
            >
                Photo
            </th>
            <th
                onClick={() => handleSort("name")}
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${setScortActiveClass(
                    "name"
                )}`}
            >
                Name
            </th>
            <th
                onClick={() => handleSort("agency")}
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${setScortActiveClass(
                    "agency"
                )}`}
            >
                Agency
            </th>
            <th
                onClick={() => handleSort("role")}
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${setScortActiveClass(
                    "role"
                )}`}
            >
                Role
            </th>
            <th
                onClick={() => handleSort("status")}
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${setScortActiveClass(
                    "status"
                )}`}
            >
                Status
            </th>
            <th
                onClick={() => handleSort("classification")}
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${setScortActiveClass(
                    "classification"
                )}`}
            >
                Classification
            </th>
            <th
                onClick={() => handleSort("gender")}
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${setScortActiveClass(
                    "gender"
                )}`}
            >
                Gender
            </th>
            <th
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider no-sort`}
            >
                Action
            </th>
        </tr>
    );

    {
        successMessage && (
            <div
                className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4'
                role='alert'
            >
                <strong className='font-bold'>Success!</strong>
                <span className='block sm:inline'>{successMessage}</span>
            </div>
        );
    }

    const body = (
        <>
            {Array.isArray(filterData) &&
                filterData.map((item, index) => (
                    <tr key={index}>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <div className='flex'>
                                <div className='ml-3'>
                                    <p className='text-gray-900 whitespace-no-wrap w-8 h-8 nx-image'>
                                        {item.staff_photo && (
                                            <img
                                                className='rounded-full'
                                                fill={true}
                                                src={`${item.staff_photo}`}
                                                alt={`${item.name}'s image`}
                                            />
                                        )}
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <div className='flex'>
                                <div className='ml-3'>
                                    <p className='text-gray-900 whitespace-no-wrap'>
                                        {item.name}
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <div className='flex'>
                                <div className='ml-3'>
                                    <p className='text-gray-900 whitespace-no-wrap'>
                                        {item.agency}
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <p className='text-gray-900 whitespace-no-wrap'>
                                {item.staff_role}
                            </p>
                        </td>

                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <p className='text-gray-900 whitespace-no-wrap'>
                                {item.status === 1
                                    ? "Unblocked"
                                    : "Blocked"}
                            </p>
                        </td>

                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <p className='text-gray-900 whitespace-no-wrap'>
                                {item.classification}
                            </p>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <p className='text-gray-900 whitespace-no-wrap'>
                                {item.gender}
                            </p>
                        </td>

                        <td
                            className='relative px-5 py-5 border-b border-gray-200 bg-white text-sm'
                            style={{ whiteSpace: "nowrap" }}
                        >
                            {/* <ActionDropdown /> */}

                            <Link
                                href={{
                                    pathname: "/admin/staff/log-history",
                                    query: { id: item._id },
                                }}
                                className='px-4 py-2 mx-2 bg-main text-white rounded'
                            >
                                {" "}
                                Log
                            </Link>

                            <Link
                                href={{
                                    pathname: "/admin/staff/details",
                                    query: { id: item._id },
                                }}
                                className='px-4 py-2 mx-2 bg-main text-white rounded'
                            >
                                {" "}
                                Details
                            </Link>

                            <button
                                onClick={async () => {
                                    // Show a confirmation alert
                                    const confirmed = window.confirm(
                                        "Are you sure you want to update the status?"
                                    );

                                    if (confirmed) {
                                        // Make a DELETE request to your API to mark the question as deleted
                                        try {
                                            const postData = {
                                                status: 1,
                                            };

                                            const response =
                                                await axiosClient.put(
                                                    `users/status-update/${item._user_id}`,
                                                    postData
                                                );

                                            //   await fetch(`/api/users/status-update/${item.user._id}`, {
                                            //       method: 'PUT',
                                            //       body:'',
                                            //       headers: {
                                            //           'Content-Type': 'application/json',
                                            //       },
                                            //   });

                                            console.log(response);
                                            setSuccessMessage(
                                                "Status Update successfully"
                                            );
                                            fetchData();
                                            // Remove the deleted question from the state
                                        } catch (error) {
                                            console.error(
                                                "Error deleting user:",
                                                error
                                            );
                                        }
                                    }
                                }}
                                className='px-4 py-2 mx-2 bg-red-500 text-white rounded hover:bg-red-600'
                            >
                                {item.status === 1 ? "Block" : "Unblock"}
                            </button>

                            <Link
                                href={{
                                    pathname: "/admin/staff/edit",
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
                                                `staff/${item._id}`,
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
                                    Staff
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

export default Staff;
