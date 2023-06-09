async function annotateImage(context, body) {
  // The convention contract does not fill in status.template at all,
  // so start with a copy
  body.status.template = {...body.spec.template}

  const image = body['spec']['imageConfig'][0];

  const imageData = image.config.config;

  console.log('Image data is: ', imageData);
  console.log('Labels are:', imageData.Labels);

  try {
    let revision = imageData.Labels['org.opencontainers.image.revision'];
    let label = imageData.Labels['org.opencontainers.image.version'];
    let source = imageData.Labels['org.opencontainers.image.source'];
    if (!revision) {
      // Legacy format is e.g. "main/f11adae1c008aa8e381902fb7952686d0e7aac14" in the "source" field
      // And no other keys from https://github.com/opencontainers/image-spec/blob/main/annotations.md#pre-defined-annotation-keys set
      let legacy = imageData.Labels['org.opencontainers.image.source'];
      console.log('On legacy path, splitting ', legacy);
      [label, revision] = legacy.split('/');
      source = body.spec.template.metadata['app.tanzu.vmware.com/source-url'];
      if (!source) {
        source = "unknown";
      }
    }

    if (!('metadata' in body.status.template)) {
      body.status.template.metadata = {};
    }
    if (!('annotations' in body.status.template.metadata)) {
      body.status.template.metadata = {'annotations': {}};
    }

    body.status.template.metadata.annotations['app.tanzu.vmware.com/source-url'] = source;
    body.status.template.metadata.annotations['app.tanzu.vmware.com/source-ref'] = label;
    body.status.template.metadata.annotations['app.tanzu.vmware.com/source-hash'] = revision;
    if (!body.status.appliedConventions) {
      body.status.appliedConventions = [];
    }
    body.status.appliedConventions.push('annotate-metadata');
  } catch (error) {
    console.log('Unable to enrich: ', error)
  }

  console.log('Returning: ', body);

  return body;
};

module.exports = annotateImage