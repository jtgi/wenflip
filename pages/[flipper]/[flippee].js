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

const ProgressBar = ({ percent, labels }) => {
  const [value, setValue] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const set = () => setValue(ref.current?.clientWidth || 0);

    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <div
        className="progress-wrap"
        ref={ref}
        style={{
          width: "100%",
          position: "relative",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          padding: "0 5px",
          justifyContent: "flex-start",
          backgroundColor: "rgba(255,255,255,0.5)",
          borderRadius: "2rem",
        }}
      >
        <div
          className="progress"
          style={{
            width: value * percent + "px",
            backgroundColor: "#69cf0c",
            height: "3.5rem",
            borderRadius: "2rem",
            transition: "1s ease",
            transitionDelay: "0.5s",
          }}
        ></div>

        {labels.map((label, i) => {
          const offset = Math.round(label.percent * value);
          const isDown = i % 2 === 0;

          return (
            <div
              className="label"
              key={label.name}
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                alignItems: "center",
                position: "absolute",
                left: `${offset}px`,
                transform: isDown
                  ? "translate(-46%, 100%)"
                  : "translate(-50%, -100%)",
                backgroundColor: "white",
                padding: "0.75rem",
              }}
            >
              <div
                className="arrow"
                style={{
                  width: 0,
                  height: 0,
                  borderStyle: "solid",
                  position: "absolute",
                  ...(isDown
                    ? {
                        top: "-2.65rem",
                        borderWidth: "0 2.65rem 2.7rem 2.65rem",
                        borderColor:
                          "transparent transparent #ffffff transparent",
                      }
                    : {
                        bottom: "-2.65rem",
                        borderWidth: "2.7rem 2.65rem 0 2.65rem",
                        borderColor: "#FFF transparent transparent transparent",
                      }),
                }}
              ></div>
              <div
                style={{
                  width: 60,
                  height: 60,
                  overflow: "hidden",
                  border: "3px solid black",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {label.imgSrc && (
                  <img
                    style={{
                      imageRendering: label.imgPixelated ? "pixelated" : "auto",
                    }}
                    src={label.imgSrc}
                    width="70"
                  />
                )}
              </div>
              <div style={{ marginLeft: "0.5rem", fontSize: "1rem" }}>
                {label.value}
              </div>
            </div>
          );
        })}
      </div>
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
          <h2>{getMessage(flipper, flippee)}</h2>
        </section>

        <section style={{ width: "80vw" }}>
          <ProgressBar
            css={{ backgroundColor: "red" }}
            percent={Math.min(pctFlipped, 1)}
            labels={[
              {
                ...flipper,
                percent: flipper.floor / max,
                value: `${flipper.floor}Ξ`,
              },
              {
                ...flippee,
                percent: flippee.floor / max,
                value: `${flippee.floor}Ξ`,
              },
            ]}
          />
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
          font-size: 0.9rem;
        }

        .info {
          margin-bottom: 10rem;
          text-align: center;
        }

        .info h2 {
          font-size: 2rem;
          display: inline-block;
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
          font-size: 3rem;
          text-align: center;
        }

        @media (max-width: 600px) {
          .title {
            font-size: 2rem;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-size: 22px;
          background-color: #d89066;
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
    return `The ${flippee.title} have been flipped.`;
  } else {
    return `${prettyDiff(flippee.floor - flipper.floor)} to go`;
  }
};
