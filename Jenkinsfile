// ==============================================================================
// NETRISK — Enterprise Cybersecurity SDLC Platform
// Jenkins Declarative CI/CD Pipeline
// ==============================================================================

pipeline {
    agent any

    options {
        // Prevent pipeline jobs from hanging indefinitely
        timeout(time: 30, unit: 'MINUTES')
        // Retain last 10 build records and artifacts to manage disk space
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Disallow concurrent builds of the same branch
        disableConcurrentBuilds()
    }

    environment {
        REPO_URL       = 'https://github.com/KalpitaGharat/NetRisk.git'
        DEFAULT_BRANCH = 'main'
        IMAGE_NAME     = 'netrisk'
        IMAGE_TAG      = '2.0'
        VENV_DIR       = '.venv-ci'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "Checking out repository from GitHub..."
                    // Multibranch or SCM-triggered job uses scm checkout; standalone fallback uses explicit Git URL
                    if (scm && scm.class.name != 'hudson.scm.NullSCM') {
                        checkout scm
                    } else {
                        git branch: "${DEFAULT_BRANCH}", url: "${REPO_URL}"
                    }
                }
            }
        }

        stage('Environment Setup') {
            steps {
                script {
                    echo "Provisioning isolated Python virtual environment in ${VENV_DIR}..."
                    if (isUnix()) {
                        sh '''
                            if command -v python3 >/dev/null 2>&1; then
                                PYTHON_BIN="python3"
                            elif command -v python >/dev/null 2>&1; then
                                PYTHON_BIN="python"
                            else
                                echo "ERROR: Python 3 executable not found on this Jenkins agent."
                                exit 1
                            fi
                            echo "Agent Python version: $($PYTHON_BIN --version)"
                            $PYTHON_BIN -m venv ${VENV_DIR}
                        '''
                    } else {
                        bat """
                            python --version || exit /b 1
                            python -m venv %VENV_DIR%
                        """
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo "Installing project dependencies from requirements.txt..."
                    if (isUnix()) {
                        sh '''
                            . ${VENV_DIR}/bin/activate
                            python -m pip install --upgrade pip
                            pip install -r requirements.txt
                        '''
                    } else {
                        bat """
                            call %VENV_DIR%\\Scripts\\activate.bat
                            python -m pip install --upgrade pip
                            pip install -r requirements.txt
                        """
                    }
                }
            }
        }

        stage('Code Validation') {
            steps {
                script {
                    echo "Validating Python bytecode syntax across application modules..."
                    if (isUnix()) {
                        sh '''
                            . ${VENV_DIR}/bin/activate
                            python -m compileall -q backend tests pages services components app.py
                        '''
                    } else {
                        bat """
                            call %VENV_DIR%\\Scripts\\activate.bat
                            python -m compileall -q backend tests pages services components app.py
                        """
                    }
                }
            }
        }

        stage('Automated Tests') {
            steps {
                script {
                    echo "Running pytest automated test suite and generating JUnit XML report..."
                    if (isUnix()) {
                        sh '''
                            . ${VENV_DIR}/bin/activate
                            python -m pytest --junitxml=test-results.xml
                        '''
                    } else {
                        bat """
                            call %VENV_DIR%\\Scripts\\activate.bat
                            python -m pytest --junitxml=test-results.xml
                        """
                    }
                }
            }
            post {
                always {
                    junit testResults: 'test-results.xml', allowEmptyResults: true
                }
            }
        }

        stage('Docker Build Validation') {
            steps {
                script {
                    def hasDocker = false
                    try {
                        if (isUnix()) {
                            hasDocker = (sh(script: 'docker --version', returnStatus: true) == 0)
                        } else {
                            hasDocker = (bat(script: 'docker --version', returnStatus: true) == 0)
                        }
                    } catch (Exception e) {
                        hasDocker = false
                    }

                    if (hasDocker) {
                        echo "Docker CLI detected on agent. Validating Docker image build (${IMAGE_NAME}:${IMAGE_TAG})..."
                        if (isUnix()) {
                            sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:build-${BUILD_NUMBER} ."
                        } else {
                            bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% -t %IMAGE_NAME%:build-%BUILD_NUMBER% ."
                        }
                        echo "Docker image build validation succeeded. Container runtime testing skipped for CI safety."
                    } else {
                        echo "NOTICE: Docker CLI or Docker daemon not available on this agent. Skipping container image build stage."
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Pipeline finished with status: ${currentBuild.currentResult}"
            }
            // Cleanup ephemeral virtual environment to preserve agent workspace hygiene
            script {
                try {
                    if (isUnix()) {
                        sh "rm -rf ${VENV_DIR}"
                    } else {
                        bat "if exist %VENV_DIR% rmdir /s /q %VENV_DIR% 2>nul"
                    }
                } catch (Exception e) {
                    echo "Workspace cleanup notice: ${e.message}"
                }
            }
        }
        success {
            echo "=========================================================================="
            echo " SUCCESS: NETRISK CI Pipeline passed all stages for Build #${BUILD_NUMBER}"
            echo "=========================================================================="
        }
        failure {
            echo "=========================================================================="
            echo " FAILURE: NETRISK CI Pipeline failed in Build #${BUILD_NUMBER}"
            echo " Inspect the Stage View and console logs for details."
            echo "=========================================================================="
        }
    }
}
