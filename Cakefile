spawn = require('child_process').spawn

task 'run', 'Builds and runs', ->
  invoke 'build'
  invoke 'start'

task 'build', 'Builds everything', ->
  invoke 'build:server'
  invoke 'build:client'


task 'build:client', 'Builds client-side coffeescript to js', ->
  build = spawn 'coffee', ['-c', '-o', 'public/js/', 'src/client/']
  build.stdout.on 'data', (data) ->
    console.log "build:client stdout: #{data}"
  build.stderr.on 'data', (data) ->
    console.log "build:client stderr: #{data}"


task 'build:server', 'Builds server-side coffeescript to js', ->
  build = spawn 'coffee', ['-c', '-o', '.', 'src/server/']
  build.stdout.on 'data', (data) ->
    console.log "build:server stdout: #{data}"
  build.stderr.on 'data', (data) ->
    console.log "build:server stderr: #{data}"


task 'start', 'Runs built code', ->
  start = spawn 'node', ['app.js']
  start.stdout.on 'data', (data) ->
    console.log "start stdout: #{data}"
  start.stderr.on 'data', (data) ->
    console.log "start stderr: #{data}"


task 'clean', 'Cleans out previously generated source', ->
  clean = spawn 'rm', ['app.js', 'controllers/*', 'models/*', 'public/js/*']
  clean.stdout.on 'data', (data) ->
    console.log "clean stdout: #{data}"
  clean.stderr.on 'data', (data) ->
    console.log "clean stderr: #{data}"
