import { Request } from "express";

export function getToken(req: Request) {
    return req.cookies["access_token"];
}

export function getBearerToken(req: Request) {
    const result = "Bearer " + getToken(req);
    return result;
}
