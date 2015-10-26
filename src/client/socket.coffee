# jquery = require 'jquery'
#
# jquery.ajax {
#   type: 'POST'
#   async: false
#   success: (response) ->
#     client_username = reponse.player_data.username
#     initial_player_data = response.player_data
#     initial_game_data = response.game_data
# }
#
# console.log initial_player_data
# console.log initial_game_data
#
# thisURL = location.protocol + '//' + document.domain + if location.port then ':' + location.port else ''
# socket = io.connect thisURL
#
# socket.on 'connect', ->
#   socket.emit 'HANDSHAKE_FROM_CLIENT', {
#     'username': client_username
#     'payload': 'hand'
#   }
