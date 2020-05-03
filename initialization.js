"use strict";

use dbmongo;

db.createUser({ user: "user", pwd: "password", roles: [{ role: "dbOwner", db: "dbmongo" }]});

db.insertMany([{ item: "apple", price: 5 }, { item: "banana", price: 10 }]);
