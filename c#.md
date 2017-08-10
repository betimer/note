# C\# Note

## Delegate (Type/class)

Delegate is a type/class, whose real variable is a reference to a method (methods)

Delegates are multicast, (think of List type) all variables of delegate can: =, +=, -=

There is a function to get list: Delegate[] GetInvocationList()

Func<>, Action<>, Predicate<> are generic delegates

public delegate string MyConvertDeleg(string value);

## Delegate variable assigning [My idea]

When you assign a function to a delegate variable, actually you pass the ADDRESS of that function to the delegate variable. And that is why when delegate variable tries to invoke, it could call the function from myInstance.MyFunction instead of yourInstance.MyFunction, because it stores ADDRESS (of particular object).

## Event (keyword when declare)

Event is a keyword, used to declare a real event member. (not a type)

public event MyConvertDeleg MyEvent;

public event Func<string,string> MyEvent; (same with upper)

## An anonymous function (function body)

https://msdn.microsoft.com/en-us/library/bb882516.aspx

- C# 1.0 Common function body: Original delegate constructor
  - MyConvertDeleg d = new MyConvertDeleg(myObject1.MyFunction);
- C# 2.0 Anonymous Methods: Inline code
  - MyConvertDeleg d = delegate(string s) { Console.WriteLine(s); return s+”.” };
- C# 3.0 Lambda Expressions: (The type of x is inferred by the compiler.)
  - MyConvertDeleg d = (x) => { Console.WriteLine(x); return s+”.” };


## Asynchronous Patterns

- 0.0 synchronous:
  - string DownloadString(Uri address);
  - e.g. clicked in WPF, the app is not responding unless the download is finished.
- 1.0 Asynchronous Programming Model (APM) pattern
  - IAsyncResult BeginGetResponse(AsyncCallback callback, object state);
  - WebResponse EndGetResponse(IAsyncResult asyncResult);
- 2.0 Event-based Asynchronous Pattern (EAP):
  - void DownloadStringAsync(Uri address);
  - event DownloadStringCompletedEventHandler DownloadStringCompleted;

Still that WPF, subscribe completed event to notify users. Now it is asynchronous.
webClient.DownloadStringAsync(url); webClient.DownloadStringCompleted += MyFunc;

- 3.0 Task-based Asynchronous Pattern (TAP): (The only recommended method in msdn)
  - Task<string> DownloadStringTaskAsync(string address);

### Asynchronous Patterns Analysis

- 1.0 APM
  - With help of delegate: there is memberDelegate.BeginInvoke/EndInvoke

## Building Configuration & #define

They are totally independent. A build configuration (e.g. Debug) can contain multiple conditional symbols (DEBUG/TRACE/MYXX/MYOO). and #if any of 4 will be executed.
