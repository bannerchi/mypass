##Mypass

###useage

####install <br>
```bash
npm i -g mypass
```

####Generate a password<br>  
```bash
mypass -c
```
<br>
"I want a long one! (max length 32)" <br>

```bash

mypass -c -n 16
```

Create & Save a password<br>

```bash
mypass -s
```

"I want a bookmark!"<br>

```bash
mypass -s -f test
```

List my passwords(will show all default save passwords)<br>

```bash
mypass -l
```

will get your bookmark<br>

```bash
mypass -l -f test
```

Remove all passwords<br>

```bash
mypass -C
```