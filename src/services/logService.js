// import * as Sentry from "@sentry/browser";

function init() {
  //   Sentry.init({
  //     dsn: "https://0a43fbdd78f3467cab2d26b6f9576595@sentry.io/1724121"
  //   });
}

function log(error) {
  //   Sentry.captureException(error);
  console.error(error);
}

export default {
  init,
  log
};
