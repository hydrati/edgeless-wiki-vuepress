yarn docs:build

cd /d "D:\Desktop\edgeless-wiki-vuepress\docs\.vuepress\dist"
"C:\Program Files\7-Zip\7z.exe" a -tzip dist.zip *

ssh root@148.70.88.72 "cd /www/admin/wiki.edgeless.top_80/wwwroot/v2;rm -rf *"
scp "D:\Desktop\edgeless-wiki-vuepress\docs\.vuepress\dist\dist.zip" root@148.70.88.72:/www/admin/wiki.edgeless.top_80/wwwroot/v2
ssh root@148.70.88.72 "cd /www/admin/wiki.edgeless.top_80/wwwroot/v2;unzip ./dist.zip"