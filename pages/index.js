import Head from "next/head";
import Confetti from "react-confetti";

export default function Index() {
  const pairs = [
    [
      { name: "Bored Apes", slug: "boredapeyachtclub" },
      { name: "Punks", slug: "cryptopunks" },
    ],
    [
      { name: "Doodles", slug: "doodles-official" },
      { name: "Cool Cats", slug: "cool-cats-nft" },
    ],
    [
      { name: "Chain Runners", slug: "chain-runners-nft" },
      { name: "Bears Deluxe", slug: "bears-deluxe-new" },
    ],
    [
      { name: "SupDucks", slug: "supducks" },
      { name: "World of Women", slug: "world-of-women-nft" },
    ],
    [
      { name: "Lazy Lions", slug: "lazy-lions" },
      { name: "Creature World", slug: "creatureworld" },
    ],
  ];

  return (
    <div className="container">
      <Head>
        <title>wen flip? (╯°□°)╯</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="info">
        <h1>(╯°Д°)╯︵/(.□ . \)</h1>
        {pairs.map((pair) => (
          <h1 className="link">
            <a href={`${pair[0].slug}/${pair[1].slug}`}>
              wen <span className="highlight">{pair[0].name}</span> flip{" "}
              <span className="highlight">{pair[1].name}</span>?
            </a>
          </h1>
        ))}
      </main>

      <footer>
        made by&nbsp;<a href="https://twitter.com/jtgi">jtgi.eth</a>&nbsp;
        <br />
        making nfts?&nbsp;
        <a href="https://nftjoy.club/waitlist">nftjoy.club/waitlist</a>
        <br />
        <p className="footnote">
          authors of this website do not advocate flippenings – srsly ppl wagmi
        </p>
      </footer>

      <style jsx>{`
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

        .link {
          margin: 0;
        }

        .link a {
          text-decoration: none;
          color: white;
        }

        .link a:hover,
        .link a:focus,
        .link a:active {
          text-decoration: underline;
        }
        .footnote {
          font-size: 6px;
          font-family: sans-serif;
        }
      `}</style>

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
      `}</style>
    </div>
  );
}
