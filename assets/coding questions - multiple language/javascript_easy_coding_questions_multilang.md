# Coding Questions – Easy (JavaScript, Python, Java, C# and C++)

**How to use this file:** Start here if you are at the easy stage. Try each problem before reading its solution. Every question keeps its original notebook section/number in the source label, so you can trace it back to the master notes.

**Classification note:** Difficulty is an instructional estimate based on the core concept and algorithmic reasoning required. A question can feel easier or harder depending on your JavaScript experience. Repeated or similar questions from different notebook sections are intentionally retained; none are silently removed.

**Source:** `javascript_final_complete_notes_no_react.md`. React questions are excluded.


**Languages included:** JavaScript (original solution), Python, Java, C# (.NET), and C++. Each question includes solutions in all five languages.


## Notes for running the other language solutions

- **Python:** Examples are directly runnable with Python 3.
- **Java:** Examples are method snippets intended inside a class such as `Main`. Add `import java.util.*;`, `import java.util.stream.*;`, and `import java.util.function.*;` where needed. The examples target Java 11 or later.
- **C# (.NET):** Examples are methods intended inside a class. They target C# 10 / .NET 6 or later. Add `using System;`, `using System.Linq;`, `using System.Collections.Generic;`, and `using System.Text;` where needed.
- **C++:** Examples target C++17. Function snippets assume `#include <bits/stdc++.h>` and `using namespace std;`. Put function declarations at global scope and executable statements inside `main()`.
- **JSON question:** Java uses Jackson (`ObjectMapper`), while C++ uses the external `nlohmann/json` library. C# uses the built-in `System.Text.Json` library.

The existing **Expected Output** shows the logical result of the question. Exact display formatting for arrays, maps, floating-point values, and objects can differ between languages.

---

## Question count: 113

## First batch (Q1–Q100)

### 1. Swap two numbers using a temporary variable

**Original section:** First batch (Q1–Q100).

**Question:** Write a JavaScript program to swap the values of two numbers using a temporary variable.

**Answer:**
```js
function swap(a, b) {
  const temp = a;
  a = b;
  b = temp;

  console.log("After swapping:", a, b);
}

swap(10, 20); // 20 10
```

**Other Language Solutions:**

**Python:**
```python
def swap(a, b):
    return b, a

print(swap(10, 20))  # (20, 10)
```

**Java:**
```java
static int[] swap(int a, int b) {
    int temp = a; a = b; b = temp;
    return new int[]{a, b};
}
```

**C# (.NET):**
```csharp
static int[] Swap(int a, int b) {
    int temp = a; a = b; b = temp;
    return new[] { a, b };
}
```

**C++:**
```cpp
pair<int,int> swapValues(int a, int b) {
    int temp = a; a = b; b = temp;
    return {a, b};
}
```


**Expected Output:**
```text
After swapping: 20 10
```

**Explanation (Simple English):**
A temporary variable keeps the first value safe. The first variable receives the second value, then the second receives the saved value.

**Explanation (Simple Hindi):**
Pehle temporary variable mein pehli value save hoti hai. Phir pehle variable mein doosri value aur doosre variable mein saved pehli value aa jaati hai.

**How to solve this type of problem:**
For swapping, save one value first, perform the assignment, and then restore the saved value into the other variable.

---

### 2. Convert kilometers to miles

**Original section:** First batch (Q1–Q100).

**Question:** Convert a distance from kilometers to miles.  
**Formula:** 1 kilometer = 0.621371 miles.

**Answer:**
```js
function kmToMiles(km) {
  const miles = km * 0.621371;
  return miles;
}

console.log(kmToMiles(10)); // 6.21371
```

**Other Language Solutions:**

**Python:**
```python
def km_to_miles(km):
    return km * 0.621371

print(km_to_miles(10))  # 6.21371
```

**Java:**
```java
static double kmToMiles(double km) { return km * 0.621371; }
```

**C# (.NET):**
```csharp
static double KmToMiles(double km) => km * 0.621371;
```

**C++:**
```cpp
double kmToMiles(double km) { return km * 0.621371; }
```


**Expected Output:**
```text
6.21371
```

**Explanation (Simple English):**
The function multiplies kilometers by 0.621371. This applies the given conversion formula and returns the distance in miles.

**Explanation (Simple Hindi):**
Function kilometer ko 0.621371 se multiply karta hai. Ye conversion formula hai; isse distance miles mein milta hai.

**How to solve this type of problem:**
For unit conversion, identify the formula, take the input value, substitute it into the formula, and return the result.

---

### 3. Convert Celsius to Fahrenheit

**Original section:** First batch (Q1–Q100).

**Question:** Convert a temperature from Celsius to Fahrenheit.  
**Formula:** Fahrenheit = (Celsius × 9/5) + 32.

**Answer:**
```js
function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

console.log(celsiusToFahrenheit(37)); // 98.6
```

**Other Language Solutions:**

**Python:**
```python
def celsius_to_fahrenheit(c):
    return c * 9 / 5 + 32

print(celsius_to_fahrenheit(37))  # 98.6
```

**Java:**
```java
static double celsiusToFahrenheit(double c) { return c * 9.0 / 5 + 32; }
```

**C# (.NET):**
```csharp
static double CelsiusToFahrenheit(double c) => c * 9.0 / 5 + 32;
```

**C++:**
```cpp
double celsiusToFahrenheit(double c) { return c * 9.0 / 5 + 32; }
```


**Expected Output:**
```text
98.6
```

**Explanation (Simple English):**
The Celsius value is multiplied by 9/5 and then 32 is added. The result is the equivalent temperature in Fahrenheit.

**Explanation (Simple Hindi):**
Celsius value ko pehle 9/5 se multiply karte hain aur phir 32 add karte hain. Jo value milti hai, woh Fahrenheit temperature hai.

**How to solve this type of problem:**
For formula questions, write the formula first, identify the input variable, apply the formula, and test it with a known example.

---

### 4. Check whether a number is positive, negative, or zero

**Original section:** First batch (Q1–Q100).

**Question:** Check whether a given number is positive, negative, or zero.

**Answer:**
```js
function checkNumber(number) {
  if (number > 0) {
    return "Positive";
  } else if (number < 0) {
    return "Negative";
  } else {
    return "Zero";
  }
}

console.log(checkNumber(-5)); // Negative
```

**Other Language Solutions:**

**Python:**
```python
def check_number(n):
    if n > 0: return "Positive"
    if n < 0: return "Negative"
    return "Zero"
```

**Java:**
```java
static String checkNumber(int n) {
    if (n > 0) return "Positive";
    if (n < 0) return "Negative";
    return "Zero";
}
```

**C# (.NET):**
```csharp
static string CheckNumber(int n) => n > 0 ? "Positive" : n < 0 ? "Negative" : "Zero";
```

**C++:**
```cpp
string checkNumber(int n) { if (n > 0) return "Positive"; if (n < 0) return "Negative"; return "Zero"; }
```


**Expected Output:**
```text
Negative
```

**Explanation (Simple English):**
The conditions compare the number with zero. A value above zero is positive, below zero is negative, and the remaining case is zero.

**Explanation (Simple Hindi):**
Conditions number ko zero se compare karti hain. Zero se bada positive, zero se chhota negative, aur baaki case zero hota hai.

**How to solve this type of problem:**
For classification questions, list the possible cases, check the most specific conditions first, and keep a final else for the remaining case.

---

### 6. Find the largest among three numbers

**Original section:** First batch (Q1–Q100).

**Question:** Find the largest number among three given numbers.

**Answer:**
```js
function findLargest(a, b, c) {
  if (a >= b && a >= c) return a;
  if (b >= a && b >= c) return b;
  return c;
}

console.log(findLargest(10, 20, 30)); // 30
```

**Other Language Solutions:**

**Python:**
```python
def largest_of_three(a, b, c):
    return max(a, b, c)
```

**Java:**
```java
static int largestOfThree(int a, int b, int c) { return Math.max(a, Math.max(b, c)); }
```

**C# (.NET):**
```csharp
static int LargestOfThree(int a, int b, int c) => Math.Max(a, Math.Max(b, c));
```

**C++:**
```cpp
int largestOfThree(int a, int b, int c) { return max(a, max(b, c)); }
```


**Expected Output:**
```text
30
```

**Explanation (Simple English):**
The solution keeps a current best value and compares each new value with it. Whenever a bigger or smaller value is found, the stored answer is updated.

**Explanation (Simple Hindi):**
Code ek current best value rakhta hai aur har naye number se compare karta hai. Bada ya chhota number milne par answer update ho jaata hai.

**How to solve this type of problem:**
For minimum/maximum problems, initialize the answer with the first array value, scan the remaining values, and update it whenever a better value appears.

---

### 7. Find the factorial of a number using a loop

**Original section:** First batch (Q1–Q100).

**Question:** Calculate the factorial of a number using a loop.

**Answer:**
```js
function factorial(number) {
  if (!Number.isInteger(number) || number < 0) {
    return "Enter a non-negative integer";
  }

  let result = 1;

  for (let i = 2; i <= number; i++) {
    result *= i;
  }

  return result;
}

console.log(factorial(5)); // 120
```

**Other Language Solutions:**

**Python:**
```python
def factorial(n):
    if n < 0: raise ValueError("n must be non-negative")
    result = 1
    for i in range(2, n + 1): result *= i
    return result
```

**Java:**
```java
static long factorial(int n) {
    if (n < 0) throw new IllegalArgumentException("n must be non-negative");
    long result = 1; for (int i = 2; i <= n; i++) result *= i; return result;
}
```

**C# (.NET):**
```csharp
static long Factorial(int n) {
    if (n < 0) throw new ArgumentOutOfRangeException(nameof(n));
    long result = 1; for (int i = 2; i <= n; i++) result *= i; return result;
}
```

**C++:**
```cpp
long long factorial(int n) { if (n < 0) throw invalid_argument("negative n"); long long r = 1; for (int i=2;i<=n;i++) r*=i; return r; }
```


**Expected Output:**
```text
120
```

**Explanation (Simple English):**
Factorial means multiplying all whole numbers from the given number down to 1. The loop or recursive calls keep multiplying until the base case is reached.

**Explanation (Simple Hindi):**
Factorial ka matlab hai diye gaye number se 1 tak sabhi numbers ko multiply karna. Loop ya recursion har step par multiplication karta hai, aur base case par rukta hai.

**How to solve this type of problem:**
For factorial, handle invalid/negative input, remember that 0! and 1! equal 1, then multiply the numbers from 2 through n or use a recursive base case.

---

### 9. Print the multiplication table of a given number

**Original section:** First batch (Q1–Q100).

**Question:** Print the multiplication table of any given number from 1 to 10.

**Answer:**
```js
function printTable(number) {
  for (let i = 1; i <= 10; i++) {
    console.log(`${number} x ${i} = ${number * i}`);
  }
}

printTable(5);
```

**Other Language Solutions:**

**Python:**
```python
def print_table(n):
    for i in range(1, 11): print(f"{n} x {i} = {n*i}")
```

**Java:**
```java
static void printTable(int n) { for (int i=1; i<=10; i++) System.out.println(n + " x " + i + " = " + (n*i)); }
```

**C# (.NET):**
```csharp
static void PrintTable(int n) { for (int i=1; i<=10; i++) Console.WriteLine($"{n} x {i} = {n*i}"); }
```

**C++:**
```cpp
void printTable(int n) { for (int i=1;i<=10;i++) cout << n << " x " << i << " = " << n*i << '\n'; }
```


**Expected Output:**
```text
5 x 1 = 5
5 x 2 = 10
5 x 3 = 15
5 x 4 = 20
5 x 5 = 25
5 x 6 = 30
5 x 7 = 35
5 x 8 = 40
5 x 9 = 45
5 x 10 = 50
```

**Explanation (Simple English):**
The loop runs from 1 to 10. On every iteration it multiplies the input number by the current counter and prints one line.

**Explanation (Simple Hindi):**
Loop 1 se 10 tak chalta hai. Har round mein input number ko current counter se multiply karke ek line print hoti hai.

**How to solve this type of problem:**
For a multiplication table, use a counter loop, multiply the fixed number by the counter, and stop at the requested limit.

---

### 10. Create a simple calculator using switch

**Original section:** First batch (Q1–Q100).

**Question:** Create a calculator that performs addition, subtraction, multiplication, or division based on an operator.

**Answer:**
```js
function calculator(a, b, operator) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? "Cannot divide by zero" : a / b;
    default:
      return "Invalid operator";
  }
}

console.log(calculator(10, 5, "+")); // 15
console.log(calculator(10, 5, "*")); // 50
```

**Other Language Solutions:**

**Python:**
```python
def calculate(a, b, op):
    if op == "+": return a + b
    if op == "-": return a - b
    if op == "*": return a * b
    if op == "/": return "Cannot divide by zero" if b == 0 else a / b
    return "Invalid operator"
```

**Java:**
```java
static String calculate(double a, double b, String op) {
    switch (op) {
        case "+": return String.valueOf(a+b); case "-": return String.valueOf(a-b);
        case "*": return String.valueOf(a*b); case "/": return b==0 ? "Cannot divide by zero" : String.valueOf(a/b);
        default: return "Invalid operator";
    }
}
```

**C# (.NET):**
```csharp
static string Calculate(double a, double b, string op) => op switch {
    "+" => (a+b).ToString(), "-" => (a-b).ToString(), "*" => (a*b).ToString(),
    "/" => b == 0 ? "Cannot divide by zero" : (a/b).ToString(), _ => "Invalid operator" };
```

**C++:**
```cpp
string calculate(double a, double b, char op) { switch(op) { case '+': return to_string(a+b); case '-': return to_string(a-b); case '*': return to_string(a*b); case '/': return b==0 ? "Cannot divide by zero" : to_string(a/b); default: return "Invalid operator"; } }
```


**Expected Output:**
```text
15
50
```

**Explanation (Simple English):**
The switch statement checks the operator and runs the matching arithmetic operation. The default branch handles an unsupported operator.

**Explanation (Simple Hindi):**
Switch operator ko check karta hai aur uske hisaab se addition, subtraction, multiplication ya division karta hai. Default branch galat operator ko handle karti hai.

**How to solve this type of problem:**
For calculator questions, decide the supported operators, add one switch case per operator, handle division by zero, and include a default case.

---

### 11. Check whether three numbers have the same last digit

**Original section:** First batch (Q1–Q100).

**Question:** Check whether three numbers have the same last digit.

**Answer:**
```js
function haveSameLastDigit(a, b, c) {
  const lastA = Math.abs(a) % 10;
  const lastB = Math.abs(b) % 10;
  const lastC = Math.abs(c) % 10;

  return lastA === lastB && lastB === lastC;
}

console.log(haveSameLastDigit(123, 43, 73)); // true
```

**Other Language Solutions:**

**Python:**
```python
def same_last_digit(a, b, c):
    return abs(a) % 10 == abs(b) % 10 == abs(c) % 10
```

**Java:**
```java
static boolean sameLastDigit(int a, int b, int c) { return Math.abs(a)%10 == Math.abs(b)%10 && Math.abs(b)%10 == Math.abs(c)%10; }
```

**C# (.NET):**
```csharp
static bool SameLastDigit(int a, int b, int c) => Math.Abs(a)%10 == Math.Abs(b)%10 && Math.Abs(b)%10 == Math.Abs(c)%10;
```

**C++:**
```cpp
bool sameLastDigit(int a,int b,int c){ return abs(a)%10==abs(b)%10 && abs(b)%10==abs(c)%10; }
```


**Expected Output:**
```text
true
```

**Explanation (Simple English):**
The remainder after division by 10 gives the last digit. The solution compares the three remainders to see whether they are equal.

**Explanation (Simple Hindi):**
Kisi number ko 10 se divide karne par jo remainder bachta hai, wahi last digit hota hai. Code teeno remainders compare karta hai.

**How to solve this type of problem:**
For last-digit problems, use absolute value if negative numbers are possible, take % 10, and compare the extracted digits.

---

### 19. Replace characters in a string

**Original section:** First batch (Q1–Q100).

**Question:** Replace a specified character or word in a string with another value.

**Answer:**
```js
const text = "my red bag is red";
const updatedText = text.replaceAll("red", "blue");

console.log(updatedText); // my blue bag is blue
```

**Other Language Solutions:**

**Python:**
```python
def replace_one(s, old, new): return s.replace(old,new,1)
```

**Java:**
```java
static String replaceOne(String s,String oldValue,String newValue){int i=s.indexOf(oldValue);return i<0?s:s.substring(0,i)+newValue+s.substring(i+oldValue.length());}
```

**C# (.NET):**
```csharp
static string ReplaceOne(string s,string oldValue,string newValue){int i=s.IndexOf(oldValue);return i<0?s:s.Remove(i,oldValue.Length).Insert(i,newValue);}
```

**C++:**
```cpp
string replaceOne(string s,const string&o,const string&n){size_t p=s.find(o);if(p!=string::npos)s.replace(p,o.size(),n);return s;}
```


**Expected Output:**
```text
my blue bag is blue
blue rose and blue bag
```

**Explanation (Simple English):**
replace() changes the first matching part by default, while replaceAll() or a global regular expression changes every occurrence.

**Explanation (Simple Hindi):**
replace() default mein pehla matching part change karta hai, jabki replaceAll() ya global regex har occurrence change karta hai.

**How to solve this type of problem:**
For replacement, decide whether one or all matches should change, consider case sensitivity, and choose replace(), replaceAll(), or a regex.

---

### 20. Reverse a string using a loop

**Original section:** First batch (Q1–Q100).

**Question:** Reverse a string without using the built-in `reverse()` method.

**Answer:**
```js
function reverseString(str) {
  let reversed = "";

  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }

  return reversed;
}

console.log(reverseString("hello")); // olleh
```

**Other Language Solutions:**

**Python:**
```python
def reverse_string(s):
    out = ""
    for i in range(len(s)-1, -1, -1): out += s[i]
    return out
```

**Java:**
```java
static String reverseString(String s) { StringBuilder r=new StringBuilder(); for(int i=s.length()-1;i>=0;i--) r.append(s.charAt(i)); return r.toString(); }
```

**C# (.NET):**
```csharp
static string ReverseString(string s) { char[] r=new char[s.Length]; for(int i=0;i<s.Length;i++) r[i]=s[s.Length-1-i]; return new string(r); }
```

**C++:**
```cpp
string reverseString(string s) { string r; for(int i=(int)s.size()-1;i>=0;i--) r+=s[i]; return r; }
```


**Expected Output:**
```text
olleh
```

**Explanation (Simple English):**
The solution reads the value from the end towards the beginning and builds a new reversed result. This avoids changing the original array/string when a new result is required.

**Explanation (Simple Hindi):**
Code value ko end se start ki taraf read karke naya reversed result banata hai. Naya array/string banane se original value safe rehti hai.

**How to solve this type of problem:**
For reversing, identify whether you must mutate the original or return a new value, then traverse backward or use split/reverse/join for strings.

---

### 21. Convert the first letter of a string to uppercase

**Original section:** First batch (Q1–Q100).

**Question:** Capitalize the first character of a string and keep the remaining characters unchanged.

**Answer:**
```js
function capitalizeFirst(str) {
  if (str.length === 0) return str;

  return str.charAt(0).toUpperCase() + str.slice(1);
}

console.log(capitalizeFirst("green")); // Green
```

**Other Language Solutions:**

**Python:**
```python
def capitalize_first(s):
    return s[:1].upper() + s[1:]
```

**Java:**
```java
static String capitalizeFirst(String s) { return s.isEmpty() ? s : s.substring(0,1).toUpperCase()+s.substring(1); }
```

**C# (.NET):**
```csharp
static string CapitalizeFirst(string s) => string.IsNullOrEmpty(s) ? s : char.ToUpper(s[0]) + s.Substring(1);
```

**C++:**
```cpp
string capitalizeFirst(string s) { if(s.empty()) return s; s[0]=toupper((unsigned char)s[0]); return s; }
```


**Expected Output:**
```text
Green
```

**Explanation (Simple English):**
The code changes letter case using uppercase/lowercase methods. For mixed-case tasks, it checks each character and switches it to the opposite case.

**Explanation (Simple Hindi):**
Code uppercase/lowercase methods se letters ka case badalta hai. Mixed-case task mein har character check karke uska opposite case banaya jaata hai.

**How to solve this type of problem:**
For case-conversion problems, choose whether to change the whole string, only the first letter, or every word; then use the matching string methods.

---

### 22. Count the occurrences of a character in a string

**Original section:** First batch (Q1–Q100).

**Question:** Count how many times a given character appears in a string.

**Answer:**
```js
function countCharacter(str, target) {
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === target) {
      count++;
    }
  }

  return count;
}

console.log(countCharacter("javascript", "a")); // 2
```

**Other Language Solutions:**

**Python:**
```python
def count_char(s, target):
    return sum(ch == target for ch in s)
```

