import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

describe("Auth Service", () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // create fake copy of users service
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
        }


        // create testing container
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ],
        }).compile();

        // get instance of AuthService
        service = module.get(AuthService);
    })

    it('can create an instance of AuthService', async () => {
        // test the created instance of AuthService
        expect(service).toBeDefined();
    })

    it('creates a new user with salted and hashed password', async () => {
        const user = await service.signup('asdf@gmail.com', 'asdf');

        expect(user.password).not.toEqual('asdf');

        const [salt, hash] = user.password.split('.');

        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws an error if email is already in use', async () => {
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: 'asdf' } as User]);
        
        // expects that asynchronous signup operation should 
        // result in a rejected Promise with a value BadRequestException
        await expect(service.signup('asdf@gmail.com', 'asdf')).rejects.toThrow(BadRequestException);
    })
})


