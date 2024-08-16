import { Controller, UseGuards, Post, Query, Body } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthUserDto } from 'src/dto/AuthUserDto.model';
import { LocalAuthGuard } from './local-auth.guard';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User authentication' })
  @ApiBody({ type: AuthUserDto })
  @ApiResponse({ status: 200, description: 'Authentication is successfull' })
  async login(
    @Body() authUserDto: AuthUserDto,
  ) {
    return this.authService.login(authUserDto);
  }
}