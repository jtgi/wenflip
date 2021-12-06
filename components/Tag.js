const Tag = ({ item, value, isDown = true }) => {
  return (
    <div
      className="label"
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        alignItems: "center",
        position: "absolute",
        left: Math.max(item.percent * value, 88) + "px",
        top: "0.1rem",
        transform: "translateX(-102%)",
        transition: "1s ease",
        transitionDelay: "0.5s",
      }}
    >
      <div
        style={{
          width: "3.8rem",
          height: "3.8rem",
          overflow: "hidden",
          border: "3px solid black",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          justifyContent: "center",
        }}
      >
        {item.imgSrc && (
          <img
            style={{
              imageRendering: item.imgPixelated ? "pixelated" : "auto",
              width: "4rem",
            }}
            src={item.imgSrc}
          />
        )}
      </div>
      <div
        style={{
          position: "absolute",
          textAlign: "center",
          fontSize: "1.3rem",
          ...(isDown
            ? {
                bottom: 0,
                marginTop: "0.7rem",
                transform: "translateY(120%)",
              }
            : {
                top: 0,
                transform: "translateY(-110%)",
              }),
        }}
      >
        {item.value}
      </div>
    </div>
  );
};

export default Tag;
