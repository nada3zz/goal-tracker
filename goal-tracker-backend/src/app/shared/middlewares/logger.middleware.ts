import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


@Injectable()
export class LoggerMiddleWare implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(request: Request, response: Response, next: NextFunction): void {
        const { method, originalUrl } = request;
        const userAgent = request.get('user-agent') || '';
         const realIp = request.get('x-real-ip')
        

        response.on('finish', () => {
            const { statusCode } = response;
            this.logger.log(`${method}  ${originalUrl}  ${statusCode} - ${userAgent} ${realIp} `);
        });

        next();
    }
}