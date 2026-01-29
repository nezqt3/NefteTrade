import { Request, Response } from "express";

export type TypedRequest<T> = Request<{}, {}, T>;
export type TypedResponse<T> = Response<T>;