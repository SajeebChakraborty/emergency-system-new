"use client";

import axiosClient from "@/app/axiosClient";
import { useEffect, useState } from "react";

function SubCategoryCreate() {
  const [category, setCategoryList] = useState([]);
  const [categoryId, setCategoryId] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [slug, setSlug] = useState("");
  //success message
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage,setErrorMessage]=useState("");



  const handleSubCategoryNameChange = (value) => {
    setSubCategoryName(value);
  };

  const handleCategoryIdChange = (value) => {
    setCategoryId(value);
  };

  const handleSlugChange = (value) => {
    setSlug(value);
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
            const { data } = await axiosClient.get('categories');
            setCategoryList(data.result);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    fetchData();
}, []); // Empty dependency array means this effect runs only once, similar to componentDidMount



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Prepare data for API request
    const postData = {
      category_id:categoryId,
      name: subCategoryName,
      slug:slug
    };

    try {

        const response = await axiosClient.post('subcategories', postData);
        // Check if the response contains data
        console.log(response);
        if (response && response.data) {
          if(response.data.success==true)
          {
            setSuccessMessage("SubCategory Create Successfully");
            setSubCategoryName("");
            setCategoryId("");
            setSlug("");
          }
          else
          {
            const allErrors = extractErrors(response.data.error.errors);
            const errorMessageString = allErrors.join(', '); // Join errors into a single string
            setErrorMessage(errorMessageString);
          }
        } else {
          console.error('Response does not contain data:', response);
        }
      } catch (error) {
        console.error('Error during API call:', error);
      }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">


        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="font-sans antialiased bg-grey-lightest">
              {/* Content */}

              <form
                action="#"
                className="w-full bg-grey-lightest"
                style={{ paddingTop: "4rem" }}
                onSubmit={handleSubmit}
              >
                <div className="container mx-auto py-8">
                  <div className="w-5/6 mx-auto bg-white rounded shadow">
                    <div className="p-8">
                      <p className="text-2xl text-black font-bold">
                        SubCategory Create
                      </p>
                      <br></br>
                      {successMessage && (
                        <div
                          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4"
                          role="alert"
                        >
                          <strong className="font-bold">Success!</strong>
                          <span className="block sm:inline">
                            {successMessage}
                          </span>
                        </div>
                      )}
                       {errorMessage && (
                                                <div
                                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
                                                role="alert"
                                                >
                                                <strong className="font-bold">Error!</strong>
                                                <span className="block sm:inline">
                                                    {errorMessage}
                                                </span>
                                                </div>
                                            )}

                    <label className="block text-grey-darker text-sm font-bold mb-2">
                        Category
                      </label>
                      <div className="mb-4">
                        <select
                          className="appearance-none border rounded w-full py-2 px-3  text-grey-darker"
                          value={categoryId}
                          onChange={(e) => handleCategoryIdChange(e.target.value)}
                        >
                          <option value="" disabled hidden>
                            Select Category
                          </option>
                          {category.map((val) => (
                            <option key={val.id} value={val._id}>
                              {val.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-grey-darker text-sm font-bold mb-2"
                          htmlFor="questionName"
                        >
                          SubCategory Name
                        </label>
                        <input
                          className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                          id="subcategoryName"
                          type="text"
                          placeholder="Enter your subcategory name"
                          value={subCategoryName}
                          onChange={(e) =>
                            handleSubCategoryNameChange(e.target.value)
                          }

                        />
                      </div>

                      <div className="mb-4">
                        <label
                          className="block text-grey-darker text-sm font-bold mb-2"
                          htmlFor="questionName"
                        >
                          Slug
                        </label>
                        <input
                          className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                          id="slug"
                          type="text"
                          placeholder="Enter your slug"
                          value={slug}
                          onChange={(e) =>
                            handleSlugChange(e.target.value)
                          }

                        />
                      </div>

                      <div className="flex items-center justify-between mt-8">
                        <button
                          className="bg-main duration-300 leading-normal transition opacity-80 hover:opacity-100 text-white font-bold py-2 px-4 rounded"
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function extractErrors(errors) {
    const result = [];
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const errorDetails = errors[key];
        const errorMessage = errorDetails.properties.message;
        result.push(`${key}: ${errorMessage}`);
      }
    }
    return result;
}

export default SubCategoryCreate;

