@echo off

title Updating(1/5)
git add *.md
git add *.cmd
git add *.js
git add img
git commit -m "%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%%time:~9,2%"
git push

title Building(2/5)
cmd /c "yarn docs:build"

title Compressing(3/5)
cd /d ".\docs\.vuepress\dist"
"C:\Program Files\7-Zip\7z.exe" a -tzip dist.zip *

ssh root@192.144.230.47 "cd /www/wwwroot/wiki.edgeless.top/v2;rm -rf *"
title Uploading(4/5)
scp "dist.zip" root@192.144.230.47:/www/wwwroot/wiki.edgeless.top/v2
title Unziping(5/5)
ssh root@192.144.230.47 "cd /www/wwwroot/wiki.edgeless.top/v2;unzip ./dist.zip"
exit