import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt); //just to make promise version of scrypt


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {} //dependency injection of usersService to use in this authService

    async signup(email: string, password: string) {
        const users = await this.usersService.find(email);
        if (users.length) {
            throw new BadRequestException('Email in use');
        }
        //Hash the users password 
        //Generate  a salt
        const salt = randomBytes(8).toString('hex');
        //Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer; //typescript has no idea what scrypt returns so we have to cast it as a buffer to help ts out
        //Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');
        //create a new user and save it
        const user = await this.usersService.create(email, result);
        //return the user
        return user;
    }

    async signin(email: string, password: string) { 
        //find the user
        const [user] = await this.usersService.find(email); //the find method returns an array of users
        if (!user) {
            throw new BadRequestException('Invalid email');
        }
        //make sure the password is correct
        const [salt, storedHash] = user.password.split('.'); //split the password into the salt and the hash
        const hash = (await scrypt(password, salt, 32)) as Buffer; //hash the password with the salt
        if (storedHash !== hash.toString('hex')) {
             //compare the stored hash with the hash of the password
            throw new BadRequestException('Invalid password');
        }
        return user;
    }

}

