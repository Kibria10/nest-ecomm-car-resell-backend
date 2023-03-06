import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        //create a fake copy of the users service
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = ({
                    id: Math.floor(Math.random() * 99999),
                    email,
                    password
                } as User);
                users.push(user);
                return Promise.resolve(user);
            }
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

    //in this test we want the find method to return an empty array
    it('creates a new user with a salted and hashed password', async () => {
        const user = service.signup('asdf@asdf.com', 'asdf');

        expect((await user).password).not.toEqual('asdf');
        const [salt, hash] = (await user).password.split('.');
        expect(salt).toBeDefined(); //making sure that the password was salted
        expect(hash).toBeDefined(); //making sure that the password was hashed
    });

    //in this test we want the find method to return an array with one user in it
    it('throws an error if user signs up with email that is in use', () => {
        fakeUsersService.find = () =>
            Promise.resolve([{ id: 1, email: 'asdf@asdf.com', password: 'asdf' } as User]); //redefine the find method to return an array with one user in it for only this test
        return service.signup('asdf@asdf.com', 'asdf')
            .catch((err) => {
                // Handle the error here
                expect(err.message).toEqual('Email in use');
            });
    });

    //in this case we want the find method to return an empty array, so we use the default find method defined inside the beforeEach function
    it('throws if signin is called with an unused email', () => {
        return service.signin('asdf@asdf.com', 'asdf')
            .catch((err) => {
                // Handle the error here
                expect(err.message).toEqual('Invalid email');
            });
    });

    it('throws if an invalid password is provided', () => {
        fakeUsersService.find = () =>
            Promise.resolve([{ id: 1, email: 'asdf@asdf.com', password: 'asdf' } as User]); //redefine the find method to return an array with one user in it for only this test
        return service.signin('whateveremail@whatever.com', 'asdf')
            .catch((err) => {
                // Handle the error here
                expect(err.message).toEqual('Invalid password')
            });
    });

    it('returns a user if correct password is provided', async () => {
        const email = 'test@example.com';
        const password = 'password123';

        // Create a user with the given email and password
        await service.signup(email, password);

        // Call the signin() function with the correct email and password
        const user = await service.signin(email, password);

        // Assert that the user object is returned and has the correct email
        expect(user).toBeDefined();
        expect(user.email).toEqual(email);
    });

});
