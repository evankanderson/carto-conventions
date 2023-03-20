 async function annotateImage(context, body) {
  console.log('Got request: ', body);
  console.log('With context: ', context);

  const image = body['spec']['imageConfig'][0];

  const imageData = image.config.config;

  console.log('Image data is: ', imageData);

  return body;
};

module.exports = annotateImage