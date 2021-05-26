# React JS SDK App

## Dependencies

### Backend App

This is a frontend client that uses the [Python Backend App](../PythonBackendApp) as its backend. Make sure the [Python Backend App](../PythonBackendApp) is running before running the React JS SDK App.

### Node modules

Before starting this client, install its dependencies:

```
yarn
```

## Start

Start the client with:

```
yarn start
```

## Usage

You can trigger the popup closure with a `curl` request on the backend, like this:

```
curl -X POST -d '{"requestId":"<id of the request>"}' http://localhost:5000/webhook
```
