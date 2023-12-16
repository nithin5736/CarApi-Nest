import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe("Auth Service", () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        const users: User[] = [];

        // create fake copy of users service
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter((user) => user.email === email)
                return Promise.resolve(filteredUsers)
            },
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 9999), email, password } as User
                users.push(user)
                return Promise.resolve(user)
            }
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

    it('throws an error if user signsup with an email already in use', async () => {
        await service.signup('asdf@gmail.com', 'asdf')

        // expects that asynchronous signup operation should 
        // result in a rejected Promise with a value BadRequestException
        await expect(service.signup('asdf@gmail.com', 'asdf')).rejects.toThrow(BadRequestException);
    })

    it('throws an error if user signin with unsused email', async () => {
        await expect(service.signin('asdf@gmail.com', 'password')).rejects.toThrow(NotFoundException);
    })

    it('throws an error if user provides invalid password', async () => {
        await service.signup('asdf@gmail.com', 'mypassword')
        await expect(service.signin('asdf@gmail.com', 'ahjgdhg')).rejects.toThrow(BadRequestException)
    })

    it('returns user if user provides correct password', async () => {
        // fakeUsersService.find = () => Promise.resolve([{ email: 'asdf@gmail.com', password: 'ddeba23710250136.b7979a583729f1ec1b2bf3a5515256aef2cc9bb401174faf0c68b7d7f2658aab'} as User])

        // const user = await service.signin('asdf@gmail.com', 'mypassword');

        // expect(user).toBeDefined();

        await service.signup('asdf@gmail.com', 'mypassword')
        // console.log(user)
        const user = await service.signin('asdf@gmail.com', 'mypassword')
        expect(user).toBeDefined()
    })
})


