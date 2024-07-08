"use client";
import Modal from "@/components/ui/Modal";
import { deleteGame, getGames } from "@/utils/action";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdDeleteOutline } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import GameDetails from "@/components/ui/modals/GameDetails";
import { MdEdit } from "react-icons/md";
import EditGame from "@/components/ui/modals/EditGame";
import Loader from "@/components/ui/Loader";
import { FaCircle } from "react-icons/fa";
import TableComponent from "@/components/TableComponent";

const Game = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState();
  const [refresh, setRefresh] = useState(false);
  const [modalType, setModalType] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const optionList = [];

  let ModalContent;
  switch (modalType) {
    case "Game Details":
      ModalContent = <GameDetails data={rowData} />;
      break;

    case "Edit Game":
      ModalContent = (
        <EditGame
          prevData={rowData}
          id={rowData._id}
          setRefresh={setRefresh}
          setOpen={setOpen}
          refresh={refresh}
        />
      );
      break;

    default:
      ModalContent = null;
  }
  const handleModalOpen = (type) => {
    setModalType(type);
    setOpen(true);
  };

  const handleRowClick = (data) => {
    setRowData(data);
  };

  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await getGames();
      setData(response.data);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await deleteGame(id);
      toast.success(response.data.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [refresh]);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const tableData = {
    tableHead: ["Name", "Category", "Type", "Status", "Slug", "Action"],
    tableBody: ["name", "category", "type", "status", "slug", "action"],
  };

  return (
    <div className="h-full w-[95%] mx-auto flex flex-col">
      <div className="w-[50%] pt-4">
        <div className="w-full flex shadow-lg items-center gap-2 text-black dark:text-white dark:bg-Dark_light border dark:border-none rounded-md  font-extralight py-2 px-4 ">
          <div className="text-lg">
            <FiSearch />
          </div>
          <input
            name="search"
            className="focus:outline-none placeholder:text-black dark:placeholder:text-[#fffbfb7c] text-md bg-transparent w-full"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="overflow-y-auto">
        <TableComponent
          pageType="game"
          tableData={tableData}
          rowClick={handleRowClick}
          openModal={handleModalOpen}
          DashboardFetchedData={filteredData}
          deleteTableData={handleDelete}
        />
      </div>
      <Modal
        open={open}
        setOpen={setOpen}
        modalType={modalType}
        setModalType={setModalType}
      >
        {ModalContent}
      </Modal>
      <Loader show={loading} />
    </div>
  );
};

export default Game;
