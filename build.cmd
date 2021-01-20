yarn docs:build
cd docs/.vuepress/dist
git init
git add -A
git commit -m 'deploy'
git push -f git@gitee.com:cnotech/edgeless-wiki-dist.git master:master