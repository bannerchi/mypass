##Mypass

###useage

1. install <br>
```bash
npm i -g mypass
```
2. Generate a password<br>  
```bash
mypass -c
```
<br>
"I want a long one!" <br>
```bash
mypass -c -n 16
```
<br>
 max length 32<br>
3. Create & Save a password<br>
```bash
mypass -s
```
<br>
"I want a bookmark!"<br>
```bash
mypass -s -f test
```
<br>
4. List my passwords<br>
```bash
mypass -l
```
<br>
will show all default save passwords<br>
```bash
mypass -l -f test
```
<br>
 will get your bookmark<br>
5. Remove all passwords<br>
```bash
mypass -C
```