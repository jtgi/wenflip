import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import cheerio from "cheerio";
import Celebration from "../../components/Celebration";
import ProgressBar from "../../components/ProgressBar";
import Tag from "../../components/Tag";

export async function getServerSideProps({ req, res, params }) {
  try {
    const [flipper, flippee] = await Promise.all([
      await fetchFloor(params.flipper),
      await fetchFloor(params.flippee),
    ]);
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=59"
    );

    return {
      props: {
        flipper,
        flippee,
      },
    };
  } catch (e) {
    console.error(e.getMessage(), e);
    return {
      props: {
        error: e,
      },
    };
  }
}

async function fetchFloor(collectionSlug) {
  if (collectionSlug === "cryptopunks") {
    return await fetchPunksFloor();
  }

  const url = `https://api.opensea.io/collection/${collectionSlug}?format=json`;
  const rsp = await axios.get(url);

  if (!rsp.data) {
    throw new Error("No data, sorry");
  }

  const res = rsp.data.collection;
  const ethUsd =
    res.payment_tokens.find((token) => token.symbol === "ETH")?.usd_price || 0; // :D

  return {
    floor: res.stats.floor_price,
    floorUsd: res.stats.floor_price * ethUsd,
    title: res.name,
    imgSrc: res.image_url,
    url: `https://opensea.io/collection/${collectionSlug}`,
  };
}

async function fetchPunksFloor() {
  const matcher = /.*Sale:\s([^\s]+).*\$([^\s.]+).*Bid:\s([^\s]+).*\$([^\s.]+)/; // <-- gmi?
  const rsp = await axios.get("https://www.larvalabs.com/cryptopunks/forsale");
  const $ = cheerio.load(rsp.data);

  const noadz = $(".punk-image-container-dense a")
    .filter((i, link) => link.attribs.title && matcher.test(link.attribs.title))
    .toArray();

  const floorPunk = noadz[0];
  const [gm, floor, floorUsd, ...other] =
    floorPunk.attribs.title.match(matcher);
  const url = `https://larvalabs.com${floorPunk.attribs.href}`;
  const imgSrc = `https://larvalabs.com${$(floorPunk).find("img").attr("src")}`;

  return {
    floor: parseFloat(floor),
    floorUsd: parseFloat(floorUsd.replace(/,/g, "")),
    title: "CryptoPunks",
    url,
    imgSrc,
    imgPixelated: true, // :S
  };
}

export default function Home({ flipper, flippee, error }) {
  if (error) {
    return (
      <div>
        <h1>(┛◉Д◉)┛彡┻━┻</h1>
        <h2>Something went wrong</h2>
      </div>
    );
  }
  const max = Math.max(flipper.floor, flippee.floor);
  const pctFlipped = flipper.floor / flippee.floor;
  const isFlipped = flipper.floor > flippee.floor;

  return (
    <div>
      <Head>
        <title>wen flip? (╯°□°)╯</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>

      {isFlipped && <Celebration />}

      <div>
        <section className="info">
          <h1 className="title">
            wen{" "}
            <a href={flipper.url} target="_blank">
              {flipper.title.toLowerCase()}
            </a>{" "}
            flip{" "}
            <a href={flippee.url} target="_blank">
              {flippee.title.toLowerCase()}
            </a>
            ?
          </h1>
        </section>

        <section className="graph" style={{ width: "80vw" }}>
          <ProgressBar
            css={{ backgroundColor: "red" }}
            percent={Math.min(pctFlipped, 1)}
            flipper={{
              ...flipper,
              percent: flipper.floor / max,
              value: `${flipper.floor}Ξ`,
            }}
            flippee={{
              ...flippee,
              percent: flippee.floor / max,
              value: `${flippee.floor}Ξ`,
            }}
          />
        </section>

        <section
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2>{getMessage(flipper, flippee)}</h2>
        </section>
      </div>

      <style jsx>{`
        .info {
          text-align: center;
        }

        h2 {
          font-size: 1.5rem;
          display: inline-block;
        }

        .graph {
          margin-top: 3rem;
          margin-bottom: 3rem;
        }

        a {
          color: inherit;
          text-decoration: underline;
        }

        a:hover,
        a:focus,
        a:active {
          color: white;
        }

        .title a {
          text-decoration: none;
          color: white;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        h2 {
          background-color: black;
          color: white;
          padding: 1rem;
          border: 1px solid black;
          border-radius: 0.5rem;
          text-align: center;
        }

        img.pixelated {
          image-rendering: pixelated;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 2.5rem;
          text-align: center;
        }

        @media (max-width: 600px) {
          .title {
            font-size: 1.5rem;
          }
          h2 {
            font-size: 0.9rem;
          }
        }

        @keyframes Pulse {
          0% {
            box-shadow: 0 0 1.2rem rgba(205, 220, 57, 0.5);
          }
          50% {
            box-shadow: 0 0 1.5rem rgba(205, 220, 57, 0.99);
          }
          100% {
            box-shadow: 0 0 1.2rem rgba(205, 220, 57, 0.5);
          }
        }
      `}</style>
    </div>
  );
}

const prettyDiff = (value) => {
  if (value == 0) {
    return `they're the same price, wow.`;
  } else if (value < 0.001) {
    return `< 0.001Ξ`;
  } else {
    const str = String(value).split(".");
    if (str[1] && str[1].length > 2) {
      return `~${value.toFixed(2)}Ξ`;
    } else {
      return `${value}Ξ`;
    }
  }
};

const getMessage = (flipper, flippee) => {
  if (flipper.floor === flippee.floor) {
    return `they have the same floor, wow.`;
  } else if (flipper.floor > flippee.floor) {
    if (flippee.title.charAt(flippee.title.length - 1) === "s") {
      return `The ${flippee.title} have been flippened`;
    } else {
      return `The ${flippee.title} has been flippened`;
    }
  } else {
    return `${prettyDiff(flippee.floor - flipper.floor)} to go`;
  }
};
