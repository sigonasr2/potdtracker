npm start &
cd src/backend
read -e -p "Provide Log file: " log
node logreader.js $log