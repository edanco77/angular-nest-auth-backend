import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from '../entities/jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService : JwtService,
              private authService : AuthService){}


  async canActivate(context: ExecutionContext): Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token){
      throw new UnauthorizedException('No hay Token en la peticion');
    }


    try{
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        {secret: process.env.JWT_SEED}
      );
      
      const user = await this.authService.findUserById(payload.id);
      if (!user) throw new UnauthorizedException('El Usuario no existe');
      if (!user.isActive) throw new UnauthorizedException('El Usuario esta Inactivo');


      request['user'] = user;

    }catch(rror){
       throw  new UnauthorizedException('No tiene Autorizacion')
    }
    
    




   
    console.log({token});


    return Promise.resolve(true);
  }


  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}
