# YouTube Streams Launcher

Welcome to the **YouTube Streams Launcher**! This open-source project helps you automate the process of listening to YouTube streams. This repository comes with an MIT license, so feel free to use and modify it as you wish.

## Getting Started

To get started with the YouTube Streams Launcher, follow these simple steps:

### 1. Clone the repository

First, clone the repository to your local machine using the following command:

```bash
git clone https://github.com/vasilevich/youtube-streams-launcher.git
```

### 2. Install dependencies

Navigate to the cloned repository and install the required dependencies using either `npm` or `yarn`:

```bash
cd youtube-streams-launcher
npm install
```

or

```bash
cd youtube-streams-launcher
yarn install
```

### 3. Set up the Google API client secret

To authenticate with the Google API, you'll need a `client_secret.json` file. You can obtain this file by creating a new project in the [Google API Console](https://console.developers.google.com/), enabling the YouTube Data API v3, and creating OAuth 2.0 credentials with the scope of `youtube.youtube.readonly`. 

Once you have your `client_secret.json` file, place it in the following directory:

```
./assets/certs/client_secret.json
```

### 4. Run the application

Now you're ready to run the application! Start the app using the following command:

```bash
node app.js
```

On the first run, the app will launch Google Chrome and prompt you to authenticate your Google account (or you can copy the link from the console). This process will generate a `token.json` file, which will be used for subsequent runs.

After authentication, the application will start an Express server on port 3000 and begin listening for YouTube streams.

On subsequent runs, the application will automatically use the existing `token.json` file and start the listening process without requiring authentication.

## Contributing

We welcome contributions to this project! Feel free to submit pull requests or open issues with any suggestions, improvements, or bug reports.

## License

This project is licensed under the MIT License. For more information, please refer to the [LICENSE](LICENSE) file in the repository.
