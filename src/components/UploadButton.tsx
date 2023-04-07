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

  const previewAnduploadImage = (image: File) => {
    // create FormData
    var formData = new FormData();
    formData.append("image", image);

    const randomValue = Math.floor(Math.random() * 100);
    updateResult({ pattern: randomValue, imgUrl: URL.createObjectURL(image) });

    // upload the image
    /*
    const uploadLocation = "https://api.imgbb.com/1/upload";
    formData.append("key", "bb63bee9d9846c8d5b7947bcdb4b3573");

    var ajax = new XMLHttpRequest();
    ajax.open("POST", uploadLocation, true);

    ajax.onreadystatechange = function (e) {
      if (ajax.readyState === 4) {
        if (ajax.status === 200) {
          // done!
        } else {
          // error!
        }
      }
    };

    ajax.upload.onprogress = function (e) {
      // change progress
      // (reduce the width of overlay)

      var perc = (e.loaded / e.total) * 100 || 100,
        width = 100 - perc;
    };

    ajax.send(formData);
    */
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
