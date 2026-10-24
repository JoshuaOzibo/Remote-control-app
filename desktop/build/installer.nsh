!macro removePhoneRemoteFirewallRules
  nsExec::ExecToLog 'netsh advfirewall firewall delete rule name="Phone Remote"'
  nsExec::ExecToLog 'netsh advfirewall firewall delete rule name="Phone Remote (laptop hotspot)"'
!macroend

!macro customInstall
  !insertmacro removePhoneRemoteFirewallRules
  nsExec::ExecToLog 'netsh advfirewall firewall add rule name="Phone Remote" dir=in action=allow enable=yes program="$INSTDIR\Phone Remote.exe" protocol=TCP localport=80,3001-3010 remoteip=localsubnet profile=any'
!macroend

!macro customUnInstall
  !insertmacro removePhoneRemoteFirewallRules
!macroend
