import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

//create temporary testing DI container. to load up some classes and some fake implementations of those classes.
it('can create an instance of auth service', async () => {
    //create a fake copy of the users service
    const fakeUsersService : Partial<UsersService> = {
        find: () => Promise.resolve([]),
        create: (email: string, password: string) =>
            Promise.resolve({ id: 1, email, password } as User)
    }

    //create a module or a DI container    
    const module = await Test.createTestingModule({
        providers: [AuthService, {
            provide: UsersService,
            useValue: fakeUsersService
        }],

    }).compile();

    //get an instance of the auth service from the DI container
    const service = module.get<AuthService>(AuthService);
    //assert that the service is defined
    expect(service).toBeDefined();
});