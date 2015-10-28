exec = require('child_process').exec
spawn = require('child_process').spawn

task 'test', 'Runs from coffee', ->
  test = spawn 'coffee', ['src/server/app.coffee']
  test.stdout.on 'data', (data) ->
    console.log "test stdout: #{data}"
  test.stderr.on 'data', (data) ->
    console.log "test stderr: #{data}"


task 'run', 'Builds and runs', ->
  invoke 'build'
  invoke 'start'


task 'build', 'Builds server-side coffeescript to js', ->
  build = spawn 'coffee', ['-c', '-o', '.', 'src/server/']
  build.stdout.on 'data', (data) ->
    console.log "build stdout: #{data}"
  build.stderr.on 'data', (data) ->
    console.log "build stderr: #{data}"


task 'start', 'Runs built code', ->
  start = spawn 'node', ['app.js']
  start.stdout.on 'data', (data) ->
    console.log "start stdout: #{data}"
  start.stderr.on 'data', (data) ->
    console.log "start stderr: #{data}"


task 'clean', 'Cleans out previously generated source', ->
  clean = exec 'rm *.js controllers/*.js models/*.js'
  clean.stdout.on 'data', (data) ->
    console.log "clean stdout: #{data}"
  clean.stderr.on 'data', (data) ->
    console.log "clean stderr: #{data}"