**Java:**
```java
static int countChar(String s, char target) { int count=0; for(char ch:s.toCharArray()) if(ch==target) count++; return count; }
```

**C# (.NET):**
```csharp
static int CountChar(string s, char target) => s.Count(ch => ch == target);
```

**C++:**
```cpp
int countChar(const string& s, char target) { return count(s.begin(), s.end(), target); }
```


**Expected Output:**
```text
2
```

**Explanation (Simple English):**
The code scans each character and increases a counter whenever it matches the target character. The final counter is the total number of occurrences.

**Explanation (Simple Hindi):**
Code har character scan karta hai aur target character match hone par counter badhata hai. End mein counter total occurrences batata hai.

**How to solve this type of problem:**
For counting a character, start count at zero, scan each character, increase the count on a match, and return the final count.

---

### 23. Count the number of vowels in a string using RegExp

**Original section:** First batch (Q1–Q100).

**Question:** Count all vowels (`a`, `e`, `i`, `o`, `u`) in a string, regardless of letter case.

**Answer:**
```js
function countVowels(str) {
  const matches = str.match(/[aeiou]/gi);
  return matches ? matches.length : 0;
}

console.log(countVowels("JavaScript")); // 3
```

**Other Language Solutions:**

**Python:**
```python
def count_vowels(s):
    return sum(ch.lower() in "aeiou" for ch in s)

# To get the vowels themselves: [c for c in s if c.lower() in "aeiou"]
```

**Java:**
```java
static int countVowels(String s) { int n=0; for(char c:s.toLowerCase().toCharArray()) if("aeiou".indexOf(c)>=0) n++; return n; }
```

**C# (.NET):**
```csharp
static int CountVowels(string s) => s.Count(c => "aeiouAEIOU".Contains(c));
```

**C++:**
```cpp
int countVowels(const string& s) { int n=0; for(char c:s) if(string("aeiouAEIOU").find(c)!=string::npos) n++; return n; }
```


**Expected Output:**
```text
3
```

**Explanation (Simple English):**
The pattern [aeiou] matches vowels. The global and case-insensitive flags find every vowel in both lowercase and uppercase; the solution counts the matches.

**Explanation (Simple Hindi):**
[aeiou] pattern vowels ko match karta hai. g aur i flags se lowercase aur uppercase dono mein saare vowels milte hain; phir unki count nikalti hai.

**How to solve this type of problem:**
For vowel questions, decide whether case matters, scan with a loop or regular expression, and handle the case where no match is found.

---

### 24. Check whether a string starts and ends with specific characters

**Original section:** First batch (Q1–Q100).

**Question:** Check whether a string starts with a given character and ends with another given character.

**Answer:**
```js
function checkStartAndEnd(str, startChar, endChar) {
  return str.startsWith(startChar) && str.endsWith(endChar);
}

console.log(checkStartAndEnd("hello", "h", "o")); // true
```

**Other Language Solutions:**

**Python:**
```python
def starts_and_ends(s, start, end):
    return s.startswith(start) and s.endswith(end)
```

**Java:**
```java
static boolean startsAndEnds(String s, String start, String end) { return s.startsWith(start) && s.endsWith(end); }
```

**C# (.NET):**
```csharp
static bool StartsAndEnds(string s, string start, string end) => s.StartsWith(start) && s.EndsWith(end);
```

**C++:**
```cpp
bool startsAndEnds(const string& s,const string& a,const string& b){ return s.rfind(a,0)==0 && s.size()>=b.size() && s.compare(s.size()-b.size(),b.size(),b)==0; }
```


**Expected Output:**
```text
true
```

**Explanation (Simple English):**
startsWith() checks the beginning of the string and endsWith() checks its ending. Both conditions must be true when both are required.

**Explanation (Simple Hindi):**
startsWith() string ki shuruaat check karta hai aur endsWith() ending check karta hai. Dono required hon toh dono true hone chahiye.

**How to solve this type of problem:**
For start/end checks, use the exact prefix and suffix and remember that string comparisons are case-sensitive by default.

---

### 25. Check whether a string contains a substring

**Original section:** First batch (Q1–Q100).

**Question:** Check whether one string contains another string.

**Answer:**
```js
function containsSubstring(str, substring) {
  return str.includes(substring);
}

console.log(containsSubstring("Hello Geeks", "Geeks")); // true
console.log(containsSubstring("Hello Geeks", "World")); // false
```

**Other Language Solutions:**

**Python:**
```python
def contains_text(s, part):
    return part in s
```

**Java:**
```java
static boolean containsText(String s, String part) { return s.contains(part); }
```

**C# (.NET):**
```csharp
static bool ContainsText(string s, string part) => s.Contains(part);
```

**C++:**
```cpp
bool containsText(const string& s,const string& part){ return s.find(part)!=string::npos; }
```


**Expected Output:**
```text
true
false
```

**Explanation (Simple English):**
The solution checks whether the target text exists inside the main string. Methods such as includes() or indexOf() answer this directly.

**Explanation (Simple Hindi):**
Code check karta hai ki target text main string ke andar present hai ya nahi. includes() ya indexOf() se ye check ho jaata hai.

**How to solve this type of problem:**
For substring searches, identify the exact target, choose whether case matters, and use includes()/indexOf() or a loop if built-ins are not allowed.

---

### 28. Find the maximum number in an array

**Original section:** First batch (Q1–Q100).

**Question:** Find the largest value in an array.

**Answer:**
```js
function findMax(arr) {
  if (arr.length === 0) {
    throw new Error("Array must not be empty");
  }

  let max = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }

  return max;
}

console.log(findMax([5, 8, 2, 10, 3])); // 10
```

**Other Language Solutions:**

**Python:**
```python
def find_max(arr):
    if not arr: raise ValueError("array must not be empty")
    return max(arr)
```

**Java:**
```java
static int findMax(int[] a) { if(a.length==0) throw new IllegalArgumentException(); int m=a[0]; for(int x:a)m=Math.max(m,x); return m; }
```

**C# (.NET):**
```csharp
static int FindMax(int[] a) { if(a.Length==0) throw new ArgumentException(); return a.Max(); }
```

**C++:**
```cpp
int findMax(const vector<int>& a){ if(a.empty()) throw invalid_argument("empty"); return *max_element(a.begin(),a.end()); }
```


**Expected Output:**
```text
10
```

**Explanation (Simple English):**
The solution keeps a current best value and compares each new value with it. Whenever a bigger or smaller value is found, the stored answer is updated.

**Explanation (Simple Hindi):**
Code ek current best value rakhta hai aur har naye number se compare karta hai. Bada ya chhota number milne par answer update ho jaata hai.

**How to solve this type of problem:**
For minimum/maximum problems, initialize the answer with the first array value, scan the remaining values, and update it whenever a better value appears.

---

### 32. Separate odd and even numbers in an array

**Original section:** First batch (Q1–Q100).

**Question:** Separate the even numbers and odd numbers into two arrays.

**Answer:**
```js
function separateOddEven(arr) {
  const even = arr.filter(number => number % 2 === 0);
  const odd = arr.filter(number => number % 2 !== 0);

  return { even, odd };
}

console.log(separateOddEven([1, 2, 3, 8, 9, 12, 16]));
// { even: [2, 8, 12, 16], odd: [1, 3, 9] }
```

**Other Language Solutions:**

**Python:**
```python
def split_odd_even(arr):
    return ([x for x in arr if x % 2 == 0], [x for x in arr if x % 2 != 0])
```

**Java:**
```java
static List<List<Integer>> splitOddEven(int[] a) { List<Integer> even=new ArrayList<>(), odd=new ArrayList<>(); for(int x:a)(x%2==0?even:odd).add(x); return Arrays.asList(even,odd); }
```

**C# (.NET):**
```csharp
static (List<int> even, List<int> odd) SplitOddEven(int[] a) { var e=new List<int>(); var o=new List<int>(); foreach(int x in a) (x%2==0?e:o).Add(x); return (e,o); }
```

**C++:**
```cpp
pair<vector<int>,vector<int>> splitOddEven(const vector<int>& a){ vector<int> e,o; for(int x:a) (x%2==0?e:o).push_back(x); return {e,o}; }
```


**Expected Output:**
```text
{"even":[2,8,12,16],"odd":[1,3,9]}
```

**Explanation (Simple English):**
The remainder operator (%) tells whether a number is divisible by 2. A remainder of zero means even; otherwise it is odd.

**Explanation (Simple Hindi):**
% operator batata hai ki number 2 se poori tarah divide hota hai ya nahi. Remainder zero ho toh even, warna odd hota hai.

**How to solve this type of problem:**
For even/odd tasks, use number % 2, then either count, filter, or place each number into the required result group.

---

### 33. Find the sum of all elements in an array

**Original section:** First batch (Q1–Q100).

**Question:** Calculate the sum of all numbers in an array using `reduce()`.

**Answer:**
```js
function sumArray(arr) {
  return arr.reduce((sum, number) => sum + number, 0);
}

console.log(sumArray([7, 9, 6, 4])); // 26
```

**Other Language Solutions:**

**Python:**
```python
def sum_array(arr):
    return sum(arr)
```

**Java:**
```java
static int sumArray(int[] a) { int sum=0; for(int x:a) sum+=x; return sum; }
```

**C# (.NET):**
```csharp
static int SumArray(int[] a) => a.Sum();
```

**C++:**
```cpp
int sumArray(const vector<int>& a){ return accumulate(a.begin(),a.end(),0); }
```


**Expected Output:**
```text
26
```

**Explanation (Simple English):**
The code starts a total at zero and adds each array value to it. At the end, the accumulated total is returned.

**Explanation (Simple Hindi):**
Code total ko zero se start karta hai aur har array value ko usmein add karta hai. End mein final sum return hota hai.

**How to solve this type of problem:**
For sum problems, initialize total = 0, visit every number, add it to total, and return total after the loop.

---

### 34. Find vowels in a string

**Original section:** First batch (Q1–Q100).

**Question:** Check whether a string contains vowels and count the vowels present in it.

**Answer:**
```js
function getVowels(str) {
  return str.match(/[aeiou]/gi) || [];
}

const vowels = getVowels("JavaScript");

console.log(vowels); // ["a", "a", "i"]
console.log(vowels.length); // 3
```

**Other Language Solutions:**

**Python:**
```python
def find_vowels(s): return [c for c in s if c.lower() in "aeiou"]
```

**Java:**
```java
static List<Character> findVowels(String s){List<Character>r=new ArrayList<>();for(char c:s.toCharArray())if("aeiou".indexOf(Character.toLowerCase(c))>=0)r.add(c);return r;}
```

**C# (.NET):**
```csharp
static char[] FindVowels(string s)=>s.Where(c=>"aeiouAEIOU".Contains(c)).ToArray();
```

**C++:**
```cpp
vector<char> findVowels(const string&s){vector<char>r;for(char c:s)if(string("aeiouAEIOU").find(c)!=string::npos)r.push_back(c);return r;}
```


**Expected Output:**
```text
["a","a","i"]
3
```

**Explanation (Simple English):**
The pattern [aeiou] matches vowels. The global and case-insensitive flags find every vowel in both lowercase and uppercase; the solution counts the matches.

**Explanation (Simple Hindi):**
[aeiou] pattern vowels ko match karta hai. g aur i flags se lowercase aur uppercase dono mein saare vowels milte hain; phir unki count nikalti hai.

**How to solve this type of problem:**
For vowel questions, decide whether case matters, scan with a loop or regular expression, and handle the case where no match is found.

---

### 35. Merge two arrays

**Original section:** First batch (Q1–Q100).

**Question:** Combine two arrays into one array.

**Answer:**
```js
const arr1 = [100, "a", "b"];
const arr2 = ["45", "90"];

const mergedUsingConcat = arr1.concat(arr2);
console.log(mergedUsingConcat); // [100, "a", "b", "45", "90"]

const mergedUsingSpread = [...arr1, ...arr2];
console.log(mergedUsingSpread); // [100, "a", "b", "45", "90"]
```

**Other Language Solutions:**

**Python:**
```python
def merge_arrays(a, b):
    return a + b
```

**Java:**
```java
static int[] mergeArrays(int[] a,int[] b){ int[] r=Arrays.copyOf(a,a.length+b.length); System.arraycopy(b,0,r,a.length,b.length); return r; }
```

**C# (.NET):**
```csharp
static int[] MergeArrays(int[] a,int[] b) => a.Concat(b).ToArray();
```

**C++:**
```cpp
vector<int> mergeArrays(const vector<int>& a,const vector<int>& b){ vector<int> r=a; r.insert(r.end(),b.begin(),b.end()); return r; }
```


**Expected Output:**
```text
[100,"a","b","45","90"]
[100,"a","b","45","90"]
```

**Explanation (Simple English):**
The spread operator or concat() places the values of the second array after the values of the first array. The original arrays are not changed.

**Explanation (Simple Hindi):**
Spread operator ya concat() doosre array ke elements ko pehle array ke baad rakh deta hai. Original arrays change nahi hote.

**How to solve this type of problem:**
For merging, choose whether order should simply be appended or whether the values must be sorted; use spread/concat for simple joining.

---

### 40. Sort an array in ascending order using a loop

**Original section:** First batch (Q1–Q100).

**Question:** Sort an array from smallest to largest using the bubble sort technique.

**Answer:**
```js
function sortAscending(arr) {
  const result = [...arr];

  for (let i = 0; i < result.length - 1; i++) {
    for (let j = 0; j < result.length - 1 - i; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }

  return result;
}

console.log(sortAscending([5, 2, 8, 1, 3]));
// [1, 2, 3, 5, 8]
```

**Other Language Solutions:**

**Python:**
```python
def bubble_sort_ascending(a):
    r=a.copy()
    for i in range(len(r)):
        for j in range(0,len(r)-1-i):
            if r[j]>r[j+1]: r[j],r[j+1]=r[j+1],r[j]
    return r
```

**Java:**
```java
static int[] bubbleSortAscending(int[] a){int[]r=a.clone();for(int i=0;i<r.length;i++)for(int j=0;j<r.length-1-i;j++)if(r[j]>r[j+1]){int t=r[j];r[j]=r[j+1];r[j+1]=t;}return r;}
```

**C# (.NET):**
```csharp
static int[] BubbleSortAscending(int[] a){int[]r=(int[])a.Clone();for(int i=0;i<r.Length;i++)for(int j=0;j<r.Length-1-i;j++)if(r[j]>r[j+1])(r[j],r[j+1])=(r[j+1],r[j]);return r;}
```

**C++:**
```cpp
vector<int> bubbleSortAscending(vector<int> a){for(int i=0;i<a.size();i++)for(int j=0;j+1<a.size()-i;j++)if(a[j]>a[j+1])swap(a[j],a[j+1]);return a;}
```


**Expected Output:**
```text
[1,2,3,5,8]
```

**Explanation (Simple English):**
The values are arranged according to a comparison rule. For numeric sorting, the comparator must return a negative, zero, or positive value based on the order.

**Explanation (Simple Hindi):**
Values ko comparison rule ke hisaab se arrange kiya jaata hai. Numeric sorting mein comparator batata hai ki kaunsa number pehle aayega.

**How to solve this type of problem:**
For sorting, decide ascending or descending order, use the correct numeric comparator, and remember that sort() changes the original array.

---

### 41. Sort an array in descending order using a loop

**Original section:** First batch (Q1–Q100).

**Question:** Sort an array from largest to smallest using the bubble sort technique.

**Answer:**
```js
function sortDescending(arr) {
  const result = [...arr];

  for (let i = 0; i < result.length - 1; i++) {
    for (let j = 0; j < result.length - 1 - i; j++) {
      if (result[j] < result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }

  return result;
}

console.log(sortDescending([5, 2, 8, 1, 3]));
// [8, 5, 3, 2, 1]
```

**Other Language Solutions:**

**Python:**
```python
def bubble_sort_descending(a):
    r=a.copy()
    for i in range(len(r)):
        for j in range(0,len(r)-1-i):
            if r[j]<r[j+1]: r[j],r[j+1]=r[j+1],r[j]
    return r
```

**Java:**
```java
static int[] bubbleSortDescending(int[] a){int[]r=a.clone();for(int i=0;i<r.length;i++)for(int j=0;j<r.length-1-i;j++)if(r[j]<r[j+1]){int t=r[j];r[j]=r[j+1];r[j+1]=t;}return r;}
```

**C# (.NET):**
```csharp
static int[] BubbleSortDescending(int[] a){int[]r=(int[])a.Clone();for(int i=0;i<r.Length;i++)for(int j=0;j<r.Length-1-i;j++)if(r[j]<r[j+1])(r[j],r[j+1])=(r[j+1],r[j]);return r;}
```

**C++:**
```cpp
vector<int> bubbleSortDescending(vector<int> a){for(int i=0;i<a.size();i++)for(int j=0;j+1<a.size()-i;j++)if(a[j]<a[j+1])swap(a[j],a[j+1]);return a;}
```


**Expected Output:**
```text
[8,5,3,2,1]
```

**Explanation (Simple English):**
The values are arranged according to a comparison rule. For numeric sorting, the comparator must return a negative, zero, or positive value based on the order.

**Explanation (Simple Hindi):**
Values ko comparison rule ke hisaab se arrange kiya jaata hai. Numeric sorting mein comparator batata hai ki kaunsa number pehle aayega.

**How to solve this type of problem:**
For sorting, decide ascending or descending order, use the correct numeric comparator, and remember that sort() changes the original array.

---

### 42. Find the minimum value in an array

**Original section:** First batch (Q1–Q100).

**Question:** Find the smallest number in an array.

**Answer:**
```js
function findMin(arr) {
  if (arr.length === 0) {
    throw new Error("Array must not be empty");
  }

  let min = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
    }
  }

  return min;
}

console.log(findMin([5, 10, -1, 8])); // -1
```

**Other Language Solutions:**

**Python:**
```python
def find_min(arr):
    if not arr: raise ValueError("array must not be empty")
    return min(arr)
```

**Java:**
```java
static int findMin(int[] a) { if(a.length==0) throw new IllegalArgumentException(); int m=a[0]; for(int x:a)m=Math.min(m,x); return m; }
```

**C# (.NET):**
```csharp
static int FindMin(int[] a) { if(a.Length==0) throw new ArgumentException(); return a.Min(); }
```

**C++:**
```cpp
int findMin(const vector<int>& a){ if(a.empty()) throw invalid_argument("empty"); return *min_element(a.begin(),a.end()); }
```


**Expected Output:**
```text
-1
-1
```

**Explanation (Simple English):**
The solution keeps a current best value and compares each new value with it. Whenever a bigger or smaller value is found, the stored answer is updated.

**Explanation (Simple Hindi):**
Code ek current best value rakhta hai aur har naye number se compare karta hai. Bada ya chhota number milne par answer update ho jaata hai.

**How to solve this type of problem:**
For minimum/maximum problems, initialize the answer with the first array value, scan the remaining values, and update it whenever a better value appears.

---

### 46. Capitalize the first letter of every word in a sentence

**Original section:** First batch (Q1–Q100).

**Question:** Convert the first letter of each word to uppercase.

**Answer:**
```js
function capitalizeWords(sentence) {
  return sentence
    .split(" ")
    .map(word => {
      if (word.length === 0) return word;
      return word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");
}

console.log(capitalizeWords("i love js")); // I Love Js
```

**Other Language Solutions:**

**Python:**
```python
def capitalize_words(sentence):
    return " ".join(w[:1].upper()+w[1:] for w in sentence.split(" "))
```

**Java:**
```java
static String capitalizeWords(String s){ String[] w=s.split(" ",-1); for(int i=0;i<w.length;i++) if(!w[i].isEmpty()) w[i]=w[i].substring(0,1).toUpperCase()+w[i].substring(1); return String.join(" ",w); }
```

**C# (.NET):**
```csharp
static string CapitalizeWords(string s) => string.Join(" ", s.Split(' ').Select(w => w.Length==0 ? w : char.ToUpper(w[0])+w.Substring(1)));
```

**C++:**
```cpp
string capitalizeWords(string s){ stringstream ss(s); string w,r; while(ss>>w){ if(!r.empty()) r+=" "; w[0]=toupper((unsigned char)w[0]); r+=w;} return r; }
```


**Expected Output:**
```text
I Love Js
```

**Explanation (Simple English):**
The map() method visits every element and converts it into a new value. The result has the same number of elements as the input array.

**Explanation (Simple Hindi):**
map() har element par jaata hai aur usko naye value mein convert karta hai. Result array mein elements ki count original ke barabar rehti hai.

**How to solve this type of problem:**
For transformation problems, decide what one input item should become, write that transformation in map(), and return the new value from the callback.

---

### 47. Convert an array of strings to uppercase

**Original section:** First batch (Q1–Q100).

**Question:** Convert every string in an array to uppercase.

