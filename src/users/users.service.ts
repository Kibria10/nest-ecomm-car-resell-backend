import { Injectable } from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './user.entity';

@Injectable()
export class UsersService {
    //As our service is going to be using the repository we need to inject it into the constructor
    //we are going to create a private property called repo
    //we are going to call our repository repo
    //repo type is Repository<> and its going to have a generic type of User
    //inside the constructor we are going to set a property
    //@InjectRepoasitory(User) is telling the dependency system to create an instance of the users repository and inject it into the constructor.
    constructor(@InjectRepository(User) private repo: Repository<User>){
    }
    create(email: string, password: string){
        const user = this.repo.create({email, password});
        return this.repo.save(user);
    }
}
