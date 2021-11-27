addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request).catch((err) => { return new Response(err.message) }))
})
 const html = `
<html>
  <head>
  <h1 style="font-size:32px;font-family:verdana;color:black; text-align: center;margin-top: 10%">discordiy--Download Acceleration</h1>
  </head>
        <body>
        <div style="">
        <input type="url" placeholder="url" id="url" style="margin-top: 1em;padding: 0.85em 0.15em;width: 100%;background: transparent;color: #595F6E;margin-left: auto;">
        <input 
        type="submit" id="submit" value="download"
        style="line-height: 38px;background-color: #00bfb3;color: #fff;white-space: nowrap;text-align: center;font-size: 14px;border: none;border-radius: 2px;cursor: pointer;padding: 5px;width: 160px;margin: 30px 0; margin-left: 45%;"/>
        </div>
  <div id="res"></div>
  <a id="a" href=""></a>
      <p>
      <br>
      <br>
      </p>
          <script>
            document.getElementById('submit').onclick=function(){
                let url  = document.getElementById('url').value;
                console.log('url: '+url);
                let a = document.getElementById('a');
                let div = document.getElementById('res');
                if(!url || !url.startsWith('http')){
                    div.textContent="The link is illegal: "+url;
                    a.style="display:none";
                }else{
                    div.textContent="";
                    let res = (new URL(window.location.href)).origin+'?url='+encodeURIComponent(url);
                    a.textContent=res;
                    a.href=res;
                    a.style="";
                }
            }
          </script>
        </body>
</html>`;
 /**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
     if (request.method === 'OPTIONS' && request.headers.has('access-control-request-headers')) {
        return new Response(null, {
            status: 204,
            headers: new Headers({
                'access-control-allow-origin': '*',
                'access-control-allow-methods': 'GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS',
                'access-control-allow-headers': '*',
                'access-control-max-age': '1728000'
            }),
        })
    }
    let req_url = new URL(request.url);
    if (req_url.pathname.startsWith('/ajax/')) {//ajax
        let url = req_url.pathname.slice(6).replace(/^(https?):\/+/, '$1://');
        if (!url) return new Response("Only For Ajax");
        let res = await fetch(url, { method: request.method, headers: request.headers, body: request.body });
        let h = new Headers(res.headers);
        h.set('access-control-allow-origin', '*');
        h.set('access-control-expose-headers', '*');
        return new Response(res.body, { status: res.status, headers: h });
    } else if (req_url.pathname === '/') {//download
        let url = req_url.searchParams.get('url');
        if (!url) return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        let res;
        if (request.headers.get('Range')) {
            res = await fetch(url, { headers: { 'Range': request.headers.get('Range') } });
        } else {
            res = await fetch(url);
        }
        let h = new Headers(res.headers);
        h.set('set-cookie', '');
        h.set('access-control-allow-origin', '*');
        h.set('access-control-expose-headers', '*');
        return new Response(res.body, {
            status: res.status,
            headers: h,
        })
    } else {
        return new Response("400 --", { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
}
