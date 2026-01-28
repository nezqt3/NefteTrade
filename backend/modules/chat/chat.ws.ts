export async function sendMessage(ws, payload) {
    await chatService.send(payload)
}