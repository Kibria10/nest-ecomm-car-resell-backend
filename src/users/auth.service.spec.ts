import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";

//create temporary testing DI container. to load up some classes and some fake implementations of those classes.
it('can create an instance of auth service', async () => { 
    //create a module or a DI container    
    const module = await Test.createTestingModule({
        providers: [AuthService]
    }).compile();

//get an instance of the auth service from the DI container
    const service = module.get<AuthService>(AuthService);
//assert that the service is defined
    expect(service).toBeDefined();
});