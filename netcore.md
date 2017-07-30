# .net core

## dotnet cli

dotnet new --install Microsoft.AspNet.Core.SpaServices::*
dotnet new webapi --name  firstapi
dotnet restore
dotnet run
or: dotnet bin\firstapi.dll

## check whether existing proj is eligible for migration

check all dependencies support in .net core: https://icanhasdot.net/

## Entity Framework Core

Roadmap[https://github.com/aspnet/EntityFramework/wiki/Roadmap]

Microsoft.EntityFrameworkCore.InMemory (testing)
```c#
var options = new DbContextOptionsBuilder<BloggingContext>()
    .UseInMemoryDatabase(databaseName: "Find_searches_url")
    .Options;

// Insert seed data into the database using one instance of the context
using (var context = new BloggingContext(options))
{
    context.Blogs.Add(new Blog { Url = "http://sample.com/cats" });
    context.SaveChanges();
}
```

## Clean Architecture

## Swashbuckle
swagger in .net core

## logging and exception
seq

## <i class="icon-file"></i> Deployment

##### Framework-Dependent Deployment (FDD)
Creating a framework dependent deployment with the .NET Core CLI

dotnet publish --framework netcoreapp1.1 --confgiration Release

##### Self -Contained Deployment (SCD) 
Deploy your app, third-party dependencies, and .NET Core

dotnet publish --runtime osx.10-64 --confgiration Release


Item     | Value
-------- | ---
Computer | $1600
Phone    | $12
Pipe     | $1 