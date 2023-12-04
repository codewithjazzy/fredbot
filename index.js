require('dotenv').config()

const { Client, IntentsBitField, Guild, SlashCommandBuilder} = require('discord.js');

const bot = new Client({
    intents : [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})


bot.on('ready', c => {
    console.log(`🤖 ${c.user.username} is ready`)
})

bot.on('messageCreate', message => {
    if(message.author.bot){
        return;
    }else {
        if(message.content === "hello"){
            console.log(message)
            message.reply("hello")
        }
    }

   
})

bot.on('interactionCreate', async interaction => {
    if(!interaction.isChatInputCommand()){
        return
    }
    if(interaction.commandName === 'ping'){
       await interaction.reply('Pong!')
    }
})

bot.on('interactionCreate', async interaction => {
    if(!interaction.isChatInputCommand()){
        return
    }
    if(interaction.commandName === 'weather'){
        let city = interaction.options.get('city').value;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f08fcd4716f60e3b321883b165ae0ae6&units=imperial`;
        fetch(apiUrl)
        .then(res => res.json())
        .then(result => {
            console.log(result);
            // error check if city not found error 404. Exits
            if (result.cod === '404') {
                interaction.reply('City Not Founda')
                return;   
            }
            let temp = Math.floor(result.main.temp)
            let min = Math.floor(result.main.temp_min)
            let max = Math.floor(result.main.temp_max)
            let description = result.weather[0].description
            let icon = result.weather[0].main
            let image = `https://openweathermap.org/img/wn/${icon}@2x.png`
            
            const anotherMap = new Map([
                ['Rain', '🌧️'],
                ['Clouds', '☁️'],
                ['Clear','☀️'],
                ['Snow', '❆'],
                ['Drizzle', '☔️'],
                ['Thunderstorm', '⛈️'],
            ])

            

            interaction.reply(`The weather in ${city} is ${temp}° with a min of ${min}° and a max of ${max}. You should expect ${description} ${anotherMap.get(icon)}`)
        })
        .catch(err => console.log(err))
    }
})


bot.login(process.env.TOKEN)