# yo Voy
![image](https://user-images.githubusercontent.com/31576799/177210973-fb1a7e66-ef5f-4850-a4a8-1afd1b3e4a7a.png)
This is an academic project done as a final project of Henry's fullstack bootcamp. It is an event application where users can buy tickets or create organizations that publish events. It has authentication and a functional payment gateway implemented.

You can access the site at the following link: [YoVoy!](https://yovoy-frontend.herokuapp.com/)


## Authors

- [@Pablo Pelardas](https://github.com/pablopelardas)
- [@Diego Avila](https://github.com/Diego-Avila-Acosta)
- [@Mariano Dunand](https://github.com/Elevattd)
- [@Gonzalo Madona](https://github.com/FireDash22)
- [@Federico Gomez](https://github.com/FmtGomez)
- [@Alan](https://github.com/shekingw)
- [@WorkdayLucas](https://github.com/WorkdayLucas)

## Tech Stack

**Client:** React, Redux, Redux Toolkit, MaterialUI, Typescript

**Server:** Node, Express, Typescript, Sequelize, Postgresql


## Features

- Authentication (Users, Organizations and Administrators).
     - Login and Registration with Google
- Payment gateway with Mercado Pago
- Event publication and ticket management.
- Request system between users and administrators.
     - To update or delete events
     - To create organizations
- 100% responsive styles


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### Client

`REACT_APP_API` : For local http://localhost:API_PORT

### Api

`DB_USER`

`DB_PASSWORD`

`DB_HOST`

`DB_NAME`

`DB_PORT`

`PORT`: Api PORT

`CORS`: Frontend, for local http://localhost:FRONT_PORT

`ACCESS_TOKEN_SECRET`

`REFRESH_TOKEN_SECRET`

`CLIENT_SECRET`

`CLIENT_ID`


## Run Locally

Clone the project

```bash
  git clone https://github.com/pablopelardas/yoVoy
```

Go to the project directory

```bash
  cd yoVoy
```

Install dependencies in both folders (API and CLIENT)

```bash
  npm install
```

Start the server

Front
```bash
  npm run start
```
Back
```bash
  npm run dev
```
