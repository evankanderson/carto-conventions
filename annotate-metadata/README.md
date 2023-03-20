# Node Function

This repo contains a simple Node Function that can be deployed as a TAP workload.

This function utilizes the buildpacks provided by VMware's open-source [Function Buildpacks for Knative](https://github.com/vmware-tanzu/function-buildpacks-for-knative) project.

## Getting Started

To begin editing your function, modify `index.js` in the root directory.

Inside this file, you will find a function that is invoked by default. For example:

```
module.exports = async function sampleFunction(context) {
  const ret = 'This is a sample function';
  return new Promise((resolve, reject) => {
    setTimeout(_ => {
      context.log.info('sending response to client')
      resolve(ret);
    }, 500);
  });
};
```

You may replace the code inside this default function with your logic.

## Deploying

Please see [DEPLOYING.md](DEPLOYING.md) on how to build, deploy, and test your newly built function.
# Deploying

## Prerequisites

In order to further develop this application the following tools may be needed:
- Visual Studio Code or IntelliJ IDEA as Integrated Development Environment (IDE)
- Tanzu Developer Tools plugin for mentioned IDE
- Docker Desktop to execute integration tests or run the application locally
- [Curl](https://curl.se/download.html) for local testing
- [Pack CLI](https://buildpacks.io/docs/tools/pack/) for local testing

## Local

### Code Iteration without OCI Images

Use Node directly: 
```
npm install && npm start -- --log-level info
```

To test if it worked: `curl localhost:8080`

### Docker

Build your image and run it using Docker: 

```
pack build annotate-metadata --path . --buildpack paketo-buildpacks/nodejs --builder paketobuildpacks/builder:base
```

If using Jammy:

```
pack build annotate-metadata --path . --buildpack paketo-buildpacks/nodejs --builder paketobuildpacks/builder-jammy-buildpackless-base:latest
```

Where `annotate-metadata` is the name of your runnable function image.

Then run via Docker:

```
docker run -it --rm -p 8080:8080 annotate-metadata
```

Check for a successful response: `curl localhost:8080`

## Tanzu Application Platform (TAP)

Using the `config/workload.yaml` it is possible to build, test and deploy this application onto a
Kubernetes cluster that is provisioned with Tanzu Application Platform (https://tanzu.vmware.com/application-platform).

> NOTE: The provided `config/workload.yaml` file uses the Git URL for this sample. When you want to modify the source, you must push the code to your own Git repository and then update the `spec.source.git` information in the `config/workload.yaml` file.


### Deploying to Kubernetes as a TAP workload with Tanzu CLI

You need to select `Include TAP deployment resources` when generating the project for the steps below to work.

When you are done developing your function, you can simply deploy it using:

```
tanzu apps workload apply -f config/workload.yaml
```

If you would like deploy the code from your local working directory you can use the following command:

```
tanzu apps workload create annotate-metadata -f config/workload.yaml \
  --local-path . \
  --source-image <REPOSITORY-PREFIX>/annotate-metadata-source \
  --type web
```

### Interacting with Tanzu Application Platform

Determine the URL to use for the accessing the app by running:

```
tanzu apps workload get annotate-metadata
```

> NOTE: This depends on the TAP installation having DNS configured for the Knative ingress.

After deploying your function, you can interact with the function by using:

> NOTE: Replace the <URL> placeholder with the actual URL.

### Using Tilt with a Cluster

You may use [tilt](https://github.com/tilt-dev/tilt) `>v0.27.2` in combination with TAP's VS Code plugin to enable live development features including Application Live View and Live Update.

Update the `allow_k8s_contexts` line of the `Tiltfile` to indicate the Kubernetes context to use. 

Update the `Tiltfile` or set the SOURCE_IMAGE environment variable to indicate the registry path where TAP should store your image. 

```
export SOURCE_IMAGE=registry/project/annotate-metadata
export K8S_TEST_CONTEXT="a-kubernetes-context"
tilt up
tilt down
```
