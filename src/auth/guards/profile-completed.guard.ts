import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ProfileCompletedGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request=context.switchToHttp().getRequest()
     const user = request.user;

    if (!user.isProfileCompleted) {
      throw new ForbiddenException(
        'Please complete your profile first',
      );
    }

    return true;
  }
}
