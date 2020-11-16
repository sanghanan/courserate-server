# Course Rater

An application that lets users review and vote for courses.

## Installation

##### Clone the repository and install the dependencies

```sh
git clone https://github.com/SanjithaSingh/courserate-server.git
cd courserate-server
npm install
```

##### Create a .env file with the following constants:

- MONGODB_URI : connection string for mongodb
- SECRET_KEY : A secret key to encode and decode jwt access tokens
- REFRESH_SECRET_KEY : A secret key to encode and decode jwt refresh tokens

##### Start the development server

```sh
npm run dev
```
