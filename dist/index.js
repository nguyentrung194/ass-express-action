"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./App");
App_1.default.listen(process.env.PORT || 5001, () => {
    console.log(`Server is listening on ${process.env.PORT || 5001}`);
});
//# sourceMappingURL=index.js.map