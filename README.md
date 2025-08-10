
## Description
## 1. Architecture & Structure

Express: Gives you a blank canvas. You decide folder structure, how to organize controllers, services, etc.

NestJS: Comes with a modular architecture out of the box (controllers, services, modules), which enforces separation of concerns.

## 2.TypeScript First
Express: TypeScript support is possible, but not native — you must configure types yourself and manually manage typing for routes, middleware, etc.


NestJS: Written in TypeScript, with decorators and DI patterns built to leverage type safety. Less boilerplate for TS.

## 3. Dependency Injection (DI)
Express: No DI system; you manually pass dependencies around.


NestJS: Has a built-in DI container, similar to Angular or Spring Boot, making testing and code reuse much easier.
```bash
// userService.js
class UserService {
  getUsers() {
    return [{ id: 1, name: 'Alice' }];
  }
}
module.exports = UserService;

// userController.js
const express = require('express');
const router = express.Router();

module.exports = (userService) => {
  router.get('/users', (req, res) => {
    res.json(userService.getUsers());
  });
  return router;
};

// app.js
const express = require('express');
const UserService = require('./userService');
const userController = require('./userController');

const app = express();
const userService = new UserService(); // manual creation
app.use('/', userController(userService)); // manual injection

app.listen(3000, () => console.log('Server running'));
____

NEST JS (BUilt in DI ContaineR)
// user.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUsers() {
    return [{ id: 1, name: 'Alice' }];
  }
}

// user.controller.ts
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {} // injected automatically

  @Get('users')
  getUsers() {
    return this.userService.getUsers();
  }
}

// app.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService], // tells NestJS to manage this dependency
})
export class AppModule {}
```
__________
## 4. Built-in Features
NestJS ships with integrations and patterns for:
Validation (class-validator + class-transformer)


Authentication (Passport.js)


Caching


WebSockets


GraphQL


Microservices


Exception filters, pipes, interceptors (inspired by Angular)


With Express, you add and wire these up manually.


____________________






## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```





