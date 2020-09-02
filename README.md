# NodeJS Project Boilerplate

## Directory Structure

- **_/API_** - Used to store all API endpoints for testing purpose. These can be easily tested using VS Code's **REST Client** extension
- **_/controlles_** - Store all controller files for different modules
- **_/routes_** - Store all routes for different modules
- **_/middlewares_** - Store different middleware files for different purposes
- **_app.js_** - Base file that runs the NodeJS App

<br />

## Packages Used

- [axios](https://www.npmjs.com/package/axios) - Promise based HTTP client for the browser and node.js
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Optimized bcrypt in JavaScript with zero dependencies.
- [cors](https://www.npmjs.com/package/cors) - CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
- [dotenv](https://www.npmjs.com/package/dotenv) - Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
- [express](https://www.npmjs.com/package/express) - Fast, unopinionated, minimalist web framework for node.
- [formidable](https://www.npmjs.com/package/formidable) - A Node.js module for parsing form data, especially file uploads.
- [fs-extra](https://www.npmjs.com/package/fs-extra) - fs-extra adds file system methods that aren't included in the native fs module and adds promise support to the fs methods.
- [helmet](https://www.npmjs.com/package/helmet) - Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - An implementation of JSON Web Tokens.
- [lodash](https://www.npmjs.com/package/lodash) - The Lodash library exported as Node.js modules.
- [moment](https://www.npmjs.com/package/moment) - A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
- [morgan](https://www.npmjs.com/package/morgan) - HTTP request logger middleware for node.js
- [nodemailer](https://www.npmjs.com/package/nodemailer) - Send e-mails from Node.js
- [yup](https://www.npmjs.com/package/yup) - Yup is a JavaScript schema builder for value parsing and validation.
- [mysql](https://www.npmjs.com/package/mysql) - This is a node.js driver for mysql. It is written in JavaScript, does not require compiling, and is 100% MIT licensed.

<br />

## Dev Dependancies

- [nodemon](https://www.npmjs.com/package/nodemon) - nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

<br />

## Installation Steps

Make required changes inside .env file and simply run
`npm install`

- Run development server - `npm run dev`
- Run production server - `npm run start`

<br />

> Make sure to remove all unnecessary packages from **_package.json_** file before deploying to production server

<br />

## Todo

- [ ] Use Sequelize ORM to access database
- [x] Add Database configurations for MySQL
- [ ] Add Database configurations for MongoDB
- [ ] Implement Email feature (use mailtrap.io)
- [x] Implement full CRUD code for TODO List (Tasks)
- [x] Add image upload feature
- [ ] Add data validations using Yup library
- [ ] Implement Auth features
- [x] Add error handling helper code
- [ ] Implement app Testing procedures using Jest or Mocha