**Answer:**
```js
function convertToUppercase(arr) {
  return arr.map(value => value.toUpperCase());
}

console.log(convertToUppercase(["g", "f", "a"]));
// ["G", "F", "A"]
```

**Other Language Solutions:**

**Python:**
```python
def uppercase_all(words):
    return [w.upper() for w in words]
```

**Java:**
```java
static String[] uppercaseAll(String[] a){ return Arrays.stream(a).map(String::toUpperCase).toArray(String[]::new); }
```

**C# (.NET):**
```csharp
static string[] UppercaseAll(string[] a) => a.Select(x => x.ToUpper()).ToArray();
```

**C++:**
```cpp
vector<string> uppercaseAll(vector<string> a){ for(auto& s:a) for(char& c:s)c=toupper((unsigned char)c); return a; }
```


**Expected Output:**
```text
["G","F","A"]
```

**Explanation (Simple English):**
The map() method visits every element and converts it into a new value. The result has the same number of elements as the input array.

**Explanation (Simple Hindi):**
map() har element par jaata hai aur usko naye value mein convert karta hai. Result array mein elements ki count original ke barabar rehti hai.

**How to solve this type of problem:**
For transformation problems, decide what one input item should become, write that transformation in map(), and return the new value from the callback.

---

### 48. Remove falsy values from an array

**Original section:** First batch (Q1–Q100).

**Question:** Remove falsy values such as `false`, `0`, `""`, `null`, `undefined`, and `NaN` from an array.

**Answer:**
```js
const values = [0, false, "hello", "", null, undefined, 5, NaN];

const cleanedValues = values.filter(Boolean);

console.log(cleanedValues); // ["hello", 5]
```

**Other Language Solutions:**

> **Note:** Java/C#/.NET/C++ do not share JavaScript truthiness rules. This sample explicitly removes JS-like falsy values; for mixed dynamic values use object/variant types.

**Python:**
```python
def remove_falsy(values):
    return [x for x in values if x not in (None, False, 0, "") and x == x]  # excludes NaN too
```

**Java:**
```java
static List<Object> removeFalsy(List<Object> a){ List<Object> r=new ArrayList<>(); for(Object x:a){ boolean falsy=x==null || Boolean.FALSE.equals(x) || "".equals(x); if(x instanceof Number){double n=((Number)x).doubleValue(); falsy=falsy || n==0 || Double.isNaN(n);} if(!falsy)r.add(x);} return r; }
```

**C# (.NET):**
```csharp
static object[] RemoveFalsy(object[] a) => a.Where(x => { if(x==null)return false; if(x is bool b)return b; if(x is string s)return s.Length>0; if(x is byte or sbyte or short or ushort or int or uint or long or ulong or float or double or decimal){double n=Convert.ToDouble(x);return n!=0 && !double.IsNaN(n);} return true; }).ToArray();
```

**C++:**
```cpp
using JSValue = variant<monostate,bool,int,double,string>;
vector<JSValue> removeFalsy(const vector<JSValue>& values){vector<JSValue> r;for(const auto& v:values){bool falsy=false;if(holds_alternative<monostate>(v))falsy=true;else if(auto p=get_if<bool>(&v))falsy=!*p;else if(auto p=get_if<int>(&v))falsy=*p==0;else if(auto p=get_if<double>(&v))falsy=*p==0 || isnan(*p);else if(auto p=get_if<string>(&v))falsy=p->empty();if(!falsy)r.push_back(v);}return r;}
```


**Expected Output:**
```text
["hello",5]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

### 50. Create an object and print one of its properties

**Original section:** First batch (Q1–Q100).

**Question:** Create a JavaScript object and access a property using dot notation.

**Answer:**
```js
const person = {
  name: "John",
  age: 26
};

console.log(person.name); // John
```

**Other Language Solutions:**

**Python:**
```python
person = {"name": "John", "age": 26}
print(person["name"])
```

**Java:**
```java
Map<String,Object> person = Map.of("name", "John", "age", 26);
System.out.println(person.get("name"));
```

**C# (.NET):**
```csharp
var person = new Dictionary<string, object> { ["name"]="John", ["age"]=26 };
Console.WriteLine(person["name"]);
```

**C++:**
```cpp
struct Person { string name; int age; };
string getName(const Person& person){ return person.name; }
```


**Expected Output:**
```text
John
```

**Explanation (Simple English):**
An object stores related information as key-value pairs. Dot notation reads a value by using its property name.

**Explanation (Simple Hindi):**
Object related information ko key-value pairs mein store karta hai. Dot notation se property ka naam use karke uski value milti hai.

**How to solve this type of problem:**
For object questions, identify the required keys and values, build the object, and access or update a property using dot or bracket notation.

---

---

### 51. Use the `map()` function on an array

**Original section:** First batch (Q1–Q100).

**Question:** Use `map()` to create a new array by multiplying each number by 2.

**Answer:**
```js
const numbers = [5, 6, 9];

const result = numbers.map(number => number * 2);

console.log(result); // [10, 12, 18]
```

**Other Language Solutions:**

**Python:**
```python
def double_values(arr):
    return [x * 2 for x in arr]
```

**Java:**
```java
static int[] doubleValues(int[] a){ return Arrays.stream(a).map(x->x*2).toArray(); }
```

**C# (.NET):**
```csharp
static int[] DoubleValues(int[] a) => a.Select(x => x*2).ToArray();
```

**C++:**
```cpp
vector<int> doubleValues(const vector<int>& a){ vector<int> r; for(int x:a)r.push_back(x*2); return r; }
```


**Expected Output:**
```text
[10,12,18]
```

**Explanation (Simple English):**
The map() method visits every element and converts it into a new value. The result has the same number of elements as the input array.

**Explanation (Simple Hindi):**
map() har element par jaata hai aur usko naye value mein convert karta hai. Result array mein elements ki count original ke barabar rehti hai.

**How to solve this type of problem:**
For transformation problems, decide what one input item should become, write that transformation in map(), and return the new value from the callback.

---

### 52. Parse JSON and stringify data in JavaScript

**Original section:** First batch (Q1–Q100).

**Question:** Convert a JSON string into a JavaScript object, and convert an object into a JSON string.

**Answer:**
```js
// JSON string to JavaScript object
const jsonData = '{"name":"Cheeks"}';
const parsedData = JSON.parse(jsonData);

console.log(parsedData.name); // Cheeks

// JavaScript object to JSON string
const person = { name: "Geeks" };
const jsonString = JSON.stringify(person);

console.log(jsonString); // {"name":"Geeks"}
```

**Other Language Solutions:**

> **Note:** Java requires Jackson (ObjectMapper). C++ example requires nlohmann/json. C# uses built-in System.Text.Json.

**Python:**
```python
import json
text = '{"name":"Geeks"}'
obj = json.loads(text)
json_text = json.dumps(obj)
print(obj["name"], json_text)
```

**Java:**
```java
// Requires Jackson: import com.fasterxml.jackson.databind.ObjectMapper;
static String jsonRoundTrip(String text) throws Exception {
    ObjectMapper mapper = new ObjectMapper();
    Object value = mapper.readValue(text, Object.class);
    return mapper.writeValueAsString(value);
}
```

**C# (.NET):**
```csharp
using System.Text.Json;
static string JsonRoundTrip(string text) {
    using JsonDocument document = JsonDocument.Parse(text);
    return JsonSerializer.Serialize(document.RootElement);
}
```

**C++:**
```cpp
// Requires #include <nlohmann/json.hpp>
using json = nlohmann::json;
json jsonRoundTrip(const string& text) { return json::parse(text); }
string stringifyJson(const json& value) { return value.dump(); }
```


**Expected Output:**
```text
Cheeks
{"name":"Geeks"}
```

**Explanation (Simple English):**
An object stores related information as key-value pairs. Dot notation reads a value by using its property name.

**Explanation (Simple Hindi):**
Object related information ko key-value pairs mein store karta hai. Dot notation se property ka naam use karke uski value milti hai.

**How to solve this type of problem:**
For object questions, identify the required keys and values, build the object, and access or update a property using dot or bracket notation.

---

### 53. Convert a string into an array of words

**Original section:** First batch (Q1–Q100).

**Question:** Convert a sentence into an array using `split()`.

**Answer:**
```js
const sentence = "Geeks for Geeks";

const wordsArray = sentence.split(" ");

console.log(wordsArray); // ["Geeks", "for", "Geeks"]
```

**Other Language Solutions:**

**Python:**
```python
def split_words(s):
    return s.split()  # use s.split(",") for comma-separated input
```

**Java:**
```java
static String[] splitWords(String s){ return s.split("\\s+"); }
```

**C# (.NET):**
```csharp
static string[] SplitWords(string s) => s.Split(' ', StringSplitOptions.RemoveEmptyEntries);
```

**C++:**
```cpp
vector<string> splitWords(const string& s){ stringstream ss(s); vector<string> r; string w; while(ss>>w)r.push_back(w); return r; }
```


**Expected Output:**
```text
["Geeks","for","Geeks"]
```

**Explanation (Simple English):**
The string is split into individual words, each word is processed, and the result is joined again when a sentence is needed.

**Explanation (Simple Hindi):**
String ko alag-alag words mein split karte hain, har word par required operation karte hain, aur sentence banana ho toh join kar dete hain.

**How to solve this type of problem:**
For word-based string questions, split the sentence using whitespace, process each word, then join the words with the required separator.

---

### 58. Write a function that returns only even numbers from an array

**Original section:** First batch (Q1–Q100).

**Question:** Take an array of numbers and return a new array containing only even numbers.

**Answer:**
```js
function filterEvenNumbers(numbers) {
  return numbers.filter(number => number % 2 === 0);
}

console.log(filterEvenNumbers([1, 2, 3, 4, 5, 6]));
// [2, 4, 6]
```

**Other Language Solutions:**

**Python:**
```python
def only_evens(arr):
    return [x for x in arr if x % 2 == 0]
```

**Java:**
```java
static int[] onlyEvens(int[] a){ return Arrays.stream(a).filter(x->x%2==0).toArray(); }
```

**C# (.NET):**
```csharp
static int[] OnlyEvens(int[] a) => a.Where(x => x%2==0).ToArray();
```

**C++:**
```cpp
vector<int> onlyEvens(const vector<int>& a){ vector<int> r; for(int x:a)if(x%2==0)r.push_back(x); return r; }
```


**Expected Output:**
```text
[2,4,6]
```

**Explanation (Simple English):**
The remainder operator (%) tells whether a number is divisible by 2. A remainder of zero means even; otherwise it is odd.

**Explanation (Simple Hindi):**
% operator batata hai ki number 2 se poori tarah divide hota hai ya nahi. Remainder zero ho toh even, warna odd hota hai.

**How to solve this type of problem:**
For even/odd tasks, use number % 2, then either count, filter, or place each number into the required result group.

---

### 60. Find the average value of numbers in an array

**Original section:** First batch (Q1–Q100).

**Question:** Calculate the average of all numbers in an array.

**Answer:**
```js
function average(arr) {
  if (arr.length === 0) {
    throw new Error("Array must not be empty");
  }

  let sum = 0;

  for (const number of arr) {
    sum += number;
  }

  return sum / arr.length;
}

console.log(average([14, 8, 15, 16, 20, 25, 10])); // 15.428571...
```

**Other Language Solutions:**

**Python:**
```python
def average(arr):
    if not arr: raise ValueError("array must not be empty")
    return sum(arr) / len(arr)
```

**Java:**
```java
static double average(int[] a){ if(a.length==0) throw new IllegalArgumentException(); return Arrays.stream(a).average().orElseThrow(); }
```

**C# (.NET):**
```csharp
static double Average(int[] a) { if(a.Length==0) throw new ArgumentException(); return a.Average(); }
```

**C++:**
```cpp
double average(const vector<int>& a){ if(a.empty()) throw invalid_argument("empty"); return (double)accumulate(a.begin(),a.end(),0)/a.size(); }
```


**Expected Output:**
```text
15.428571428571429
```

**Explanation (Simple English):**
The solution first calculates the total of all values, then divides that total by the number of elements. An empty array must be handled separately.

**Explanation (Simple Hindi):**
Pehle saare numbers ka sum nikalta hai, phir us sum ko elements ki count se divide karta hai. Empty array ko alag handle karna zaroori hai.

**How to solve this type of problem:**
For average problems, calculate the sum, divide by array length, and decide what to do when the array is empty.

---

### 61. Print all elements of an array

**Original section:** First batch (Q1–Q100).

**Question:** Print every element of an array using different loop methods.

**Answer:**
```js
const arr = [1, 2, 3, 4, 5];

// 1. forEach()
arr.forEach(element => console.log(element));

// 2. for loop
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// 3. for...of loop
for (const value of arr) {
  console.log(value);
}

// 4. while loop
let i = 0;
while (i < arr.length) {
  console.log(arr[i]);
  i++;
}
```

**Other Language Solutions:**

**Python:**
```python
def print_all(arr):
    for value in arr: print(value)
```

**Java:**
```java
static void printAll(int[] a){ for(int x:a) System.out.println(x); }
```

**C# (.NET):**
```csharp
static void PrintAll(int[] a) { foreach(int x in a) Console.WriteLine(x); }
```

**C++:**
```cpp
void printAll(const vector<int>& a){ for(int x:a) cout << x << '\n'; }
```


**Expected Output:**
```text
1
2
3
4
5
1
2
3
4
5
1
2
3
4
5
1
2
3
4
5
```

**Explanation (Simple English):**
The loop visits array elements one by one. The current index is used to read the value, and the required action is performed for each item.

**Explanation (Simple Hindi):**
Loop array ke har element par ek-ek karke jaata hai. Current index se value read hoti hai aur har item par required action hota hai.

**How to solve this type of problem:**
For basic array questions, identify what must happen to each element, loop from index 0 to length - 1, and update or collect the result.

---

### 62. Find the length of an array

**Original section:** First batch (Q1–Q100).

**Question:** Find how many elements are present in an array.

**Answer:**
```js
const arr = [1, 2, 3, 4, 5];

console.log(arr.length); // 5
```

**Other Language Solutions:**

**Python:**
```python
def array_length(arr): return len(arr)
```

**Java:**
```java
static int arrayLength(int[] a){ return a.length; }
```

**C# (.NET):**
```csharp
static int ArrayLength(int[] a) => a.Length;
```

**C++:**
```cpp
int arrayLength(const vector<int>& a){ return (int)a.size(); }
```


**Expected Output:**
```text
5
```

**Explanation (Simple English):**
The solution scans the array and compares each element with the target. Depending on the task, it returns the first match, all matching indexes, or a not-found value.

**Explanation (Simple Hindi):**
Code array scan karke har element ko target se compare karta hai. Task ke hisaab se pehla match, saare indexes, ya not-found value return hoti hai.

**How to solve this type of problem:**
For search problems, decide whether you need a value or an index, scan the array, and define clearly what to return when no match is found.

---

### 63. Check whether an element exists in an array

**Original section:** First batch (Q1–Q100).

**Question:** Check whether a particular value is present in an array.

**Answer:**
```js
const arr = [1, 2, 3];

console.log(arr.includes(2)); // true
console.log(arr.includes(5)); // false
```

**Other Language Solutions:**

**Python:**
```python
def contains_value(arr, target): return target in arr
```

**Java:**
```java
static boolean containsValue(int[] a,int target){ for(int x:a)if(x==target)return true; return false; }
```

**C# (.NET):**
```csharp
static bool ContainsValue(int[] a,int target) => a.Contains(target);
```

**C++:**
```cpp
bool containsValue(const vector<int>& a,int target){ return find(a.begin(),a.end(),target)!=a.end(); }
```


**Expected Output:**
```text
true
false
```

**Explanation (Simple English):**
The loop visits array elements one by one. The current index is used to read the value, and the required action is performed for each item.

**Explanation (Simple Hindi):**
Loop array ke har element par ek-ek karke jaata hai. Current index se value read hoti hai aur har item par required action hota hai.

**How to solve this type of problem:**
For basic array questions, identify what must happen to each element, loop from index 0 to length - 1, and update or collect the result.

---

### 64. Add an element to the end of an array

**Original section:** First batch (Q1–Q100).

**Question:** Add a new element at the end of an array using `push()`.

**Answer:**
```js
const arr = [1, 2];

arr.push(3);

console.log(arr); // [1, 2, 3]
```

**Other Language Solutions:**

**Python:**
```python
def add_end(arr, value): return arr + [value]
```

**Java:**
```java
static int[] addEnd(int[] a,int value){ int[] r=Arrays.copyOf(a,a.length+1); r[a.length]=value; return r; }
```

**C# (.NET):**
```csharp
static int[] AddEnd(int[] a,int value) => a.Append(value).ToArray();
```

**C++:**
```cpp
vector<int> addEnd(vector<int> a,int v){ a.push_back(v); return a; }
```


**Expected Output:**
```text
[1,2,3]
```

**Explanation (Simple English):**
The loop visits array elements one by one. The current index is used to read the value, and the required action is performed for each item.

**Explanation (Simple Hindi):**
Loop array ke har element par ek-ek karke jaata hai. Current index se value read hoti hai aur har item par required action hota hai.

**How to solve this type of problem:**
For basic array questions, identify what must happen to each element, loop from index 0 to length - 1, and update or collect the result.

---

### 65. Add an element to the beginning of an array

**Original section:** First batch (Q1–Q100).

**Question:** Add a new element at the beginning of an array using `unshift()`.

**Answer:**
```js
const arr = [2, 3];

arr.unshift(1);

console.log(arr); // [1, 2, 3]
```

**Other Language Solutions:**

**Python:**
```python
def add_start(arr, value): return [value] + arr
```

**Java:**
```java
static int[] addStart(int[] a,int v){ int[] r=new int[a.length+1]; r[0]=v; System.arraycopy(a,0,r,1,a.length); return r; }
```

**C# (.NET):**
```csharp
static int[] AddStart(int[] a,int v) => new[]{v}.Concat(a).ToArray();
```

**C++:**
```cpp
vector<int> addStart(vector<int> a,int v){ a.insert(a.begin(),v); return a; }
```


**Expected Output:**
```text
[1,2,3]
```

**Explanation (Simple English):**
The loop visits array elements one by one. The current index is used to read the value, and the required action is performed for each item.

**Explanation (Simple Hindi):**
Loop array ke har element par ek-ek karke jaata hai. Current index se value read hoti hai aur har item par required action hota hai.

**How to solve this type of problem:**
For basic array questions, identify what must happen to each element, loop from index 0 to length - 1, and update or collect the result.

---

### 66. Remove the last element of an array

**Original section:** First batch (Q1–Q100).

**Question:** Remove the last element using `pop()`.

**Answer:**
```js
const arr = [1, 2, 3];

arr.pop();

console.log(arr); // [1, 2]
```

**Other Language Solutions:**

**Python:**
```python
def remove_last(arr): return arr[:-1]
```

**Java:**
```java
static int[] removeLast(int[] a){ return Arrays.copyOf(a,Math.max(0,a.length-1)); }
```

**C# (.NET):**
```csharp
static int[] RemoveLast(int[] a) => a.Take(Math.Max(0,a.Length-1)).ToArray();
```

**C++:**
```cpp
vector<int> removeLast(vector<int> a){ if(!a.empty())a.pop_back(); return a; }
```


**Expected Output:**
```text
[1,2]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

### 67. Remove the first element of an array

**Original section:** First batch (Q1–Q100).

**Question:** Remove the first element using `shift()`.

**Answer:**
```js
const arr = [1, 2, 3];

arr.shift();

console.log(arr); // [2, 3]
```

**Other Language Solutions:**

**Python:**
```python
def remove_first(arr): return arr[1:]
```

**Java:**
```java
static int[] removeFirst(int[] a){ return a.length==0? a : Arrays.copyOfRange(a,1,a.length); }
```

**C# (.NET):**
```csharp
static int[] RemoveFirst(int[] a) => a.Skip(Math.Min(1,a.Length)).ToArray();
```

**C++:**
```cpp
vector<int> removeFirst(vector<int> a){ if(!a.empty())a.erase(a.begin()); return a; }
```


**Expected Output:**
```text
[2,3]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

### 68. Find the index of a specific element

**Original section:** First batch (Q1–Q100).

**Question:** Find the index of a given element using `indexOf()`.

**Answer:**
```js
const arr = ["a", "b", "c"];

