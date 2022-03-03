import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "../../user/entities/user.entity";
import { ROLES_KEY } from "../auth.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        await super.canActivate(context);

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (!requiredRoles || requiredRoles == []) {
            return true;
        }

        const req = context.switchToHttp().getRequest();

        return requiredRoles.some((role) => req.user.roles?.includes(role));
    }
}
