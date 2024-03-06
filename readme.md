1 action and 0 triggger required for publish atleast workflow
nvm use node 17
git pull https://github.com/njaiswal78/crmm-workflows.git
npm run build
//npm start
pm2 restart crmm-workflows
