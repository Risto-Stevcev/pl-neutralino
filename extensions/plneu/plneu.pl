#!/usr/bin/env swipl

:- use_module(library(main)).
:- use_module(library(http/websocket)).
:- use_module(library(persistency)).
:- use_module(arg_parse).

:- persistent
        log(value:any).

:- db_attach('pl_neu_logs.pl', []).
:- set_prolog_flag(double_quotes, chars).
%:- gspy(http_open_websocket/3).

neu(URL) :-
    assert_log('Connecting to... ' - URL),
    http_open_websocket(URL, WS, []),
    assert_log('Connected'),
    ws_receive(WS, Reply),
    ws_send(WS, text('Hello World!')),
    write(Reply), % TODO
    ws_close(WS, 1000, "Goodbye").

:- initialization(main, main).


get_args(Argv, Args) :-
  atomic_list_concat(Argv, ' ', Argv2),
  atom_chars(Argv2, ArgvStr),
  phrase(arguments(Args), ArgvStr).

dict_to_url(_{ extension_id: ExtId, port: Port, token: _ }, URL) :-
  format(atom(URL), 'ws://localhost:~d?extensionId=~a', [Port, ExtId]).

args_to_url(Argv, URL) :-
  get_args(Argv, Args),
  dict_pairs(Dict, _, Args),
  dict_to_url(Dict, URL).

main(Argv) :-
  args_to_url(Argv, URL),
  neu(URL).
