 async function annotateImage sampleFunction(context, body) {
  context.log('Got request: ', body);

  const image = body['spec']['imageConfig'][0];

  const imageData = image.config.config;

  context.log('Image data is: ', imageData);

  return body;
};

module.exports = annotateImage