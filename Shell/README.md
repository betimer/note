# SHELL (bash)

## Hints

1. 转义符\: 注意要紧跟在其后(特殊字符或者回车)

2. 注意重定向的妙用:  find /home -name xxoo 2> /dev/null

3. 管道|:只能处理standard input

4. 双向重定向tee

## ----String and Variable----

1. c=5(中间没有空格);    unset c

2. "ab$c" -> "ab5"  (""中间可以允许${Veriable} $(Command) `Command` 这样的扩展)  ("sys=$(uanme -r)"="sys=`uname -r`")

'ab$c' -> 'ab$c'

3. 关于export后的变量c: c会变成环境变量,但是仅仅是当前终端的子进程;新开的终端跟已开的终端都不会收到变量c

4. 关于数组: declare -a arr; arr=10; arr[1]=20; arr[2]=30

echo $arr等价于echo ${arr[0]};  但是echo $arr[1]结果为10[1]

5.   echo $SHELL      echo *.jpg       通配符和变量都扩展

echo "$SHELL"    echo "*.jpg"     通配符不扩展,允许变量扩展

echo '$SHELL'    echo '*.jpg'     通配符和变量都不扩展

## ----Command----

1. umask: 指该默认值需要减掉的权限(rwx)(421)

系统新建文件默认(-rw-rw-rw-); 系统新建文件夹默认(drwxrwxrwx). 再用这个默认权限减去上面设置的umask的值。

2. ln:  ln source target(hard link); ln -s source target

硬连接: 完全本身文件的影像,不创建新文件(同样的inode),安全,只能文件不能文件夹.

符号连接: 等价于快捷方式,创建新文件(新的inode),文件文件夹都行.

3. 查找文件高效方法: locate try.py | grep 'home/oliver'

4. find ./ -name xxoo.erl (递归的)

5. find ./ -exec grep "xxoo" {} \;  (在所有子文件中,搜索包含"xxoo"的)

6. ps –u evyzbcg

## ----Script----

1. 算术运算: c=$(($a*$b))

2. 关于Script的执行: python script或者./script 是在子进程中执行, 也就是script里面的一些变量不会被执行完看到.

source script或者. script 是在父进程直接执行的,script中用到的所有变量都是父进程的.(也是为什么 source .bashrc)

3. test:常用的判断文件(-efdrwx), 本身不会返回任何值,但通过回调值或者$?可以看到,或者如下逻辑: test -e xxoo && echo 'Y' || echo 'N'

也可以用来一般判断,test $a == $b相当于[ $a == $b ](注意这中间的空格)

4. if [ XXOO ]; then

elif [ OOXX ]; then

else

fi

5. case ... esac

6. function fun() { ... }

7. while [ Condition ]

do

...

done

8. for

9. select var in "A" "B" "C" ; do    到时候让你选1 2 3

break

done

echo "You choose $var"

## -----------------Linux System Basic-------------------

禁用触摸板: sudo modprobe (-r) psmouse

修改启动顺序 sudo gedit /boot/grub/grub.cfg

Install Software

%% Fedora yum

yum install gcc

%%压缩与解压缩

.tar(注,tar是打包,不是压缩!)

    解包:tar -xvf FileName.tar

    打包:tar -cvf FileName.tar DirName

.gz

    解压1:gunzip FileName.gz

    解压2:gzip -d FileName.gz

    压缩: gzip FileName

.tar.gz

    解压:tar -zxvf FileName.tar.gz

    压缩:tar -zcvf FileName.tar.gz DirName

%% install xxx.tar.gz file

tar -zxvf 文件名(xx.gz/xx.tar.gz)  ----这是解压

怎么安装看README或者INSTALL, 通常都是:

(A)cd xxx    (B)./configure    (C)make    (D)make install

%%After install a new Ubuntu/Fedora:

1. change oliver to administrater (so oliver can use sudo)

2. language support:   1.add chinese simple    2.type method: 中文输入法(Ibus)

3. emacs

网上下个包color-theme.el,

(setq-default cursor-type 'bar) ;;change 'O' to 'l'

;;color-theme

(add-to-list 'load-path "~/Utility/")

(require 'color-theme)

(color-theme-clarity) ;;or (color-theme-tty-dark)

4. erlang:

4.1 wxWidgets (下载wxAll/wxX11)(X11一般linux已经安装,gnome之类的会用到)

> ./configure --with-x11 --with-opengl (--enable-debug) --enable-unicode (--disable-shared)

> make clean; make -> make install -> ldconfig

> cd contrib/src/stc/

> make -> make install
