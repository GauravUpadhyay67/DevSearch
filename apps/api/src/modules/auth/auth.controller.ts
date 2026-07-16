import { Controller, Post, Body, UseGuards, Request, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Public()
  @UseGuards(AuthGuard('github'))
  @Get('github')
  async githubAuth() {
    // Initiates the GitHub OAuth flow
  }

  @Public()
  @UseGuards(AuthGuard('github'))
  @Get('github/callback')
  async githubAuthCallback(@Req() req: any, @Res() res: Response) {
    const { accessToken } = await this.authService.login(req.user);
    // In a real app, redirect to frontend with tokens (e.g., via query params or cookies)
    res.redirect(`http://localhost:3000/auth/success?token=${accessToken}`);
  }

  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth() {
    // Initiates the Google OAuth flow
  }

  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const { accessToken } = await this.authService.login(req.user);
    res.redirect(`http://localhost:3000/auth/success?token=${accessToken}`);
  }
}
