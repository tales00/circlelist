const fs = require('fs');

const handler = (event) => {
  const params = event.path.split('/');
  const idx = params.indexOf('in') || params.indexOf('listMeta');
  const [evName, slug] = params.splice(idx + 1);

  let htmlText = fs.readFileSync(require.resolve('./listMeta.html'), 'utf8');
  // let htmlText = fs.readFileSync('./listMeta.html', 'utf8');

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
