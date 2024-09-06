import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaProvider extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      // log: ['query'],
      errorFormat: 'colorless',
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // // @ts-ignore
    // this.$on('query', async (e) => {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   console.log(`${e.params}`);
    //   console.log('______________________________________');
    // });
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
