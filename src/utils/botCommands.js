import { formatISO } from 'date-fns'

const commandsAvailable = [
  {
    key: 'help',
    message: 'Commands available: !help, !github',
  },
  {
    key: 'github',
    message: `BACKEND: <a href="https://github.com/ips-coding-challenge/tchat_challenge_backend" target="_blank" rel="noopener, noreferrer">Backend repository</a><br>
    FRONTEND: <a href="https://github.com/ips-coding-challenge/tchat_challenge_frontend" target="_blank" rel="noopener, noreferrer">Frontend repository</a>`,
  },
]

export const isCommand = (message) => {
  return message.match(/!([a-z]+)/gi) !== null
}

export const createBotResponse = (message) => {
  if (message.content.match(/hello|hi|hey/gi)) {
    return `Hello ${message.user.name}! How are you doing?\n
    You can talk to me if you type: !help or !github ;)`
  }

  const command = message.content.match(/!([a-z]+)/gi)

  if (!command) return null

  if (command) {
    const commandToExecute = commandsAvailable.find(
      (c) => c.key === command[0].replace('!', '')
    )

    if (commandToExecute) {
      return commandToExecute.message
    }
  }
}

export const createFrontOnlyMessage = (user, message, channelId) => {
  console.log(user)
  return {
    channelId: channelId,
    content: message,
    createdAt: formatISO(new Date()),
    updatedAt: formatISO(new Date()),
    user,
    userId: user._id,
    _id: Date.now(),
  }
}
