# Erlang

Note: there is some Chinese characters in this article.

## Erlang Basic

Erlang is COP(Concurrency Oriented Programming) and FP(functional programming). Types are determined at run time. Erlang does not have a type system.

wxErlang 是一个 Erlang 语言对 C++ 的 GUI 库 wxWidgets 的封装.

编译: c(test)与c(test.erl)都行。c(Mudule)->compile+load.  l(Moduke)->load.

Pattern=Expression (Pattern Matching) 

(Pattern单一格式, 比如A+B = CC这种是错误的)(Expression没有unbound的变量)

exported functions & local functions: -export([f1/3,f2/4]).

Terms: (atom原子)(tuple元组)(list列表)(String 必须""，'XXX'是个atom类型)(module模块)

- List: "Abac" 与[65,98,97,99] 是完全一样的。
    - [H|T]这种模式之后，H是列表中的一个头元素，而T是列表。
    - [1,2,3]++[4,5,6] 系统只要  [1]->[2]->[3]->[4,5,6]
    - lists:map(F,L)对列表L每个元素执行F；lists:filter(F,L)对列表L每个元素执行F（返回true和false）然后筛选。

Adder=fun(X,Y)->X+Y+1000 end.  再调用Adder(5,60).

Isin=fun(L)->(fun(X)->lists:member(X,L) end) end.
调用：(Isin(Fruit))(apple). 也有IsFruit=Isin(Fruit).再IsFruit(apple).

```
case Expression of
    Pattern1 -> XXOO;
    Pattern2 -> OOXX;
    _ -> XXXX
end,
if X<1 -> XX;
   X>10 -> OO;
   true -> XXOO
end
Guards:   fact(N) when N>0 -> 
                   N*fact(N-1);
Pid2 = spawn(Mod, Func, Args)
```

## Erlang Process

我通过测试发现erlang语言里面的递归非常不一样。好像没有压栈这个说法。好像压栈就像其他语言的循环一样。设计了"refer 2"的测试用例。

第一，server的loop进程，在进行无限的loop之后，发现内存根本没有怎么增加，或者说没增加。

第二，用call1(N)的方法，发现内存会一直累加，因为是call1的关联的terminal进程有大量的server发的Message，而此时这个进程还活着。

第三，如果用call2(N)，或者call_process(N)方法，调用很多很多次，内存也不会有什么啥变化，(如果进程死了，他的邮箱会被清除)

The important thing to note about tail-recursive functions is that they can run in loops without consuming stack space. Such function are often called “iterative functions.”

```
refer 1 -----------------------------
good functions:
// 类似于冒泡排序, 从List中找两个值不一样的元素出来
getDifferent([])-> {nok,nok,nok};
getDifferent([_L1])-> {nok,nok,nok};
getDifferent([L1|LCs])->
 case getDifferent(L1,LCs) of 
  {ok,L2} -> {ok,L1,L2};
  {nok,_} -> getDifferent(LCs)
 end.

getDifferent(_L1,[])->
    {nok,nok};
getDifferent(L1,[L2|LCs])->
    case someLibary:areSame(L1,L2) of 
        true -> getDifferent(L1,LCs);
        _ -> {ok, L2}
    end.
```

```
refer 2 -----------------------------
-module(server1).
-export([start/0,stop/0,loop/1,call1/1,call2/1,call_process/1]).

start()->
    Pid = spawn(ser1,loop,[[]]),
    register(server,Pid),
    {server,Pid}.

stop()->
    server!{server_stop,self()},
    receive  
      {reply_server_stop} ->  io:fwrite("Client get server_stop_reply.~n")
    after 10000 ->  io:fwrite("Client get server_stop timeout.~n")
    end.
    
call1(0)-> 
    io:fwrite("call1 ends.~n"),
    ok;
call1(Num)-> 
    %% Without receiving msg, cause memory increase.
    server!{client_start,self()},
    server!{client_over,self()},
    call1(Num-1).
    
call2(0)->
    io:fwrite("call2 ends.~n"),
    ok;
call2(Num)->
    %% With receiving msg, no further memory cost for saving msg.
    server!{client_start,self()},
    receive {reply_start} -> ok
    after 1000 -> io:fwrite("<")
    end,
    server!{client_over,self()},
    receive {reply_over} -> ok
    after 1000 -> io:fwrite(">")
    end,
    call2(Num-1).
    
call_process(Num)->
    Pid = spawn(?MODULE,call1,[Num]),
    io:fwrite("Let process ~p do it.",[Pid]),
    timer:sleep(100).
    
loop(State)->
  %% this is the main scope, even long time loop, but no memory increase, just like doing for cycle.
  XX = 
    receive 
      {client_start,Pid} ->
        Pid!{reply_start},
        loop([Pid|State]);
      {client_over,Pid} ->
        Pid!{reply_over},
        loop(lists:delete(Pid,State));
      {server_stop,Pid} ->
        Pid!{reply_server_stop},
        io:fwrite("Now, server stop.~n")
      after 100000 ->
        io:fwrite("Server timeout.~n")
      end,
    _Y = XX.
```

## erlang with emacs (.emacs)

(setq load-path (cons  "/usr/local/otp/lib/tools-<ToolsVer>/emacs" load-path))
(setq erlang-root-dir "/usr/local/otp")
(setq exec-path (cons "/usr/local/otp/bin" exec-path))
(require 'erlang-start)

## ;;change 'O' to 'l'

(setq-default cursor-type 'bar)
