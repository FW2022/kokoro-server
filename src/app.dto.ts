import { RenderableResponse } from "nest-next";
import { FindAllArgDto } from "./api/board/dto/board.dto";
import { User } from "./api/user/entities/user.entity";
import { AuthStatus } from "./api/user/user.types";

export class RouteIndexDto {
    authStatus: AuthStatus;
    res: RenderableResponse;
    query?: FindAllArgDto;
    user?: User;
}
