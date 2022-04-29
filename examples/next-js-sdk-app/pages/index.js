import Head from "next/head";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <script async defer src="/pti.js"></script>
        <script
          async
          defer
          src="https://sdk.apidev.pticlient.com/0.0.12/index.js"
        ></script>
      </Head>

      <h1 className="title">Welcome to PTI Javascript SDK Example</h1>

      <a href={"#"} onClick={() => showPaymentForm("form")}>
        Start Payment
      </a>
      <br />
      <div id={"form"} className={"form"}></div>

      <style jsx>{`
        .form {
          width: 600px;
          height: 600px;
          margin: 0 auto;
        }

        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 2rem;
        }

        .title,
        .description {
          text-align: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
