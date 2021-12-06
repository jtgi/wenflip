import Head from "next/head";

export default function Layout({ children }) {
  return (
    <div className="container">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
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

      <main>{children}</main>

      <footer>
        making nfts?{" "}
        <a href="https://nftjoy.club/waitlist">nftjoy.club/waitlist</a>
        <br />
        <span>
          made by <a href="https://twitter.com/jtgi">jtgi.eth</a> <br />
        </span>
        <p className="footnote">
          we do not advocate flippenings – srsly ppl wagmi
        </p>
      </footer>
    </div>
  );
}
