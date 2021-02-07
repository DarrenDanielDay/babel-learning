import { JSDOM } from 'jsdom'
const html = `\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`

const dom = new JSDOM(html);
global.document = dom.window.document;
global.window = dom.window.document.defaultView!