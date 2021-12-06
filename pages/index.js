import Head from "next/head";
import collections from "../config/collections.json";

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
  ];

  return (
    <div>
      <Head>
        <title>wen flip? (╯°□°)╯</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <section>
        <h1>(╯°Д°)╯︵/(.□ . \)</h1>
        <h2>
          Compare floors of any two opensea collections
          <br />
        </h2>
      </section>

      <section className="link-list">
        {pairs.map((pair, index) => (
          <div key={index}>
            <span style={{ fontSize: "0.5rem" }}>◇</span>{" "}
            <h3>
              <a href={`${pair[0].slug}/${pair[1].slug}`}>
                wenflip.xyz/{pair[0].slug}/{pair[1].slug}
              </a>
            </h3>
          </div>
        ))}
      </section>

      <style jsx>{`
        .link-list {
          margin-bottom: 3rem;
        }
        h1 {
          margin: 0;
          font-size: 2rem;
        }

        h2 {
          font-size: 1.5rem;
        }

        section {
          text-align: center;
        }

        h3 a {
          text-decoration: none;
          color: white;
        }

        h3 a:hover,
        h3 a:focus,
        h3 a:active {
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          h1 {
            font-size: 1rem;
          }

          h2 {
            font-size: 1rem;
          }

          h3 {
            font-size: 0.6rem;
          }
        }
      `}</style>
    </div>
  );
}
