import { Poppins } from "next/font/google";
import "../../app/globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DataSetter from "@/utils/DataSetter";
import { config } from "@/utils/config";
import { getCookie } from "@/utils/cookie";
import { getUserData } from "@/utils/action";

const inter = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Game Crm",
  description: "Game Crm",
};

// const getUserData = async () => {
//   const token = await getCookie();
//   const response = await fetch(`${config.server}/api/users`, {
//     method: "GET",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       Cookie: `userToken=${token}`,
//     },
//   });
//   const data = await response.json();
//   return { data };
// };

export default async function RootLayout({ children }) {
  const data = await getUserData();
  console.log("Data : ", data);
  return (
    <div className="bg-cover h-screen bg-[#F3F4F6] dark:bg-Dark flex">
      <DataSetter data={data.data} />
      <div>
        <div className="w-full h-full">
          <Sidebar userData={data.data} />
        </div>
      </div>
      <div className="w-full mx-auto ">
        <div>
          <Header userData={data.data} />
        </div>
        <div className="h-full overflow-auto w-[100%] m-auto">{children}</div>
      </div>
    </div>
  );
}