import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Pengunaan:\n${usedPrefix + command} <teks>\n\nContoh:\n${usedPrefix + command} akad`

    let res = await fetch(API('chipa', '/api/download/jooxdl', { search: text }, 'apikey'))
    if (!res.ok) throw await `${res.status} ${res.statusText}`
    let json = await res.json()
    if (!json.status) throw json
    let { judul, artist, album, thumb, mp3_url, filesize, duration } = json.result
    let pesan = `
Judul: ${judul}
Artis: ${artist}
Album: ${album}
Ukuran File: ${filesize}
Durasi: ${duration}
`.trim()
    conn.sendFile(m.chat, thumb, 'eror.jpg', pesan, m, 0, { thumbnail: await (await fetch(thumb)).buffer() })
    conn.sendFile(m.chat, mp3_url, 'error.mp3', '', m, 0, { asDocument: db.data.chats[m.chat].useDocument, mimetype: 'audio/mpeg' })
}
handler.help = ['joox'].map(v => v + ' <judul>')
handler.tags = ['downloader']
handler.command = /^joox$/i

export default handler
