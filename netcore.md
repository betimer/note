
# dotnet cli
dotnet new --install Microsoft.AspNet.Core.SpaServices::*
dotnet new webapi


# Entity Framework Core
https://github.com/aspnet/EntityFramework/wiki/Roadmap

Microsoft.EntityFrameworkCore.InMemory (testing)
```
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
# Clean Architecture


# Swashbuckle
swagger in .net core


# logging and exception
seq


# <i class="icon-file"></i> Deployment
##### Framework-Dependent Deployment (FDD)
Creating a framework dependent deployment with the .NET Core CLI
##### Self -Contained Deployment (SCD) 
Deploy your app, third-party dependencies, and .NET Core


Item     | Value
-------- | ---
Computer | $1600
Phone    | $12
Pipe     | $1
