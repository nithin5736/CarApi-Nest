import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');

export function setUpApp(app: any) {
    app.use(cookieSession({
        keys: ["abcdefghijklmnopqrstuvwxyz"]
    }))
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true
        })
    )
}