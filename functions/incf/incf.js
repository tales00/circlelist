// const fs = require('fs');

const handler = (event) => {
  // const params = event.path.split('/');
  // const idx = params.indexOf('in') || params.indexOf('listMeta');
  // const [evName, slug] = params.splice(idx + 1);

  let foo;
  try {
    let test = require('./test.json');
    foo = test.foo;
  } catch (error) {
    foo = error;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      foo,
    }),
  };
};

module.exports = { handler };
