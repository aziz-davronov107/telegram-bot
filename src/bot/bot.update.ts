import { Action, Ctx, Hears, On, Start, Update } from "nestjs-telegraf";
import { Context, Telegraf } from "telegraf";
import { UserData, UserState, userState } from "./bot.interface";
import { contact, country, keyboard, subscripions } from "./keybor.menu";
import { on } from "events";
import { checkUserSubscription } from "./check_subscriptions.func";
import { retry } from "rxjs";
import { escape } from "querystring";


export const prompts: Record<UserState, string> = {
  [UserState.subscripions]: 'Iltimos, quyidagi kanallarga obuna boling va “✅ Azo boldim” tugmasini bosing:',
  [UserState.firstname]: 'Iltimos, ismingizni kiriting:',
  [UserState.lastname]:  'Familiyangizni kiriting:',
  [UserState.age]:       'Yoshingizni kiriting:',
  [UserState.country]: 'Davlatni tanlang:',
  [UserState.contact]: 'Contactni kiriting:',
  [UserState.menu]: '☑️ Siz aval register qilgansiz Optionlarni tanlang!',
}
@Update()
export class BotService {
    @Hears("Info")
    async OnInfo(@Ctx() ctx: Context){
        const state = userState.get(ctx.from!.id);
          if (!state || !state.data) {
            return ctx.reply("Ma'lumotlar topilmadi.");
        }

        const userDataString = Object.entries(state!.data)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

        ctx.reply(`Sizning ma'lumotlaringiz:\n${userDataString}`);
    }
    @Start()
    async start(@Ctx() ctx : Context){
        let user =  userState.get(ctx.from!.id)
        if(user){
            if(user.step <= 3){
                ctx.reply(prompts[user.step]);
            }
            else if(user.step == UserState.country){
                ctx.reply(prompts[user.step],country);
            }
            else if(user.step == UserState.contact){
                ctx.reply(prompts[user.step],contact);
            } 
            else if(user.step == UserState.menu){
                ctx.reply(prompts[user.step],keyboard);
            }   
            return
        }
        userState.set(ctx.from!.id,{step:UserState.subscripions,data:{}})

        ctx.reply(prompts[0],subscripions);            
    }
    @Action("check_subscription")
    async handleSubscriptionCheck(@Ctx() ctx: Context) {
        const userid = ctx.from!.id;
        const state = userState.get(userid)
        

        if (state!.step !== UserState.subscripions) {
            return;
        }

        
        const isMember = await checkUserSubscription(ctx)
        if (!isMember){
            await ctx.answerCbQuery('❗ Kanalga a’zo bo‘lmagan ekansiz. Iltimos, a’zo bo‘ling!')
            return
        }
        userState.set(userid, { step: UserState.firstname, data: {} });
        await ctx.answerCbQuery('✅ A’zo bo‘ldingiz! Endi ismingizni kiriting:',{show_alert:true});
        await ctx.reply('Ismingizni kiriting:');


    }

    @On('text')
    async onText(@Ctx() ctx: Context){
        const state = userState.get(ctx.from!.id)
        if(!state){
            ctx.reply("Iltimos /start bosing")
        }
        if ("text" in ctx.message!) {
            const text = ctx.message.text

            const currentStep = state!.step;
            const key = UserState[currentStep] as keyof UserData['data']; 
            console.log(text);
            
            
            if(key == 'age'){
                if(isNaN(+text)){
                     ctx.reply('Yoshingizni togri kiriting!')
                }
                state!.data[key] = parseInt(text);
            }
            else{
                state!.data[key] = text;
            }
            const nextStep = state!.step + 1;
            if (UserState[nextStep] !== undefined) {                
                if(["country"].includes(UserState[nextStep])){
                    state!.step = nextStep;
                    ctx.reply(prompts[nextStep],country)
                }
                else{
                    state!.step = nextStep;
                    ctx.reply(prompts[nextStep]);
                }
                
            }

        }
        
        
    }
    @On("callback_query")
    async onCountry(@Ctx() ctx: Context) {
        const state = userState.get(ctx.from!.id)
        if(!state){
            ctx.reply("Iltimos /start bosing")
        }
        if ("data" in ctx.callbackQuery!) {
            state!.data.country = ctx.callbackQuery.data

            const nextStep = state!.step + 1;
            state!.step = nextStep;

            ctx.answerCbQuery()

            ctx.reply(prompts[nextStep], contact)
    
        }
    }
    @On('contact')
    async onContact(@Ctx() ctx: Context){
        if('contact' in ctx.message!){
            let  phone = ctx.message.contact.phone_number
            const state = userState.get(ctx.from!.id)
            state!.data.contact = phone
            const nextStep = state!.step + 1;
            state!.step = nextStep;  
            ctx.reply("☑️ Malumotlar saqlandi!",keyboard)
        }
    }
    
}
