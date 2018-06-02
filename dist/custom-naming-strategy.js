"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const StringUtils_1 = require("typeorm/util/StringUtils");
class CustomNamingStrategy extends typeorm_1.DefaultNamingStrategy {
    tableName(targetName, userSpecifiedName) {
        return userSpecifiedName ? userSpecifiedName : StringUtils_1.snakeCase(targetName);
    }
    columnName(propertyName, customName, embeddedPrefixes) {
        return StringUtils_1.snakeCase(embeddedPrefixes.concat(customName ? customName : propertyName).join("_"));
    }
    columnNameCustomized(customName) {
        return customName;
    }
    relationName(propertyName) {
        return StringUtils_1.snakeCase(propertyName);
    }
}
exports.CustomNamingStrategy = CustomNamingStrategy;
//# sourceMappingURL=custom-naming-strategy.js.map