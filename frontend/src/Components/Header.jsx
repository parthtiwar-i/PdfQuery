import React, { useState } from "react";
import logo from "../assets/Logo.png";
import axios from "axios";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useSetRecoilState } from "recoil";
import { fileAtom } from "../atoms";

const Header = () => {
  const [pdfName, setPdfName] = useState("");
  const setFileName = useSetRecoilState(fileAtom);
  const handleFileChange = async (e) => {
    await handleUpload(e.target.files[0]);
  };

  const handleUpload = async (selectedFile) => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        "https://pdfquery-c6g1.onrender.com/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPdfName(response.data.file_name);
      setFileName(response.data.file_name);

      console.log("PDF uploaded successfully", response.data, pdfName);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  return (
    <>
      <div className="flex justify-between px-5 items-center h-20 bg-slate-300">
        <div>
          <img className="w-16 md:w-full" src={logo} alt="" />
        </div>
        <div className="flex justify-between items-center gap-5">
          <div className="text-green-400">
            <FileCopyOutlinedIcon />
            <span className="md:hidden">
              {pdfName && pdfName.length > 9
                ? pdfName.substring(0, 9) + "..."
                : pdfName}
            </span>
            <span className="hidden md:inline-block ">
              {pdfName && pdfName}
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="file"
              onChange={handleFileChange}
              id="fileInput"
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="px-2 md:px-4 py-2 border transition-all border-black rounded cursor-pointer hover:bg-green-400"
            >
              <AddCircleOutlineOutlinedIcon />{" "}
              <span className="hidden md:inline-block ">Upload pdf</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
