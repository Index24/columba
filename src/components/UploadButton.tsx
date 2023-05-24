import { useRef, useState } from "react";
import type {
  ChangeEventHandler,
  DragEventHandler,
  MouseEventHandler,
} from "react";
import styles from "./UploadButton.module.css";
import { result, updateResult } from "../store/result";
import { useStore } from "@nanostores/react";

const UploadButton = () => {
  const $resultValue = useStore(result);
  const [isDragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag: DragEventHandler<HTMLElement> = (dragEvent) => {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();

    if (dragEvent.type === "dragenter" || dragEvent.type === "dragover") {
      setDragActive(true);
    } else if (dragEvent.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFiles = (files: FileList) => {
    for (let i = 0, len = files.length; i < len; i++) {
      if (validateImage(files[i])) {
        previewAnduploadImage(files[i]);
      }
    }
  };

  const validateImage = (image: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (validTypes.indexOf(image.type) === -1) {
      alert("Invalid File Type");
      return false;
    }

    var maxSizeInBytes = 10e6; // 10MB
    if (image.size > maxSizeInBytes) {
      alert("File too large. Max 10MB");
      return false;
    }

    return true;
  };

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const previewAnduploadImage = async (image: File) => {
    const base64 = (await getBase64(image)).split(",")[1];

    // upload the image
    const uploadLocation = "https://demo.columba.app/api/process-image";
    const uploadData = { image: base64 };
    try {
      const response = await fetch(uploadLocation, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        body: JSON.stringify(uploadData),
      });

      type JSONResponse = {
        image: string;
        pattern: number;
        fertile_window: boolean;
      };

      const data: JSONResponse = await response.json();

      updateResult({
        pattern: data.pattern,
        imgUrl: `data:image/${image.type};base64${data.image}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop: DragEventHandler<HTMLElement> = (dragEvent) => {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    setDragActive(false);
    if (
      dragEvent.dataTransfer?.files &&
      dragEvent.dataTransfer.files.length > 0
    ) {
      handleFiles(dragEvent.dataTransfer.files);
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (changeEvent) => {
    changeEvent.preventDefault();
    if (changeEvent.target.files && changeEvent.target.files.length > 0) {
      handleFiles(changeEvent.target.files);
    }
  };

  const handleClick: MouseEventHandler<HTMLInputElement> = (event) => {
    const element = event.target as HTMLInputElement;
    element.value = "";
  };

  return (
    <form
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
      className={styles.uploadSection}
    >
      <input
        hidden
        id="upload-file-input"
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        onClick={handleClick}
      />
      <label
        htmlFor={"upload-file-input"}
        className={`${styles.draggableArea} ${
          isDragActive ? styles.dragActive : ""
        }`}
      >
        <span>Upload Photo Here</span>
      </label>
      {$resultValue?.imgUrl ? (
        <img
          src={$resultValue.imgUrl}
          className={styles.previewImage}
          alt="preview image"
        />
      ) : null}
      {isDragActive && (
        <div
          className={styles.dropZone}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
      )}
    </form>
  );
};

export default UploadButton;
