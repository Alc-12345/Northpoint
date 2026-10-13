import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execute = promisify(execFile);
const windowsScript = `Add-Type @'
using System;
using System.Runtime.InteropServices;
public class NorthpointWindow {
 [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
 [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
}
'@;
[uint32]$foregroundProcessId = 0;
[void][NorthpointWindow]::GetWindowThreadProcessId([NorthpointWindow]::GetForegroundWindow(), [ref]$foregroundProcessId);
(Get-Process -Id $foregroundProcessId -ErrorAction Stop).ProcessName`;
export function applicationCategory(name) {
  if (/code|studio|terminal|powershell|iterm|idea|xcode/i.test(name)) return 'development';
  if (/slack|teams|zoom|mail|outlook/i.test(name)) return 'communication';
  if (/excel|word|numbers|pages|office/i.test(name)) return 'business';
  if (/chrome|safari|firefox|edge/i.test(name)) return 'research';
  return 'uncategorized';
}
export async function foregroundApplication(platform = process.platform, run = execute) {
  let result;
  if (platform === 'darwin') result = await run('/usr/bin/osascript', ['-e', 'tell application "System Events" to get name of first application process whose frontmost is true'], { timeout: 3000, maxBuffer: 4096 });
  else if (platform === 'win32') result = await run('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', windowsScript], { timeout: 3000, maxBuffer: 4096, windowsHide: true });
  else throw new Error('Foreground application collection unavailable on this OS');
  const name = result.stdout.trim().slice(0,100);
  if (!name) throw new Error('Foreground application name unavailable');
  return { application: name, category: applicationCategory(name) };
}
