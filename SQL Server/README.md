# SQL Server

## Query plan: (2 Main: seek + scan)

1. seek index (Clustered index seek, Non-clustered index seek)

    When SQL Server does a seek it knows where in the index that the data is going to be, so it loads up the index from disk, goes directly to the part of the index that it needs and reads to where the data that it needs ends.

2. scan table/index (clustered/non-clustered, clustered is table)

    (worst case: lack of proper index, or huge result of non-cluster column + key lookup) When SQL Server does a scan, it loads the object which it wants to read from disk into memory, then reads through that object from top to bottom looking for the records that it needs.

3. key lookup (bookmark lookup) (fast, return record by the primary key)

    Others say that this type is querying data one by one

    [My Idea] I will say lookup is same with clustered index seek, difference is that it calls one by one
    index seek/scan -> get PK -> lookup (clustered index seek) (I think it happens: seek + lookup)

    e.g. SELECT * FROM booking WHERE hotel_id = 985 
    (we only have index cover hotel_id, hotel_id->booking_id->*, resembling a join query)

    3.1
    That is why sometimes we INCLUDE extra columns in the index, to prevent key lookup, to get result from a single non-clustered index. This could improve performance a lot.

## Join in query plan

1. Loop Join (Nested loops)

* outer table is much smaller
* searching inner table depends on the result of outer table

A nested loops join is particularly effective if the outer input is small and the inner input is pre-indexed and large. In many small transactions, such as those affecting only a small set of rows, Loop Join is superior to both merge joins and hash joins. In large queries, however, nested loops joins are often not the optimal choice.

2. Merge Join

* outer and inner sources separately.
* both inputs are sorted

Merge join itself is very fast, but it can be an expensive choice if sort operations are required. However, if the data volume is large and the desired data can be obtained presorted from existing B-tree indexes, merge join is often the fastest available join algorithm.

3. Hash Join

* large and unsorted (So cannot merge join)
* slowest type

Both hash and merge joins process the outer and inner sources separately.

## Transaction

Transaction works between BEGIN TRAN and COMMIT TRAN.
If not explicitly, by default, each statement is a transaction.
Transaction has 4 attributes: (ACID)
* Atomicity: all-or-none
* Consistency: consistent state + follow PK, FK, Unique
* Isolation: control access to separate from each transaction 
    * old one based on locking
    * new one based on row version
    * 5 types: READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SNAPSHOT | SERIALIZABLE
* Durability: when recover, decide redo/undo based on log

## Lock

Each transaction, has many records in sys.dm_tran_locks, showing how many locks that has been granted. Column `resource_type` represents granularity (Row, Key, Page, Table…); column `request_mode` represents lock mode (S, IX, X)

* Granularity: e.g. KeyA X, PageA IX, TableA IX
* Lock Escalation: in a tran, if too many Pages X -> Table X
* Lock Mode:
    * S: shared lock while read, release it after statement, not transaction
    * U: in UPDATE statement
    U when query, then X when modify (U compatible S, not IX)
    * X: unlike UPDATE, INSERT/DELETE request X at the beginning
    * I: if obtain mode A in lower level, so high level is IA: IS, IX, SIX, ...

e.g.
```
SET TRANSACTION ISOLATION LEVEL READ COMMITTED -- REPEATABLE READ
SELECT * FROM T WITH (XLOCK, ROWLOCK, HOLDLOCK /*PAGLOCK, TABLOCKX*/)
WHERE ID = 123
```

Rule:

At most one granularity and at most one isolation level in the FROM clause.

Granularity hints: PAGLOCK, NOLOCK, ROWLOCK, TABLOCK, or TABLOCKX.

Isolation level hints: HOLDLOCK, NOLOCK, READCOMMITTED, REPEATABLEREAD, SERIALIZABLE.

## Aggregate

1. Stream Aggregation
2. Hash aggregation or Sort (Sort consume memory)

## Knowledge Points

**High Availability Solutions (SQL Server)**

- AlwaysOn Failover Cluster Instances (Instance level, the rest are DB level)
    - requires in Windows Server Failover Clustering - (WSFC) nodes
    - An FCI consists of a set of physical servers (nodes)
    - Shared same storage (Only servers/nodes are - multiple)
    - do not protect against disk failure
    - unreadable secondary, other types are readable (mirror not sure)
- AlwaysOn Availability Groups (DB level)
    - requires in Windows Server Failover Clustering (WSFC) nodes
    - no need shared storage
    - Protects against disk failure
    - 1-8 secondary db (can be read-only)
    - an enterprise-level alternative to database mirroring
- Database mirroring (DB level)
    - Not recommend any more, use AlwaysOn Availability Groups
- Log shipping (DB level)
    - backup primary trans log; copy to >=1 secondary; restore secondary
    - read-only access to secondary databases

**Replication**

- Transactional
    - Low latency
    - server-to-server environments
    - can be peer-to-peer (for update)
- Merge
    - server-to-client environments
    - ‘client’ changed locally; when connection available, sync to primary
- Snapshot
    - Data changes infrequently
    - large volume of changes occurs over a short period of time.
    - replicating the entire snapshot of data

**back up (database/log)**

database backup: full backup / differential backup (after last full backup)
log backup (3 recovery models for transaction log, ldf): simple / full / bulk-logged

restore database (data/log)

**JOIN:**

- INNER JOIN
- OUTER JOIN
    - LEFT (OUTER) JOIN
    - RIGHT (OUTER) JOIN
    - FULL (OUTER) JOIN
- CROSS JOIN  (similar to: SELECT * FROM t1,t2) (CROSS JOIN ~ ,) (No ‘ON’)

**APPLY: (two forms: CROSS APPLY / OUTER APPLY)**

- apply query/filter on the outer result
- e.g. get hotels with its any booking_id

