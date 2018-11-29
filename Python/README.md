# Python Basic

## python的缩进

空白在Python中是重要的。事实上行首的空白是重要的。它称为缩进。在逻辑行首的空白（空格和制表符）用来决定逻辑行的缩进层次，从而用来决定语句的分组。
这意味着同一层次的语句必须有相同的缩进。每一组这样的语句称为一个块。要保证每个块是同一种缩进就行了。如下的例子是可以过的，不需要每次4/8个。

```
class AAA:
       myId = 711 (这个组空了7个' ')
   	   def classSay(self):
    	self.inter = 3 (这个组空了1个' ')
    	print "classSayed."
   	   print 'Class AAA now avaliable'
```

## python的编译

python -m py_compile try.py (只生成try.pyc)
python -O -m py_compile try.py (只生成try.pyo)
或者命令行   import py_compile
            py_compile.compile(try.py)

## print参数

age = 22
name = 'Swaroop'
print '%s is %d years old'%(name, age) (定制参数的时候要用元组()) (""与''都是可以的,'as'=="as"结果为True)
print 'Why is %s playing with that python?'%name  (只有在定制参数只有一个的时候,可以不用元组)

## Useful functions

```
range(2,5)的结果为[2,3,4]
判断的结果值为 True/False
获得输入的整数 int(raw_input('Enter integer: '))
获取变量类型 type([4]/6/(3,)) -> <type 'list'/'int'/'tuple'>
判断变量类型 isinstance([4,5],list)  -> True/False
  	if not isinstance(Value_List,list): Value_List=[Value_List]
myFun=lambda x,y:x+y+100  ----myFun(3,40)
  ##相当于erlang:MyFun=fun(X,Y)->X+Y+100 end.  ----MyFun(3,40)
dir() 列出当前运行的模块的一些参数,包括的基本属性,函数,以及变量 (也可以dir(Module)别的看别的模块)
del a 释放/删除一个变量/名称
subprocess.call("mv f1.py f2.py",shell=True)
run_cmd = subprocess.Popen("ls",stdout=subprocess.PIPE,shell=True)
out_str = run_cmd.stdout.read()  ##out_str为str类型,保存着运行ls后的结果
```

## 控制语句

#!/usr/bin/env python

### If 语句:

这些都是False,(目前发现的),其他有内容的都会是True:  "" or '' or 0 or None or False or [] or {} or ()
vs = 20
get = int(raw_input('Enter one integer: '))
if get == vs:
	print 'You win'
elif get < vs:
	print 'Largen it'
else:
	print 'Smallen it'

### while 语句

running = True
while running:
	doing_xxoo
else:
	xxoo_over

### for 语句

for i in range(1,5):
	print i
else: print 'loop over'

### break 与 continue 语句

在 for/while 循环里面可以使用break退出循环, 注意, break后的循环, 不会执行for/while 循环对应的 else: 语句后面的内容
while True:
	s = raw_input('Enter something : ')
	if s == 'quit': break
	if len(s) < 3: continue
	print 'Input is of sufficient length'

### return 与 pass

return 用在函数里面直接返回; pass语句在Python中表示一个空的语句块(返回值为None,目前就个人感觉有点儿相当于return None,如果用在函数最后,因为循环里面有continue)

## 函数

### 函数定义

say() ##这里会出错，提示这个函数没有定义
def say(): print 'hellolo'
say()

### 形式参数, 默认参数, 关键参数

那么你可以通过命名来为这些参数赋值——这被称作 关键参数 ——我们使用名字（关键字）而不是位置（我们前面所一直使用的方法）来给函数指定实参。
def func(a, b=5, c=10)     	func(25, c=24)

### 局部变量, 全局变量

(没有global语句，是不可能为定义在函数外的变量赋值的)
你可以使用定义在函数外的变量的值（假设在函数内没有同名的变量）(但是不能赋值,只能取值)。然而，我并不鼓励你这样做，并且你应该尽量避免这样做，因为这使得程序的读者会不清楚这个变量是在哪里定义的。使用global语句可以清楚地表明变量是在外面的块定义的。

```
def func():
	global x (如果想x后来被赋值必须加上这句,如果仅仅是使用,看后面的解释)
	print 'x is', x
	x = 2 (如果没有事先声明global x, 这里直接赋值是会出错的,(运行错误),因为这个变量没有被定义(感觉像是没有域,因为肯定不是全局也不是局部,但是取值又是全局的)
	print 'Changed local x to', x
x = 50
func()
print 'Value of x is', x
```

### 函数的可变的参数个数

```
def powersum(power, *args):
	print args  	(会发现这里输出的是(4,5,6)是个元组类型)
	total=0
	for i in args:
        total+=pow(i,power)
	return total
由于在args变量前有*前缀，所有多余的函数参数都会作为一个元组(xx,oo)存储在args中.
如果使用的是**前缀，多余的参数则会被认为是一个字典的键/值对.
```

