!macro removePhoneRemoteFirewallRules
  nsExec::ExecToLog 'netsh advfirewall firewall delete rule name="Phone Remote"'
  nsExec::ExecToLog 'netsh advfirewall firewall delete rule name="Phone Remote (laptop hotspot)"'
!macroend

!macro customInstall
  !insertmacro removePhoneRemoteFirewallRules
  nsExec::ExecToLog 'netsh advfirewall firewall add rule name="Phone Remote" dir=in action=allow enable=yes program="$INSTDIR\Phone Remote.exe" protocol=TCP localport=3001-3010 profile=private'
  nsExec::ExecToLog 'netsh advfirewall firewall add rule name="Phone Remote (laptop hotspot)" dir=in action=allow enable=yes program="$INSTDIR\Phone Remote.exe" protocol=TCP localport=3001-3010 remoteip=192.168.137.0/24 profile=any'
!macroend

!macro customUnInstall
  !insertmacro removePhoneRemoteFirewallRules
!macroend
