import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotService } from './bot.update';
config()

@Module({
    imports:[
        TelegrafModule.forRoot({
            token:process.env.BOT_TOKEN as any
        })
    ],
    providers:[BotService]
})
export class BotModule {}