console.log(arr.indexOf("b")); // 1
console.log(arr.indexOf("z")); // -1
```

**Other Language Solutions:**

**Python:**
```python
def find_index(arr, target): return arr.index(target) if target in arr else -1
```

**Java:**
```java
static int findIndex(int[] a,int target){ for(int i=0;i<a.length;i++)if(a[i]==target)return i; return -1; }
```

**C# (.NET):**
```csharp
static int FindIndex(int[] a,int target) => Array.IndexOf(a,target);
```

**C++:**
```cpp
int findIndex(const vector<int>& a,int t){ auto it=find(a.begin(),a.end(),t); return it==a.end()?-1:it-a.begin(); }
```


**Expected Output:**
```text
1
-1
```

**Explanation (Simple English):**
The solution scans the array and compares each element with the target. Depending on the task, it returns the first match, all matching indexes, or a not-found value.

**Explanation (Simple Hindi):**
Code array scan karke har element ko target se compare karta hai. Task ke hisaab se pehla match, saare indexes, ya not-found value return hoti hai.

**How to solve this type of problem:**
For search problems, decide whether you need a value or an index, scan the array, and define clearly what to return when no match is found.

---

### 69. Reverse an array without using `reverse()`

**Original section:** First batch (Q1–Q100).

**Question:** Reverse an array by using a loop and a new array.

**Answer:**
```js
function reverseArray(arr) {
  const reversed = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    reversed.push(arr[i]);
  }

  return reversed;
}

console.log(reverseArray([1, 2, 3, 4]));
// [4, 3, 2, 1]
```

**Other Language Solutions:**

**Python:**
```python
def reverse_array(arr):
    r=arr.copy(); left=0; right=len(r)-1
    while left<right: r[left],r[right]=r[right],r[left]; left+=1; right-=1
    return r
```

**Java:**
```java
static int[] reverseArray(int[] a){ int[] r=a.clone(); for(int i=0,j=r.length-1;i<j;i++,j--){int t=r[i];r[i]=r[j];r[j]=t;} return r; }
```

**C# (.NET):**
```csharp
static int[] ReverseArray(int[] a){ int[] r=(int[])a.Clone(); for(int i=0,j=r.Length-1;i<j;i++,j--)(r[i],r[j])=(r[j],r[i]); return r; }
```

**C++:**
```cpp
vector<int> reverseArray(vector<int> a){ for(int i=0,j=(int)a.size()-1;i<j;i++,j--)swap(a[i],a[j]); return a; }
```


**Expected Output:**
```text
[4,3,2,1]
```

**Explanation (Simple English):**
The solution reads the value from the end towards the beginning and builds a new reversed result. This avoids changing the original array/string when a new result is required.

**Explanation (Simple Hindi):**
Code value ko end se start ki taraf read karke naya reversed result banata hai. Naya array/string banane se original value safe rehti hai.

**How to solve this type of problem:**
For reversing, identify whether you must mutate the original or return a new value, then traverse backward or use split/reverse/join for strings.

---

### 70. Merge two arrays

**Original section:** First batch (Q1–Q100).

**Question:** Merge two arrays into a single array.

**Answer:**
```js
const arr1 = [1, 2];
const arr2 = [3, 4];

const merged = [...arr1, ...arr2];

console.log(merged); // [1, 2, 3, 4]
```

**Other Language Solutions:**

**Python:**
```python
def merge_arrays(a, b):
    return a + b
```

**Java:**
```java
static int[] mergeArrays(int[] a,int[] b){ int[] r=Arrays.copyOf(a,a.length+b.length); System.arraycopy(b,0,r,a.length,b.length); return r; }
```

**C# (.NET):**
```csharp
static int[] MergeArrays(int[] a,int[] b) => a.Concat(b).ToArray();
```

**C++:**
```cpp
vector<int> mergeArrays(const vector<int>& a,const vector<int>& b){ vector<int> r=a; r.insert(r.end(),b.begin(),b.end()); return r; }
```


**Expected Output:**
```text
[1,2,3,4]
[1,2,3,4]
```

**Explanation (Simple English):**
The spread operator or concat() places the values of the second array after the values of the first array. The original arrays are not changed.

**Explanation (Simple Hindi):**
Spread operator ya concat() doosre array ke elements ko pehle array ke baad rakh deta hai. Original arrays change nahi hote.

**How to solve this type of problem:**
For merging, choose whether order should simply be appended or whether the values must be sorted; use spread/concat for simple joining.

---

### 72. Find the largest number in an array

**Original section:** First batch (Q1–Q100).

**Question:** Find the maximum value in an array using `Math.max()`.

**Answer:**
```js
const arr = [5, 1, 8, 2, 3];

const largest = Math.max(...arr);

console.log(largest); // 8
```

**Other Language Solutions:**

**Python:**
```python
def find_max(arr):
    if not arr: raise ValueError("array must not be empty")
    return max(arr)
```

**Java:**
```java
static int findMax(int[] a) { if(a.length==0) throw new IllegalArgumentException(); int m=a[0]; for(int x:a)m=Math.max(m,x); return m; }
```

**C# (.NET):**
```csharp
static int FindMax(int[] a) { if(a.Length==0) throw new ArgumentException(); return a.Max(); }
```

**C++:**
```cpp
int findMax(const vector<int>& a){ if(a.empty()) throw invalid_argument("empty"); return *max_element(a.begin(),a.end()); }
```


**Expected Output:**
```text
8
```

**Explanation (Simple English):**
The solution keeps a current best value and compares each new value with it. Whenever a bigger or smaller value is found, the stored answer is updated.

**Explanation (Simple Hindi):**
Code ek current best value rakhta hai aur har naye number se compare karta hai. Bada ya chhota number milne par answer update ho jaata hai.

**How to solve this type of problem:**
For minimum/maximum problems, initialize the answer with the first array value, scan the remaining values, and update it whenever a better value appears.

---

### 73. Find the smallest number in an array

**Original section:** First batch (Q1–Q100).

**Question:** Find the minimum value in an array using `Math.min()`.

**Answer:**
```js
const arr = [5, 1, 8, 2, 3];

const smallest = Math.min(...arr);

console.log(smallest); // 1
```

**Other Language Solutions:**

**Python:**
```python
def find_min(arr):
    if not arr: raise ValueError("array must not be empty")
    return min(arr)
```

**Java:**
```java
static int findMin(int[] a) { if(a.length==0) throw new IllegalArgumentException(); int m=a[0]; for(int x:a)m=Math.min(m,x); return m; }
```

**C# (.NET):**
```csharp
static int FindMin(int[] a) { if(a.Length==0) throw new ArgumentException(); return a.Min(); }
```

**C++:**
```cpp
int findMin(const vector<int>& a){ if(a.empty()) throw invalid_argument("empty"); return *min_element(a.begin(),a.end()); }
```


**Expected Output:**
```text
1
```

**Explanation (Simple English):**
The solution keeps a current best value and compares each new value with it. Whenever a bigger or smaller value is found, the stored answer is updated.

**Explanation (Simple Hindi):**
Code ek current best value rakhta hai aur har naye number se compare karta hai. Bada ya chhota number milne par answer update ho jaata hai.

**How to solve this type of problem:**
For minimum/maximum problems, initialize the answer with the first array value, scan the remaining values, and update it whenever a better value appears.

---

### 74. Calculate the sum of all elements in an array

**Original section:** First batch (Q1–Q100).

**Question:** Find the sum of all array elements using `reduce()`.

**Answer:**
```js
const arr = [1, 2, 3, 4];

const sum = arr.reduce((total, value) => total + value, 0);

console.log(sum); // 10
```

**Other Language Solutions:**

**Python:**
```python
def sum_array(arr):
    return sum(arr)
```

**Java:**
```java
static int sumArray(int[] a) { int sum=0; for(int x:a) sum+=x; return sum; }
```

**C# (.NET):**
```csharp
static int SumArray(int[] a) => a.Sum();
```

**C++:**
```cpp
int sumArray(const vector<int>& a){ return accumulate(a.begin(),a.end(),0); }
```


**Expected Output:**
```text
10
```

**Explanation (Simple English):**
The code starts a total at zero and adds each array value to it. At the end, the accumulated total is returned.

**Explanation (Simple Hindi):**
Code total ko zero se start karta hai aur har array value ko usmein add karta hai. End mein final sum return hota hai.

**How to solve this type of problem:**
For sum problems, initialize total = 0, visit every number, add it to total, and return total after the loop.

---

### 76. Convert an array into a string

**Original section:** First batch (Q1–Q100).

**Question:** Convert an array into a string using `toString()` and `join()`.

**Answer:**
```js
const arr = [1, 2, 3];

console.log(arr.toString()); // "1,2,3"
console.log(arr.join(""));   // "123"
console.log(arr.join("-"));  // "1-2-3"
```

**Other Language Solutions:**

**Python:**
```python
def array_to_string(arr): return ",".join(map(str, arr))
```

**Java:**
```java
static String arrayToString(int[] a){ return Arrays.toString(a); }
```

**C# (.NET):**
```csharp
static string ArrayToString(int[] a) => string.Join(",",a);
```

**C++:**
```cpp
string arrayToString(const vector<int>& a){ string r; for(int i=0;i<a.size();i++){if(i)r+=",";r+=to_string(a[i]);}return r; }
```


**Expected Output:**
```text
1,2,3
123
1-2-3
```

**Explanation (Simple English):**
split() breaks a string into an array. An empty separator creates character elements, while a space or comma separator splits at those delimiters.

**Explanation (Simple Hindi):**
split() string ko array mein todta hai. Empty separator se characters milte hain, aur space/comma separator se words ya comma-separated values milti hain.

**How to solve this type of problem:**
For string-to-array tasks, choose the correct separator: empty string for characters, spaces for words, or commas for CSV-like text.

---

### 77. Convert a comma-separated string into an array

**Original section:** First batch (Q1–Q100).

**Question:** Convert a comma-separated string into an array using `split()`.

**Answer:**
```js
const str = "a,b,c";

const result = str.split(",");

console.log(result); // ["a", "b", "c"]
```

**Other Language Solutions:**

**Python:**
```python
def split_commas(s): return s.split(",")
```

**Java:**
```java
static String[] splitCommas(String s){return s.split(",",-1);}
```

**C# (.NET):**
```csharp
static string[] SplitCommas(string s)=>s.Split(',');
```

**C++:**
```cpp
vector<string> splitCommas(const string&s){stringstream ss(s);vector<string>r;string x;while(getline(ss,x,','))r.push_back(x);return r;}
```


**Expected Output:**
```text
["a","b","c"]
```

**Explanation (Simple English):**
split() breaks a string into an array. An empty separator creates character elements, while a space or comma separator splits at those delimiters.

**Explanation (Simple Hindi):**
split() string ko array mein todta hai. Empty separator se characters milte hain, aur space/comma separator se words ya comma-separated values milti hain.

**How to solve this type of problem:**
For string-to-array tasks, choose the correct separator: empty string for characters, spaces for words, or commas for CSV-like text.

---

### 78. Clone an array without using `slice()`

**Original section:** First batch (Q1–Q100).

**Question:** Create a copy of an array using the spread operator.

**Answer:**
```js
const arr = [1, 2, 3];

const clone = [...arr];

console.log(clone); // [1, 2, 3]
console.log(clone === arr); // false
```

**Other Language Solutions:**

**Python:**
```python
def clone_array(arr): return arr.copy()
```

**Java:**
```java
static int[] cloneArray(int[] a){ return a.clone(); }
```

**C# (.NET):**
```csharp
static int[] CloneArray(int[] a) => (int[])a.Clone();
```

**C++:**
```cpp
vector<int> cloneArray(const vector<int>& a){ return a; }
```


**Expected Output:**
```text
[1,2,3]
false
```

**Explanation (Simple English):**
The loop visits array elements one by one. The current index is used to read the value, and the required action is performed for each item.

**Explanation (Simple Hindi):**
Loop array ke har element par ek-ek karke jaata hai. Current index se value read hoti hai aur har item par required action hota hai.

**How to solve this type of problem:**
For basic array questions, identify what must happen to each element, loop from index 0 to length - 1, and update or collect the result.

---

### 83. Join array elements with a hyphen

**Original section:** First batch (Q1–Q100).

**Question:** Join all elements of an array into one string, using `-` as the separator.

**Answer:**
```js
const arr = [1, 2, 3];

const result = arr.join("-");

console.log(result); // "1-2-3"
```

**Other Language Solutions:**

**Python:**
```python
def join_hyphen(arr): return "-".join(map(str, arr))
```

**Java:**
```java
static String joinHyphen(int[] a){ return Arrays.stream(a).mapToObj(String::valueOf).collect(Collectors.joining("-")); }
```

**C# (.NET):**
```csharp
static string JoinHyphen(int[] a) => string.Join("-",a);
```

**C++:**
```cpp
string joinHyphen(const vector<int>& a){ string r; for(int i=0;i<a.size();i++){if(i)r+="-";r+=to_string(a[i]);}return r; }
```


**Expected Output:**
```text
1-2-3
```

**Explanation (Simple English):**
split() breaks a string into an array. An empty separator creates character elements, while a space or comma separator splits at those delimiters.

**Explanation (Simple Hindi):**
split() string ko array mein todta hai. Empty separator se characters milte hain, aur space/comma separator se words ya comma-separated values milti hain.

**How to solve this type of problem:**
For string-to-array tasks, choose the correct separator: empty string for characters, spaces for words, or commas for CSV-like text.

---

### 85. Double all values in an array

**Original section:** First batch (Q1–Q100).

**Question:** Create a new array in which every number is multiplied by 2.

**Answer:**
```js
const arr = [3, 6];

const doubled = arr.map(number => number * 2);

console.log(doubled); // [6, 12]
```

**Other Language Solutions:**

**Python:**
```python
def double_values(arr):
    return [x * 2 for x in arr]
```

**Java:**
```java
static int[] doubleValues(int[] a){ return Arrays.stream(a).map(x->x*2).toArray(); }
```

**C# (.NET):**
```csharp
static int[] DoubleValues(int[] a) => a.Select(x => x*2).ToArray();
```

**C++:**
```cpp
vector<int> doubleValues(const vector<int>& a){ vector<int> r; for(int x:a)r.push_back(x*2); return r; }
```


**Expected Output:**
```text
[6,12]
```

**Explanation (Simple English):**
The map() method visits every element and converts it into a new value. The result has the same number of elements as the input array.

**Explanation (Simple Hindi):**
map() har element par jaata hai aur usko naye value mein convert karta hai. Result array mein elements ki count original ke barabar rehti hai.

**How to solve this type of problem:**
For transformation problems, decide what one input item should become, write that transformation in map(), and return the new value from the callback.

---

### 86. Sort numbers in ascending order

**Original section:** First batch (Q1–Q100).

**Question:** Sort an array of numbers from smallest to largest.

**Answer:**
```js
const numbers = [5, 2, 9, 1];

numbers.sort((a, b) => a - b);

console.log(numbers); // [1, 2, 5, 9]
```

**Other Language Solutions:**

**Python:**
```python
def sort_ascending(arr):
    return sorted(arr)
```

**Java:**
```java
static int[] sortAscending(int[] a) { int[] r=a.clone(); Arrays.sort(r); return r; }
```

**C# (.NET):**
```csharp
static int[] SortAscending(int[] a) { int[] r=(int[])a.Clone(); Array.Sort(r); return r; }
```

**C++:**
```cpp
vector<int> sortAscending(vector<int> a){ sort(a.begin(),a.end()); return a; }
```


**Expected Output:**
```text
[1,2,5,9]
```

**Explanation (Simple English):**
The values are arranged according to a comparison rule. For numeric sorting, the comparator must return a negative, zero, or positive value based on the order.

**Explanation (Simple Hindi):**
Values ko comparison rule ke hisaab se arrange kiya jaata hai. Numeric sorting mein comparator batata hai ki kaunsa number pehle aayega.

**How to solve this type of problem:**
For sorting, decide ascending or descending order, use the correct numeric comparator, and remember that sort() changes the original array.

---

### 87. Sort numbers in descending order

**Original section:** First batch (Q1–Q100).

**Question:** Sort an array of numbers from largest to smallest.

**Answer:**
```js
const numbers = [3, 6, 8, 1];

numbers.sort((a, b) => b - a);

console.log(numbers); // [8, 6, 3, 1]
```

**Other Language Solutions:**

**Python:**
```python
def sort_descending(arr):
    return sorted(arr, reverse=True)
```

**Java:**
```java
static int[] sortDescending(int[] a) { return Arrays.stream(a).boxed().sorted(Collections.reverseOrder()).mapToInt(Integer::intValue).toArray(); }
```

**C# (.NET):**
```csharp
static int[] SortDescending(int[] a) => a.OrderByDescending(x => x).ToArray();
```

**C++:**
```cpp
vector<int> sortDescending(vector<int> a){ sort(a.rbegin(),a.rend()); return a; }
```


**Expected Output:**
```text
[8,6,3,1]
```

**Explanation (Simple English):**
The values are arranged according to a comparison rule. For numeric sorting, the comparator must return a negative, zero, or positive value based on the order.

**Explanation (Simple Hindi):**
Values ko comparison rule ke hisaab se arrange kiya jaata hai. Numeric sorting mein comparator batata hai ki kaunsa number pehle aayega.

**How to solve this type of problem:**
For sorting, decide ascending or descending order, use the correct numeric comparator, and remember that sort() changes the original array.

---

### 93. Replace all negative numbers with 0

**Original section:** First batch (Q1–Q100).

**Question:** Create a new array in which every negative number is replaced with zero.

**Answer:**
```js
const numbers = [3, -1, 5, -2, 0];

const result = numbers.map(number => number < 0 ? 0 : number);

console.log(result); // [3, 0, 5, 0, 0]
```

**Other Language Solutions:**

**Python:**
```python
def replace_negative(arr): return [0 if x < 0 else x for x in arr]
```

**Java:**
```java
static int[] replaceNegative(int[] a){ return Arrays.stream(a).map(x->x<0?0:x).toArray(); }
```

**C# (.NET):**
```csharp
static int[] ReplaceNegative(int[] a) => a.Select(x=>x<0?0:x).ToArray();
```

**C++:**
```cpp
vector<int> replaceNegative(const vector<int>& a){ vector<int> r=a; for(int& x:r)if(x<0)x=0; return r; }
```


**Expected Output:**
```text
[3,0,5,0,0]
```

**Explanation (Simple English):**
The conditions compare the number with zero. A value above zero is positive, below zero is negative, and the remaining case is zero.

**Explanation (Simple Hindi):**
Conditions number ko zero se compare karti hain. Zero se bada positive, zero se chhota negative, aur baaki case zero hota hai.

**How to solve this type of problem:**
For classification questions, list the possible cases, check the most specific conditions first, and keep a final else for the remaining case.

---

### 99. Remove a specific value from an array

**Original section:** First batch (Q1–Q100).

**Question:** Remove all occurrences of a given value from an array.

**Answer:**
```js
const arr = [1, 2, 3, 2, 4];
const valueToRemove = 2;

const result = arr.filter(value => value !== valueToRemove);

console.log(result); // [1, 3, 4]
```

**Other Language Solutions:**

**Python:**
```python
def remove_value(arr, target): return [x for x in arr if x != target]
```

**Java:**
```java
static int[] removeValue(int[] a,int t){ return Arrays.stream(a).filter(x->x!=t).toArray(); }
```

**C# (.NET):**
```csharp
static int[] RemoveValue(int[] a,int t) => a.Where(x=>x!=t).ToArray();
```

**C++:**
```cpp
vector<int> removeValue(const vector<int>& a,int t){ vector<int> r; for(int x:a)if(x!=t)r.push_back(x); return r; }
```


**Expected Output:**
```text
[1,3,4]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

## Additional first-batch array exercises

### Chunk an array into groups of size N

**Original section:** Additional first-batch array exercises.

**Question:** Divide an array into smaller arrays, each containing at most `size` elements.

```js
function chunkArray(arr, size) {
  const chunks = [];

  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }

  return chunks;
}

console.log(chunkArray([1, 2, 3, 4, 5, 6, 7], 3));
// [[1, 2, 3], [4, 5, 6], [7]]
```

**Other Language Solutions:**

**Python:**
```python
def chunk_array(arr, size):
    if size <= 0: raise ValueError("size must be positive")
    return [arr[i:i+size] for i in range(0, len(arr), size)]
```

**Java:**
```java
static List<List<Integer>> chunk(int[] a,int size){ if(size<=0)throw new IllegalArgumentException(); List<List<Integer>> r=new ArrayList<>(); for(int i=0;i<a.length;i+=size){ List<Integer> c=new ArrayList<>(); for(int j=i;j<Math.min(i+size,a.length);j++)c.add(a[j]); r.add(c);} return r; }
```

**C# (.NET):**
```csharp
static List<List<int>> Chunk(int[] a,int size){ if(size<=0)throw new ArgumentOutOfRangeException(); var r=new List<List<int>>(); for(int i=0;i<a.Length;i+=size)r.Add(a.Skip(i).Take(size).ToList()); return r; }
```

**C++:**
```cpp
vector<vector<int>> chunk(const vector<int>& a,int size){ if(size<=0)throw invalid_argument("size"); vector<vector<int>> r; for(int i=0;i<a.size();i+=size)r.emplace_back(a.begin()+i,a.begin()+min((int)a.size(),i+size)); return r; }
```


