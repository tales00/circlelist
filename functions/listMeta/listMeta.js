const handler = async (event) => {
  // const fs = require('fs');
  // const path = require('path');
  // const resolved = (process.env.LAMBDA_TASK_ROOT)? path.resolve(process.env.LAMBDA_TASK_ROOT, fileName):path.resolve(__dirname, fileName)

  // fs.readFile(resolved, "utf8", (err, results) => console.log(results))

  const params = event.path.split('/');
  const idx =
    params.indexOf('in') > -1
      ? params.indexOf('in')
      : params.indexOf('listMeta');
  const [evName, slug] = params.splice(idx + 1);

  // let htmlText = await fs.readFileSync(
  //   path.join(__dirname, './index.html'),
  //   'utf-8',
  // );
  // let htmlText = fs.readFileSync('./index.html', 'utf8');
  let htmlText = require('./index.txt');

  htmlText = htmlText.replace('<title>', `<title>${evName} | `);
  htmlText = htmlText.replace(
    '<meta name="application-name" content="circleList" />',
    `<meta name="application-name" content="circleList" />
   <meta name="slug" content="${slug}" />
   `,
  );
  return {
    statusCode: 200,
    // body: JSON.stringify({
    //   event,
    //   params,
    //   evName,
    //   slug,
    //   in: params.indexOf('in'),
    //   list: params.indexOf('listMeta'),
    // }),
    body: htmlText,
  };
};

module.exports = { handler };
