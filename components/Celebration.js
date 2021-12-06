import Confetti from "react-confetti";
import { useState, useEffect } from "react";

export default function Celebration() {
  const size = useWindowSize();
  return <Confetti width={size.width} height={size.height} />;
}

// ty https://usehooks.com/useWindowSize/
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
