##Mypass

###useage

1. install <br>
```
npm i -g mypass
```
2. Generate a password<br>  
```
mypass -c
```
"I want a long one!" <br>
```
mypqss -c -n 16
```
 max length 32<br>

3. Create & Save a password<br>
```
mypass -s
```
<br>
"I want a bookmark!"<br>
```
mypass -s -f test
```
4. List my passwords<br>
```
mypass -l
```
will show all default save passwords<br>
```
mypass -l -f test
```
 will get your bookmark<br>
5. Remove all passwords<br>
```
mypass -C
```