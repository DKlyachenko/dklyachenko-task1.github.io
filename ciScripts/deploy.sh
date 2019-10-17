set -e

echo "Pull request: ${TRAVIS_PULL_REQUEST}"
echo "Parameter: ${1}"

if [["${TRAVIS_PULL_REQUEST}" == "false"]]
then
    echo "Not PR"
    if [["${1}" == "master"]] || [["${1}" == "develop"]]
    then
        echo "Correct branch"
    fi
fi
echo "Deploy finished"