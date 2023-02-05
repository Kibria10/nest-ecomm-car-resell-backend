import { Expose } from "class-transformer";

// This is the DTO that will handle the outgoing response
export class UserDto{
    @Expose()
    id: number;
    @Expose()
    email: string;
}