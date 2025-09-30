import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { LENGTH } from "../../constants/Code/Constants";

const { Dragger } = Upload;

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: `${import.meta.env.VITE_API_BASE}/api/File/upload-image`,
  headers: {
    FolderName: "AppointmentImages",
  },
  accept: "image/*",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      const imgUrl = info.file.response.data;
      message.success(`${info.file.name} file uploaded successfully. ImgUrl = ${imgUrl}.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  maxCount: LENGTH.IMAGES,
  showUploadList: true,
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const UploadImage: React.FC = () => (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined
        style={{
          color: "#00ad4e",
        }}
      />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
  </Dragger>
);

export default UploadImage;
