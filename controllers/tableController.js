const Table = require("../models/tablesModel");
const factory = require("./handlerFactory");

exports.getAllTables = factory.getAll(Table);

exports.getTable = factory.getOne(Table);

exports.createTable = factory.createOne(Table);

exports.updateTable = factory.updateOne(Table);

exports.deleteTable = factory.deleteOne(Table);
