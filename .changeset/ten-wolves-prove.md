---
'@websublime/vtx-cli': patch
'@websublime/vtx-common': patch
---

Packages resolution by name and option to exclude from alias

Package were resolved by array index entrance and that could be problem if user changes order in packages entry. Now they are resolved by name
and vite plugin as a new option to exclude from alias apps, libs or packages. Also root package as to be an array of string.
