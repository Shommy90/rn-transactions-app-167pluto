# test-app

`test-app` is a React Native application built with Expo, designed to showcase modern mobile development practices. It leverages a variety of tools and libraries such as Expo Router for navigation, Axios for HTTP requests, and Shopify's FlashList for high-performance lists, among others.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (LTS version recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Shommy90/rn-transactions-app-167pluto.git
cd test-app
```

2. Install the dependencies:

```bash
npm install
```

or if you prefer yarn:

```bash
yarn install
```

### Running the App

To run the application, you can use the following commands:
Start the app:

```bash
npm start
```

or

```bash
yarn start
```

Run on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

Run on Web:

```bash
npm run web
```

### Running json-server

To simulate a REST API with json-server, first ensure you have a db.json file in your project root or a designated directory with your mock data structured appropriately.

Example db.json content:

```bash
{
  "transactions": [
    {
      "id": "1",
      "value": 100,
      "createdAt": "2020-01-01T00:00:00.000Z"
    }
    // Add more transactions as needed
  ]
}
```

To start json-server, run the following command in your terminal:

```bash
json-server --watch db.json --port 3000
```

This command will start a local server hosting your mock API on http://localhost:3000. You can access your transactions at http://localhost:3000/transactions.

Ensure your application's API requests are pointed to http://localhost:3000/ during development to interact with your local json-server.
