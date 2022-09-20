<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h2 align="center">🏠 Zuni Forty Fourth Residences 🏠</h2>
  <p align="center">
    An Express Server!
  </p>
</div>

<br />
<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#deployment">Deployment</a></li>
  </ol>
</details>

<br />

## About The Project

This was built as a way for each resident to know a little more about their neighbors by being able to see neighbors' contact information and the property that they lived at. It also offers a place to share community events and contact information of companies for utilities, internet etc. All properties within the community are included in this application.

There were several reasons for working on this project, including the chance to:

- implement an Express server
- work with mySQL
- work with an ORM
- handle authentication and authorization via JWT and sessions
- integrate with 3rd party for image upload
- send email

### Roles

The application uses 3 access roles:

- `admin`
- `owner`
- `user`

There can only ever be 1 `admin`. The admin must approve access to allow an `owner` or `user` to access the application. The admin has the ability to add, edit or delete any `owner` or `user`.

Each property is allowed 1 `owner`. The owner must request access to the application and once approved can view and manage members of the property they own. They can also request to add additional household members and delete household members.

A `user`, once approved, can modify their information but has no permissions to approve or view any other household member of the property they belong to.

### Register Owner Flow

When adding an `owner`, the admin submits a form providing details of the `owner` including their email address. The `owner` is then sent a registration email containing a temp password and verification code and a link to the sign up page. The `owner` is added to the DB with a `request` status.

Owners need to click the sign up link (`/owner-registration-confirmation`) in the email within 48 hours otherwise it will expire. Upon clicking the link, the `owner` is taken to the "owner registration confirmation" page where they enter their email address, verification code and temp password. Once successfully confirmed, the `owner`'s status is updated to `approved`.

When submitting the request to invite a user, the server is responsible for:

- validating payload
- checking if property has an owner (only 1 owner per property allowed)
- creating owner record (user) in DB
- setting placeholder profile image
- sending email to owner including property address and temp email password

When submitting the request to register, the server is responsible for:

- checking verify code is valid
- checking verification code expiration has not expired - must register within 48 hours
- upon successful registration, associating owner with their property

#### Register User Flow

Adding a `user` can be requested by the `admin` or an `owner`. In either case, a form is submitted that provides details of the `user` including their email address. The `user` is then sent a registration email containing a temp password and verification code and a link to the sign up page. The `user` is added to the DB with a `request` status.

Users need to click the sign up link (`/user-registration-confirmation`) in the email within 48 hours otherwise it will expire. Upon clicking the link, the `user` is taken to the "user registration confirmation" page where they enter their email address, verification code and temp password. Once successfully confirmed, the `user`'s status is updated to `approved`.

When submitting the request to invite a user, the server is responsible for:

- validating payload
- checking if property has an owner (if no owner then error since need an owner before adding users)
- creating user record in DB
- setting placeholder profile image
- sending email to user including property address and temp email password

When submitting the request to register, the server is responsible for:

- checking verify code is valid
- checking verification code expiration has not expired - must register within 48 hours
- upon successful registration, associating user with their property

#### Login

The first time an `owner` or `user` logs in they need to use their `temp password` provided in the invitation email. They can then go to `my profile` to change their password.

When submitting the request to login, the provided email and password is sent. The server is responsible for:

- verifying credentials
- creating a session
- creating a JWT
- storing user and JWT signature in session
- creating a custom JWT payload
- setting a cookie with the custom JWT payload (30 min time limit)
- returning response

_To protect the api, each request from a logged in user is verified by reconstructing JWT (from session and post request sent by client) before granting access to endpoint. The cookie is then updated (maxAge) upon each successful request_

#### Forgot Password

Should an `owner` or `user` forget their password then they can visit `/forgot-password` and complete the form.Upon a successful submission, the requester receives a "password reset" email containing a reset code and a link (`/forgot-password-reset`) to confirm their password reset. The DB updates this user's status to `password`.

Upon completing the reset password form and submitting successfully, the user's status is updated to `approved`. The "user" can then login with their new password.

When submitting the request to forgot password, the server is responsible for:

- validating payload
- looking up user
- setting verify code and verify code expiration
- updating user status to 3 (password)
- sending an email to the user with a reset code

When submitting the request to change password, the server is responsible for:

- validating payload
- checking new password and confirmation password matches
- checking if user actually exists (email and verify code)
- checking verify code expiration hasn't expired
- when user found and code has not expired then user's password is updated, user's status is updated and both the verify code and verify code expiration are set to null

### Admin

Admin can:

- add `owner`
- edit `owner` details
- change property `owner` to another `user` that belongs to the property
- delete `owner`
- add `user`
- edit `user` details
- delete `user`
- add, edit and delete `events` and `companies`

_Note: An `owner` can only be added to a property that doesn't yet have an `owner`. A `user` can only be added to a property that has an `owner`._

