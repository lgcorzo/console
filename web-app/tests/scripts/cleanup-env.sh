add_alias() {
  for i in $(seq 1 4); do
    echo "... attempting to add alias $i"
    until (mc alias set minio http://127.0.0.1:9000 minioadmin minioadmin); do
      echo "...waiting... for 5secs" && sleep 5
    done
  done
}

remove_users() {
  mc admin user remove minio bucketassignpolicy-$TIMESTAMP
  mc admin user remove minio bucketread-$TIMESTAMP
  mc admin user remove minio bucketwrite-$TIMESTAMP
  mc admin user remove minio bucketobjecttags-$TIMESTAMP
  mc admin user remove minio bucketcannottag-$TIMESTAMP
  mc admin user remove minio dashboard-$TIMESTAMP
  mc admin user remove minio diagnostics-$TIMESTAMP
  mc admin user remove minio groups-$TIMESTAMP
  mc admin user remove minio heal-$TIMESTAMP
  mc admin user remove minio iampolicies-$TIMESTAMP
  mc admin user remove minio logs-$TIMESTAMP
  mc admin user remove minio notificationendpoints-$TIMESTAMP
  mc admin user remove minio settings-$TIMESTAMP
  mc admin user remove minio tiers-$TIMESTAMP
  mc admin user remove minio trace-$TIMESTAMP
  mc admin user remove minio users-$TIMESTAMP
  mc admin user remove minio watch-$TIMESTAMP
  mc admin user remove minio inspect-allowed-$TIMESTAMP
  mc admin user remove minio inspect-not-allowed-$TIMESTAMP
  mc admin user remove minio prefix-policy-ui-crash-$TIMESTAMP
  mc admin user remove minio conditions-$TIMESTAMP
  mc admin user remove minio conditions-2-$TIMESTAMP
  mc admin user remove minio conditions-3-$TIMESTAMP
  mc admin user remove minio conditions-4-$TIMESTAMP
  mc admin user remove minio rewind-allowed-$TIMESTAMP
  mc admin user remove minio rewind-not-allowed-$TIMESTAMP
}

remove_policies() {
  mc admin policy remove minio bucketassignpolicy-$TIMESTAMP
  mc admin policy remove minio bucketread-$TIMESTAMP
  mc admin policy remove minio bucketwrite-$TIMESTAMP
  mc admin policy remove minio bucketcannottag-$TIMESTAMP
  mc admin policy remove minio dashboard-$TIMESTAMP
  mc admin policy remove minio diagnostics-$TIMESTAMP
  mc admin policy remove minio groups-$TIMESTAMP
  mc admin policy remove minio heal-$TIMESTAMP
  mc admin policy remove minio iampolicies-$TIMESTAMP
  mc admin policy remove minio logs-$TIMESTAMP
  mc admin policy remove minio notificationendpoints-$TIMESTAMP
  mc admin policy remove minio settings-$TIMESTAMP
  mc admin policy remove minio tiers-$TIMESTAMP
  mc admin policy remove minio trace-$TIMESTAMP
  mc admin policy remove minio users-$TIMESTAMP
  mc admin policy remove minio watch-$TIMESTAMP
  mc admin policy remove minio inspect-allowed-$TIMESTAMP
  mc admin policy remove minio inspect-not-allowed-$TIMESTAMPmc
  mc admin policy remove minio fix-prefix-policy-ui-crash-$TIMESTAMP
  mc admin policy remove minio conditions-policy-$TIMESTAMP
  mc admin policy remove minio conditions-policy-2-$TIMESTAMP
  mc admin policy remove minio conditions-policy-3-$TIMESTAMP
  mc admin policy remove minio conditions-policy-4-$TIMESTAMP
  mc admin policy remove minio rewind-allowed-$TIMESTAMP
  mc admin policy remove minio rewind-not-allowed-$TIMESTAMP
}

__init__() {
  export TIMESTAMP="$(cat web-app/tests/constants/timestamp.txt)"
  export GOPATH=/tmp/gopath
  export PATH=${PATH}:${GOPATH}/bin

  if ! command -v mc >/dev/null 2>&1; then
    if command -v gh >/dev/null 2>&1; then
      gh release download --repo minio/mc -p "mc.linux-amd64.RELEASE*Z" -O mc || {
        MC_URL=$(curl -sSfL https://api.github.com/repos/minio/mc/releases/latest | grep "browser_download_url.*mc\.linux-amd64\.RELEASE.*Z" | cut -d : -f 2,3 | tr -d "[:space:]\"")
        curl -sSfL "$MC_URL" -o mc
      }
    else
      MC_URL=$(curl -sSfL https://api.github.com/repos/minio/mc/releases/latest | grep "browser_download_url.*mc\.linux-amd64\.RELEASE.*Z" | cut -d : -f 2,3 | tr -d "[:space:]\"")
      curl -sSfL "$MC_URL" -o mc
    fi
    chmod +x mc
    sudo mv mc /usr/local/bin || mv mc /usr/local/bin
    sudo chmod +x /usr/local/bin/mc || chmod +x /usr/local/bin/mc || true
  fi

  add_alias
}

main() {
  remove_users
  remove_policies
}

(__init__ "$@" && main "$@")
