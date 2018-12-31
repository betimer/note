
---- init connect ----
1. client: /socket.io/?EIO=3&transport=polling&t=LmQMw5g
2. server respose: {"sid":"bynPcLk7JQb3atvaAAAA","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":60000}
3. client will use that 'sid' to communicate with server



---- reconnect ----

1. client detected that the connection was lost
2. client: send request to get new socket.io sid (the existing same client object)
3. server: get new client connect, try to communicate with it (server does not know the relationship between this new request and previous failed one, server treated as 2 separate clients)
4. server this point should have 2 connections (one for old, one for new coming, old one may timeout in the future)
5. server response with {sid} to client
6. client: get response from server, and get the new socketioId.

