module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/boredapeyachtclub/cryptopunks",
        permanent: true,
      },
    ];
  },
};