**Expected Output:**
```text
[[1,2,3],[4,5,6],[7]]
```

**Explanation (Simple English):**
The loop advances by the chunk size. slice() copies the next group of values, including a shorter final group if needed.

**Explanation (Simple Hindi):**
Loop chunk size ke gap se aage badhta hai. slice() next group copy karta hai; last group chhota ho sakta hai.

**How to solve this type of problem:**
For chunking, validate that size is positive, increase the index by size, and slice from the current index to index + size.

---

### Find all indexes of a given element

**Original section:** Additional first-batch array exercises.

**Question:** Return every index at which the target value occurs.

```js
function findAllIndexes(arr, target) {
  const indexes = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) indexes.push(i);
  }

  return indexes;
}

console.log(findAllIndexes([1, 2, 4, 2, 4], 4)); // [2, 4]
```

**Other Language Solutions:**

**Python:**
```python
def all_indexes(arr, target): return [i for i, x in enumerate(arr) if x == target]
```

**Java:**
```java
static List<Integer> allIndexes(int[] a,int t){ List<Integer> r=new ArrayList<>(); for(int i=0;i<a.length;i++)if(a[i]==t)r.add(i); return r; }
```

**C# (.NET):**
```csharp
static List<int> AllIndexes(int[] a,int t){ var r=new List<int>(); for(int i=0;i<a.Length;i++)if(a[i]==t)r.Add(i); return r; }
```

**C++:**
```cpp
vector<int> allIndexes(const vector<int>& a,int t){ vector<int> r; for(int i=0;i<a.size();i++)if(a[i]==t)r.push_back(i); return r; }
```


**Expected Output:**
```text
[2,4]
```

**Explanation (Simple English):**
The solution scans the array and compares each element with the target. Depending on the task, it returns the first match, all matching indexes, or a not-found value.

**Explanation (Simple Hindi):**
Code array scan karke har element ko target se compare karta hai. Task ke hisaab se pehla match, saare indexes, ya not-found value return hoti hai.

**How to solve this type of problem:**
For search problems, decide whether you need a value or an index, scan the array, and define clearly what to return when no match is found.

---

### Create a range array

**Original section:** Additional first-batch array exercises.

**Question:** Create an array containing all integers from `start` to `end`, inclusive.

```js
function createRange(start, end) {
  const result = [];

  for (let value = start; value <= end; value++) {
    result.push(value);
  }

  return result;
}

console.log(createRange(3, 10)); // [3, 4, 5, 6, 7, 8, 9, 10]
```

**Other Language Solutions:**

**Python:**
```python
def create_range(start, end): return list(range(start, end + 1))
```

**Java:**
```java
static List<Integer> createRange(int start,int end){ List<Integer> r=new ArrayList<>(); for(int i=start;i<=end;i++)r.add(i); return r; }
```

**C# (.NET):**
```csharp
static int[] CreateRange(int start,int end) => Enumerable.Range(start,end-start+1).ToArray();
```

**C++:**
```cpp
vector<int> createRange(int start,int end){ vector<int> r; for(int i=start;i<=end;i++)r.push_back(i); return r; }
```


**Expected Output:**
```text
[3,4,5,6,7,8,9,10]
```

**Explanation (Simple English):**
A counter starts at the first number and increases by one until it reaches the ending number. Each value is pushed into the result.

**Explanation (Simple Hindi):**
Counter starting number se shuru hota hai aur end number tak ek-ek karke badhta hai. Har value result array mein push hoti hai.

**How to solve this type of problem:**
For range generation, initialize at start, loop until end (inclusive if required), push each value, and consider start greater than end.

---

### Swap two adjacent elements

**Original section:** Additional first-batch array exercises.

**Question:** Swap each adjacent pair of elements in an array.

```js
function swapAdjacentPairs(arr) {
  const result = [...arr];

  for (let i = 0; i < result.length - 1; i += 2) {
    [result[i], result[i + 1]] = [result[i + 1], result[i]];
  }

  return result;
}

console.log(swapAdjacentPairs([1, 2, 3, 4, 5]));
// [2, 1, 4, 3, 5]
```

**Other Language Solutions:**

**Python:**
```python
def swap_adjacent(arr):
    r = arr.copy()
    for i in range(0, len(r)-1, 2): r[i], r[i+1] = r[i+1], r[i]
    return r
```

**Java:**
```java
static int[] swapAdjacent(int[] a){ int[] r=a.clone(); for(int i=0;i+1<r.length;i+=2){int t=r[i];r[i]=r[i+1];r[i+1]=t;} return r; }
```

**C# (.NET):**
```csharp
static int[] SwapAdjacent(int[] a){ var r=(int[])a.Clone(); for(int i=0;i+1<r.Length;i+=2)(r[i],r[i+1])=(r[i+1],r[i]); return r; }
```

**C++:**
```cpp
vector<int> swapAdjacent(vector<int> a){ for(int i=0;i+1<a.size();i+=2)swap(a[i],a[i+1]); return a; }
```


**Expected Output:**
```text
[2,1,4,3,5]
```

**Explanation (Simple English):**
The solution identifies the two positions and exchanges their values. A temporary variable or destructuring assignment makes sure neither value is lost during the swap.

**Explanation (Simple Hindi):**
Code dono positions identify karke unki values exchange karta hai. Temporary variable ya destructuring assignment se swap ke dauraan koi value lost nahi hoti.

**How to solve this type of problem:**
For swapping array elements, verify both indexes, then exchange arr[i] and arr[j] using a temporary variable or [arr[i], arr[j]] = [arr[j], arr[i]].

---

### Remove elements less than a given number

**Original section:** Additional first-batch array exercises.

**Question:** Return only values greater than or equal to a threshold.

```js
function removeBelowThreshold(arr, threshold) {
  return arr.filter(value => value >= threshold);
}

console.log(removeBelowThreshold([1, 5, 10, 2, 8], 5));
// [5, 10, 8]
```

**Other Language Solutions:**

**Python:**
```python
def at_least(arr, threshold): return [x for x in arr if x >= threshold]
```

**Java:**
```java
static int[] atLeast(int[] a,int t){ return Arrays.stream(a).filter(x->x>=t).toArray(); }
```

**C# (.NET):**
```csharp
static int[] AtLeast(int[] a,int t)=>a.Where(x=>x>=t).ToArray();
```

**C++:**
```cpp
vector<int> atLeast(const vector<int>& a,int t){ vector<int> r; for(int x:a)if(x>=t)r.push_back(x); return r; }
```


**Expected Output:**
```text
[5,10,8]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

### Interleave two arrays

**Original section:** Additional first-batch array exercises.

**Question:** Alternate elements from two arrays in the output.

```js
function interleave(a, b) {
  const result = [];

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) result.push(a[i]);
    if (i < b.length) result.push(b[i]);
  }

  return result;
}

console.log(interleave([1, 2, 3], ["a", "b", "c"]));
// [1, "a", 2, "b", 3, "c"]
```

**Other Language Solutions:**

**Python:**
```python
def interleave(a, b):
    out=[]
    for i in range(max(len(a),len(b))):
        if i<len(a): out.append(a[i])
        if i<len(b): out.append(b[i])
    return out
```

**Java:**
```java
static List<Integer> interleave(int[] a,int[] b){ List<Integer> r=new ArrayList<>(); for(int i=0;i<Math.max(a.length,b.length);i++){if(i<a.length)r.add(a[i]);if(i<b.length)r.add(b[i]);}return r;}
```

**C# (.NET):**
```csharp
static List<int> Interleave(int[] a,int[] b){ var r=new List<int>(); for(int i=0;i<Math.Max(a.Length,b.Length);i++){if(i<a.Length)r.Add(a[i]);if(i<b.Length)r.Add(b[i]);}return r;}
```

**C++:**
```cpp
vector<int> interleave(const vector<int>& a,const vector<int>& b){ vector<int> r; for(int i=0;i<max(a.size(),b.size());i++){if(i<a.size())r.push_back(a[i]);if(i<b.size())r.push_back(b[i]);}return r;}
```


**Expected Output:**
```text
[1,"a",2,"b",3,"c"]
```

**Explanation (Simple English):**
The loop takes one item from the first array and then one from the second array. It checks lengths so extra items from a longer array are not lost.

**Explanation (Simple Hindi):**
Loop pehle array se ek item aur phir doosre array se ek item leta hai. Length check hone se bade array ke extra elements bhi miss nahi hote.

**How to solve this type of problem:**
For interleaving, loop to the larger array length and conditionally push an item from each input at every index.

---

### Split array elements by even and odd indexes

**Original section:** Additional first-batch array exercises.

**Question:** Put elements at even indexes and odd indexes into separate arrays.

```js
function splitByIndex(arr) {
  const evenIndex = [];
  const oddIndex = [];

  for (let i = 0; i < arr.length; i++) {
    if (i % 2 === 0) evenIndex.push(arr[i]);
    else oddIndex.push(arr[i]);
  }

  return { evenIndex, oddIndex };
}

console.log(splitByIndex([1, 2, 3, 4, 5, 6]));
// { evenIndex: [1, 3, 5], oddIndex: [2, 4, 6] }
```

**Other Language Solutions:**

**Python:**
```python
def split_by_index(arr):
    return [arr[::2], arr[1::2]]
```

**Java:**
```java
static List<List<Integer>> splitByIndex(int[] a){ List<Integer> even=new ArrayList<>(),odd=new ArrayList<>(); for(int i=0;i<a.length;i++)(i%2==0?even:odd).add(a[i]); return Arrays.asList(even,odd); }
```

**C# (.NET):**
```csharp
static (List<int> even,List<int> odd) SplitByIndex(int[] a){var e=new List<int>();var o=new List<int>();for(int i=0;i<a.Length;i++)(i%2==0?e:o).Add(a[i]);return(e,o);}
```

**C++:**
```cpp
pair<vector<int>,vector<int>> splitByIndex(const vector<int>& a){vector<int> e,o;for(int i=0;i<a.size();i++)(i%2==0?e:o).push_back(a[i]);return{e,o};}
```


**Expected Output:**
```text
{"evenIndex":[1,3,5],"oddIndex":[2,4,6]}
```

**Explanation (Simple English):**
The remainder operator (%) tells whether a number is divisible by 2. A remainder of zero means even; otherwise it is odd.

**Explanation (Simple Hindi):**
% operator batata hai ki number 2 se poori tarah divide hota hai ya nahi. Remainder zero ho toh even, warna odd hota hai.

**How to solve this type of problem:**
For even/odd tasks, use number % 2, then either count, filter, or place each number into the required result group.

---

### Find the average of an array

**Original section:** Additional first-batch array exercises.

**Question:** Calculate the arithmetic mean of all array values.

```js
function arrayAverage(arr) {
  if (arr.length === 0) {
    throw new Error("Array must not be empty");
  }

  const sum = arr.reduce((total, value) => total + value, 0);
  return sum / arr.length;
}

console.log(arrayAverage([2, 4, 6, 8, 10])); // 6
```

**Other Language Solutions:**

**Python:**
```python
def average(arr):
    if not arr: raise ValueError("array must not be empty")
    return sum(arr) / len(arr)
```

**Java:**
```java
static double average(int[] a){ if(a.length==0) throw new IllegalArgumentException(); return Arrays.stream(a).average().orElseThrow(); }
```

**C# (.NET):**
```csharp
static double Average(int[] a) { if(a.Length==0) throw new ArgumentException(); return a.Average(); }
```

**C++:**
```cpp
double average(const vector<int>& a){ if(a.empty()) throw invalid_argument("empty"); return (double)accumulate(a.begin(),a.end(),0)/a.size(); }
```


**Expected Output:**
```text
6
```

**Explanation (Simple English):**
The solution first calculates the total of all values, then divides that total by the number of elements. An empty array must be handled separately.

**Explanation (Simple Hindi):**
Pehle saare numbers ka sum nikalta hai, phir us sum ko elements ki count se divide karta hai. Empty array ko alag handle karna zaroori hai.

**How to solve this type of problem:**
For average problems, calculate the sum, divide by array length, and decide what to do when the array is empty.

---

### Find the product of all elements

**Original section:** Additional first-batch array exercises.

**Question:** Multiply all numbers in an array.

```js
function productOfArray(arr) {
  return arr.reduce((product, value) => product * value, 1);
}

console.log(productOfArray([1, 2, 3, 4])); // 24
```

**Other Language Solutions:**

**Python:**
```python
from math import prod
def product_array(arr): return prod(arr)
```

**Java:**
```java
static long productArray(int[] a){ long p=1; for(int x:a)p*=x; return p; }
```

**C# (.NET):**
```csharp
static long ProductArray(int[] a)=>a.Aggregate(1L,(p,x)=>p*x);
```

**C++:**
```cpp
long long productArray(const vector<int>& a){ long long p=1;for(int x:a)p*=x;return p;}
```


**Expected Output:**
```text
24
```

**Explanation (Simple English):**
The accumulator starts at 1 and is multiplied by each element. Starting at 1 keeps the multiplication result correct.

**Explanation (Simple Hindi):**
Accumulator 1 se start hota hai aur har element se multiply hota hai. Multiplication ke liye starting value 1 rakhna sahi hota hai.

**How to solve this type of problem:**
For product problems, initialize product = 1, multiply every value into it, and consider what an empty input should mean.

---

### Count positive, negative, and zero values

**Original section:** Additional first-batch array exercises.

**Question:** Count how many values are positive, negative, and zero.

```js
function countSigns(arr) {
  let positive = 0;
  let negative = 0;
  let zero = 0;

  for (const value of arr) {
    if (value > 0) positive++;
    else if (value < 0) negative++;
    else zero++;
  }

  return { positive, negative, zero };
}

console.log(countSigns([-1, 0, 5, -3, 2, 0]));
// { positive: 2, negative: 2, zero: 2 }
```

**Other Language Solutions:**

**Python:**
```python
def count_signs(arr):
    return {"positive":sum(x>0 for x in arr), "negative":sum(x<0 for x in arr), "zero":sum(x==0 for x in arr)}
```

**Java:**
```java
static Map<String,Integer> countSigns(int[] a){ Map<String,Integer> r=new LinkedHashMap<>(); r.put("positive",0);r.put("negative",0);r.put("zero",0);for(int x:a){String k=x>0?"positive":x<0?"negative":"zero";r.put(k,r.get(k)+1);}return r;}
```

**C# (.NET):**
```csharp
static Dictionary<string,int> CountSigns(int[] a){var r=new Dictionary<string,int>{{"positive",0},{"negative",0},{"zero",0}};foreach(int x in a)r[x>0?"positive":x<0?"negative":"zero"]++;return r;}
```

**C++:**
```cpp
map<string,int> countSigns(const vector<int>& a){map<string,int> r{{"positive",0},{"negative",0},{"zero",0}};for(int x:a)r[x>0?"positive":x<0?"negative":"zero"]++;return r;}
```


**Expected Output:**
```text
{"positive":2,"negative":2,"zero":2}
```

**Explanation (Simple English):**
The conditions compare the number with zero. A value above zero is positive, below zero is negative, and the remaining case is zero.

**Explanation (Simple Hindi):**
Conditions number ko zero se compare karti hain. Zero se bada positive, zero se chhota negative, aur baaki case zero hota hai.

**How to solve this type of problem:**
For classification questions, list the possible cases, check the most specific conditions first, and keep a final else for the remaining case.

---

### Reverse an array using a loop

**Original section:** Additional first-batch array exercises.

**Question:** Reverse an array without using the built-in `reverse()` method.

```js
function reverseArrayLoop(arr) {
  const result = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i]);
  }

  return result;
}

console.log(reverseArrayLoop([1, 2, 3, 4]));
// [4, 3, 2, 1]
```

**Other Language Solutions:**

**Python:**
```python
def reverse_array(arr):
    r=arr.copy(); left=0; right=len(r)-1
    while left<right: r[left],r[right]=r[right],r[left]; left+=1; right-=1
    return r
```

**Java:**
```java
static int[] reverseArray(int[] a){ int[] r=a.clone(); for(int i=0,j=r.length-1;i<j;i++,j--){int t=r[i];r[i]=r[j];r[j]=t;} return r; }
```

**C# (.NET):**
```csharp
static int[] ReverseArray(int[] a){ int[] r=(int[])a.Clone(); for(int i=0,j=r.Length-1;i<j;i++,j--)(r[i],r[j])=(r[j],r[i]); return r; }
```

**C++:**
```cpp
vector<int> reverseArray(vector<int> a){ for(int i=0,j=(int)a.size()-1;i<j;i++,j--)swap(a[i],a[j]); return a; }
```


**Expected Output:**
```text
[4,3,2,1]
```

**Explanation (Simple English):**
The solution reads the value from the end towards the beginning and builds a new reversed result. This avoids changing the original array/string when a new result is required.

**Explanation (Simple Hindi):**
Code value ko end se start ki taraf read karke naya reversed result banata hai. Naya array/string banane se original value safe rehti hai.

**How to solve this type of problem:**
For reversing, identify whether you must mutate the original or return a new value, then traverse backward or use split/reverse/join for strings.

---

### Count strings that start with a given letter

**Original section:** Additional first-batch array exercises.

**Question:** Count the strings in an array that start with a specified letter.

```js
function countStartingWith(arr, letter) {
  const target = letter.toLowerCase();

  return arr.filter(
    word => typeof word === "string" &&
      word.toLowerCase().startsWith(target)
  ).length;
}

console.log(countStartingWith(["apple", "banana", "apricot", "pear"], "a"));
// 2
```

**Other Language Solutions:**

**Python:**
```python
def count_starting_with(words, letter):
    return sum(isinstance(w,str) and w.lower().startswith(letter.lower()) for w in words)
```

**Java:**
```java
static long countStartingWith(String[] a,char c){ return Arrays.stream(a).filter(s->!s.isEmpty()&&Character.toLowerCase(s.charAt(0))==Character.toLowerCase(c)).count(); }
```

**C# (.NET):**
```csharp
static int CountStartingWith(string[] a,char c)=>a.Count(s=>!string.IsNullOrEmpty(s)&&char.ToLower(s[0])==char.ToLower(c));
```

**C++:**
```cpp
int countStartingWith(const vector<string>& a,char c){int n=0;for(auto&s:a)if(!s.empty()&&tolower((unsigned char)s[0])==tolower((unsigned char)c))n++;return n;}
```


**Expected Output:**
```text
2
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

### Capitalize each string in an array

**Original section:** Additional first-batch array exercises.

**Question:** Convert the first character of each string to uppercase.

```js
function capitalizeArray(arr) {
  return arr.map(word =>
    word.length ? word[0].toUpperCase() + word.slice(1) : word
  );
}

console.log(capitalizeArray(["cat", "dog", "bird"]));
// ["Cat", "Dog", "Bird"]
```

**Other Language Solutions:**

**Python:**
```python
def capitalize_array(words): return [w[:1].upper()+w[1:] for w in words]
```

**Java:**
```java
static String[] capitalizeArray(String[] a){return Arrays.stream(a).map(s->s.isEmpty()?s:s.substring(0,1).toUpperCase()+s.substring(1)).toArray(String[]::new);}
```

**C# (.NET):**
```csharp
static string[] CapitalizeArray(string[] a)=>a.Select(s=>s.Length==0?s:char.ToUpper(s[0])+s.Substring(1)).ToArray();
```

**C++:**
```cpp
vector<string> capitalizeArray(vector<string> a){for(auto&s:a)if(!s.empty())s[0]=toupper((unsigned char)s[0]);return a;}
```


**Expected Output:**
```text
["Cat","Dog","Bird"]
```

**Explanation (Simple English):**
The map() method visits every element and converts it into a new value. The result has the same number of elements as the input array.

**Explanation (Simple Hindi):**
map() har element par jaata hai aur usko naye value mein convert karta hai. Result array mein elements ki count original ke barabar rehti hai.

**How to solve this type of problem:**
For transformation problems, decide what one input item should become, write that transformation in map(), and return the new value from the callback.

---

### Trim whitespace from every string in an array

**Original section:** Additional first-batch array exercises.

**Question:** Remove leading and trailing spaces from each string in an array.

```js
const wordsWithSpaces = [" hello ", " world ", " JavaScript "];
const trimmedWords = wordsWithSpaces.map(word => word.trim());

console.log(trimmedWords); // ["hello", "world", "JavaScript"]
```

**Other Language Solutions:**

**Python:**
```python
def trim(s): return s.strip()
```

**Java:**
```java
static String trim(String s){return s.trim();}
```

**C# (.NET):**
```csharp
static string Trim(string s)=>s.Trim();
```

**C++:**
```cpp
string trim(const string& s){size_t b=s.find_first_not_of(" \t\n"),e=s.find_last_not_of(" \t\n");return b==string::npos?"":s.substr(b,e-b+1);}
```


**Expected Output:**
```text
["hello","world","JavaScript"]
```

