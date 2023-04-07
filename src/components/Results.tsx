import { useStore } from "@nanostores/react";
import styles from "./Results.module.css";
import { result } from "../store/result";
import type { CSSProperties } from "react";

const Results = () => {
  const $resultValue = useStore(result);
  if (!$resultValue) return null;

  const pattern = $resultValue.pattern;
  const windowCount = 28;
  function getColor(index: number, isSuccess: boolean) {
    const forth = windowCount / 4;
    if (index < forth || index >= windowCount - forth) {
      return isSuccess ? "#D9D9D9" : "#F95D51";
    } else {
      return isSuccess ? "#62C584" : "#D9D9D9";
    }
  }

  const restPattern = 100 - pattern;
  const columns = `${pattern}fr ${restPattern}fr`;

  const isSuccess = pattern > 50;

  const patternItems = [
    { color: isSuccess ? "#62C584" : "#F95D51" },
    { color: "#D9D9D9" },
  ];

  const windowItems = Array.from({ length: windowCount }, (_, i) => ({
    color: getColor(i, isSuccess),
  }));

  const patternStatsStyles = {
    "--columns": `${pattern}fr ${restPattern}fr`,
  } as CSSProperties;

  return (
    <section className={styles.results}>
      <div className={styles.result}>
        <p className={styles.resultTitle}>{pattern}%</p>
        <p className={styles.resultDescription}>Ferning Pattern</p>
        <div className={styles.patternStats} style={patternStatsStyles}>
          {patternItems.map(({ color }) => {
            return (
              <span className={styles.stat} style={{ background: color }} />
            );
          })}
        </div>
      </div>
      <div className={styles.result}>
        <p className={styles.resultTitle}>{isSuccess ? "Yes" : "No"}</p>
        <p className={styles.resultDescription}>Fertile Window</p>
        <div className={styles.windowStats}>
          {windowItems.map(({ color }) => {
            return (
              <span className={styles.stat} style={{ background: color }} />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Results;
