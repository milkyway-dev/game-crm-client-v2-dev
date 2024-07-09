"use client";
import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Clients from "./Clients";
import Transactions from "./Transaction";

const Subordinate = ({ subordinateData }) => {
  const [option, setOption] = useState("report");
  return (
    <div>
      <div className="w-[94%] pt-3  m-auto">
        <h1 className="text-2xl text-black dark:text-gray-400 ">{subordinateData.name}</h1>
      </div>
      <Dashboard data={subordinateData} />
      <div className="flex w-[95%] mx-auto gap-5 my-5">
        <button
          onClick={() => {
            setOption("report");
          }}
          className={`px-4 py-2 bg-[#7969ed50] rounded-md ${
            option === "report" ? "text-white bg-[#8D7CFD]" : "text-[#f4f2f2ac]"
          } border-[1px] border-[#e3e2eb56]`}
        >
          Report
        </button>
        <button
          onClick={() => {
            setOption("subordinates");
          }}
          className={`px-4 py-2 bg-[#7969ed50] rounded-md ${
            option === "subordinates" ? "text-white bg-[#8D7CFD]" : "text-[#f4f2f2ac]"
          } border-[1px] border-[#e3e2eb56] transition-all`}
        >
          Subordinates
        </button>
        <button
          onClick={() => {
            setOption("transactions");
          }}
          className={`px-4 py-2 bg-[#7969ed50] rounded-md ${
            option === "transactions" ? "text-white bg-[#8D7CFD]" : "text-[#f4f2f2ac]"
          } border-[1px] border-[#e3e2eb56] transition-all`}
        >
          Transactions
        </button>
      </div>
      {subordinateData && option === "subordinates" && (
        <Clients clientData={subordinateData?.subordinates} />
      )}
      {subordinateData && option === "transactions" && (
        <Transactions transactions={subordinateData?.transactions} />
      )}
    </div>
  );
};

export default Subordinate;