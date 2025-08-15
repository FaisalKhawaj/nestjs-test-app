
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


## Validations 
 Validations are done through pipes. can be done at global level or specific method controller level

### 1. @useGlobalPipes()

Scope: Applies to every request in the entire application — controllers, routes, guards, interceptors, everything.

When to use: When you want the same validation logic for all DTOs, without repeating yourself.

Where: In main.ts at bootstrap time.

### Pros:

Centralized configuration.
No need to add @UsePipes() everywhere.
Automatically applies to all endpoints

### Cons:

Less granular — if one route needs different settings, you must override it at method or controller level..
___

### 2.@UsePipes
Scope: Only applies to the method or controller it decorates.

### When to use:
If you want custom settings for a specific route/controller.
If you don’t want validation to run globally.

At method level:

```bash
@Post()
@UsePipes(new ValidationPipe({ whitelist: false }))
createUser(@Body() dto: CreateUserDto) {}
```

At controller level:

```bash
@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('users')
export class UsersController {}
```
______________________

## DTO VS Entity

### DTO (Data transfer object)
Purpose: Define the shape of incoming/outgoing data.

Usage: Used in controllers/services to validate and control what data is sent or accepted.

Contains: Validation rules, API docs metadata.

Decorators: class-validator (@IsString(), @IsEmail(), etc.), Swagger decorators (@ApiProperty()).

Not tied to the database: Purely for API contract.

```bash
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;
}

```

### Entities

Purpose: Map your code to database tables (ORM models).

Usage: Used by TypeORM to create, read, update, delete data.

Contains: Table name, columns, relations, indexes, etc.

Decorators: @Entity(), @Column(), @PrimaryGeneratedColumn(), etc.

Coupled to the database: Directly represents the DB schema.

```bash
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { comment: 'The user unique identifier' })
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // stored hashed in DB
}
```
_________

### Typical NestJS Data Flow

Client (Frontend) → Controller → Service → Repository → Database

Controller: Handles incoming HTTP requests and sends responses. It does not contain business logic.

Service: Contains the business logic. Calls the repository to fetch, insert, or update data.

Repository: Handles direct database communication via TypeORM. It maps your Entity (User) to the actual database table.

Database: Your actual persistence layer (PostgreSQL, MySQL, etc.).



### FindOneBy vs FindOne
findOne({ where: { id: userId } })
Accepts a full FindOneOptions object, meaning you can:

Add relations (eager load related entities like userProfile)

Add select (choose which fields to return)

Add order, cache, etc.

```bash
const user = await this.userRepo.findOne({ where: { id: userId },
 relations: { userProfile: true },
  select: { id: true, email: true },
});
```
Downside: Slightly more overhead since TypeORM has to process options.
______

findOneBy({ id: userId })
Simpler and faster — directly translates to a SQL WHERE clause.

Can only filter
```bash
const user = await this.userRepo.findOneBy({ id: userId });
```



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