### Owner

Owner can:

- invite `user`s to the property they own
- delete `user`s from the property they own
- modify their profile

_Note: owner cannot delete themselves_

### User

User can:

- modify their profile

_Note: user cannot delete themselves_

#### Profile Picture

Upon creation of a `owner` or `user` a placeholder picture is saved for the record. Once logged in, the "user" can choose to upload their own profile picture, which is saved to `Cloudinary` and served via an optimized url.

### Email

There are a few transaction emails that are sent from the application and in development [Mailtrap](https://mailtrap.io/) is used to intercept the email being sent in order to view it to confirm correctness. This is a simple way to avoid sending emails out to "users" while working on logic in development.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### **Built With**

Below is a list of the major pieces of the tech stack that were used for this application.

- [![Express][express]][express-url]
- [![MySQL][mysql]][mysql-url]
- [![Sequelize][sequelize]][sequelize-url]
- [![Pug][pug]][pug-url]
- [![JSON Web Tokens][jsonwebtokens]][jsonwebtokens-url]
- [![Cloudinary][cloudinary]][cloudinary-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

---

HERE HERE HERE

## Getting Started

The following information will provide you with the details necessary to get the application up and running locally.

### **Prerequisites**

On your operating system of choice, ensure that [NodeJS](https://nodejs.org/en/) version `14.8.1` is installed. It is recommended that a Node Version Manager be used, such as [NVM](https://github.com/nvm-sh/nvm). When installing `NodeJS` this way, the correctly associated `npm` version should automatically be installed.

```sh
nvm install node@14.8.1
```

It's recommended to download [Sequel Pro](http://sequelpro.com/) or another GUI to work with `mySQL` database. Once installed, you'll need a way to start a SQL server. One option is to install [MySQL](https://dev.mysql.com/). On mac, once installed you can visit `System Preferences` and should be able to select `MySQL` and start the server.

Once the server is running, you can create a new `localhost` (`127.0.0.1`) connection with `3306` port.

You'll also need to create a [Mailtrap](https://mailtrap.io/) account since this will be used to "trap" transaction emails that are sent to users in non-production environments. Keep a note of the `host`, `port`, `username` and `password`.

To handle images, you'll want to create a [Cloudinary](https://cloudinary.com/) account. Be sure to take note of the `cloud name`, `API key` and `API secret`.

You'll then want to create a local `variables-dev.env` file at the root of the project with the following info:

```sh
  NODE_ENV=development
  DB_HOST=localhost
  DB_USER=root
  DB_PASS=root
  DB_NAME=<Database Name>
  HOST='http://localhost'
  FE_PORT=<Front End App Port>
  PORT=5555
  SECRET=<Secret>
  CLOUDINARY_CLOUD_NAME=<Cloudinary Cloud Name>
  CLOUDINARY_API_KEY=<Cloudinary API Key>
  CLOUDINARY_API_SECRET=<Cloudinary API Secret>
  MAIL_USER=<Mailtrap User>
  MAIL_PASS=<Mailtrap User Password>
  MAIL_HOST=<Mailtrap Host>
  MAIL_PORT=<Mailtrap Port>
```

### **Installation**

Once `NodeJS` and `npm` are installed you can follow these steps:

1. Clone the repo
   ```sh
   git clone https://github.com/DeanGilewicz/zuni-forty-fourth-backend.git
   ```
2. Install NPM packages
   ```sh
   npm i
   ```
3. Run local DB server
4. Run the application
   ```sh
   npm start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

## Usage

This application provides a couple of commands in `package.json`:

- start
  - run the application based on `variables-dev.env` or `variable.env`
- test
  - not configured

Once the server is up and running `npm start` you can reach it at [http://localhost:5555/](http://localhost:5555/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

## Deployment

This application can be deployed anywhere where `NodeJS` can be ran.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[express]: https://img.shields.io/badge/Express-20232A?style=for-the-badge&logo=express&logoColor=ffffff
[express-url]: https://expressjs.com/
[mysql]: https://img.shields.io/badge/MySQL-ffffff?style=for-the-badge&logo=mysql&logoColor=4479A1
[mysql-url]: https://www.mongodb.com/
[sequelize]: https://img.shields.io/badge/Sequelize-ffffff?style=for-the-badge&logo=sequelize&logoColor=52B0E7
[sequelize-url]: https://mongoosejs.com/
[pug]: https://img.shields.io/badge/Pug-A86454?style=for-the-badge&logo=pug&logoColor=ffffff
[pug-url]: https://pugjs.org/api/getting-started.html
[jsonwebtokens]: https://img.shields.io/badge/jsonwebtokens-ffffff?style=for-the-badge&logo=jsonwebtokens&logoColor=000000
[jsonwebtokens-url]: https://webpack.js.org/
[cloudinary]: https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge
[cloudinary-url]: https://cloudinary.com/
