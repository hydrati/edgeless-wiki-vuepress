@echo off
title Building（1/4）
cmd /c "yarn docs:build"

cd /d "D:\Desktop\edgeless-wiki-vuepress\docs\.vuepress\dist"
"C:\Program Files\7-Zip\7z.exe" a -tzip dist.zip *
title Compressing（2/4）

ssh root@148.70.88.72 "cd /www/admin/wiki.edgeless.top_80/wwwroot/v2;rm -rf *"
title Uploading（3/4）
scp "D:\Desktop\edgeless-wiki-vuepress\docs\.vuepress\dist\dist.zip" root@148.70.88.72:/www/admin/wiki.edgeless.top_80/wwwroot/v2
title Unziping（4/4）
ssh root@148.70.88.72 "cd /www/admin/wiki.edgeless.top_80/wwwroot/v2;unzip ./dist.zip"
title Finish
timeout 5