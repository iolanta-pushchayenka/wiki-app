import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || "development";
const configModule = await import("../config/config.cjs");
const config = configModule.default[env];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

const db = {};

const files = fs.readdirSync(__dirname).filter(f =>
    f.endsWith(".js") && f !== "index.js"
);

for (const file of files) {
    const modelModule = await import(`./${file}`);
    const model = modelModule.default(sequelize);
    db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

