"use client";
import { addClient, getUserData } from "@/utils/action";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AddClient = () => {
  const [user, setUser] = useState({
    username: "",
    name: "",
    password: "",
    role: "",
    credits: "",
  });
  const [userRole, setUserRole] = useState("");
  const data = useSelector((state) => state.userData);
  const myRole = data.role;

  useEffect(() => {
    switch (myRole) {
      case "master":
        setUserRole("distributor");
        break;
      case "distributor":
        setUserRole("subdistributor");
        break;
      case "subdistributor":
        setUserRole("store");
        break;
      case "store":
        setUserRole("player");
        break;
      default:
        setUserRole("");
        break;
    }
  }, [myRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (myRole !== "company") {
      user.role = userRole;
    }

    if (
      user.username === "" ||
      user.name === "" ||
      user.password === "" ||
      user.role === "" ||
      user.credits === ""
    ) {
      return toast.error("All fileds are required!");
    } else if (user.credits < 0) {
      return toast.error("Credit can't be negative");
    }
    try {
      const response = await addClient(user);
      toast.success("Client Added successfully!");
      setUser({
        username: "",
        name: "",
        password: "",
        role: "",
        credits: "",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="h-[90%] w-full  flex items-center dark:bg-Dark justify-center">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 gap-y-10 overflow-hidden w-[50%] dark:bg-Dark_light shadow-xl bg-white m-auto px-16 py-12 rounded-2xl text-black dark:text-white border-[#8b7cfd5b] border-[1px]"
      >
        <p className="text-left font-light">Username :</p>
        <input
          name="username"
          onChange={handleChange}
          value={user.username}
          className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e] "
        />
        <p className="text-left font-light">Name :</p>
        <input
          name="name"
          onChange={handleChange}
          value={user.name}
          className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e] "
        />
        <p className="text-left font-light">Password :</p>
        <input
          name="password"
          onChange={handleChange}
          value={user.password}
          className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e] "
        />
        <p className="text-left font-light">Role :</p>
        {myRole === "company" ? (
          <select
            name="role"
            id="role"
            value={user.role}
            onChange={handleChange}
            className="outline-none bg-transparent w-full text-left font-extralight text-gray-400 border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e]"
          >
            <option value="master">master</option>
            <option value="distributor">distributor</option>
            <option value="subdistributor">sub-distributor</option>
            <option value="store">store</option>
            <option value="player">player</option>
          </select>
        ) : (
          <input
            name="role"
            type="text"
            value={userRole}
            className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e]"
          />
        )}
        <p className="text-left font-light">Credits :</p>
        <input
          name="credits"
          type="number"
          onChange={handleChange}
          value={user.credits}
          className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e]"
        />
        <div className="col-span-2 flex justify-center mt-2">
          <button
            type="submit"
            className="text-center flex justify-center px-4 items-center gap-2 bg-gradient-to-r from-[#8C7CFD] hover:from-[#BC89F1] hover:to-[#8C7CFD] to-[#BC89F1] mx-auto text-white text-xl rounded-md p-2 font-light hover:shadow-[0_30px_10px_-15px_rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