**Explanation (Simple English):**
The map() method visits every element and converts it into a new value. The result has the same number of elements as the input array.

**Explanation (Simple Hindi):**
map() har element par jaata hai aur usko naye value mein convert karta hai. Result array mein elements ki count original ke barabar rehti hai.

**How to solve this type of problem:**
For transformation problems, decide what one input item should become, write that transformation in map(), and return the new value from the callback.

---

### Check whether an array is sorted in ascending order

**Original section:** Additional first-batch array exercises.

**Question:** Check whether every element is greater than or equal to the previous element.

```js
function isSortedAscending(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }

  return true;
}

console.log(isSortedAscending([1, 2, 2, 4, 5])); // true
console.log(isSortedAscending([1, 3, 2, 4]));    // false
```

**Other Language Solutions:**

**Python:**
```python
def is_sorted(arr): return all(arr[i] >= arr[i-1] for i in range(1,len(arr)))
```

**Java:**
```java
static boolean isSorted(int[] a){for(int i=1;i<a.length;i++)if(a[i]<a[i-1])return false;return true;}
```

**C# (.NET):**
```csharp
static bool IsSorted(int[] a){for(int i=1;i<a.Length;i++)if(a[i]<a[i-1])return false;return true;}
```

**C++:**
```cpp
bool isSorted(const vector<int>& a){for(int i=1;i<a.size();i++)if(a[i]<a[i-1])return false;return true;}
```


**Expected Output:**
```text
true
false
```

**Explanation (Simple English):**
The values are arranged according to a comparison rule. For numeric sorting, the comparator must return a negative, zero, or positive value based on the order.

**Explanation (Simple Hindi):**
Values ko comparison rule ke hisaab se arrange kiya jaata hai. Numeric sorting mein comparator batata hai ki kaunsa number pehle aayega.

**How to solve this type of problem:**
For sorting, decide ascending or descending order, use the correct numeric comparator, and remember that sort() changes the original array.

---

## First-batch closing exercises (Q146 onward)

### 146. Remove every second element from an array

**Original section:** First-batch closing exercises (Q146 onward).

**Question:** Create a new array containing the elements at even indexes (0, 2, 4, ...).

**Answer:**
```js
function removeEverySecond(arr) {
  return arr.filter((_, index) => index % 2 === 0);
}

console.log(removeEverySecond([1, 2, 3, 4, 5, 6]));
// [1, 3, 5]
```

**Other Language Solutions:**

**Python:**
```python
def remove_every_second(arr): return arr[::2]
```

**Java:**
```java
static int[] removeEverySecond(int[] a){return java.util.stream.IntStream.range(0,a.length).filter(i->i%2==0).map(i->a[i]).toArray();}
```

**C# (.NET):**
```csharp
static int[] RemoveEverySecond(int[] a)=>a.Where((x,i)=>i%2==0).ToArray();
```

**C++:**
```cpp
vector<int> removeEverySecond(const vector<int>& a){vector<int> r;for(int i=0;i<a.size();i+=2)r.push_back(a[i]);return r;}
```


**Expected Output:**
```text
[1,3,5]
```

**Explanation (Simple English):**
The remainder operator (%) tells whether a number is divisible by 2. A remainder of zero means even; otherwise it is odd.

**Explanation (Simple Hindi):**
% operator batata hai ki number 2 se poori tarah divide hota hai ya nahi. Remainder zero ho toh even, warna odd hota hai.

**How to solve this type of problem:**
For even/odd tasks, use number % 2, then either count, filter, or place each number into the required result group.

---

### 149. Reverse each string in an array

**Original section:** First-batch closing exercises (Q146 onward).

**Question:** Reverse every string present in an array.

**Answer:**
```js
const words = ["one", "two", "three"];

const reversedWords = words.map(word =>
  word.split("").reverse().join("")
);

console.log(reversedWords); // ["eno", "owt", "eerht"]
```

**Other Language Solutions:**

**Python:**
```python
def reverse_each(words): return [w[::-1] for w in words]
```

**Java:**
```java
static String[] reverseEach(String[] a){return Arrays.stream(a).map(s->new StringBuilder(s).reverse().toString()).toArray(String[]::new);}
```

**C# (.NET):**
```csharp
static string[] ReverseEach(string[] a)=>a.Select(s=>new string(s.Reverse().ToArray())).ToArray();
```

**C++:**
```cpp
vector<string> reverseEach(vector<string> a){for(auto&s:a)reverse(s.begin(),s.end());return a;}
```


**Expected Output:**
```text
["eno","owt","eerht"]
```

**Explanation (Simple English):**
The map() method visits every element and converts it into a new value. The result has the same number of elements as the input array.

**Explanation (Simple Hindi):**
map() har element par jaata hai aur usko naye value mein convert karta hai. Result array mein elements ki count original ke barabar rehti hai.

**How to solve this type of problem:**
For transformation problems, decide what one input item should become, write that transformation in map(), and return the new value from the callback.

---

### 152. Remove all strings from a mixed array

**Original section:** First-batch closing exercises (Q146 onward).

**Question:** Remove string values and keep the non-string values.

**Answer:**
```js
const mixed = [1, "hello", 2, "world", 3];

const result = mixed.filter(value => typeof value !== "string");

console.log(result); // [1, 2, 3]
```

**Other Language Solutions:**

**Python:**
```python
def remove_strings(values): return [x for x in values if not isinstance(x,str)]
```

**Java:**
```java
static List<Object> removeStrings(List<Object> a){List<Object> r=new ArrayList<>();for(Object x:a)if(!(x instanceof String))r.add(x);return r;}
```

**C# (.NET):**
```csharp
static object[] RemoveStrings(object[] a)=>a.Where(x=>x is not string).ToArray();
```

**C++:**
```cpp
// Use a tagged variant for mixed values; keep non-string alternatives.
vector<variant<int,double,bool>> removeStrings(const vector<variant<int,double,bool,string>>& a){vector<variant<int,double,bool>> r;for(auto&x:a)if(!holds_alternative<string>(x)){if(holds_alternative<int>(x))r.push_back(get<int>(x));else if(holds_alternative<double>(x))r.push_back(get<double>(x));else r.push_back(get<bool>(x));}return r;}
```


**Expected Output:**
```text
[1,2,3]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

---

# Section B – Intermediate JavaScript / Array Questions (Notebook Questions 1–26)

---

## 100 Intermediate JS section (26 visible questions)

### 7. Find strings whose length is greater than 3

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Filter an array and keep only strings longer than three characters.

**Answer:**
```js
const words = ["hi", "hello", "world", "JS"];

const result = words.filter(word => word.length > 3);

console.log(result); // ["hello", "world"]
```

**Other Language Solutions:**

**Python:**
```python
def long_strings(words): return [w for w in words if len(w)>3]
```

**Java:**
```java
static List<String> longStrings(String[] a){List<String> r=new ArrayList<>();for(String s:a)if(s.length()>3)r.add(s);return r;}
```

**C# (.NET):**
```csharp
static string[] LongStrings(string[] a)=>a.Where(s=>s.Length>3).ToArray();
```

**C++:**
```cpp
vector<string> longStrings(const vector<string>& a){vector<string>r;for(auto&s:a)if(s.size()>3)r.push_back(s);return r;}
```


**Expected Output:**
```text
["hello","world"]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

## String questions (58)

### 1. Find the length of a string

**Original section:** String questions (58).

**Question:** Find the number of characters in a string.

**Answer:**
```js
const str = "JavaScript";
console.log(str.length); // 10
```

**Other Language Solutions:**

**Python:**
```python
def string_length(s): return len(s)
```

**Java:**
```java
static int stringLength(String s){return s.length();}
```

**C# (.NET):**
```csharp
static int StringLength(string s)=>s.Length;
```

**C++:**
```cpp
int stringLength(const string& s){return (int)s.size();}
```


**Expected Output:**
```text
10
```

**Explanation (Simple English):**
A string is a sequence of characters. The length property gives the number of characters, indexes start at zero, and comparison/concatenation operators let us compare or join text.

**Explanation (Simple Hindi):**
String characters ki sequence hoti hai. length property characters ki count deti hai, index zero se start hota hai, aur comparison/concatenation operators se text compare ya join kar sakte hain.

**How to solve this type of problem:**
For basic string questions, check whether you need a length, a character at an index, or a text comparison; remember that the first index is 0 and the last is length - 1.

---

### 2. Access the first character of a string

**Original section:** String questions (58).

**Question:** Get the first character using its index.

**Answer:**
```js
const str = "Hello";
console.log(str[0]); // H
```

**Other Language Solutions:**

**Python:**
```python
def first_char(s): return s[0] if s else ""
```

**Java:**
```java
static String firstChar(String s){return s.isEmpty()?"":s.substring(0,1);}
```

**C# (.NET):**
```csharp
static string FirstChar(string s)=>string.IsNullOrEmpty(s)?"":s.Substring(0,1);
```

**C++:**
```cpp
string firstChar(const string& s){return s.empty()?"":s.substr(0,1);}
```


**Expected Output:**
```text
H
```

**Explanation (Simple English):**
A string is a sequence of characters. The length property gives the number of characters, indexes start at zero, and comparison/concatenation operators let us compare or join text.

**Explanation (Simple Hindi):**
String characters ki sequence hoti hai. length property characters ki count deti hai, index zero se start hota hai, aur comparison/concatenation operators se text compare ya join kar sakte hain.

**How to solve this type of problem:**
For basic string questions, check whether you need a length, a character at an index, or a text comparison; remember that the first index is 0 and the last is length - 1.

---

### 3. Access the last character of a string

**Original section:** String questions (58).

**Question:** Get the last character of a string.

**Answer:**
```js
const str = "World";
console.log(str[str.length - 1]); // d
```

**Other Language Solutions:**

**Python:**
```python
def last_char(s): return s[-1] if s else ""
```

**Java:**
```java
static String lastChar(String s){return s.isEmpty()?"":s.substring(s.length()-1);}
```

**C# (.NET):**
```csharp
static string LastChar(string s)=>string.IsNullOrEmpty(s)?"":s.Substring(s.Length-1);
```

**C++:**
```cpp
string lastChar(const string& s){return s.empty()?"":s.substr(s.size()-1);}
```


**Expected Output:**
```text
d
```

**Explanation (Simple English):**
A string is a sequence of characters. The length property gives the number of characters, indexes start at zero, and comparison/concatenation operators let us compare or join text.

**Explanation (Simple Hindi):**
String characters ki sequence hoti hai. length property characters ki count deti hai, index zero se start hota hai, aur comparison/concatenation operators se text compare ya join kar sakte hain.

**How to solve this type of problem:**
For basic string questions, check whether you need a length, a character at an index, or a text comparison; remember that the first index is 0 and the last is length - 1.

---

### 4. Convert a string to uppercase and lowercase

**Original section:** String questions (58).

**Question:** Convert a string to uppercase and lowercase.

**Answer:**
```js
const str = "hello";

console.log(str.toUpperCase()); // HELLO
console.log(str.toLowerCase()); // hello
```

**Other Language Solutions:**

**Python:**
```python
def upper_lower(s): return s.upper(), s.lower()
```

**Java:**
```java
static String[] upperLower(String s){return new String[]{s.toUpperCase(),s.toLowerCase()};}
```

**C# (.NET):**
```csharp
static string[] UpperLower(string s)=>new[]{s.ToUpper(),s.ToLower()};
```

**C++:**
```cpp
pair<string,string> upperLower(string s){string a=s,b=s;for(char&c:a)c=toupper((unsigned char)c);for(char&c:b)c=tolower((unsigned char)c);return{a,b};}
```


**Expected Output:**
```text
HELLO
hello
```

**Explanation (Simple English):**
The code changes letter case using uppercase/lowercase methods. For mixed-case tasks, it checks each character and switches it to the opposite case.

**Explanation (Simple Hindi):**
Code uppercase/lowercase methods se letters ka case badalta hai. Mixed-case task mein har character check karke uska opposite case banaya jaata hai.

**How to solve this type of problem:**
For case-conversion problems, choose whether to change the whole string, only the first letter, or every word; then use the matching string methods.

---

### 5. Compare two strings alphabetically and concatenate them

**Original section:** String questions (58).

**Question:** Compare two strings using alphabetical order and join two strings.

**Answer:**
```js
const a = "apple";
const b = "banana";

console.log(a < b); // true
console.log(a + " " + b); // apple banana
```

**Other Language Solutions:**

**Python:**
```python
def compare_and_join(a,b): return a < b, a + " " + b
```

**Java:**
```java
static boolean alphabeticalBefore(String a,String b){return a.compareTo(b)<0;}
```

**C# (.NET):**
```csharp
static bool AlphabeticalBefore(string a,string b)=>string.CompareOrdinal(a,b)<0;
```

**C++:**
```cpp
bool alphabeticalBefore(const string&a,const string&b){return a<b;}
```


**Expected Output:**
```text
true
apple banana
```

**Explanation (Simple English):**
A string is a sequence of characters. The length property gives the number of characters, indexes start at zero, and comparison/concatenation operators let us compare or join text.

**Explanation (Simple Hindi):**
String characters ki sequence hoti hai. length property characters ki count deti hai, index zero se start hota hai, aur comparison/concatenation operators se text compare ya join kar sakte hain.

**How to solve this type of problem:**
For basic string questions, check whether you need a length, a character at an index, or a text comparison; remember that the first index is 0 and the last is length - 1.

---

### 6. Trim whitespace from both ends

**Original section:** String questions (58).

**Question:** Remove leading and trailing whitespace.

**Answer:**
```js
const str = "  hello world  ";

console.log(str.trim()); // "hello world"
```

**Other Language Solutions:**

**Python:**
```python
def trim(s): return s.strip()
```

**Java:**
```java
static String trim(String s){return s.trim();}
```

**C# (.NET):**
```csharp
static string Trim(string s)=>s.Trim();
```

**C++:**
```cpp
string trim(const string& s){size_t b=s.find_first_not_of(" \t\n"),e=s.find_last_not_of(" \t\n");return b==string::npos?"":s.substr(b,e-b+1);}
```


**Expected Output:**
```text
hello world
```

**Explanation (Simple English):**
startsWith() checks the beginning of the string and endsWith() checks its ending. Both conditions must be true when both are required.

**Explanation (Simple Hindi):**
startsWith() string ki shuruaat check karta hai aur endsWith() ending check karta hai. Dono required hon toh dono true hone chahiye.

**How to solve this type of problem:**
For start/end checks, use the exact prefix and suffix and remember that string comparisons are case-sensitive by default.

---

### 7. Trim only leading spaces

**Original section:** String questions (58).

**Question:** Remove whitespace from the beginning of a string.

**Answer:**
```js
const str = "   hello";

console.log(str.trimStart()); // "hello"
```

**Other Language Solutions:**

**Python:**
```python
def trim_start(s): return s.lstrip()
```

**Java:**
```java
static String trimStart(String s){return s.replaceFirst("^\\s+", "");}
```

**C# (.NET):**
```csharp
static string TrimStart(string s)=>s.TrimStart();
```

**C++:**
```cpp
string trimStart(const string& s){size_t p=s.find_first_not_of(" \t\n");return p==string::npos?"":s.substr(p);}
```


**Expected Output:**
```text
hello
```

**Explanation (Simple English):**
The code either trims unwanted spaces at the edges or replaces spaces inside the text with a chosen separator.

**Explanation (Simple Hindi):**
Code ya toh string ke start/end ke extra spaces remove karta hai ya beech ke spaces ko diye gaye separator se replace karta hai.

**How to solve this type of problem:**
For whitespace tasks, distinguish leading/trailing spaces from spaces between words, then use trim(), trimStart(), or a replacement pattern.

---

### 8. Replace part of a string

**Original section:** String questions (58).

**Question:** Replace a matching part of a string.

**Answer:**
```js
const str = "I like cats";

console.log(str.replace("cats", "dogs")); // I like dogs
```

**Other Language Solutions:**

**Python:**
```python
def replace_one(s, old, new): return s.replace(old,new,1)
```

**Java:**
```java
static String replaceOne(String s,String oldValue,String newValue){int i=s.indexOf(oldValue);return i<0?s:s.substring(0,i)+newValue+s.substring(i+oldValue.length());}
```

**C# (.NET):**
```csharp
static string ReplaceOne(string s,string oldValue,string newValue){int i=s.IndexOf(oldValue);return i<0?s:s.Remove(i,oldValue.Length).Insert(i,newValue);}
```

**C++:**
```cpp
string replaceOne(string s,const string&o,const string&n){size_t p=s.find(o);if(p!=string::npos)s.replace(p,o.size(),n);return s;}
```


**Expected Output:**
```text
I like dogs
```

**Explanation (Simple English):**
replace() changes the first matching part by default, while replaceAll() or a global regular expression changes every occurrence.

**Explanation (Simple Hindi):**
replace() default mein pehla matching part change karta hai, jabki replaceAll() ya global regex har occurrence change karta hai.

**How to solve this type of problem:**
For replacement, decide whether one or all matches should change, consider case sensitivity, and choose replace(), replaceAll(), or a regex.

---

### 9. Replace all occurrences of a word

**Original section:** String questions (58).

**Question:** Replace every occurrence of a word in a string.

**Answer:**
```js
const str = "apple banana apple";

console.log(str.replaceAll("apple", "orange"));
// orange banana orange
```

**Other Language Solutions:**

**Python:**
```python
def replace_all(s, old, new): return s.replace(old,new)
```

**Java:**
```java
static String replaceAll(String s,String oldValue,String newValue){return s.replace(oldValue,newValue);}
```

**C# (.NET):**
```csharp
static string ReplaceAll(string s,string oldValue,string newValue)=>s.Replace(oldValue,newValue);
```

**C++:**
```cpp
string replaceAll(string s,const string&o,const string&n){size_t p=0;while((p=s.find(o,p))!=string::npos){s.replace(p,o.size(),n);p+=n.size();}return s;}
```


**Expected Output:**
```text
orange banana orange
```

**Explanation (Simple English):**
replace() changes the first matching part by default, while replaceAll() or a global regular expression changes every occurrence.

**Explanation (Simple Hindi):**
replace() default mein pehla matching part change karta hai, jabki replaceAll() ya global regex har occurrence change karta hai.

**How to solve this type of problem:**
For replacement, decide whether one or all matches should change, consider case sensitivity, and choose replace(), replaceAll(), or a regex.

---

### 10. Check whether a string contains a substring

**Original section:** String questions (58).

**Question:** Check whether a string contains a specified word.

**Answer:**
```js
const str = "I love JavaScript";

console.log(str.includes("love")); // true
```

**Other Language Solutions:**

**Python:**
```python
def contains_text(s, part):
    return part in s
```

**Java:**
```java
static boolean containsText(String s, String part) { return s.contains(part); }
```

**C# (.NET):**
```csharp
static bool ContainsText(string s, string part) => s.Contains(part);
```

**C++:**
```cpp
bool containsText(const string& s,const string& part){ return s.find(part)!=string::npos; }
```


**Expected Output:**
```text
true
```

**Explanation (Simple English):**
The solution checks whether the target text exists inside the main string. Methods such as includes() or indexOf() answer this directly.

**Explanation (Simple Hindi):**
Code check karta hai ki target text main string ke andar present hai ya nahi. includes() ya indexOf() se ye check ho jaata hai.

**How to solve this type of problem:**
For substring searches, identify the exact target, choose whether case matters, and use includes()/indexOf() or a loop if built-ins are not allowed.

---

### 11. Check whether a string starts and ends with a specific word

**Original section:** String questions (58).

**Question:** Check the beginning and ending of a string.

**Answer:**
```js
const str = "JavaScript is fun";

console.log(str.startsWith("Java")); // true
console.log(str.endsWith("fun"));    // true
```

**Other Language Solutions:**

**Python:**
```python
def starts_and_ends(s, start, end):
    return s.startswith(start) and s.endswith(end)
```

**Java:**
```java
static boolean startsAndEnds(String s, String start, String end) { return s.startsWith(start) && s.endsWith(end); }
```

**C# (.NET):**
```csharp
static bool StartsAndEnds(string s, string start, string end) => s.StartsWith(start) && s.EndsWith(end);
```

**C++:**
```cpp
bool startsAndEnds(const string& s,const string& a,const string& b){ return s.rfind(a,0)==0 && s.size()>=b.size() && s.compare(s.size()-b.size(),b.size(),b)==0; }
```


**Expected Output:**
```text
true
true
```

**Explanation (Simple English):**
startsWith() checks the beginning of the string and endsWith() checks its ending. Both conditions must be true when both are required.

**Explanation (Simple Hindi):**
startsWith() string ki shuruaat check karta hai aur endsWith() ending check karta hai. Dono required hon toh dono true hone chahiye.

**How to solve this type of problem:**
For start/end checks, use the exact prefix and suffix and remember that string comparisons are case-sensitive by default.

---

### 12. Find the index of a character

