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
```bash
#I want a bookmark!
mypass -s -f test
```
<br>
4. List my passwords<br>
```bash
#will show all default save passwords
mypass -l
```
<br>
```bash
#will get your bookmark
mypass -l -f test
```
<br>

5. Remove all passwords<br>
```bash
mypass -C
```