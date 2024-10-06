Set WshShell = CreateObject("WScript.Shell")
' Obtiene el directorio donde está el archivo .vbs
currentDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
' Ejecuta el archivo .bat que está en el mismo directorio
WshShell.Run Chr(34) & currentDir & "\Pacifit.bat" & Chr(34), 0
Set WshShell = Nothing
