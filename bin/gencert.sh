#!/usr/bin/env bash
 
#Required
domain=$1
commonname=$domain
 
#Change to your company details
country=US
state=Example
locality=Example
organization="Example LTD"
organizationalunit=IT
email=me@example.com
 
#Optional
password=$(dd if=/dev/urandom bs=3 count=8)

prefix=etc/certs
 
if [ -z "$domain" ]
then
    echo "Argument not present."
    echo "Useage $0 [common name]"
 
    exit 99
fi
 
echo "Generating key request for $domain"
 
#Generate a key
openssl genrsa -des3 -passout pass:$password -out $prefix/$domain.key 2048 -noout
 
#Remove passphrase from the key. Comment the line out to keep the passphrase
echo "Removing passphrase from key"
openssl rsa -in $prefix/$domain.key -passin pass:$password -out $prefix/$domain.key
 
#Create the request
echo "Creating CSR"
openssl req -new -key $prefix/$domain.key -out $prefix/$domain.csr -passin pass:$password \
    -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname/emailAddress=$email"
 
echo "---------------------------"
echo "-----Below is your CSR-----"
echo "---------------------------"
echo
cat $prefix/$domain.csr
 
echo
echo "---------------------------"
echo "-----Below is your Key-----"
echo "---------------------------"
echo
cat $prefix/$domain.key
