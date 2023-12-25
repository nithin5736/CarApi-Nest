import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string) {
        const user = this.repo.create({ email, password });
        
        return this.repo.save({ email, password });
    }

    async findOne(id: number) {
        if(!id) {
            throw new NotFoundException('no user with id null')
        }

        const user = await this.repo.findOneBy({ id });
        if(!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    find(email: string) {
        return this.repo.find({ where: { email } });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.repo.findOneBy({ id });
        if(!user) {
            throw new NotFoundException('User not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.repo.findOneBy({ id });
        if(!user){
            throw new NotFoundException('User not found');
        }
        return this.repo.remove(user);
    }
}
