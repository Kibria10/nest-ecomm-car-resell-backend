import{
    createParamDecorator,
    ExecutionContext
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    //the never type is to ensure that CurrentUser decorator does not need any data passed to it
    (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.session.userId;
    }
)