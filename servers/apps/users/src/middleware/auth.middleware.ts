import { Injectable, NestMiddleware } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ClearRolesMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const context = GqlExecutionContext.create(req);
    const { operationName } = context.getInfo();

    // Define your authentication operations
    const authOperations = [
      'register',
      'login',
      'resetPassword',
      'forgotPassword',
    ];

    // Check if the operation name matches any of the auth operations
    if (authOperations.includes(operationName)) {
      // Clear roles metadata
      Reflect.deleteMetadata('roles', req);
    }

    next();
  }
}
