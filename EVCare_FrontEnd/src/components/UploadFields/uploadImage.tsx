import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { LENGTH } from "../../constants/Code/Constants";

const { Dragger } = Upload;

interface Props {
  handleFileSubmit: (u: string) => void;
}

const UploadImage: React.FC<Props> = ({ handleFileSubmit }: Props) => {
  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: `${import.meta.env.VITE_API_BASE}/api/File/upload-image`,
    headers: {
      FolderName: "AppointmentImages",
    },
    accept: "image/*",
    maxCount: LENGTH.IMAGES,
    showUploadList: true,
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        const imgUrl = info.file.response.data as string;
        message.success(`${info.file.name} uploaded. Url = ${imgUrl}`);
        const url = info.file.response.data;
        handleFileSubmit(url);
      } else if (status === "error") {
        message.error(`${info.file.name} upload failed.`);
      }
    },
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined style={{ color: "#00ad4e" }} />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
    </Dragger>
  );
};

export default UploadImage;
