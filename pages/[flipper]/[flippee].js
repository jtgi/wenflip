import Head from "next/head";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import cheerio from "cheerio";

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
        left: item.percent * value + "px",
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

const ProgressBar = ({ percent, flipper, flippee }) => {
  const [value, setValue] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const set = () => setValue(ref.current?.clientWidth || 0);

    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        className="progress-wrap"
        ref={ref}
        style={{
          width: "100%",
          position: "relative",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "rgba(16,16,16)",
          borderRadius: "2rem",
          boxShadow: "5px 0px 40px rgba(255,255,255, 0.2)",
        }}
      >
        <div
          className="progress"
          style={{
            width: value * percent + "px",
            backgroundColor: "rgb(204, 207, 12)",
            height: "4rem",
            position: "relative",
            borderRadius: "2rem",
            zIndex: 5,
            transition: "1s ease",
            transitionDelay: "0.5s",
            animation: "Pulse 2s infinite ease-in-out",
          }}
        >
          <Tag item={flipper} value={value} />
        </div>
      </div>
      <Tag isDown={false} item={flippee} value={value} />
    </div>
  );
};

export default function Home({ flipper, flippee, error }) {
  const max = Math.max(flipper.floor, flippee.floor);
  const pctFlipped = flipper.floor / flippee.floor;

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

      <main>
        <section className="info">
          <h1 className="title">
            wen <a href={flipper.url}>{flipper.title.toLowerCase()}</a> flip{" "}
            <a href={flippee.url}>{flippee.title.toLowerCase()}</a>?
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

        <section>
          <h2>{getMessage(flipper, flippee)}</h2>
        </section>
      </main>

      <footer>
        made by&nbsp;<a href="https://twitter.com/jtgi">jtgi.eth</a>&nbsp;
        <br />
        making nfts?&nbsp;
        <a href="https://nftjoy.club/waitlist">nftjoy.club/waitlist</a>
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
          padding: 2rem;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #f5b58f;
          padding-top: 20px;
          text-align: center;
          font-size: 0.7rem;
        }

        .info {
          margin-bottom: 3rem;
          text-align: center;
        }

        .info h2 {
          font-size: 2rem;
          display: inline-block;
        }

        .graph {
          margin-bottom: 3rem;
        }

        a {
          color: inherit;
          text-decoration: underline;
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
          padding: 5px;
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
            font-size: 2rem;
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

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-size: 22px;
          background-color: #ed5941;
          font-family: Readex Pro, Roboto, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
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
      return `The ${flippee.title} have been flipped.`;
    } else {
      return `The ${flippee.title} has been flipped.`;
    }
  } else {
    return `${prettyDiff(flippee.floor - flipper.floor)} to go`;
  }
};
