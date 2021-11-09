// const fs = require('fs');

const handler = async (event) => {
  const params = event.path.split('/');
  const idx = params.indexOf('incf');
  const [evName, slug] = params.splice(idx + 1);

  let foo;
  try {
    let test = await require('./test.json');
    foo = test.foo;
  } catch (error) {
    foo = error;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      foo,
      evName,
      slug,
      event,
    }),
  };
};

module.exports = { handler };
