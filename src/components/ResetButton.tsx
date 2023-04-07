import styles from "./ResetButton.module.css";
import { updateResult, result } from "../store/result";
import { useStore } from "@nanostores/react";

const ResetButton = () => {
  const $resultValue = useStore(result);

  const handleClick = () => {
    updateResult(null);
  };

  if (!$resultValue) return null;

  return (
    <button className={styles.resetButton} onClick={handleClick}>
      Rester test
    </button>
  );
};

export default ResetButton;