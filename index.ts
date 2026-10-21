import { Bot, InlineKeyboard, Keyboard } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN!);
const WEBAPP_URL = process.env.WEBAPP_URL!;
const ADMIN = Number(process.env.ADMIN_CHAT_ID);
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin_username"; // @ belgisiz

const notify = async (text: string) => {
  try {
    await bot.api.sendMessage(ADMIN, text);
  } catch (e) {
    console.error("Admin'ga xabar yuborilmadi:", e);
  }
};

const toAdmin = new InlineKeyboard().url(
  "✍️ Adminga yozish",
  `https://t.me/${ADMIN_USERNAME}`,
);

bot.command("start", async (ctx) => {
  const kb = new Keyboard().webApp("🎨 Uslub tanlash", WEBAPP_URL).resized();
  await ctx.reply(
    "Assalomu alaykum! Taklifnoma uslubini tanlash uchun tugmani bosing 👇",
    { reply_markup: kb },
  );
});

bot.on("message:web_app_data", async (ctx) => {
  const { theme, label } = JSON.parse(ctx.message.web_app_data.data) as {
    theme: string;
    label: string;
  };
  await ctx.reply(
    `✅ Tanlovingiz qabul qilindi: “${label}”\n\nSana va vaqt boʻyicha adminga murojaat qiling: @${ADMIN_USERNAME}`,
    { reply_markup: toAdmin },
  );
  const u = ctx.from;
  await notify(
    `🆕 Yangi tanlov: ${label} (${theme})\nMijoz: ${u.username ? "@" + u.username : u.first_name + " (tg://user?id=" + u.id + ")"}`,
  );
});

bot.catch((err) => console.error("Bot xatosi:", err.error));
bot.start();
