# Publishing Workflow Application

This is a React application designed to be embedded within a Media Asset Management (MAM) system as an iframe. It provides a publishing workflow interface for media assets.

## Features

- Display asset information received from the parent MAM system
- Edit in/out points with timecode support
- Configure publishing settings:
  - Publishing date range (from/to)
  - Publishing title and SEO title
  - Tags and category
  - Publishing destinations (TV2.no, Play, Direktesport, MyGame)
  - Logo settings
  - Ingress text
- View the designated poster frame

## Communication

The application communicates with the parent MAM system using the postMessage API. It listens for messages from the parent window and can send messages back to update metadata or trigger actions.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   cd publisher-app
   npm install
   ```

### Development

To start the development server:

```
npm start
```

This will start the app at http://localhost:3000

### Building for Production

To build the application for production:

```
npm run build
```

The build files will be in the `build` directory and can be served from any static file server.

## Integration with MAM System

To embed this application in the MAM system:

1. Host the built application on a web server
2. Include the application in an iframe in the MAM system:

```html
<iframe
  src="https://your-app-url/?origin=https://mam-system-url"
  width="100%"
  height="600px"
  frameborder="0"
></iframe>
```

Make sure to include the `origin` parameter with the URL of the MAM system to enable secure postMessage communication.

## Message Protocol

The application listens for the following message types from the parent window:

- `mimir_ready`: Indicates the parent system is ready to communicate
- `item_loaded` or `item`: Contains asset metadata

The application can send the following messages to the parent window:

- `plugin_loaded`: Indicates the application has loaded
- `update_metadata`: Updates asset metadata
- `save_metadata`: Requests the parent system to save the current metadata

## Available Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## License

This project is licensed under the MIT License.
