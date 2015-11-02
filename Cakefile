exec = require('child_process').exec
spawn = require('child_process').spawn

printOutput = (data, proc, stream) -> console.log "#{proc} #{stream}: #{data}"


task 'test', 'Runs from coffee', ->
  test = spawn 'coffee', ['src/app.coffee']
  test.stdout.on 'data', (data) -> printOutput data, 'test', 'stdout'
  test.stderr.on 'data', (data) -> printOutput data, 'test', 'stderr'


task 'run', 'Builds and runs', ->
  build = spawn 'cake', ['build']
  build.stdout.on 'data', (data) -> printOutput data, 'run', 'stdout'
  build.stderr.on 'data', (data) -> printOutput data, 'run', 'stderr'
  build.on 'exit', (exitCode) -> invoke 'start'


task 'build', 'Builds coffeescript to js', ->
  build = spawn 'coffee', ['-c', '-o', '.', 'src/']
  build.stdout.on 'data', (data) -> printOutput data, 'build', 'stdout'
  build.stderr.on 'data', (data) -> printOutput data, 'build', 'stderr'


task 'start', 'Runs built code', ->
  start = spawn 'node', ['app.js']
  start.stdout.on 'data', (data) -> printOutput data, 'start', 'stdout'
  start.stderr.on 'data', (data) -> printOutput data, 'start', 'stderr'


task 'clean', 'Cleans out previously generated source', ->
  clean = exec 'rm *.js models/*.js'
  clean.stdout.on 'data', (data) -> printOutput data, 'clean', 'stdout'
  clean.stderr.on 'data', (data) -> printOutput data, 'clean', 'stderr'
  clean.on 'exit', (exitCode) ->
    clean = spawn 'rmdir', ['models/']
    clean.stdout.on 'data', (data) -> printOutput data, 'clean', 'stdout'
    clean.stderr.on 'data', (data) -> printOutput data, 'clean', 'stderr'
