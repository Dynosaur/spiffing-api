$currentPath = (Get-Location).Path
$tsNodePath = "node_modules\.bin\ts-node"
$scriptName = "update-interface.ts"

if ($currentPath.EndsWith("spiffing")) {
    $tsNodePath = $currentPath + "\" + $tsNodePath
    $scriptPath = $currentPath + "\scripts\" + $scriptName
} else {
    if ($currentPath.EndsWith("spiffing\scripts")) {
        $tsNodePath = $currentPath + "\..\" + $tsNodePath
        $scriptPath = $currentPath + "\" + $scriptName
    } else {
        "Unknown location, cannot find node_modules directory."
        exit 1;
    }
}

if (-not (Test-Path ($tsNodePath))) {
    "$tsNodePath does not exist."
    exit 1;
}

cmd.exe /c "$tsNodePath -P scripts\tsconfig.json $scriptPath"
