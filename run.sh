npm start &
cd src/backend
for fname in "$@"; do
  node logreader.js "$fname"
done