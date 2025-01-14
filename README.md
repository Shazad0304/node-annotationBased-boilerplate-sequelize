🎫 A Class Base Routing Boilerplate for Node.js, Express.js, MongoDB with Typescript.

### What is it?
Try to implement A  Class Base Routing with clean structure and scalable boilerplate in Node.js,Express.js and Typescript.

### Features

- **Sentry** catch errors.
- **API Documentation** using **Swagger**.
- **Basic Security Features** using [Helmet](https://github.com/helmetjs/helmet), [hpp](https://github.com/analog-nico/hpp) and [xss clean](https://github.com/jsonmaur/xss-clean).
- **Validation** using [class-validator](https://github.com/typestack/class-validator)
- **class base routing** using [routing-controllers](https://github.com/typestack/routing-controllers)
- **Authentication** - using [Passport.js](https://github.com/jaredhanson/passport) [passport-jwt](https://github.com/mikenicholson/passport-jwt) which is compatible with Express.js and is a authentication middleware for Node.js.
- **Database** using [mongoose](https://mongoosejs.com/) odm for interacting with mongoDB.
- **run testing** using [Jest](https://jestjs.io/)
- **linting** using [ESLint](https://eslint.org/)
- **prettier** using [Prettier](https://prettier.io/)
 

<br />

## Getting Started

 install dependencies

```bash
yarn
```
<br>

### Without Docker
Note: It is assumed here that you have MongoDB running in the background.

set `.env.development.local` file with your credentials.(like DB URL)

Run the app
```bash
yarn dev
```


### With Docker
Note: It is assumed here that you have installed Docker and running in the background.
```bash
yarn docker:db
```
set `.env.development.local` file with your credentials.(like DB URL)

Run the app
```bash
yarn dev
```



<br />
<br />

### Route Documents

you can access swagger documentation at `http://localhost:3000/api-docs`

<br>
<br>
<br>

### What is the Structure of template?
```
binah
├─ .github
│  └─ workflows
│     └─ tests.yml
├─ README.md
├─ ecosystem.config.js
├─ jest.config.js
├─ package.json
├─ src
│  ├─ __tests__
│  │  ├─ api
│  │  │  └─ v1
│  │  │     └─ auth
│  │  │     └─ users
│  ├─ api
│  │  └─ v1
│  │     ├─ auth
│  │     │  ├─ auth.controller.ts
│  │     │  └─ dtos
│  │     ├─ index.ts
│  │     └─ user
│  │        └─ user.controller.ts
│  ├─ app.ts
│  ├─ common
│  │  ├─ constants
│  │  │  └─ index.ts
│  │  ├─ interfaces
│  │  │  ├─ crud.interface.ts
│  │  │  └─ timestamp.interface.ts
│  │  └─ types
│  ├─ config
│  │  ├─ index.ts
│  │  └─ passport.ts
│  ├─ exceptions
│  │  └─ HttpException.ts
│  ├─ index.ts
│  ├─ middlewares
│  │  ├─ auth.middleware.ts
│  │  ├─ handlingErrors.middleware.ts
│  │  └─ validation.middleware.ts
│  ├─ models
│  │  ├─ tokens.model.ts
│  │  └─ users.model.ts
│  ├─ services
│  │  └─ v1
│  │     ├─ auth.service.ts
│  │     ├─ index.ts
│  │     ├─ token.service.ts
│  │     └─ user.service.ts
│  └─ utils
│     └─ toJSON.plugin.ts
├─ tsconfig.json

```