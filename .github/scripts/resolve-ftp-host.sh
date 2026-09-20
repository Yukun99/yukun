#!/usr/bin/env bash
# Prints the host name to use for FTPS so that strict certificate checks pass.
# Needs FTP_SERVER (where to connect) and FTP_CERT_SUFFIX (the only domain a discovered name may end in).
set -euo pipefail

server="${FTP_SERVER:?FTP_SERVER is not set}"
suffix="${FTP_CERT_SUFFIX:?FTP_CERT_SUFFIX is not set}"

# exits non-zero unless the certificate chain is trusted and the certificate covers the given name
verified() {
  echo QUIT | timeout 30 openssl s_client -connect "$1:21" -starttls ftp -servername "$1" \
    -verify_return_error -verify_hostname "$1" >/dev/null 2>&1
}

if verified "$server"; then
  echo "$server"
  exit 0
fi

# The name comes from an unverified handshake, so it is only a hint: it must sit under the trusted suffix
# and then pass a full verification of its own before it is used.
names=$(echo QUIT | timeout 30 openssl s_client -connect "$server:21" -starttls ftp -servername "$server" 2>/dev/null \
  | openssl x509 -noout -ext subjectAltName 2>/dev/null | grep -oE 'DNS:[^, ]+' | cut -d: -f2 || true)

for name in $names; do
  if [[ "$name" != *'*'* && "$name" == *"$suffix" ]] && verified "$name"; then
    echo "$name"
    exit 0
  fi
done

echo "No certificate name under $suffix passed verification for the FTP server." >&2
exit 1
