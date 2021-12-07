const Header = () => (
  <nav style={{ margin: "0 auto" }}>
    <div
      className="home"
      style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        top: 15,
      }}
    >
      <a style={{ textDecoration: "none", fontSize: 35 }} href="/">
        ⦿
      </a>
    </div>
  </nav>
);

export default Header;
