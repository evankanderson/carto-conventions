 async function annotateImage(context, body) {
  const image = body['spec']['imageConfig'][0];

  const imageData = image.config.config;

  console.log('Image data is: ', imageData);

  let revision = imageData.Labels['org.opencontainers.image.revision'];
  let label = imageData.Labels['org.opencontainers.image.version']
  let source = imageData.Labels['org.opencontainers.image.source']
  if (! version) {
    // Legacy format is e.g. "main/f11adae1c008aa8e381902fb7952686d0e7aac14" in the "source" field
    // And no other keys from https://github.com/opencontainers/image-spec/blob/main/annotations.md#pre-defined-annotation-keys set
    let legacy = imageData.Labels['org.opencontainers.image.source']
    [revision, label] = legacy.split('/')
    source = body.spec.template.metadata['app.tanzu.vmware.com/source-url']
    if (! source) {
      source = "unknown"
    }
  }

  body.status.template.metadata.annotations['app.tanzu.vmware.com/source-url'] = source
  body.status.template.metadata.annotations['app.tanzu.vmware.com/source-ref'] = label
  body.status.template.metadata.annotations['app.tanzu.vmware.com/source-hash'] = revision

  return body;
};

module.exports = annotateImage