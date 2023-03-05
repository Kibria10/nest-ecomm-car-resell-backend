import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        //create a fake copy of the users service
        const fakeUsersService: Partial<UsersService> = {
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
        service = module.get<AuthService>(AuthService);
    });

    //create temporary testing DI container. to load up some classes and some fake implementations of those classes.
    it('can create an instance of auth service', async () => {
        //assert that the service is defined
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = service.signup('asdf@asdf.com', 'asdf');

        expect((await user).password).not.toEqual('asdf');
        const [salt, hash] = (await user).password.split('.');
        expect(salt).toBeDefined(); //making sure that the password was salted
        expect(hash).toBeDefined(); //making sure that the password was hashed
    });

});