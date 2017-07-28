
# dotnet cli
dotnet new --install Microsoft.AspNet.Core.SpaServices::*
dotnet new webapi


# Entity Framework Core
https://github.com/aspnet/EntityFramework/wiki/Roadmap

Microsoft.EntityFrameworkCore.InMemory (testing)
```
 var options = new DbContextOptionsBuilder<BloggingContext>()
    .UseInMemoryDatabase(databaseName: "Add_writes_to_database")
    .Options;

// Run the test against one instance of the context
using (var context = new BloggingContext(options))
{
    var service = new BlogService(context);
    service.Add("http://sample.com");
}
```
# Clean Architecture


# Swashbuckle
swagger in .net core




