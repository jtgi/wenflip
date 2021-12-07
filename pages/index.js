import Head from "next/head";
import collections from "../config/collections.json";
import { shuffle } from "../util/util";

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

export default function Index() {
  return (
    <div>
      <Head>
        <title>wen flip? (╯°□°)╯</title>
      </Head>

      <section>
        <h1>(╯°Д°)╯︵/(.□ . \)</h1>
        <h2>Compare floors of any two opensea collections.</h2>
        <h2 className="smallcaps">EXAMPLES</h2>
      </section>

      <section className="link-list">
        {pairs.map((pair, index) => (
          <div key={index}>
            <h3>
              <a href={`${pair[0].slug}/${pair[1].slug}`}>
                wenflip.xyz/{pair[0].slug}/{pair[1].slug}
              </a>
            </h3>
          </div>
        ))}
      </section>

      <section className="instructions">
        Use the opensea collection url name. e.g. opensea.io/collection/
        {`<name>`}
      </section>

      <style jsx>{`
        .link-list {
          margin-bottom: 1.5rem;
        }

        .smallcaps {
          text-transform: uppercase;
          font-size: 0.5rem;
          letter-spacing: 0.1rem;
          opacity: 0.5;
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

        .instructions {
          font-size: 0.7rem;
        }

        h3 a {
          text-decoration: none;
          color: white;
        }

        h3 {
          margin-bottom: 5px;
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