## 模块

两种import方式: import sys
           	from sys import argv
           	from sys import *

### sys.argv, sys.path

运行 python using_sys.py we are 或者是 ./using_sys.py we are
'using_sys.py'或者'./using_sys.py'(后者)是sys.argv[0]、'we'是sys.argv[1]、'are'是sys.argv[2]

### 创建自己模块

#!/usr/bin/python
# Filename: mymodule.py
def sayhi(): print 'Hi, this is my module speaking.'
version = '0.1'
________________________
记住这个模块应该被放置在我们输入它的程序的同一个目录中，或者在sys.path所列目录之一。

#!/usr/bin/python
# Filename: mymodule_demo.py
import mymodule
mymodule.sayhi()
print 'Version', mymodule.version
 

## 数据结构 序列(列表[],元组()和字典{}都是序列)

Python 中有三种内建的数据结构——列表[],元组()和字典{key1 : value1, key2 : value2 }
help(list), help(tuple), help(dict)
列表: len(L),  Ele=L[0],  del L[0],  L.append('oliver')尾部添加,  L.sort()
元组: z=(0,1,2),  x=(),  c=(y,)(一个元素注意特殊),  Ele=z[0],
字典:
d={'a':'A','b':'B','c':'C'}
d['a']='AAAA'   (修改,赋值)
d['d']='DD' 	(增加)
del d['b']  	(删除)
d.items() 返回值为  [('a', 'AAA'), ('c', 'C'), ('d', 'DD')]
for (X,Y) in d.items(): print 'small %s, big %s'%(X,Y)
判断存在性:  if 'Guido' in d:  (这种方法列表[]也可以使用)(相似性)
        	或者d.has_key('Guido')
____________________________________________________________
序列:  下面为序列的一般操作,序列的两个主要特点是索引操作符和切片操作符,可以适用于上面三个数据结构
特别注意在列表赋值的时候,事实上只是引用传递,而用这个切片可以达到重新内存分配

```
z=[1,2,3]
x=z     	('Simple Assignment')
del z[0]	(这之后,x跟z都是[2,3])
zz=[1,2,3]
xx=zz[:]	('Copy by making a full slice')
del zz[0]   (这之后,xx为原来的[1,2,3])
```

## 面向对象

### self: 类的方法与普通的函数只有一个特别的区别——它们必须有一个额外的第一个参数名称，但是在调用这个方法的时候你不为这个参数赋值，Python会提供这个值。这个特别的变量指对象本身，按照惯例它的名称是self。反正只要写python类的方法,都尽量在第一个参数加上self比较严谨些.

### 变量的作用域: 有两种类型的域--——类的变量和对象的变量，它们根据是类还是对象 拥有 这个变量而区分。

class Person:
	count=0  	(整个类的变量)
	def __init__(self,name):
        self.name=name  (任何对象域的变量都要有self.veriable,否则就成了函数的局部变量了)
        Person.count+=1 (注意类的变量使用: 类名.类变量)
	def __del__(self):
    	Person.name-=1

### 继承

class Teacher(Person):
	def __init__(self,name,topic):
        Person.__init__(self,name)
        self.topic=topic

### 类的一些特殊方法

__init__(self,...)    这个方法在新建对象恰好要被返回使用之前被调用。
__del__(self)         恰好在对象要被删除之前调用。
__str__(self)         在我们对对象使用print语句或是使用str()的时候调用。
__lt__(self,other)    当使用 小于 运算符（<）的时候调用。类似地，对于所有的运算符（+，>等等）
__getitem__(self,key) 使用x[key]索引操作符的时候调用。
__len__(self)         对序列对象使用内建的len()函数的时候调用。

## 文件操作

### 文件读写

```
f=file('lala.txt','r'/'w'/'a')  (模式为:读,写,接在后面写,默认是读模式
while True:
	line = f.readline()     	(读取一行的数据)
	if len(line) == 0:      	(来判断是否文件结束,每一行的回车要多加一个字符,算长度为1)
    	break
	print "%d:%s"%(len(line),line), ##','表示不让print自动加回车
s = "xxoo\n\nxx"
f.write(s)   	##这两个是写文件
f.close()
```

### 储存器/序列化 (pickle, cPickle(比pickle快1000倍))

```
使用它你可以在一个文件中储存任何Python对象(List,类对象等等都行),之后你又可以把它完整无缺地取出来,类似于C#的序列化.
import cPickle as p
shoplist = ['apple', 'mango', 'carrot']
f = file('shoplist.data', 'w')
p.dump(shoplist, f) # dump the object to a file
f.close()
del shoplist # remove the shoplist
f = file('shoplist.data')
storedlist = p.load(f)
print storedlist
```
