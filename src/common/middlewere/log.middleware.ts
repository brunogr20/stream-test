import * as dotenv from 'dotenv';

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

dotenv.config();

import LogItemsToHide from '../constants/log-hide-items.constant';
import Logger from '../helpers/logger.helper';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (this.isUrltoIgnoreLog(req.path, req.method)) return next();
    this.preProcess(req);

    function postProcess(): void {
      res.removeListener('finish', postProcess);
      res.removeListener('close', postProcess);

      const startTime = new Date(req['startTime']);
      const endTime = new Date();

      const logObject = {
        requestId: req['id'],
        originalPath: req['originalPath'],
        startTime: format(startTime, 'dd-MM-yyyy HH:mm:ss'),
        endTime: format(endTime, 'dd-MM-yyyy HH:mm:ss'),
        intervalInSeconds: (endTime.getTime() - startTime.getTime()) / 1000,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
      };

      const logMessage = JSON.stringify(logObject);

      process.nextTick(() => {
        if (res.statusCode > 399) {
          Logger.error(logMessage);
        } else if (res.statusCode > 299) {
          Logger.warn(logMessage);
        } else {
          Logger.info(logMessage);
        }
      });
    }

    res.on('finish', postProcess);
    res.on('close', postProcess);

    if (next) {
      next();
    }
  }

  private filterLogBody(
    params: Record<string, unknown>,
  ): Record<string, unknown> {
    const filtered: Record<string, unknown> = { ...params };
    for (const [key] of Object.entries(filtered)) {
      if (LogItemsToHide.params.includes(key.toLowerCase())) {
        filtered[key] = '[FILTERED]';
      }
    }

    return filtered;
  }

  private filterLogHeaders(
    headers: Record<string, unknown>,
  ): Record<string, unknown> {
    const filtered = { ...headers };
    for (const [key] of Object.entries(filtered)) {
      if (LogItemsToHide.header.includes(key.toLowerCase())) {
        filtered[key] = '[FILTERED]';
      }
    }

    return filtered;
  }

  private isUrltoIgnoreLog(url: string, method: string): boolean {
    const isUrlToIgnore = LogItemsToHide.urls.find(
      (item) =>
        item.url === url && item.method.toLowerCase === method.toLowerCase,
    );
    return isUrlToIgnore ? true : false;
  }

  preProcess(req: Request): void {
    const params = {
      query: this.filterLogBody(req.query),
      params: this.filterLogBody(req.params),
      body: this.filterLogBody(req.body),
    };

    const startTime = new Date();
    const requestId = uuidv4();
    req['id'] = requestId;
    req['originalPath'] = req.path;
    req['startTime'] = startTime;

    const logObject = {
      requestId: requestId,
      path: req.url,
      method: req.method,
      userAgent: req.headers['user-agent'],
      headers: this.filterLogHeaders(req.headers),
      ip: req.ip,
      startedAt: format(new Date(startTime), 'dd-MM-yyyy HH:mm:ss'),
      params,
    };

    process.nextTick(() => {
      Logger.info(JSON.stringify(logObject));
    });
  }
}
