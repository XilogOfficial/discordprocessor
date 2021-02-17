const fs = require('fs');
messages = null;
try {
    messages = JSON.parse(fs.readFileSync('result.json', 'utf8')).messages;
} catch (err) {
    return console.log("Messages JSON file not found. Is it named result.json, in the root folder of the program and exported as JSON via https://github.com/Tyrrrz/DiscordChatExporter?")
}

let result = {
    messages: { },
    media: { bytesSent: {  }, gibiBytesSent: {  } },
    calls: { },
    pinsBy: { },
    pinnedMessages: { }
}

for (i in messages) {
    let message = messages[i]
    let from = `${message.author.name}#${message.author.discriminator}`
    result.messages[from] = result.messages[from] !== undefined ? result.messages[from] + 1 : 1

    if (message.type == "Call") {
        addVal("calls", from, 1)
    }

    if (message.type == "ChannelPinnedMessage") {
        addVal("pinsBy", from, 1)
    }
    
    attachments = message.attachments
    if (attachments.length > 0) {
        addVal("media", from, 1)
        bytes = 0
        for (j in attachments) {
            bytes += parseInt(attachments[j].fileSizeBytes)
        }
        addVal("media.bytesSent", from, bytes)
        addVal("media.gibiBytesSent", from, bytes/1024/1024/1024)
    }

    if (message.isPinned) {
        addVal("pinnedMessages", from, 1)
    }
}

console.log(result)
try {
    fs.writeFileSync("./data.json", JSON.stringify(result))
    console.log("SAVED TO ./data.json!")
} catch (err) {
    console.error(err)
}

function addVal(key, from, value) {
    key = key.split(".")
    if (key.length > 1)
        result[key[0]][key[1]][from] = result[key[0]][key[1]][from] !== undefined ? result[key[0]][key[1]][from] + value : value
    else
        result[key[0]][from] = result[key[0]][from] !== undefined ? result[key[0]][from] + value : value
}