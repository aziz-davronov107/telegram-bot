import { Context, Telegraf } from "telegraf";

export async function checkUserSubscription(ctx: Context): Promise<boolean> {
    try{
        const member = await ctx.telegram.getChatMember('@my_history_gorup',ctx.from!.id)
        return ['member','administrator','creator'].includes(member.status);
        
        
    }catch(err){
        console.error('checkUserSubscription xatosi:', err);
        return false
    }
}