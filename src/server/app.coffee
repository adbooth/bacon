express = require 'express'
app = express()
app.set 'view engine', 'jade'
app.use express.static 'public'

app.get '/', (request, response) ->
  response.render 'play'

server = app.listen 5000, ->
  host = server.address().address
  port = server.address().port

  console.log "Application server running at http://#{host}:#{port}"
