import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="container">
      <nav style={{ margin: "0 auto" }}>
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 10,

            textDecoration: "none",
          }}
        >
          <Link href="/">wenflip</Link>
        </div>
      </nav>

      <main>{children}</main>

      <footer>
        made by <a href="https://twitter.com/jtgi">jtgi.eth</a> <br />
        making nfts?{" "}
        <a href="https://nftjoy.club/waitlist">nftjoy.club/waitlist</a>
        <br />
        <p className="footnote">
          we do not advocate flippenings – srsly ppl wagmi
        </p>
      </footer>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-size: 22px;
          background-color: #ef3434;
          font-family: Readex Pro, Roboto, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .container {
          min-height: 100vh;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid rgb(199, 20, 20);
          padding-top: 20px;
          text-align: center;
          font-size: 0.7rem;
        }

        a {
          color: inherit;
          text-decoration: underline;
        }

        .footnote {
          font-size: 6px;
          font-family: serif;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
