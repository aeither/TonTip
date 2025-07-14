import { Bot, InlineKeyboard } from "grammy";

// Mini app URLs for different environments
const DEV_MINI_APP_URL = "https://basically-enough-clam.ngrok-free.app";
const _PROD_MINI_APP_URL = "https://your-production-domain.com"; // TODO: Update with actual production URL

// Use development URL for now - can be changed to PROD_MINI_APP_URL for production
const CURRENT_MINI_APP_URL = DEV_MINI_APP_URL;

export function createBot(token: string) {
  // Create bot instance
  const bot = new Bot(token);

  // Handle start command
  bot.command("start", async (ctx) => {
    const welcomeMessage = `Welcome to TonTip Bot! 🚀\n\nUse /menu to open the mini app and start managing your portfolio.`;
    
    const keyboard = new InlineKeyboard()
      .webApp("Open Mini App", CURRENT_MINI_APP_URL);
    
    await ctx.reply(welcomeMessage, {
      reply_markup: keyboard
    });
  });
  
  // Handle menu command
  bot.command("menu", async (ctx) => {
    const menuMessage = `📱 TonTip Mini App\n\nClick the button below to open the mini app and manage your portfolio:`;
    
    const keyboard = new InlineKeyboard()
      .webApp("Open Mini App", CURRENT_MINI_APP_URL);
    
    await ctx.reply(menuMessage, {
      reply_markup: keyboard
    });
  });

  // Handle help command
  bot.command("help", async (ctx) => {
    const helpMessage = `🤖 TonTip Bot Commands:\n\n` +
      `/start - Welcome message and open mini app\n` +
      `/menu - Open the mini app\n` +
      `/help - Show this help message\n\n` +
      `The mini app allows you to manage your portfolio and interact with your smart contracts.`;
    
    const keyboard = new InlineKeyboard()
      .webApp("Open Mini App", CURRENT_MINI_APP_URL);
    
    await ctx.reply(helpMessage, {
      reply_markup: keyboard
    });
  });

  // Handle non-command messages
  bot.on("message", async (ctx) => {
    const message = `Hi! Use /menu to open the TonTip mini app and start managing your portfolio.`;
    
    const keyboard = new InlineKeyboard()
      .webApp("Open Mini App", CURRENT_MINI_APP_URL);
    
    await ctx.reply(message, {
      reply_markup: keyboard
    });
  });

  return bot;
}
