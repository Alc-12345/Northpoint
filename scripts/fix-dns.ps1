$ErrorActionPreference = "Stop"

netsh interface ipv4 set dnsservers name="WiFi" static 1.1.1.1 primary
netsh interface ipv4 add dnsservers name="WiFi" 8.8.8.8 index=2
netsh interface ipv6 set dnsservers name="WiFi" static 2606:4700:4700::1111 primary
netsh interface ipv6 add dnsservers name="WiFi" 2001:4860:4860::8888 index=2
ipconfig /flushdns

Write-Host "DNS updated for WiFi. You can close this window."
Read-Host "Press Enter to close"