**Original section:** String questions (58).

**Question:** Find the first and last index of a character.

**Answer:**
```js
const str = "elephant";

console.log(str.indexOf("e"));     // 0
console.log(str.lastIndexOf("e")); // 2
```

**Other Language Solutions:**

**Python:**
```python
def char_indexes(s, ch): return s.find(ch), s.rfind(ch)
```

**Java:**
```java
static int[] charIndexes(String s,char c){return new int[]{s.indexOf(c),s.lastIndexOf(c)};}
```

**C# (.NET):**
```csharp
static int[] CharIndexes(string s,char c)=>new[]{s.IndexOf(c),s.LastIndexOf(c)};
```

**C++:**
```cpp
pair<int,int> charIndexes(const string&s,char c){return{(int)s.find(c),s.empty()||s.find(c)==string::npos?-1:(int)s.rfind(c)};}
```


**Expected Output:**
```text
0
2
```

**Explanation (Simple English):**
String indexes begin at zero. slice() takes the part before and after the chosen position, allowing a character to be inserted or removed.

**Explanation (Simple Hindi):**
String index zero se start hota hai. slice() chosen position ke pehle aur baad ka part nikaalta hai, jisse character insert ya remove kar sakte hain.

**How to solve this type of problem:**
For index-based string edits, split the string into the portion before the index and the portion after it, then combine with the new content.

---

### 13. Repeat a string three times

**Original section:** String questions (58).

**Question:** Repeat a string three times.

**Answer:**
```js
const str = "Hi ";

console.log(str.repeat(3)); // Hi Hi Hi
```

**Other Language Solutions:**

**Python:**
```python
def repeat_string(s, n): return s * n
```

**Java:**
```java
static String repeatString(String s,int n){return s.repeat(n);}
```

**C# (.NET):**
```csharp
static string RepeatString(string s,int n)=>string.Concat(Enumerable.Repeat(s,n));
```

**C++:**
```cpp
string repeatString(const string&s,int n){string r;while(n-->0)r+=s;return r;}
```


**Expected Output:**
```text
Hi Hi Hi 
```

**Explanation (Simple English):**
repeat(n) creates a new string by copying the original string n times.

**Explanation (Simple Hindi):**
repeat(n) original string ko n baar repeat karke nayi string banata hai.

**How to solve this type of problem:**
For repetition problems, use repeat(count) or a loop, and be clear whether spaces or separators are part of the repeated text.

---

### 14. Reverse a string

**Original section:** String questions (58).

**Question:** Reverse a string using array methods.

**Answer:**
```js
const str = "hello";

const reversed = str.split("").reverse().join("");

console.log(reversed); // olleh
```

**Other Language Solutions:**

**Python:**
```python
def reverse_string(s):
    out = ""
    for i in range(len(s)-1, -1, -1): out += s[i]
    return out
```

**Java:**
```java
static String reverseString(String s) { StringBuilder r=new StringBuilder(); for(int i=s.length()-1;i>=0;i--) r.append(s.charAt(i)); return r.toString(); }
```

**C# (.NET):**
```csharp
static string ReverseString(string s) { char[] r=new char[s.Length]; for(int i=0;i<s.Length;i++) r[i]=s[s.Length-1-i]; return new string(r); }
```

**C++:**
```cpp
string reverseString(string s) { string r; for(int i=(int)s.size()-1;i>=0;i--) r+=s[i]; return r; }
```


**Expected Output:**
```text
olleh
```

**Explanation (Simple English):**
The solution reads the value from the end towards the beginning and builds a new reversed result. This avoids changing the original array/string when a new result is required.

**Explanation (Simple Hindi):**
Code value ko end se start ki taraf read karke naya reversed result banata hai. Naya array/string banane se original value safe rehti hai.

**How to solve this type of problem:**
For reversing, identify whether you must mutate the original or return a new value, then traverse backward or use split/reverse/join for strings.

---

### 15. Count vowels in a string

**Original section:** String questions (58).

**Question:** Count the vowels in a string.

**Answer:**
```js
function countVowels(str) {
  const matches = str.match(/[aeiou]/gi);
  return matches ? matches.length : 0;
}

console.log(countVowels("education")); // 5
```

**Other Language Solutions:**

**Python:**
```python
def count_vowels(s):
    return sum(ch.lower() in "aeiou" for ch in s)

# To get the vowels themselves: [c for c in s if c.lower() in "aeiou"]
```

**Java:**
```java
static int countVowels(String s) { int n=0; for(char c:s.toLowerCase().toCharArray()) if("aeiou".indexOf(c)>=0) n++; return n; }
```

**C# (.NET):**
```csharp
static int CountVowels(string s) => s.Count(c => "aeiouAEIOU".Contains(c));
```

**C++:**
```cpp
int countVowels(const string& s) { int n=0; for(char c:s) if(string("aeiouAEIOU").find(c)!=string::npos) n++; return n; }
```


**Expected Output:**
```text
5
```

**Explanation (Simple English):**
The pattern [aeiou] matches vowels. The global and case-insensitive flags find every vowel in both lowercase and uppercase; the solution counts the matches.

**Explanation (Simple Hindi):**
[aeiou] pattern vowels ko match karta hai. g aur i flags se lowercase aur uppercase dono mein saare vowels milte hain; phir unki count nikalti hai.

**How to solve this type of problem:**
For vowel questions, decide whether case matters, scan with a loop or regular expression, and handle the case where no match is found.

---

### 16. Count consonants in a string

**Original section:** String questions (58).

**Question:** Count alphabetic consonants in a string.

**Answer:**
```js
function countConsonants(str) {
  const matches = str.match(/[b-df-hj-np-tv-z]/gi);
  return matches ? matches.length : 0;
}

console.log(countConsonants("JavaScript")); // 7
```

**Other Language Solutions:**

**Python:**
```python
def count_consonants(s):
    return sum(ch.isalpha() and ch.lower() not in "aeiou" for ch in s)
```

**Java:**
```java
static int countConsonants(String s) { int n=0; for(char c:s.toLowerCase().toCharArray()) if(c>='a'&&c<='z'&&"aeiou".indexOf(c)<0)n++; return n; }
```

**C# (.NET):**
```csharp
static int CountConsonants(string s) => s.Count(c => char.IsLetter(c) && !"aeiouAEIOU".Contains(c));
```

**C++:**
```cpp
int countConsonants(const string& s){ int n=0; for(unsigned char c:s) if(isalpha(c) && string("aeiouAEIOU").find(c)==string::npos)n++; return n; }
```


**Expected Output:**
```text
7
```

**Explanation (Simple English):**
The regular expression matches alphabetic consonants. The number of matches gives the consonant count.

**Explanation (Simple Hindi):**
Regular expression alphabet ke consonants ko match karta hai. Jitne matches milte hain, wahi consonants ki total count hai.

**How to solve this type of problem:**
For consonant counting, count letters that are not vowels; exclude spaces, digits, and punctuation from the count.

---

### 17. Remove vowels from a string

**Original section:** String questions (58).

**Question:** Remove all vowels from a string.

**Answer:**
```js
const str = "beautiful";

const result = str.replace(/[aeiou]/gi, "");

console.log(result); // btfl
```

**Other Language Solutions:**

**Python:**
```python
def remove_vowels(s): return "".join(c for c in s if c.lower() not in "aeiou")
```

**Java:**
```java
static String removeVowels(String s){return s.replaceAll("(?i)[aeiou]","");}
```

**C# (.NET):**
```csharp
static string RemoveVowels(string s)=>System.Text.RegularExpressions.Regex.Replace(s,"[aeiou]","",System.Text.RegularExpressions.RegexOptions.IgnoreCase);
```

**C++:**
```cpp
string removeVowels(const string&s){string r;for(char c:s)if(string("aeiouAEIOU").find(c)==string::npos)r+=c;return r;}
```


**Expected Output:**
```text
btfl
```

**Explanation (Simple English):**
The pattern [aeiou] matches vowels. The global and case-insensitive flags find every vowel in both lowercase and uppercase; the solution counts the matches.

**Explanation (Simple Hindi):**
[aeiou] pattern vowels ko match karta hai. g aur i flags se lowercase aur uppercase dono mein saare vowels milte hain; phir unki count nikalti hai.

**How to solve this type of problem:**
For vowel questions, decide whether case matters, scan with a loop or regular expression, and handle the case where no match is found.

---

### 18. Remove digits from a string

**Original section:** String questions (58).

**Question:** Remove all numeric digits from a string.

**Answer:**
```js
const str = "abc123";

const result = str.replace(/[0-9]/g, "");

console.log(result); // abc
```

**Other Language Solutions:**

**Python:**
```python
import re
def remove_digits(s): return re.sub(r"[0-9]", "", s)
```

**Java:**
```java
static String removeDigits(String s){return s.replaceAll("[0-9]","");}
```

**C# (.NET):**
```csharp
static string RemoveDigits(string s)=>System.Text.RegularExpressions.Regex.Replace(s,@"[0-9]","");
```

**C++:**
```cpp
string removeDigits(const string&s){string r;for(char c:s)if(!isdigit((unsigned char)c))r+=c;return r;}
```


**Expected Output:**
```text
abc
```

**Explanation (Simple English):**
The pattern [0-9] matches one digit at a time. Counting all matches tells us how many digits are present.

**Explanation (Simple Hindi):**
[0-9] pattern ek-ek digit ko match karta hai. Saare matches ki length se digits ki count milti hai.

**How to solve this type of problem:**
For digit problems, use a digit pattern or check each character, and decide whether the task is to count, remove, or validate digits.

---

### 19. Remove special characters from a string

**Original section:** String questions (58).

**Question:** Remove characters other than letters and numbers.

**Answer:**
```js
const str = "Hello@123#World!";

const cleaned = str.replace(/[^a-zA-Z0-9]/g, "");

console.log(cleaned); // Hello123World
```

**Other Language Solutions:**

**Python:**
```python
import re
def remove_special(s): return re.sub(r"[^a-zA-Z0-9]", "", s)
```

**Java:**
```java
static String removeSpecial(String s){return s.replaceAll("[^a-zA-Z0-9]","");}
```

**C# (.NET):**
```csharp
static string RemoveSpecial(string s)=>System.Text.RegularExpressions.Regex.Replace(s,@"[^a-zA-Z0-9]","");
```

**C++:**
```cpp
string removeSpecial(const string&s){string r;for(unsigned char c:s)if(isalnum(c))r+=c;return r;}
```


**Expected Output:**
```text
Hello123World
```

**Explanation (Simple English):**
String indexes begin at zero. slice() takes the part before and after the chosen position, allowing a character to be inserted or removed.

**Explanation (Simple Hindi):**
String index zero se start hota hai. slice() chosen position ke pehle aur baad ka part nikaalta hai, jisse character insert ya remove kar sakte hain.

**How to solve this type of problem:**
For index-based string edits, split the string into the portion before the index and the portion after it, then combine with the new content.

---

### 20. Count occurrences of a specific character

**Original section:** String questions (58).

**Question:** Count how many times a target character appears.

**Answer:**
```js
function countCharacter(str, target) {
  let count = 0;

  for (const char of str) {
    if (char === target) count++;
  }

  return count;
}

console.log(countCharacter("hello world", "l")); // 3
```

**Other Language Solutions:**

**Python:**
```python
def count_char(s, target):
    return sum(ch == target for ch in s)
```

**Java:**
```java
static int countChar(String s, char target) { int count=0; for(char ch:s.toCharArray()) if(ch==target) count++; return count; }
```

**C# (.NET):**
```csharp
static int CountChar(string s, char target) => s.Count(ch => ch == target);
```

**C++:**
```cpp
int countChar(const string& s, char target) { return count(s.begin(), s.end(), target); }
```


**Expected Output:**
```text
3
```

**Explanation (Simple English):**
The code scans each character and increases a counter whenever it matches the target character. The final counter is the total number of occurrences.

**Explanation (Simple Hindi):**
Code har character scan karta hai aur target character match hone par counter badhata hai. End mein counter total occurrences batata hai.

**How to solve this type of problem:**
For counting a character, start count at zero, scan each character, increase the count on a match, and return the final count.

---

### 21. Capitalize the first letter

**Original section:** String questions (58).

**Question:** Convert the first character of a string to uppercase.

**Answer:**
```js
function capitalizeFirst(str) {
  if (!str) return str;

  return str.charAt(0).toUpperCase() + str.slice(1);
}

console.log(capitalizeFirst("hello")); // Hello
```

**Other Language Solutions:**

**Python:**
```python
def capitalize_first(s):
    return s[:1].upper() + s[1:]
```

**Java:**
```java
static String capitalizeFirst(String s) { return s.isEmpty() ? s : s.substring(0,1).toUpperCase()+s.substring(1); }
```

**C# (.NET):**
```csharp
static string CapitalizeFirst(string s) => string.IsNullOrEmpty(s) ? s : char.ToUpper(s[0]) + s.Substring(1);
```

**C++:**
```cpp
string capitalizeFirst(string s) { if(s.empty()) return s; s[0]=toupper((unsigned char)s[0]); return s; }
```


**Expected Output:**
```text
Hello
```

**Explanation (Simple English):**
The code changes letter case using uppercase/lowercase methods. For mixed-case tasks, it checks each character and switches it to the opposite case.

**Explanation (Simple Hindi):**
Code uppercase/lowercase methods se letters ka case badalta hai. Mixed-case task mein har character check karke uska opposite case banaya jaata hai.

**How to solve this type of problem:**
For case-conversion problems, choose whether to change the whole string, only the first letter, or every word; then use the matching string methods.

---

### 22. Convert a string into an array of characters or words

**Original section:** String questions (58).

**Question:** Split a string into characters or split a sentence into words.

**Answer:**
```js
const str = "hello";
console.log(str.split("")); // ["h", "e", "l", "l", "o"]

const sentence = "this is JS";
console.log(sentence.split(" ")); // ["this", "is", "JS"]
```

**Other Language Solutions:**

**Python:**
```python
def split_words(s):
    return s.split()  # use s.split(",") for comma-separated input
```

**Java:**
```java
static String[] splitWords(String s){ return s.split("\\s+"); }
```

**C# (.NET):**
```csharp
static string[] SplitWords(string s) => s.Split(' ', StringSplitOptions.RemoveEmptyEntries);
```

**C++:**
```cpp
vector<string> splitWords(const string& s){ stringstream ss(s); vector<string> r; string w; while(ss>>w)r.push_back(w); return r; }
```


**Expected Output:**
```text
["h","e","l","l","o"]
["this","is","JS"]
```

**Explanation (Simple English):**
The string is split into individual words, each word is processed, and the result is joined again when a sentence is needed.

**Explanation (Simple Hindi):**
String ko alag-alag words mein split karte hain, har word par required operation karte hain, aur sentence banana ho toh join kar dete hain.

**How to solve this type of problem:**
For word-based string questions, split the sentence using whitespace, process each word, then join the words with the required separator.

---

### 23. Replace spaces with hyphens

**Original section:** String questions (58).

**Question:** Replace whitespace with hyphens.

**Answer:**
```js
const str = "space to dash";

console.log(str.replace(/\s/g, "-"));
// space-to-dash
```

**Other Language Solutions:**

**Python:**
```python
def replace_spaces(s): return s.replace(" ", "-")
```

**Java:**
```java
static String replaceSpaces(String s){return s.replace(" ","-");}
```

**C# (.NET):**
```csharp
static string ReplaceSpaces(string s)=>s.Replace(" ","-");
```

**C++:**
```cpp
string replaceSpaces(string s){replace(s.begin(),s.end(),' ','-');return s;}
```


**Expected Output:**
```text
space-to-dash
```

**Explanation (Simple English):**
The code either trims unwanted spaces at the edges or replaces spaces inside the text with a chosen separator.

**Explanation (Simple Hindi):**
Code ya toh string ke start/end ke extra spaces remove karta hai ya beech ke spaces ko diye gaye separator se replace karta hai.

**How to solve this type of problem:**
For whitespace tasks, distinguish leading/trailing spaces from spaces between words, then use trim(), trimStart(), or a replacement pattern.

---

### 24. Insert a character at a specific index

**Original section:** String questions (58).

**Question:** Insert a character at a specified position in a string.

**Answer:**
```js
function insertAt(str, index, char) {
  return str.slice(0, index) + char + str.slice(index);
}

console.log(insertAt("hello", 2, "y")); // heyllo
```

**Other Language Solutions:**

**Python:**
```python
def insert_at(s, index, ch): return s[:index] + ch + s[index:]
```

**Java:**
```java
static String insertAt(String s,int i,char c){return s.substring(0,i)+c+s.substring(i);}
```

**C# (.NET):**
```csharp
static string InsertAt(string s,int i,char c)=>s.Insert(i,c.ToString());
```

**C++:**
```cpp
string insertAt(const string&s,int i,char c){string r=s;r.insert(r.begin()+i,c);return r;}
```


**Expected Output:**
```text
heyllo
```

**Explanation (Simple English):**
String indexes begin at zero. slice() takes the part before and after the chosen position, allowing a character to be inserted or removed.

**Explanation (Simple Hindi):**
String index zero se start hota hai. slice() chosen position ke pehle aur baad ka part nikaalta hai, jisse character insert ya remove kar sakte hain.

**How to solve this type of problem:**
For index-based string edits, split the string into the portion before the index and the portion after it, then combine with the new content.

---

### 25. Remove a character at a specific index

**Original section:** String questions (58).

**Question:** Remove one character from a specified index.

**Answer:**
```js
function removeAt(str, index) {
  return str.slice(0, index) + str.slice(index + 1);
}

console.log(removeAt("hello", 1)); // hllo
```

**Other Language Solutions:**

**Python:**
```python
def remove_at(s, index): return s[:index] + s[index+1:]
```

**Java:**
```java
static String removeAt(String s,int i){return s.substring(0,i)+s.substring(i+1);}
```

**C# (.NET):**
```csharp
static string RemoveAt(string s,int i)=>s.Remove(i,1);
```

**C++:**
```cpp
string removeAt(const string&s,int i){string r=s;r.erase(i,1);return r;}
```


**Expected Output:**
```text
hllo
```

**Explanation (Simple English):**
String indexes begin at zero. slice() takes the part before and after the chosen position, allowing a character to be inserted or removed.

**Explanation (Simple Hindi):**
String index zero se start hota hai. slice() chosen position ke pehle aur baad ka part nikaalta hai, jisse character insert ya remove kar sakte hain.

**How to solve this type of problem:**
For index-based string edits, split the string into the portion before the index and the portion after it, then combine with the new content.

---

### 26. Get a substring from a string

**Original section:** String questions (58).

**Question:** Extract part of a string using `substring()`.

**Answer:**
```js
const str = "substring";

console.log(str.substring(0, 3)); // sub
```

**Other Language Solutions:**

**Python:**
```python
def get_substring(s, start, end): return s[start:end]
```

**Java:**
```java
static String getSubstring(String s,int start,int end){return s.substring(start,end);}
```

**C# (.NET):**
```csharp
static string GetSubstring(string s,int start,int end)=>s.Substring(start,end-start);
```

**C++:**
```cpp
string getSubstring(const string&s,int start,int end){return s.substr(start,end-start);}
```


**Expected Output:**
```text
sub
```

**Explanation (Simple English):**
The solution checks whether the target text exists inside the main string. Methods such as includes() or indexOf() answer this directly.

**Explanation (Simple Hindi):**
Code check karta hai ki target text main string ke andar present hai ya nahi. includes() ya indexOf() se ye check ho jaata hai.

**How to solve this type of problem:**
For substring searches, identify the exact target, choose whether case matters, and use includes()/indexOf() or a loop if built-ins are not allowed.

---

### 28. Count digits in a string

**Original section:** String questions (58).

**Question:** Count the numeric digits present in a string.

**Answer:**
```js
function countDigits(str) {
  const matches = str.match(/[0-9]/g);
  return matches ? matches.length : 0;
}

console.log(countDigits("abc123def456")); // 6
```

**Other Language Solutions:**

**Python:**
```python
def count_digits(s): return sum(ch.isdigit() for ch in s)
```

**Java:**
```java
static long countDigits(String s){return s.chars().filter(Character::isDigit).count();}
```

**C# (.NET):**
```csharp
static int CountDigits(string s)=>s.Count(char.IsDigit);
```

**C++:**
```cpp
int countDigits(const string&s){int n=0;for(unsigned char c:s)if(isdigit(c))n++;return n;}
```


**Expected Output:**
```text
6
```

**Explanation (Simple English):**
The pattern [0-9] matches one digit at a time. Counting all matches tells us how many digits are present.

**Explanation (Simple Hindi):**
[0-9] pattern ek-ek digit ko match karta hai. Saare matches ki length se digits ki count milti hai.

**How to solve this type of problem:**
For digit problems, use a digit pattern or check each character, and decide whether the task is to count, remove, or validate digits.

---

