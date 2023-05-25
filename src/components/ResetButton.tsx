import styles from "./ResetButton.module.css";
import { updateResult, result, updateImgSrc } from "../store/result";
import { useStore } from "@nanostores/react";

const ResetButton = () => {
  const $resultValue = useStore(result);

  const handleClick = () => {
    updateResult(null);
    updateImgSrc("");
  };

  if (!$resultValue) return null;

  return (
    <button className={styles.resetButton} onClick={handleClick}>
      Reset test
    </button>
  );
};

export default ResetButton;
