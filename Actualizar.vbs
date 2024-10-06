Set objShell = CreateObject("WScript.Shell")

' Obtener la ruta del archivo .vbs (que será la misma que la del repositorio)
Set objFSO = CreateObject("Scripting.FileSystemObject")
scriptPath = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Cambia al directorio donde está el archivo .vbs y ejecuta git pull origin main
command = "cmd /c cd " & scriptPath & " && git pull origin main"

' Ejecutar el comando en una ventana de CMD
objShell.Run command, 1, true
