import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto } from 'src/dto/AuthUserDto.model';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        console.log('serching email ' + email);
        const user = await this.usersService.findOneByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return { id: user.id, email: user.email };
        }

        return null;
    }

    async login(authUserDto: AuthUserDto) {
        const user = await this.validateUser(authUserDto.email, authUserDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
