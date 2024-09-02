# EDUC Platform Admin Panel 


Install it and run:

```sh
yarn install
``` 

### Command to Run Local Dev Environment Using ASM PC as API Server
```sh
yarn run dev-local:app-admin
yarn run dev-local:app-educ
yarn run dev-local:app-learner
yarn run dev-local:app-institute
```
### Command to Run Local Dev Environment Using Dev Server as API Server
```bash
yarn run dev-live:app-admin
yarn run dev-live:app-educ
yarn run dev-live:app-learner
yarn run dev-live:app-institute
```

### Build Command for Development Server
```bash
yarn build:app-admin-dev
yarn build:app-educ-dev
yarn build:app-learner-dev
yarn build:app-institute-dev
```
# Deployment 
### Build Command for Production Server

```bash
yarn build:app-admin-prod
yarn build:app-educ-prod
yarn build:app-learner-prod
yarn build:app-institute-prod
```
### Commands to Deploy the Web Apps in the Dev/Production Server
```bash
pm2 start yarn --name "educ" --interpreter bash -- start:educ
pm2 start yarn --name "admin" --interpreter bash -- start:admin
pm2 start yarn --name "learner" --interpreter bash -- start:learner
pm2 start yarn --name "institute" --interpreter bash -- start:institute
```

#Note: Do not merge develop, staging and master with one another

###Deployment Steps
#####1. Update this branch with the latest code
#####2. Open version.yaml file from `deploy` folder.
#####3. To deploy a module change `imageRelease` to `true` and increase `imageAppVersion` to create a new image version
#####4. Deploy build commit is - `RELEASE = any message`
#####5. This will build pipeline in gitlab.
#####6. After build success. Open deploy/module(admin, educ, ....) folder and open values.yaml and change `imageAppVersion` with current version and push to git



# Deploytment to Kubernetes
1. go to deploy folder
2. Inside deploy folder we have multiple chart package in different sub folder which contain `values.yaml` file
3. Inspect folder and browse `values.yaml` file and change necessary key value. Keys are describe bellow - 


| Key | Value | Comments |
| -------- | -------- |-----|
|  hostName| migration-portal-dev.educee.com | the domain name where sirvice publish |
|   enableEngress| true | if enable then service will expose publically to given domain otherwise it will be private |
|  ingressClusterIssuer | "k-issuer" | this will set the custom certificate issuer |
|   **imageAppVersion** | "1.0.0"| image tag number which you want to deploy |
|   replicaCount | 1| How many replica you want |
|   **imageRepository** | registry.educ.com/educ-cube-client-web-migration-portal| the docker image repository |
| autoScaling.enabled | true| true/false value enable/disable autoscalling |
|  autoScaling.minReplicas | 1| this value should equal to `replicaCount` field, this will define your minimum replica count |
| autoScaling.maxReplicas | 15| max replica number |
|||


4. Now you can deploy the chart/service inside kubernetes cluster by `Helm`. 
    * go to your target chart folder
    * run  **`helm install my-service ./ -f values.yaml -n default`**


# Image deployment
You can deploy image manually or make ci/cd for your target environment. Inside `repository` we have docker file name with Docker`*`. Use them to make docker image. 

## Manual Deployment (We use docker hub as example)

Repositories
============

Docker Hub repositories allow you share container images with your team, customers, or the Docker community at large.

Docker images are pushed to Docker Hub through the [`docker push`](https://docs.docker.com/engine/reference/commandline/push/) command. A single Docker Hub repository can hold many Docker images (stored as **tags**).

Creating repositories
---------------------

To create a repository, sign into Docker Hub, click on **Repositories** then **Create Repository**:

![Create repo](doc_assets/repos-create.png)

When creating a new repository:

*   You can choose to put it in your Docker ID namespace, or in any [organization](/docker-hub/orgs/) where you are an [_owner_](/docker-hub/orgs/#the-owners-team).
*   The repository name needs to be unique in that namespace, can be two to 255 characters, and can only contain lowercase letters, numbers, hyphens (`-`), and underscores (`_`).
    
    > **Note:**
    > 
    > You cannot rename a Docker Hub repository once it has been created.
    
*   The description can be up to 100 characters and is used in the search result.
*   You can link a GitHub or Bitbucket account now, or choose to do it later in the repository settings.

![Setting page for creating a repo](doc_assets/repo-create-details.png)

After you hit the **Create** button, you can start using `docker push` to push images to this repository.


Pushing a Docker container image to Docker Hub
----------------------------------------------

To push an image to Docker Hub, you must first name your local image using your Docker Hub username and the repository name that you created through Docker Hub on the web.

You can add multiple images to a repository by adding a specific `:<tag>` to them (for example `docs/base:testing`). If it’s not specified, the tag defaults to `latest`.

Name your local images using one of these methods:

*   When you build them, using `docker build -t <hub-user>/<repo-name>[:<tag>]`
*   By re-tagging an existing local image `docker tag <existing-image> <hub-user>/<repo-name>[:<tag>]`
*   By using `docker commit <existing-container> <hub-user>/<repo-name>[:<tag>]` to commit changes

Now you can push this repository to the registry designated by its name or tag.

    $ docker push <hub-user>/<repo-name>:<tag>
    

The image is then uploaded and available for use by your teammates and/or you can use it with out chart.


# Automatic Deployment
 We use gitlab CI/CD, we have a gitlab-ci.yaml file to deploy image and push to our private repository. We use `version.yaml` file (which locate inside deploy folder) to deploy image. The file describe bellow - 

 | Key | Value | Comments |
| -------- | -------- |-----|
|  image*Release| true/false | should the service build or not |
|  image*AppVersion| 1.0.0 | tag number which you want to build |
|  image*Repository| image docker repository url | the repo url where you want to upload the image |
|||