```
select top 100 h.hotel_id, h.hotel_name, bb.booking_id, bb.guest_name
from product_hotels h
CROSS APPLY ( -- similar to inner join, return rows only exists in outer results
-- if allow null booking, use: OUTER APPLY
	select top 1 *
	from header_booking b
	where b.hotel_id = h.hotel_id
	) as bb
order by 1
```

**Create index:**

```
CREATE INDEX idx1 ON MyTable (Col1, Col2, Col3)
CREATE INDEX idx1 ON MyTable (Col1) INCLUDE (Col2, Col3)
Clustered index contains: indexed column(s) + all other columns.
Nonclustered index contains: indexed column(s) + Included columns + Primary Key.
```

**Predict Statement:**

3 results: True / False / Null (If any of variable in the expression is null)
Only True is ‘true’ (null will be discarded) (And not Null, will also be null)
select * from detail where detail_id = null or not (detail_id = null) (Get nothing)

Use ‘IS’ when dealing with null in expression


**Union: (only get 100 distinct, if without all)**

```
select top 100 * from hotel -- column name will follow first query
union  --all
select top 100 * from hotel 
```

**Data Type Conversion:**

```
CONVERT(type, value, format) -- format is optional
CAST(value as type)
PARSE(str as type)
TRY_PARSE(str as type)  -- if success, return result; if fail, return NULL
```

**OUTPUT: (say: localized trigger)**

- get old/new values of INSERT/UPDATE/DELETE/MERGE 
- work similarly to SELECT (so we can add INTO dbo.xxxx)
- 2 types
    - INSERTED.* (inserted new rows, updated new values)
    - DELETED.price (deleted rows, original value before updating)


**TRY CATCH**

```
BEGIN TRY
	BEGIN TRANSACTION
	XX1; XX2; XX3
	COMMIT TRANSACTION
END TRY
BEGIN CATCH
	ROLLBACK TRANSACTION
	SELECT ERROR_NUMBER(), ERROR_MESSAGE()
END CATCH
```

**RAISEERROR/THROW: (only THROW can be used within CATCH block)**

```
RAISEERROR(msg_id/msg_str, serverity_id, state_id)
THROW; 
THROW 50000, ‘my message’, 1  -- error_number, msg_str, state_id
```


**group by options:**

```
-- add total: each month, each year, all year
SELECT  year,month,day, SUM (sale_price) from dbo.deal
GROUP BY year,month,day WITH ROLLUP 
GROUP BY ROLLUP (year,month,day)
-- original + all total -- similar union all 2 groups: year,month,day + all
GROUP BY GROUPING SETS ((year,month,day),()) 
-- every combination, each year, each month in diff year + day, xxxx
GROUP BY CUBE (year,month,day) 
```

**Ranking functions: (Put in select list) (all rank function can return 4,3,11,7,xxx)**
ROW_NUMBER
    ROW_NUMBER() OVER (ORDER BY x_id DESC) -- 1,2,3,4
RANK
    1,1,1,4
    PARTITION BY c.city_id ORDER BY c.score DESC -- 每个城市都有第一名
DENSE_RANK
    1,1,1,3,3,2, -- all ran
NTILE(x) -- just separate into x groups
    111112222

**Paging: (wants 31-40, put following code at the end of query)**

```
offset 30 rows
fetch next 10 rows only
```

**MERGE:**

```
MERGE Production.UnitMeasure AS target
USING (SELECT @UnitMeasureCode, @Name) AS source (UnitMeasureCode, Name)
ON (target.UnitMeasureCode = source.UnitMeasureCode)
WHEN MATCHED THEN 
UPDATE SET Name = source.Name
WHEN NOT MATCHED BY TARGET THEN -- target is missing
INSERT (UnitMeasureCode, Name)
VALUES (source.UnitMeasureCode, source.Name)
https://www.simple-talk.com/sql/learn-sql-server/the-merge-statement-in-sql-server-2008/
```

**SQL Server Fragmentation**

- disk fragmentation (Out of sql server, system level; try to put mdf into a separate disk isolated from OS or log files)
- Index level fragmentation
    - Internal fragmentation (inside a page)
    e.g. delete records in a page, causing this page fragmented
    - External fragmentation (between pages)
    logical order and the physical order of the pages does not match
    e.g. 1235-6789-10; insert 4: 123-(45)-6789-10 (45 page was created at the end of the physical page, even logical should be 123-45-6789-10)

**read nullable things**

```
if (reader["YourColumn"] != DBNull.Value)
{
    somestring.Text = reader["YourColumn"].ToString();
}
else
{
     somestring.Text = "Got null string";
}
```

**table trigger**

```
create table oliver_table ([u_id] int not null, name nvarchar(40), comments nvarchar(100), score int )
create table oliver_table_track ([u_id] int not null, name nvarchar(40), comments nvarchar(100), score int, update_time datetime )

create trigger oliver_table_update_trigger
on dbo.oliver_table after update
as
begin
	insert into oliver_table_track (u_id, name, comments, score, update_time)
	select u_id, name, comments, score, GETDATE() from deleted 
end
go

select * from oliver_table_track 
insert into oliver_table values (12,'xiaowei','haohaoxuexi',96)
update oliver_table set score = 100 where name = 'xiaowei'
```

**waitfor**

```
WAITFOR DELAY '000:00:20'
WAITFOR TIME '7:00:00'
```

**Batch Operation**

```
1. C# build string -> SQL server parse varchar string to xml table
2. Create User Table Type (newer than 1.)
CREATE TYPE SalesHistoryTableType AS TABLE
	SELECT * FROM sys.table_types
3. BULK INSERT (look this one later)
```

Evaluate existing and potential indexes:
Database Engine Tuning Advisor







