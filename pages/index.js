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
    [
      { name: "Lazy Lions", slug: "lazy-lions" },
      { name: "Creature World", slug: "creatureworld" },
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
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <section>
        <h1>(╯°Д°)╯︵/(.□ . \)</h1>
        {pairs.map((pair) => (
          <div>
            <h1 className="link">
              <a href={`${pair[0].slug}/${pair[1].slug}`}>
                wen{" "}
                <span className="highlight">{pair[0].name.toLowerCase()}</span>{" "}
                flip{" "}
                <span className="highlight">{pair[1].name.toLowerCase()}</span>?
              </a>
            </h1>
            <span style={{ fontSize: "0.5rem" }}>◇</span>{" "}
          </div>
        ))}
      </section>

      <style jsx>{`
        .link {
          margin: 0;
        }

        section {
          text-align: center;
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

        @media (max-width: 600px) {
          h1 {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
