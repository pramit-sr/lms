import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Outer Wrapper for 10% margin */}
      <div className="w-[80%] mx-auto">

        {/* Navbar */}
        <nav className="bg-white-100 shadow-md px-4 py-4 flex items-center justify-between relative">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            {/* <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" /> */}
            <h1 className="text-xl font-bold text-green-700">KnowledgePlus</h1>
          </div>

          {/* Centered Nav Links */}
          <ul className="absolute left-1/2 transform -translate-x-1/2 flex gap-6">
            <li>
              <Link to="/" className="flex items-center text-gray-700 hover:text-green-600">
                <RiHome2Fill className="mr-1" /> Home
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center text-green-600 font-semibold">
                <FaDiscourse className="mr-1" /> Courses
              </Link>
            </li>
            <li>
              <Link to="/purchases" className="flex items-center text-gray-700 hover:text-green-600">
                <FaDownload className="mr-1" /> Purchases
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center text-gray-700 hover:text-green-600">
                <IoMdSettings className="mr-1" /> Settings
              </Link>
            </li>
          </ul>

          {/* Right Side: Search & Auth */}
          <div className="flex items-center gap-4">
            <div className="flex border border-gray-300 rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 focus:outline-none"
              />
              <button className="px-4 bg-green-200 text-green-700">
                <FiSearch />
              </button>
            </div>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <IoLogOut className="mr-1" /> Logout
              </button>
            ) : (
              <Link to="/login" className="flex items-center text-green-600 hover:text-green-800">
                <IoLogIn className="mr-1" /> Login
              </Link>
            )}
            <FaCircleUser className="text-3xl text-green-600" />
          </div>
        </nav>

        {/* Main Section */}
        <main className="p-6">
          {/* Centered Header */}
          <header className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-green-700">Courses</h2>
          </header>

          {/* Course Cards */}
          <div className="overflow-y-auto max-h-[75vh]">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : courses.length === 0 ? (
              <p className="text-center text-gray-500">
                No course posted yet by admin
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="border border-gray-200 rounded-lg p-3 shadow-sm scale-90 hover:scale-95 transition-transform duration-300"
                  >
                    <img
                      src={course.image.url}
                      alt={course.title}
                      className="rounded mb-3"
                    />
                    <h2 className="font-semibold text-md mb-2">{course.title}</h2>
                    <p className="text-gray-600 text-sm mb-3">
                      {course.description.length > 100
                        ? `${course.description.slice(0, 100)}...`
                        : course.description}
                    </p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-green-700">
                        ₹{course.price}{" "}
                        <span className="text-gray-400 line-through">5999</span>
                      </span>
                      <span className="text-green-500 text-sm">20% off</span>
                    </div>
                    <Link
                      to={`/buy/${course._id}`}
                      className="bg-green-500 w-full text-white px-4 py-2 rounded-lg hover:bg-green-600 duration-300 block text-center text-sm"
                    >
                      Buy Now
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Courses;
