#!/usr/bin/env bash

openssl req -config root.conf -new -x509 -nodes -sha256 -days 3650 -key root.key > root.cert
