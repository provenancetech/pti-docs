Start the client with `npm start`

Then you need a backend to generate the tokens.
This can be tested with `pti-js-sdk-client` project (node example/server/index.js)

You need CORS disabled for this test, as the 2 services are not running on the same port.

With chrome on Mac you can start it like this
```
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
```

