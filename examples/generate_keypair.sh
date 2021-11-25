#!/usr/bin/env sh
# script to generate key material for pti api in current directory. requires access to the PTI docker registry on github
docker run -i --rm docker.pkg.github.com/provenancetech/pti-tools/jwk-generator:latest genkey > "${1}_private.jwk"
cat "${1}_private.jwk" | docker run -i --rm docker.pkg.github.com/provenancetech/pti-tools/jwk-generator:latest pubkey > "${1}_public.jwk"
cat "${1}_private.jwk" | docker run -i --rm docker.pkg.github.com/provenancetech/pti-tools/jwk-generator:latest pubkey --thumbprint > "${1}_thumb.jwk"
