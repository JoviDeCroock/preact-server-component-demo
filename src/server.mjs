import staticServer from "node-static";
import http from "http";
import path from "path";

const p = path.join(".", "public");
const file = new staticServer.Server(p, {
	cache: 0,
});

const PORT = 8080;
console.log(`Listening at http://localhost:${PORT}`);
http
	.createServer((req, res) => {
    if (req.url?.startsWith('/preact')) {
      const queryParams = req.url.split('?')[1];
      const parts = queryParams.split('&');
      const mod = parts.find(x => x.split('=')[0] === 'module')?.split('=')[1];
      const props = parts.reduce((acc, part) => {
        const [key, value] = part.split('=');
        if (key === 'module') return acc;
        acc[key] = value;
        return acc;
      }, {})
      import(`./client/${mod?.split('|')[0]}`).then(m => {
        res.end(JSON.stringify(m[mod.split('|')[1]](props)));
      })
    } else {
      file.serve(req, res);
    }
	})
	.listen(PORT);
