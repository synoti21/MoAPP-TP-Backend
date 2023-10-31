pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "famstory"
        REGISTRY = "synoti21"
        TAG = "latest"
    }

    stages {
        stage('Clone repository') {
            steps {
                git 'https://github.com/Fam-Story/fam-Story_Backend.git'
            }
        }
        stage('Build and push Docker image') {
            steps {
                script {
                    docker.build("$REGISTRY/$DOCKER_IMAGE:$TAG").push()
                }
            }
        }
        stage('Update Kubernetes manifests') {
            steps {
                script {
                    sh "sed -i 's#image: .*#image: $REGISTRY/$DOCKER_IMAGE:$TAG#' k8s/manifest.yaml"
                }
            }
        }
    }
}