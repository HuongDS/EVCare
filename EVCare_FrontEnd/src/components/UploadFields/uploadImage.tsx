import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import styled from "styled-components";
const UploadListFix = styled.div`
  .ant-upload-list-item-name {
    color: #111827 !important; /* màu chữ xám đậm */
    text-decoration: none !important; /* bỏ gạch chân */
    font-weight: 500;
    cursor: default;
  }

  .ant-upload-list-item-name:hover {
    color: #111827 !important;
    text-decoration: none !important;
  }

  .ant-upload-list-item {
    background-color: #f9fafb !important;
    border-radius: 6px;
    transition: background 0.2s;
  }

  .ant-upload-list-item:hover {
    background-color: #f3f4f6 !important;
  }
`;

const { Dragger } = Upload;

interface Props {
  handleFileSubmit: (file: { url: string; name: string }) => void;
  imgQuantity: number;
  handleFileRemove?: (url: string) => void;
  existingImages?: { url: string; name: string }[];
}

const UploadImage: React.FC<Props> = ({
  handleFileSubmit,
  imgQuantity,
  handleFileRemove,
  existingImages = [],
}: Props) => {
  const defaultFileList: UploadFile[] = existingImages.map((file, index) => ({
    uid: `${-index - 1}`,
    name: file.name,
    status: "done",
    url: file.url,
    response: { data: file.url },
  }));

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: `${import.meta.env.VITE_API_BASE}/api/File/upload-image`,
    headers: {
      FolderName: "AppointmentImages",
    },
    accept: "image/*",
    maxCount: imgQuantity,
    showUploadList: true,
    defaultFileList: defaultFileList,

    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} uploaded.`);
        const url = info.file.response.data;
        const name = info.file.name;
        handleFileSubmit({ url, name });
      } else if (status === "error") {
        message.error(`${info.file.name} upload failed.`);
      }
    },
    onRemove(file) {
      const url = file.response?.data || file.url;
      if (url && handleFileRemove) {
        handleFileRemove(url);
      }
    },
  };

  return (
    <UploadListFix>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ color: "#00ad4e" }} />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Dragger>
    </UploadListFix>
  );
};

export default UploadImage;
