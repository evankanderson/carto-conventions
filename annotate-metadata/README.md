# Annotate PodIntents With OCI Version Information

This implements a Cartographer Convention to attach build-time information (if
available) to the template pod. It is intended to run as a Knative Service in
the same cluster as the convention service, though it could be deployed to
common infrastructure, as the function itself is stateless.

This function extract the following
[pre-defined OCI image annotations](https://github.com/opencontainers/image-spec/blob/main/annotations.md#pre-defined-annotation-keys)
and adds them as pod annotations scoped under the `app.tanzu.vmware.com/`
prefix:

| OCI annotation                      | meaning                                                                                                                                              | annotation                         |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `org.opencontainers.image.version`  | version of the packaged software. The version MAY match a label or tag in the source code repository. version MAY be Semantic versioning-compatible. | `app.tanzu.vmware.com/source-ref`  |
| `org.opencontainers.image.source`   | URL to get source code for building the image                                                                                                        | `app.tanzu.vmware.com/source-url`  |
| `org.opencontainers.image.revision` | Source control revision identifier for the packaged software.                                                                                        | `app.tanzu.vmware.com/source-hash` |

This repo was created with the
[Tanzu Node function accelerator](https://github.com/vmware-tanzu/application-accelerator-samples/tree/main/node-function).
