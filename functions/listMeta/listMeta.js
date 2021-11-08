const handler = (event) => {
  // const path = require('path');
  const fs = require('fs');
  // const resolved = (process.env.LAMBDA_TASK_ROOT)? path.resolve(process.env.LAMBDA_TASK_ROOT, fileName):path.resolve(__dirname, fileName)

  // fs.readFile(resolved, "utf8", (err, results) => console.log(results))

  const params = event.path.split('/');
  const idx = params.indexOf('in') || params.indexOf('listMeta');
  const [evName, slug] = params.splice(idx + 1);

  let htmlText = fs.readFileSync('listMeta.html', 'utf8');
  // let htmlText = fs.readFileSync('./functions/listMeta/listMeta.html', 'utf8');

  htmlText = htmlText.replace('{{evName}}', evName + ' | ');
  htmlText = htmlText.replace('{{slug}}', slug);
  return {
    statusCode: 200,
    // body: JSON.stringify({
    //   evName,
    //   slug,
    // }),
    body: htmlText,
  };
};

module.exports = { handler };
