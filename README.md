# Cibus - Inventory Management App

Cibus is an inventory management application designed to help businesses keep track of their products, inventory items, and recipes. The app includes features for user registration, authentication, and validation of JWT tokens.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and login
- JWT-based authentication
- Token validation
- CRUD operations for products and inventory items
- Recipe management

## Technologies Used

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend**: React, Expo

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Git
- Expo Go App (found in App Store or Google Play Store)

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/cibus.git
    cd cibus
    ```

2. Install backend dependencies:

    ```sh
    cd backend
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the `backend` directory and add the following:

    ```env
    JWT_SECRET=your_jwt_secret
    MONGODB_URI=your_mongodb_uri
    ```

4. Install frontend dependencies:

    ```sh
    cd ../frontend
    npm install
    ```

### Running the Application

1. Start the MongoDB server.

2. Start the backend server:

    ```sh
    cd backend
    node 
    ```

3. Start the frontend server:

    ```sh
    cd frontend
    npx expo start
    ```

## Usage

Scan the QR code using the expo app with your mobile phone or run it using an emulator
