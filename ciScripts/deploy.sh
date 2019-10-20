set -e

echo "Pull request: ${TRAVIS_PULL_REQUEST}"
echo "Parameter: ${1}"

if [[ "${TRAVIS_PULL_REQUEST}" == "false" ]]
then
    echo "Not PR"
    if [[ "${1}" == "master" ]] || [[ "${1}" == "develop" ]] || [[ "${1}" == "feature-travis-ci" ]]
    then
        echo "Correct branch"
        repositoryRelativeGitHubAddress="DKlyachenko/dklyachenko-task1.github.io"

        echo "Prepare for deploy to gh-pages."
        echo $PWD
        echo "Clone ${repositoryRelativeGitHubAddress} to gh-pages"
        git clone --recursive "https://github.com/${repositoryRelativeGitHubAddress}.git" repo
        cd repo
        echo $PWD

        git checkout gh-pages
        git pull

        echo "Remove results of previous deploy for ${TRAVIS_BRANCH} branch"
        rm -rf "${TRAVIS_BRANCH}"
        mkdir "${TRAVIS_BRANCH}"

        echo "Copy application for ${TRAVIS_BRANCH} branch"
        cp -r ../docs/* "${TRAVIS_BRANCH}"
        cd "${TRAVIS_BRANCH}"
        ls -l
        cd ..

        git config user.name "dklyachenko"
        git config user.email "dklyachenko@gmail.com"

        echo "Commit & push changes"
        git add --all
        git commit -m "Update gh-pages for ${TRAVIS_BRANCH} branch"

        git push --force --quiet "https://${GH_TOKEN}@github.com/${repositoryRelativeGitHubAddress}.git" > /dev/null 2>&1
    fi
fi
echo "Deploy finished"