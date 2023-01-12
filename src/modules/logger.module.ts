import { GrayLogger } from '../helpers/graylog/graylog';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
    providers: [GrayLogger],
    exports: [GrayLogger],
})
export class LoggerModule {}
