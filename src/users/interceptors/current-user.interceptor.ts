import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable() // to make use of DI
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) {}

    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};

        if(userId) {
            const currentUser = await this.usersService.findOne(userId);
            request.currentUser = currentUser;
        }

        return handler.handle();
    }
}