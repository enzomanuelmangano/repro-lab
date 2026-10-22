#!/bin/sh
# Applies patches/<package>@<version>.patch to node_modules/<package>, once.
# Used instead of bun's patchedDependencies, which cannot apply a patch that adds a file.
set -e
for patch in patches/*.patch; do
  [ -e "$patch" ] || continue
  name=$(basename "$patch" .patch)
  pkg=${name%@*}
  dir="node_modules/$pkg"
  if git apply --directory="$dir" --reverse --check "$patch" 2>/dev/null; then
    echo "$pkg: already patched"
  else
    git apply --directory="$dir" "$patch"
    echo "$pkg: patched"
  fi
done