### 30. Check whether a string is alphanumeric

**Original section:** String questions (58).

**Question:** Check whether a string contains only letters and digits.

**Answer:**
```js
function isAlphanumeric(str) {
  return /^[a-z0-9]+$/i.test(str);
}

console.log(isAlphanumeric("abc123")); // true
console.log(isAlphanumeric("abc 123")); // false
```

**Other Language Solutions:**

**Python:**
```python
def is_alphanumeric(s): return bool(s) and s.isalnum()
```

**Java:**
```java
static boolean isAlphanumeric(String s){return !s.isEmpty() && s.matches("[a-zA-Z0-9]+");}
```

**C# (.NET):**
```csharp
static bool IsAlphanumeric(string s)=>s.Length>0 && s.All(char.IsLetterOrDigit);
```

**C++:**
```cpp
bool isAlphanumeric(const string&s){return !s.empty()&&all_of(s.begin(),s.end(),[](unsigned char c){return isalnum(c);});}
```


**Expected Output:**
```text
true
false
```

**Explanation (Simple English):**
The pattern [0-9] matches one digit at a time. Counting all matches tells us how many digits are present.

**Explanation (Simple Hindi):**
[0-9] pattern ek-ek digit ko match karta hai. Saare matches ki length se digits ki count milti hai.

**How to solve this type of problem:**
For digit problems, use a digit pattern or check each character, and decide whether the task is to count, remove, or validate digits.

---

### 31. Check whether a string contains only letters

**Original section:** String questions (58).

**Question:** Validate that a string contains alphabetic characters only.

**Answer:**
```js
function containsOnlyLetters(str) {
  return /^[a-z]+$/i.test(str);
}

console.log(containsOnlyLetters("helloWorld")); // true
console.log(containsOnlyLetters("hello123"));   // false
```

**Other Language Solutions:**

**Python:**
```python
def only_letters(s): return bool(s) and s.isalpha()
```

**Java:**
```java
static boolean onlyLetters(String s){return !s.isEmpty() && s.matches("[a-zA-Z]+");}
```

**C# (.NET):**
```csharp
static bool OnlyLetters(string s)=>s.Length>0 && s.All(char.IsLetter);
```

**C++:**
```cpp
bool onlyLetters(const string&s){return !s.empty()&&all_of(s.begin(),s.end(),[](unsigned char c){return isalpha(c);});}
```


**Expected Output:**
```text
true
false
```

**Explanation (Simple English):**
The regular expression allows only alphabetic characters from A to Z. The anchors make sure the entire string follows that rule.

**Explanation (Simple Hindi):**
Regular expression sirf A se Z tak ke letters allow karta hai. Start aur end anchors ensure karte hain ki poori string isi rule ko follow kare.

**How to solve this type of problem:**
For validation, define the allowed characters, use ^ and $ to validate the whole string, and test both valid and invalid examples.

---

### 32. Check whether a string contains only digits

**Original section:** String questions (58).

**Question:** Validate that a string contains digits only.

**Answer:**
```js
function containsOnlyDigits(str) {
  return /^\d+$/.test(str);
}

console.log(containsOnlyDigits("12345")); // true
console.log(containsOnlyDigits("12a45")); // false
```

**Other Language Solutions:**

**Python:**
```python
def only_digits(s): return bool(s) and s.isdigit()
```

**Java:**
```java
static boolean onlyDigits(String s){return !s.isEmpty() && s.matches("\\d+");}
```

**C# (.NET):**
```csharp
static bool OnlyDigits(string s)=>s.Length>0 && s.All(char.IsDigit);
```

**C++:**
```cpp
bool onlyDigits(const string&s){return !s.empty()&&all_of(s.begin(),s.end(),[](unsigned char c){return isdigit(c);});}
```


**Expected Output:**
```text
true
false
```

**Explanation (Simple English):**
The pattern [0-9] matches one digit at a time. Counting all matches tells us how many digits are present.

**Explanation (Simple Hindi):**
[0-9] pattern ek-ek digit ko match karta hai. Saare matches ki length se digits ki count milti hai.

**How to solve this type of problem:**
For digit problems, use a digit pattern or check each character, and decide whether the task is to count, remove, or validate digits.

---

### 33. Validate whether a string represents a number

**Original section:** String questions (58).

**Question:** Check whether a string can be converted into a finite number.

**Answer:**
```js
function isNumericString(str) {
  return str.trim() !== "" && Number.isFinite(Number(str));
}

console.log(isNumericString("123.45")); // true
console.log(isNumericString("hello"));  // false
```

**Other Language Solutions:**

**Python:**
```python
def is_numeric_string(s):
    try: float(s.strip()); return bool(s.strip())
    except ValueError: return False
```

**Java:**
```java
static boolean isNumericString(String s){if(s.trim().isEmpty())return false;try{Double.parseDouble(s.trim());return true;}catch(NumberFormatException e){return false;}}
```

**C# (.NET):**
```csharp
static bool IsNumericString(string s)=>!string.IsNullOrWhiteSpace(s) && double.TryParse(s,out _);
```

**C++:**
```cpp
bool isNumericString(const string&s){if(s.empty())return false;try{size_t p;stod(s,&p);return p==s.size();}catch(...){return false;}}
```


**Expected Output:**
```text
true
false
```

**Explanation (Simple English):**
The solution checks whether the complete input follows the required character or numeric format. A regular expression or numeric conversion is used to reject invalid text.

**Explanation (Simple Hindi):**
Code check karta hai ki poora input required format mein hai ya nahi. Regex ya Number conversion se galat text ko reject kiya jaata hai.

**How to solve this type of problem:**
For validation problems, clarify exactly what is allowed, check the full string rather than a partial match, and test empty strings and invalid characters.

---

### 36. Count uppercase and lowercase letters

**Original section:** String questions (58).

**Question:** Count uppercase and lowercase alphabetic characters separately.

**Answer:**
```js
function countCases(str) {
  let uppercase = 0;
  let lowercase = 0;

  for (const char of str) {
    if (/[A-Z]/.test(char)) uppercase++;
    else if (/[a-z]/.test(char)) lowercase++;
  }

  return { uppercase, lowercase };
}

console.log(countCases("Hello"));
// { uppercase: 1, lowercase: 4 }
```

**Other Language Solutions:**

**Python:**
```python
def count_cases(s):
    return sum(c.isupper() for c in s), sum(c.islower() for c in s)
```

**Java:**
```java
static int[] countCases(String s){int up=0,low=0;for(char c:s.toCharArray()){if(Character.isUpperCase(c))up++;else if(Character.isLowerCase(c))low++;}return new int[]{up,low};}
```

**C# (.NET):**
```csharp
static int[] CountCases(string s){int up=0,low=0;foreach(char c in s){if(char.IsUpper(c))up++;else if(char.IsLower(c))low++;}return new[]{up,low};}
```

**C++:**
```cpp
pair<int,int> countCases(const string&s){int u=0,l=0;for(unsigned char c:s){if(isupper(c))u++;else if(islower(c))l++;}return{u,l};}
```


**Expected Output:**
```text
{"uppercase":1,"lowercase":4}
```

**Explanation (Simple English):**
The regular expression allows only alphabetic characters from A to Z. The anchors make sure the entire string follows that rule.

**Explanation (Simple Hindi):**
Regular expression sirf A se Z tak ke letters allow karta hai. Start aur end anchors ensure karte hain ki poori string isi rule ko follow kare.

**How to solve this type of problem:**
For validation, define the allowed characters, use ^ and $ to validate the whole string, and test both valid and invalid examples.

---

### 38. Double every character in a string

**Original section:** String questions (58).

**Question:** Repeat every character twice.

**Answer:**
```js
function doubleCharacters(str) {
  return [...str].map(char => char + char).join("");
}

console.log(doubleCharacters("abc")); // aabbcc
```

**Other Language Solutions:**

**Python:**
```python
def double_chars(s): return "".join(ch*2 for ch in s)
```

**Java:**
```java
static String doubleChars(String s){StringBuilder r=new StringBuilder();for(char c:s.toCharArray())r.append(c).append(c);return r.toString();}
```

**C# (.NET):**
```csharp
static string DoubleChars(string s)=>string.Concat(s.Select(c=>new string(c,2)));
```

**C++:**
```cpp
string doubleChars(const string&s){string r;for(char c:s){r+=c;r+=c;}return r;}
```


**Expected Output:**
```text
aabbcc
```

**Explanation (Simple English):**
The map() method visits every element and converts it into a new value. The result has the same number of elements as the input array.

**Explanation (Simple Hindi):**
map() har element par jaata hai aur usko naye value mein convert karta hai. Result array mein elements ki count original ke barabar rehti hai.

**How to solve this type of problem:**
For transformation problems, decide what one input item should become, write that transformation in map(), and return the new value from the callback.

---

### 41. Swap the case of all letters

**Original section:** String questions (58).

**Question:** Convert uppercase letters to lowercase and lowercase letters to uppercase.

**Answer:**
```js
function swapCase(str) {
  return [...str].map(char =>
    char === char.toUpperCase()
      ? char.toLowerCase()
      : char.toUpperCase()
  ).join("");
}

console.log(swapCase("Hello")); // hELLO
```

**Other Language Solutions:**

**Python:**
```python
def swap_case(s): return s.swapcase()
```

**Java:**
```java
static String swapCase(String s){StringBuilder r=new StringBuilder();for(char c:s.toCharArray())r.append(Character.isUpperCase(c)?Character.toLowerCase(c):Character.toUpperCase(c));return r.toString();}
```

**C# (.NET):**
```csharp
static string SwapCase(string s)=>new string(s.Select(c=>char.IsUpper(c)?char.ToLower(c):char.ToUpper(c)).ToArray());
```

**C++:**
```cpp
string swapCase(const string&s){string r=s;for(char&c:r)c=islower((unsigned char)c)?toupper((unsigned char)c):tolower((unsigned char)c);return r;}
```


**Expected Output:**
```text
hELLO
```

**Explanation (Simple English):**
The map() method visits every element and converts it into a new value. The result has the same number of elements as the input array.

**Explanation (Simple Hindi):**
map() har element par jaata hai aur usko naye value mein convert karta hai. Result array mein elements ki count original ke barabar rehti hai.

**How to solve this type of problem:**
For transformation problems, decide what one input item should become, write that transformation in map(), and return the new value from the callback.

---

### 45. Abbreviate a name

**Original section:** String questions (58).

**Question:** Convert a name such as `John Doe` into initials such as `J.D.`.

**Answer:**
```js
function abbreviateName(name) {
  return name
    .trim()
    .split(/\s+/)
    .map(word => word[0].toUpperCase())
    .join(".") + ".";
}

console.log(abbreviateName("John Doe")); // J.D.
```

**Other Language Solutions:**

**Python:**
```python
def abbreviate(name): return ".".join(w[0].upper() for w in name.split() if w) + "."
```

**Java:**
```java
static String abbreviate(String name){StringBuilder r=new StringBuilder();for(String w:name.trim().split("\\s+"))if(!w.isEmpty())r.append(Character.toUpperCase(w.charAt(0))).append('.');return r.toString();}
```

**C# (.NET):**
```csharp
static string Abbreviate(string name)=>string.Join(".",name.Split(' ',StringSplitOptions.RemoveEmptyEntries).Select(w=>char.ToUpper(w[0])))+".";
```

**C++:**
```cpp
string abbreviate(const string& name){stringstream ss(name);string w,r;while(ss>>w){if(!r.empty())r+=".";r+=char(toupper((unsigned char)w[0]));}return r.empty()?r:r+".";}
```


**Expected Output:**
```text
J.D.
```

**Explanation (Simple English):**
The map() method visits every element and converts it into a new value. The result has the same number of elements as the input array.

**Explanation (Simple Hindi):**
map() har element par jaata hai aur usko naye value mein convert karta hai. Result array mein elements ki count original ke barabar rehti hai.

**How to solve this type of problem:**
For transformation problems, decide what one input item should become, write that transformation in map(), and return the new value from the callback.

---

### 46. Mask all characters except the last four

**Original section:** String questions (58).

**Question:** Replace all but the last four characters with `*`.

**Answer:**
```js
function maskString(str) {
  if (str.length <= 4) return str;

  return "*".repeat(str.length - 4) + str.slice(-4);
}

console.log(maskString("1234567890")); // ******7890
```

**Other Language Solutions:**

**Python:**
```python
def mask_except_last_four(s): return "*" * max(0,len(s)-4) + s[-4:]
```

**Java:**
```java
static String mask(String s){return "*".repeat(Math.max(0,s.length()-4))+s.substring(Math.max(0,s.length()-4));}
```

**C# (.NET):**
```csharp
static string Mask(string s)=>new string('*',Math.Max(0,s.Length-4))+s.Substring(Math.Max(0,s.Length-4));
```

**C++:**
```cpp
string mask(const string&s){return string(s.size()>4?s.size()-4:0,'*')+s.substr(s.size()>4?s.size()-4:0);}
```


**Expected Output:**
```text
******7890
```

**Explanation (Simple English):**
The solution creates a string of asterisks for the hidden part and appends the last four characters unchanged.

**Explanation (Simple Hindi):**
Code hidden part ke liye asterisks banata hai aur last ke chaar characters ko waise hi append karta hai.

**How to solve this type of problem:**
For masking, decide how many ending characters should remain visible, create the hidden prefix, and append the visible suffix.

---

### 47. Replace every vowel with `*`

**Original section:** String questions (58).

**Question:** Replace all vowels in a string with an asterisk.

**Answer:**
```js
const str = "javascript";

const result = str.replace(/[aeiou]/gi, "*");

console.log(result); // j*v*scr*pt
```

**Other Language Solutions:**

**Python:**
```python
def replace_vowels_with_star(s):
    return "".join("*" if c.lower() in "aeiou" else c for c in s)
```

**Java:**
```java
static String replaceVowelsWithStar(String s){return s.replaceAll("(?i)[aeiou]", "*");}
```

**C# (.NET):**
```csharp
static string ReplaceVowelsWithStar(string s)=>System.Text.RegularExpressions.Regex.Replace(s,"[aeiou]","*",System.Text.RegularExpressions.RegexOptions.IgnoreCase);
```

**C++:**
```cpp
string replaceVowelsWithStar(const string&s){string r=s;for(char&c:r)if(string("aeiouAEIOU").find(c)!=string::npos)c='*';return r;}
```


**Expected Output:**
```text
j*v*scr*pt
```

**Explanation (Simple English):**
The pattern [aeiou] matches vowels. The global and case-insensitive flags find every vowel in both lowercase and uppercase; the solution counts the matches.

**Explanation (Simple Hindi):**
[aeiou] pattern vowels ko match karta hai. g aur i flags se lowercase aur uppercase dono mein saare vowels milte hain; phir unki count nikalti hai.

**How to solve this type of problem:**
For vowel questions, decide whether case matters, scan with a loop or regular expression, and handle the case where no match is found.

---

### 56. Toggle the case of characters

**Original section:** String questions (58).

**Question:** Change uppercase characters to lowercase and lowercase characters to uppercase.

**Answer:**
```js
function toggleCase(str) {
  return [...str].map(char => {
    if (char === char.toUpperCase()) return char.toLowerCase();
    return char.toUpperCase();
  }).join("");
}

console.log(toggleCase("hElLo")); // HeLlO
```

**Other Language Solutions:**

**Python:**
```python
def swap_case(s): return s.swapcase()
```

**Java:**
```java
static String swapCase(String s){StringBuilder r=new StringBuilder();for(char c:s.toCharArray())r.append(Character.isUpperCase(c)?Character.toLowerCase(c):Character.toUpperCase(c));return r.toString();}
```

**C# (.NET):**
```csharp
static string SwapCase(string s)=>new string(s.Select(c=>char.IsUpper(c)?char.ToLower(c):char.ToUpper(c)).ToArray());
```

**C++:**
```cpp
string swapCase(const string&s){string r=s;for(char&c:r)c=islower((unsigned char)c)?toupper((unsigned char)c):tolower((unsigned char)c);return r;}
```


**Expected Output:**
```text
HeLlO
```

**Explanation (Simple English):**
The map() method visits every element and converts it into a new value. The result has the same number of elements as the input array.

**Explanation (Simple Hindi):**
map() har element par jaata hai aur usko naye value mein convert karta hai. Result array mein elements ki count original ke barabar rehti hai.

**How to solve this type of problem:**
For transformation problems, decide what one input item should become, write that transformation in map(), and return the new value from the callback.

---

### 57. Check whether a string contains any word from a list

**Original section:** String questions (58).

**Question:** Check whether at least one word from a given list is present in a string.

**Answer:**
```js
function containsAnyWord(str, words) {
  return words.some(word => str.includes(word));
}

console.log(
  containsAnyWord("I love JavaScript", ["Java", "Python", "JavaScript"])
); // true
```

**Other Language Solutions:**

**Python:**
```python
def contains_any_word(text, words): return any(w in text for w in words)
```

**Java:**
```java
static boolean containsAnyWord(String s,String[] words){for(String w:words)if(s.contains(w))return true;return false;}
```

**C# (.NET):**
```csharp
static bool ContainsAnyWord(string s,string[] words)=>words.Any(w=>s.Contains(w));
```

**C++:**
```cpp
bool containsAnyWord(const string&s,const vector<string>& words){for(auto&w:words)if(s.find(w)!=string::npos)return true;return false;}
```


**Expected Output:**
```text
true
```

**Explanation (Simple English):**
The solution checks whether the target text exists inside the main string. Methods such as includes() or indexOf() answer this directly.

**Explanation (Simple Hindi):**
Code check karta hai ki target text main string ke andar present hai ya nahi. includes() ya indexOf() se ye check ho jaata hai.

**How to solve this type of problem:**
For substring searches, identify the exact target, choose whether case matters, and use includes()/indexOf() or a loop if built-ins are not allowed.

---

---

# Final Learning Summary – How to Solve JavaScript Coding Problems

Use this checklist whenever you see a new coding question:

1. **Understand the requirement:** Identify the input, the exact output, and whether the original input may be changed.
2. **Try a small example by hand:** Write down the expected result before coding. Include an empty input, one item, duplicates, negative values, or mixed case when relevant.
3. **Choose the right tool:** Use `if/else` for decisions, loops for repeated work, `map()` for transforming every item, `filter()` for keeping matching items, `reduce()` for one accumulated answer, `Set` for uniqueness/membership, and `Map`/objects for frequency counts.
4. **Write the simplest correct approach first:** Make the logic easy to read. Optimize only after it works.
5. **Dry-run the code:** Track the values of important variables after every iteration. For nested loops, write the current indexes; for recursion, write the base case and the smaller calls.
6. **Check edge cases:** Empty array/string, one element, no match, all values equal, negative numbers, zero, repeated values, and invalid input.
7. **Check the result:** Compare the actual output with the expected output and test at least one more example.
8. **Think about efficiency:** A single loop is usually O(n); nested loops are often O(n²); sorting is commonly O(n log n). Use a Set/Map or prefix sums when they simplify repeated searches or calculations.

## Common problem patterns

| Problem pattern | A practical starting approach |
|---|---|
| Number checks and formulas | Write the condition/formula first, then test boundaries. |
| Sum, product, count, average | Initialize an accumulator, loop through the data, update it, then return it. |
| Search and indexes | Scan once, compare with the target, and define what happens when no match exists. |
| Transform every item | Use `map()` or a loop and push each transformed value into a new array. |
| Keep/remove items | Convert the requirement into a true/false condition and use `filter()`. |
| Unique values and duplicates | Use `Set`, `indexOf()`/`lastIndexOf()`, or a frequency map depending on the exact output needed. |
| Frequency and most common item | Count values in a `Map` or object, then inspect the counts. |
| Sorting and k-th values | Sort with a numeric comparator, then select the required position. |
| String checks | Decide case/space rules, then use string methods or a regular expression. |
| Palindrome and anagram | Normalize the input, then compare opposite characters, sorted characters, or frequency counts. |
| Pairs and triplets | Compare different indexes; for larger inputs consider sorting and two pointers. |
| Subarrays and range sums | Keep subarrays contiguous; use nested start/end loops or prefix sums for range queries. |
| Recursion | Write the base case first, then make progress toward it with a smaller input. |
| Right-side / sequence problems | Try scanning from the right or maintaining a running value when future elements matter. |
| Objects and grouping | Choose the property that defines a group and store values in a bucket under that key. |

## Suggested practice order

- **Easy:** Understand variables, conditions, loops, string/array basics, and common built-in methods. Practise writing the logic without copying.
- **Medium:** Focus on frequency maps, recursion, sorting, searching, duplicate handling, and combining multiple array/string operations.
- **Hard:** Learn to recognize patterns such as two pointers, prefix sums, nested subarrays, greedy right-to-left scans, and tracking multiple running states.

**Important:** The output shown under each question is for the sample input used in its code. Change the input and run the program again to check whether you understand the logic.

