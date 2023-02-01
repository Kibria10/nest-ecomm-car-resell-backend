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
    //@InjectRepoasitory(User) is telling the dependency system to create an instance of the users repository and inject it into the constructor.
    constructor(@InjectRepository(User) private repo: Repository<User>){
    }
    create(email: string, password: string){
        //9.2 & 9.3: we COULD directly pass into save function the object {email, password} but we are going to create a variable called user and assign it to the result of calling repo.create
        //we didn't directly pass to the save function the object {email, password} because hooks are not going to be triggered if we do that.
        //hooks are going to be triggered if we create an instance of the user entity and then call save on that instance.
        //hooks are defined in the user.entity.ts file i.e. @BeforeInsert() and @BeforeUpdate() to check if the password is hashed or not etc functionalities.
        
        const user = this.repo.create({email, password}); //create function creates an instance of the user entity
        return this.repo.save(user); //save is used for persisting the user to the database
    }

    findOne(id: number){
        return this.repo.findOneBy({id}); //findOne is deprecated. findOneBy is the new one and it takes object as an argument.
    }

    find(email: string){
        return this.repo.find({
            where: {email: email}
        });//find is deprecated as well. It now takes where and relation objects as arguments.
    }

    async update(id: number, attrs: Partial<User>){
        const user = await this.findOne(id);
        if(!user){
            throw new Error('User not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number){
        const user = await this.findOne(id);
        if(!user){
            throw new Error('User not found');
        }
        return this.repo.remove(user);
    }
}
