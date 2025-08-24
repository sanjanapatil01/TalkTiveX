

-----

# TalkTiveX

## 📝 Description

TalkTiveX is a **full-stack web-based chat application** designed to provide a seamless and engaging communication experience. It leverages **React** for the front end and **Express** for the back end, using **MongoDB** as the database. The application's core real-time functionality is powered by **Socket.io**, enabling instant message delivery.

-----

## ✨ Features

  - **Real-time Messaging**: Instant, bidirectional communication between users.
  - **Responsive Design**: The user interface is built with **React** and **Tailwind CSS** to work smoothly on both desktop and mobile devices.
  - **User Authentication**: Secure handling of user logins and profiles.

-----

## 🛠️ Tech Stack

  * **Frontend**: React, Tailwind CSS, Axios, React Router, React Hot Toast
  * **Backend**: Express.js, Node.js
  * **Database**: MongoDB
  * **Real-time**: Socket.io

-----

## 📦 Key Dependencies

```
@tailwindcss/vite: ^4.1.12
axios: ^1.11.0
date-fns: ^4.1.0
react: ^19.1.1
react-dom: ^19.1.1
react-hot-toast: ^2.6.0
react-router-dom: ^7.8.1
socket.io-client: ^4.8.1
tailwindcss: ^4.1.12
```

-----

## 🚀 Development Setup

To run this project, you need to set up both the **backend** and **frontend** in separate terminals.

1.  **Install Node.js**: Ensure you have a recent version of Node.js (v18+ recommended) installed.
2.  **Install Dependencies**: Navigate into both the `server` and `client` directories and run `npm install` in each to install the required packages.
    ```bash
    # Install backend dependencies
    cd server
    npm install

    # Install frontend dependencies
    cd ../client
    npm install
    ```
3.  **Run the Application**: You must start the backend server first.
      * **Start Backend**: In your first terminal (in the `server` directory), run:
        ```bash
        npm run server
        ```
      * **Start Frontend**: In a **new terminal** (in the `client` directory), run:
        ```bash
        npm run dev
        ```

The application will now be running, and you can view it in your browser.

-----

## 📁 Project Structure

```
.
├── client
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   └── ...
│   └── ...
└── server
    ├── controllers
    ├── models
    ├── routes
    └── ...
```

-----

## 👥 Contributing

Contributions are welcome\! Here's how you can help:

1.  **Fork** the repository.
2.  **Clone** your fork: `git clone https://github.com/sanjanapatil01/TalkTiveX.git`
3.  **Create** a new branch: `git checkout -b feature/your-feature`
4.  **Commit** your changes: `git commit -am 'Add some feature'`
5.  **Push** to your branch: `git push origin feature/your-feature`
6.  **Open** a pull request.
