import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";
import { UserDto } from "../users/dtos/UserDto";

// This is the interface that will be used to specify the type of the DTO that will be used for the outgoing response
// This is not needed if you are using the DTO directly in the controller
// This interface is for the Serialize decorator that will take only class types as arguments instead of using "any" type
interface ClassConstructor {
    new (...args: any[]): {}
}
// This is the decorator that will be used in the controller to specify which DTO to use for the outgoing response
export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {

    constructor(private dto: any) { 

    }

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        // Run something before a request is handled by the request handler
        console.log('I am running before the handler', context);

        return handler.handle().pipe(
            map((data: any) => {
                // Run something before the response is sent out
                // console.log('I am running before the response is sent out', data);
                return plainToClass(UserDto, data,
                    {
                        excludeExtraneousValues: true //removes extra property if users tries to send extra keys with theier incoming body request. basically allows to send only the keys that are defined in the DTO.
                    }
                );
            }),
        )
    };
}