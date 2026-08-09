import https from 'https'

const url = 'https://muehehe-4dc7e.web.app/'
https.get(url, res => {
  let body = ''
  res.on('data', chunk => body += chunk)
  res.on('end', () => {
    const scriptMatch = body.match(/<script[^>]+src="([^"]+)"/)
    console.log('script-src:', scriptMatch ? scriptMatch[1] : 'none')
    if (!scriptMatch) return
    const scriptUrl = scriptMatch[1].startsWith('http') ? scriptMatch[1] : 'https://muehehe-4dc7e.web.app' + scriptMatch[1]
    https.get(scriptUrl, res2 => {
      let js = ''
      res2.on('data', chunk => js += chunk)
      res2.on('end', () => {
        console.log('railway:', js.includes('https://man-backend-production.up.railway.app'))
        console.log('localhost:', js.includes('http://localhost:4000'))
        console.log('github:', js.includes('github.com/samsiahtahang-spec/man-backend.git'))
        console.log('js length:', js.length)
      })
    }).on('error', (e) => console.error('script fetch error', e))
  })
}).on('error', e => console.error('page fetch error', e))
