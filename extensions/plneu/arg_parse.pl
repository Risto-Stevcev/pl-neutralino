:- module(arg_parse, [args/3, arguments/3]).
:- use_module(library(dcg/high_order)).

:- set_prolog_flag(double_quotes, chars).

seq([])     --> [].
seq([E|Es]) --> [E], seq(Es).

args(port-Port) --> "--nl-port=", seq(P), { atom_chars(P2, P), atom_number(P2, Port) }.
args(token-Token) --> "--nl-token=", seq(T), { atom_chars(Token, T) }.
args(extension_id-ExtId) --> "--nl-extension-id=", seq(E), { atom_chars(ExtId, E) }.

arguments(Args) --> sequence(args, " ", Args).

% ?- set_prolog_flag(double_quotes, chars).
% ?- phrase(arguments(Args), "--nl-extension-id=foo --nl-port=435").
% Args = [extension_id(foo), port(435)] .
