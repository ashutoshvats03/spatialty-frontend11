"use client";
import { setdisplayContent } from '@/app/redux/slices/contentSlice';
import Image from "next/image";
import NavLink from "next/link";
import { useContext, useState } from "react";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { MdAccountCircle, MdSpaceDashboard } from "react-icons/md";
import { RiLoginCircleFill, RiLogoutCircleFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import AuthContext from "../context/AuthContext";


export default function Home() {
  const { user, logout ,data } = useContext(AuthContext); // Get user and logout from AuthContext
  const [dashboard, setDashboard] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false); // State for profile dropdown
  const [showMenu, setShowMenu] = useState(false); // State for the arrow and menu

  const dispatch = useDispatch();
  const toggleArrowMenu = () => {
    setShowMenu(!showMenu);
    setProfileMenu(false);
    setDashboard(false);
    setTimeout(() => {
      setShowMenu(false);
    }, 5000);
  };

  const toggleProfileMenu = () => {
    setProfileMenu(!profileMenu);
    setShowMenu(false);
    setDashboard(false);
    setTimeout(() => {
      setProfileMenu(false);
    }, 5000);
  };

  const toggleDashboard = () => {
    setDashboard(!dashboard);
    setProfileMenu(false);
    setShowMenu(false);
    setTimeout(() => {
      setDashboard(false);
    }, 5000);
  };

  return (
    <div className="  border-b-2 border-black ">
      <div className="flex justify-between px-20">
        <div className="text-3xl font-bold m-2">
          <NavLink href="/">
            {process.env.NODE_ENV !== "development" ? (
              <Image src="/img/logo1.png" width={200} height={200} alt="logo" />
            ) : (
              <Image src="/spatialty-web-app/img/logo1.png" width={200} height={200} alt="logo" />
            )}
          </NavLink>
        </div>
        <div className="flex gap-16 my-auto">
          <div>
            <IoIosNotifications className="bg-white" size={40} />
          </div>

          {/* Arrow to toggle menu */}
          <div className="relative cursor-pointer" onClick={toggleArrowMenu}>
            {showMenu ? <FaChevronCircleUp className="bg-white" size={40} /> : <FaChevronCircleDown className="bg-white" size={40} />}
            <div
              className={`absolute border p-3 bg-white text-black z-10  my-2 mx-3 font-extrabold text flex-col w-fit  shadow-sm shadow-black transform -translate-x-10 translate-y-10 top-0 left-0 ${showMenu ? "flex" : "hidden"
                }`}
            >
              {user ? (
                <div className="logout  flex" onClick={() => { logout(); dispatch(setdisplayContent(true)); }}>
                  <RiLogoutCircleFill size={30} />
                  <span>Logout</span>
                </div>
              ) : (
                <div className="flex flex-col bg-white ">
                  <div className="login flex gap-3 ">
                    <RiLoginCircleFill size={30} />
                    <NavLink href="/login">Login User</NavLink>
                  </div>
                  <div className="login flex gap-3">
                    <RiLoginCircleFill size={30} />
                    <NavLink href="/adminLogin">Login Admin</NavLink>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile icon */}
          <div className="relative cursor-pointer" onClick={toggleProfileMenu}>
            <MdAccountCircle className="" size={40} />
            <div
              className={`absolute bg-white  text-black z-10 gap-3 py-2 px-3 font-extrabold text flex-col w-fit my-2 shadow-sm shadow-black transform -translate-x-10 translate-y-10 top-0 left-0 ${profileMenu ? "flex" : "hidden"
                }`}
            >
              {user ? (
                <div className="profile-info flex">
                  <span>Welcome, {user.username}</span>
                </div>
              ) : (
                <div className="login-info">
                  <span>Please log in to access more features</span>
                </div>
              )}
            </div>
          </div>

          {/* Dashboard icon and dropdown */}
          {data?.length !== 0 && (
            <NavLink href="/wayVision1">
              <MdSpaceDashboard
                size={40}
                className="cursor-pointer  "
              />
            </NavLink>

          )}
        </div>
      </div>
      <div className="border-2 border-white"></div>
    </div>
  );
}
