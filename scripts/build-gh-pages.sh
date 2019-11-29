#!/bin/bash
# Copyright 2017-2019 @polkadot/dev authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

function run_clean () {
  echo ""
  echo "*** Running clean"

  yarn run clean

  echo ""
  echo "*** Checks completed"
}

function run_check () {
  echo ""
  echo "*** Running checks"

  yarn run lint

  echo ""
  echo "*** Checks completed"
}

function run_test () {
  echo ""
  echo "*** Running tests"

  yarn run test

  if [ -f "coverage/lcov.info" ] && [ -n "$COVERALLS_REPO_TOKEN" ]; then
    echo ""
    echo "*** Submitting to coveralls.io"

    (cat coverage/lcov.info | yarn run coveralls) || true
  fi

  echo ""
  echo "*** Tests completed"
}

function run_build () {
  echo ""
  echo "*** Running build"

  yarn run build

  echo ""
  echo "*** Build completed"
}


run_clean
run_check
run_test
run_build

echo ""
echo "*** CI build completed"

exit 0
