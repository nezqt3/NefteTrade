import { Request, Response } from "express";

export type TypedRequestParams<P> = Request<P, any, any, any>;
export type TypedRequest<T> = Request<{}, {}, T>;
export type TypedResponse<T> = Response<T>;
