
# Class API (Midterm assignment)

API server side



## API Reference

#### Authentication routes

```http
  POST /auth/login
  POST /auth/google
  POST /auth/register
```

#### Course management

```http 
  GET /course/
  GET /course/:id
  GET /course/public/:id

  POST /course/
  POST /course/join
  POST /course/invite/teacher
  POST /course/invite/student
  POST /course/leaveCourse

  PUT /course/:id
  DELETE /course/:id
```


## Run Locally

Clone the project

```bash
  git clone https://github.com/black055/midterm-classroom-api
```

Go to the project directory

```bash
  cd midterm-classroom-api
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```


## Features

- Authentication: Register, Login, Logout
- Google Sign-In
- Create course
- List courses
- Show course's members
- Partake course by an invitation link
- Invite teachers/students by email
- Manage Profile
- Student ID and account mapping


## Tech Stack


**Server:** Node, express, passport, nodemailer

