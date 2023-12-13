import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        // Check user is present in DB
        const user = await this.usersService.find(email);
        if(user.length){
            throw new BadRequestException('email in use');
        }

        // Hash the password
        // Generate salt
        const salt = randomBytes(8).toString('hex');
        // Hash the password and salt
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        // Combine salt and hashed password
        const result = salt + '.' + hash.toString('hex');

        // Create and save the user
        const savedUser = await this.usersService.create(email, result);

        // return the created user
        return savedUser;
    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        
        if(!user){
            throw new NotFoundException('user not found with given email');
        }

        const [salt, savedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if(hash.toString('hex') !== savedHash) {
            throw new BadRequestException('invalid password');
        }

        return user;
    }
}