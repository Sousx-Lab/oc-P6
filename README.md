# Piiquante

API Piiquante

### Install dependencies

```bash
  npm install
```

### Setup

Edit ```DATABASE_URL``` in ```.env``` file.

### Load fixtures

```bash
  npm fixtures
```

### Run tests

Edit ```DATABASE_URL``` in ```.env.test``` file.

```bash
  npm test
```
if some tests fail, run the tests located in the ```test/controllers``` folder one by one .

e.g to run ```user.controller.test.js```

```bash
npm test test/controllers/user.controller.test.js
```

### Run server

```bash
  npm start
```