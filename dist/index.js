"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const chemical_1 = __importDefault(require("./routes/chemical"));
const chemicalLog_1 = __importDefault(require("./routes/chemicalLog"));
const instrument_1 = __importDefault(require("./routes/instrument"));
const instrumentLog_1 = __importDefault(require("./routes/instrumentLog"));
const reservation_1 = __importDefault(require("./routes/reservation"));
const error_1 = __importDefault(require("./middlewares/error"));
require("./configs/passport");
mongoose_1.default.set('sanitizeFilter', true);
mongoose_1.default
    .connect(process.env.DB_URL)
    .then(() => {
    console.log('資料庫連線成功');
})
    .catch((error) => {
    console.error(error);
    console.error('資料庫連線失敗');
});
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    // origin 請求來源網域
    // callback(錯誤, 是否允許)
    origin: (origin, callback) => {
        if (origin &&
            [
                'http://localhost:3000',
                'http://127.0.0.1:3000',
                'https://erinameng0720.github.io',
            ].includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('CORS'), false);
        }
    },
    // 允許跨網域請求攜帶 cookie
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/auth', auth_1.default);
app.use('/user', user_1.default);
app.use('/chemical', chemical_1.default);
app.use('/chemical-log', chemicalLog_1.default);
app.use('/instrument', instrument_1.default);
app.use('/instrument-log', instrumentLog_1.default);
app.use('/reservation', reservation_1.default);
app.use(error_1.default);
app.listen(process.env.PORT || 4000, () => {
    console.log('伺服器啟動');
});
//# sourceMappingURL=index.js.map