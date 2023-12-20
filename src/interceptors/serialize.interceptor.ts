import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";

interface ClassContructor {
    new (...args: any[]) : {}
}

export function Serialize(dto: ClassContructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor (private dto: any) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // intercept incoming request before route handler
        // Run something before request is handled in handler
        // console.log("I'm running before handler", context);

        // Intercept outgoing response before response sent
        return next.handle().pipe(
            // Run something before response sent out
            map((data: any) => {
                // console.log("I'm running before response sent", data);

                // Converts the outgoing response to UserDto excluding
                // other properties
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        )
    }
}