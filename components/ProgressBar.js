import { useRef, useEffect, useState } from "react";
import Tag from "./Tag";

const ProgressBar = ({ percent, flipper, flippee }) => {
  const [value, setValue] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const set = () => setValue(ref.current?.clientWidth || 0);

    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        className="progress-wrap"
        ref={ref}
        style={{
          width: "100%",
          position: "relative",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "rgba(16,16,16)",
          borderRadius: "2rem",
          boxShadow: "5px 0px 40px rgba(255,255,255, 0.2)",
        }}
      >
        <div
          className="progress"
          style={{
            width: Math.max(value * percent, 88) + "px",
            backgroundColor: "rgba(204, 207, 12, 0.95)",
            height: "4rem",
            position: "relative",
            borderRadius: "2rem",
            zIndex: 5,
            transition: "1s ease",
            transitionDelay: "0.5s",
            animation: "Pulse 2s infinite ease-in-out",
          }}
        >
          <Tag item={flipper} value={value} />
        </div>
      </div>
      <Tag isDown={false} item={flippee} value={value} />
    </div>
  );
};

export default ProgressBar;
