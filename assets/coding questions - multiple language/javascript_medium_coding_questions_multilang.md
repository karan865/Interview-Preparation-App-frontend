# Coding Questions – Medium (JavaScript, Python, Java, C# and C++)

**How to use this file:** Start here if you are at the medium stage. Try each problem before reading its solution. Every question keeps its original notebook section/number in the source label, so you can trace it back to the master notes.

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

## Question count: 107

## First batch (Q1–Q100)

### 5. Check whether a number is prime

**Original section:** First batch (Q1–Q100).

**Question:** Write a function to check whether a number is prime.

**Answer:**
```js
function isPrime(number) {
  if (number <= 1) return false;

  for (let i = 2; i <= Math.sqrt(number); i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
}

console.log(isPrime(15)); // false
console.log(isPrime(17)); // true
```

**Other Language Solutions:**

**Python:**
```python
def is_prime(n):
    if n <= 1: return False
    for d in range(2, int(n**0.5)+1):
        if n % d == 0: return False
    return True
```

**Java:**
```java
static boolean isPrime(int n){if(n<=1)return false;for(int d=2;d<=Math.sqrt(n);d++)if(n%d==0)return false;return true;}
```

**C# (.NET):**
```csharp
static bool IsPrime(int n){if(n<=1)return false;for(int d=2;d<=Math.Sqrt(n);d++)if(n%d==0)return false;return true;}
```

**C++:**
```cpp
bool isPrime(int n){if(n<=1)return false;for(int d=2;d<=sqrt(n);d++)if(n%d==0)return false;return true;}
```


**Expected Output:**
```text
false
true
```

**Explanation (Simple English):**
A prime number has exactly two positive factors: 1 and itself. The function checks whether any number from 2 up to the square root divides it evenly.

**Explanation (Simple Hindi):**
Prime number ke sirf do positive factors hote hain: 1 aur woh number khud. Function 2 se square root tak check karta hai ki koi number poori tarah divide karta hai ya nahi.

**How to solve this type of problem:**
For prime checking, reject numbers below 2, test possible divisors from 2 to √n, and return false as soon as a divisor is found.

---

### 8. Find the factorial of a number using recursion

**Original section:** First batch (Q1–Q100).

**Question:** Calculate the factorial of a number using a recursive function.

**Answer:**
```js
function factorialRecursive(number) {
  if (!Number.isInteger(number) || number < 0) {
    return "Enter a non-negative integer";
  }

  if (number === 0 || number === 1) {
    return 1;
  }

  return number * factorialRecursive(number - 1);
}

console.log(factorialRecursive(5)); // 120
```

**Other Language Solutions:**

**Python:**
```python
def factorial(n):
    if n < 0: raise ValueError("n must be non-negative")
    if n <= 1: return 1
    return n * factorial(n - 1)
```

**Java:**
```java
static long factorial(int n) {
    if (n < 0) throw new IllegalArgumentException();
    return n <= 1 ? 1 : n * factorial(n - 1);
}
```

**C# (.NET):**
```csharp
static long Factorial(int n) {
    if (n < 0) throw new ArgumentOutOfRangeException(nameof(n));
    return n <= 1 ? 1 : n * Factorial(n - 1);
}
```

**C++:**
```cpp
long long factorial(int n) { if (n < 0) throw invalid_argument("negative n"); return n <= 1 ? 1 : n * factorial(n-1); }
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

### 12. Print the Fibonacci series

**Original section:** First batch (Q1–Q100).

**Question:** Print the Fibonacci sequence, where each next number is the sum of the previous two numbers.

**Answer:**
```js
function fibonacci(count) {
  let a = 0;
  let b = 1;
  const series = [];

  for (let i = 0; i < count; i++) {
    series.push(a);
    const next = a + b;
    a = b;
    b = next;
  }

  return series;
}

console.log(fibonacci(8)); // [0, 1, 1, 2, 3, 5, 8, 13]
```

**Other Language Solutions:**

**Python:**
```python
def fibonacci(count):
    a,b=0,1; result=[]
    for _ in range(count): result.append(a); a,b=b,a+b
    return result
```

**Java:**
```java
static List<Integer> fibonacci(int count){List<Integer> r=new ArrayList<>();int a=0,b=1;for(int i=0;i<count;i++){r.add(a);int t=a+b;a=b;b=t;}return r;}
```

**C# (.NET):**
```csharp
static List<int> Fibonacci(int count){var r=new List<int>();int a=0,b=1;for(int i=0;i<count;i++){r.Add(a);int t=a+b;a=b;b=t;}return r;}
```

**C++:**
```cpp
vector<int> fibonacci(int count){vector<int> r;int a=0,b=1;for(int i=0;i<count;i++){r.push_back(a);int t=a+b;a=b;b=t;}return r;}
```


**Expected Output:**
```text
[0,1,1,2,3,5,8,13]
```

**Explanation (Simple English):**
The sequence starts with 0 and 1. Each loop adds the previous two values to get the next value, stores it, and moves the two variables forward.

**Explanation (Simple Hindi):**
Sequence 0 aur 1 se start hoti hai. Har loop pichhle do numbers ko jodkar next number banata hai, phir dono variables aage shift ho jaate hain.

**How to solve this type of problem:**
For Fibonacci, store the previous two numbers, output the current one, calculate their sum, and update the pair for the next iteration.

---

### 13. Check whether a number is an Armstrong number

**Original section:** First batch (Q1–Q100).

**Question:** Check whether a number is equal to the sum of its digits, each raised to the power of the number of digits.

**Answer:**
```js
function isArmstrong(number) {
  if (!Number.isInteger(number) || number < 0) return false;

  const digits = String(number).split("");
  const power = digits.length;

  const sum = digits.reduce((total, digit) => {
    return total + Number(digit) ** power;
  }, 0);

  return sum === number;
}

console.log(isArmstrong(153)); // true
console.log(isArmstrong(123)); // false
```

**Other Language Solutions:**

**Python:**
```python
def is_armstrong(n):
    digits=str(n); p=len(digits)
    return sum(int(d)**p for d in digits)==n
```

**Java:**
```java
static boolean isArmstrong(int n){String s=String.valueOf(n);int p=s.length(),sum=0;for(char c:s.toCharArray())sum+=(int)Math.pow(c-'0',p);return sum==n;}
```

**C# (.NET):**
```csharp
static bool IsArmstrong(int n){string s=n.ToString();int p=s.Length,sum=0;foreach(char c in s)sum+=(int)Math.Pow(c-'0',p);return sum==n;}
```

**C++:**
```cpp
bool isArmstrong(int n){string s=to_string(n);int sum=0,p=s.size();for(char c:s)sum+=(int)pow(c-'0',p);return sum==n;}
```


**Expected Output:**
```text
true
false
```

**Explanation (Simple English):**
The number is split into digits. Each digit is raised to the total number of digits, and those powers are added. The result is compared with the original number.

**Explanation (Simple Hindi):**
Number ko digits mein todte hain. Har digit ko total digits ki power tak raise karke sabko add karte hain. Phir sum ko original number se compare karte hain.

**How to solve this type of problem:**
For Armstrong problems, count the digits, raise every digit to that count, add the powers, and compare the sum with the original number.

---

### 14. Find Armstrong numbers in a given interval

**Original section:** First batch (Q1–Q100).

**Question:** Print all Armstrong numbers between a lower limit and an upper limit.

**Answer:**
```js
function isArmstrong(number) {
  const digits = String(number).split("");
  const power = digits.length;

  const sum = digits.reduce(
    (total, digit) => total + Number(digit) ** power,
    0
  );

  return sum === number;
}

function findArmstrongNumbers(start, end) {
  const result = [];

  for (let number = start; number <= end; number++) {
    if (isArmstrong(number)) {
      result.push(number);
    }
  }

  return result;
}

console.log(findArmstrongNumbers(1, 500));
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 153, 370, 371, 407]
```

**Other Language Solutions:**

**Python:**
```python
def armstrong_in_range(start, end):
    result = []
    for n in range(start, end + 1):
        digits = str(n)
        power = len(digits)
        if sum(int(d) ** power for d in digits) == n:
            result.append(n)
    return result
```

**Java:**
```java
static List<Integer> armstrongRange(int start,int end){List<Integer> r=new ArrayList<>();for(int n=start;n<=end;n++){String s=String.valueOf(n);int sum=0,p=s.length();for(char c:s.toCharArray())sum+=(int)Math.pow(c-'0',p);if(sum==n)r.add(n);}return r;}
```

**C# (.NET):**
```csharp
static List<int> ArmstrongRange(int start,int end){var r=new List<int>();for(int n=start;n<=end;n++){string s=n.ToString();int sum=0,p=s.Length;foreach(char c in s)sum+=(int)Math.Pow(c-'0',p);if(sum==n)r.Add(n);}return r;}
```

**C++:**
```cpp
vector<int> armstrongRange(int start,int end){vector<int> r;for(int n=start;n<=end;n++){string s=to_string(n);int sum=0,p=s.size();for(char c:s)sum+=(int)pow(c-'0',p);if(sum==n)r.push_back(n);}return r;}
```


**Expected Output:**
```text
[1,2,3,4,5,6,7,8,9,153,370,371,407]
```

**Explanation (Simple English):**
The number is split into digits. Each digit is raised to the total number of digits, and those powers are added. The result is compared with the original number.

**Explanation (Simple Hindi):**
Number ko digits mein todte hain. Har digit ko total digits ki power tak raise karke sabko add karte hain. Phir sum ko original number se compare karte hain.

**How to solve this type of problem:**
For Armstrong problems, count the digits, raise every digit to that count, add the powers, and compare the sum with the original number.

---

### 15. Find all factors of a number

**Original section:** First batch (Q1–Q100).

**Question:** Print all positive factors of a given number.

**Answer:**
```js
function findFactors(number) {
  const factors = [];

  for (let i = 1; i <= number; i++) {
    if (number % i === 0) {
      factors.push(i);
    }
  }

  return factors;
}

console.log(findFactors(12)); // [1, 2, 3, 4, 6, 12]
```

**Other Language Solutions:**

**Python:**
```python
def factors(n): return [d for d in range(1,n+1) if n%d==0]
```

**Java:**
```java
static List<Integer> factors(int n){List<Integer> r=new ArrayList<>();for(int d=1;d<=n;d++)if(n%d==0)r.add(d);return r;}
```

**C# (.NET):**
```csharp
static List<int> Factors(int n){var r=new List<int>();for(int d=1;d<=n;d++)if(n%d==0)r.Add(d);return r;}
```

**C++:**
```cpp
vector<int> factors(int n){vector<int> r;for(int d=1;d<=n;d++)if(n%d==0)r.push_back(d);return r;}
```


**Expected Output:**
```text
[1,2,3,4,6,12]
```

**Explanation (Simple English):**
The loop checks every candidate divisor. If the number gives remainder zero when divided by that candidate, the candidate is one of its factors.

**Explanation (Simple Hindi):**
Loop har possible divisor ko check karta hai. Agar number ko candidate se divide karne par remainder zero aaye, toh woh factor hai.

**How to solve this type of problem:**
For factor problems, loop through possible divisors, use the modulo operator (%) to test divisibility, and collect the values that divide evenly.

---

### 16. Find the sum of natural numbers using recursion

**Original section:** First batch (Q1–Q100).

**Question:** Calculate the sum of natural numbers from 1 to `n` using recursion.

**Answer:**
```js
function sumNaturalNumbers(number) {
  if (number <= 0) return 0;

  return number + sumNaturalNumbers(number - 1);
}

console.log(sumNaturalNumbers(5)); // 15
```

**Other Language Solutions:**

**Python:**
```python
def sum_natural(n): return 0 if n<=0 else n+sum_natural(n-1)
```

**Java:**
```java
static int sumNatural(int n){return n<=0?0:n+sumNatural(n-1);}
```

**C# (.NET):**
```csharp
static int SumNatural(int n)=>n<=0?0:n+SumNatural(n-1);
```

**C++:**
```cpp
int sumNatural(int n){return n<=0?0:n+sumNatural(n-1);}
```


**Expected Output:**
```text
15
```

**Explanation (Simple English):**
The recursive function adds the current number to the sum of all smaller positive numbers. It stops when the number reaches zero or below.

**Explanation (Simple Hindi):**
Recursive function current number mein usse chhote positive numbers ka sum add karta hai. Number zero ya usse neeche aate hi recursion ruk jaata hai.

**How to solve this type of problem:**
For recursive sums, define a clear stopping condition first, then make the function call itself with a smaller input.

---

### 17. Check whether a string is a palindrome using a loop

**Original section:** First batch (Q1–Q100).

**Question:** Check whether a string reads the same forward and backward.

**Answer:**
```js
function isPalindrome(str) {
  for (let i = 0; i < str.length / 2; i++) {
    if (str[i] !== str[str.length - 1 - i]) {
      return false;
    }
  }

  return true;
}

console.log(isPalindrome("madam")); // true
console.log(isPalindrome("hello")); // false
```

**Other Language Solutions:**

**Python:**
```python
def is_palindrome(s): return s == s[::-1]
```

**Java:**
```java
static boolean isPalindrome(String s){return s.equals(new StringBuilder(s).reverse().toString());}
```

**C# (.NET):**
```csharp
static bool IsPalindrome(string s)=>s==new string(s.Reverse().ToArray());
```

**C++:**
```cpp
bool isPalindrome(const string&s){return equal(s.begin(),s.end(),s.rbegin());}
```


**Expected Output:**
```text
true
false
```

**Explanation (Simple English):**
A palindrome reads the same from both ends. The solution compares matching characters from the beginning and end; one mismatch means it is not a palindrome.

**Explanation (Simple Hindi):**
Palindrome aage aur peeche se same read hota hai. Code shuru aur end ke matching characters compare karta hai; ek bhi mismatch aaye toh palindrome nahi hai.

**How to solve this type of problem:**
For palindrome questions, decide whether to normalize case/spaces first, then compare opposite characters or reverse the value and compare it with the original.

---

### 18. Sort the characters of a string in alphabetical order

**Original section:** First batch (Q1–Q100).

**Question:** Arrange the characters of a string in alphabetical order. The PDF's example uses character splitting and sorting.

**Answer:**
```js
function sortCharacters(str) {
  return str.toLowerCase().split("").sort().join("");
}

console.log(sortCharacters("dcab")); // abcd
```

**Other Language Solutions:**

**Python:**
```python
def sort_characters(s): return "".join(sorted(s))
```

**Java:**
```java
static String sortCharacters(String s){char[] a=s.toCharArray();Arrays.sort(a);return new String(a);}
```

**C# (.NET):**
```csharp
static string SortCharacters(string s)=>new string(s.OrderBy(c=>c).ToArray());
```

**C++:**
```cpp
string sortCharacters(string s){sort(s.begin(),s.end());return s;}
```


**Expected Output:**
```text
abcd
```

**Explanation (Simple English):**
The values are arranged according to a comparison rule. For numeric sorting, the comparator must return a negative, zero, or positive value based on the order.

**Explanation (Simple Hindi):**
Values ko comparison rule ke hisaab se arrange kiya jaata hai. Numeric sorting mein comparator batata hai ki kaunsa number pehle aayega.

**How to solve this type of problem:**
For sorting, decide ascending or descending order, use the correct numeric comparator, and remember that sort() changes the original array.

---

### 26. Check whether a string is a palindrome using built-in methods

**Original section:** First batch (Q1–Q100).

**Question:** Check whether a string is a palindrome using `split()`, `reverse()`, and `join()`.

**Answer:**
```js
function isPalindromeBuiltIn(str) {
  const reversed = str.split("").reverse().join("");
  return str === reversed;
}

console.log(isPalindromeBuiltIn("madam")); // true
console.log(isPalindromeBuiltIn("hello")); // false
```

**Other Language Solutions:**

**Python:**
```python
def is_palindrome(s): return s == s[::-1]
```

**Java:**
```java
static boolean isPalindrome(String s){return s.equals(new StringBuilder(s).reverse().toString());}
```

**C# (.NET):**
```csharp
static bool IsPalindrome(string s)=>s==new string(s.Reverse().ToArray());
```

**C++:**
```cpp
bool isPalindrome(const string&s){return equal(s.begin(),s.end(),s.rbegin());}
```


**Expected Output:**
```text
true
false
```

**Explanation (Simple English):**
A palindrome reads the same from both ends. The solution compares matching characters from the beginning and end; one mismatch means it is not a palindrome.

**Explanation (Simple Hindi):**
Palindrome aage aur peeche se same read hota hai. Code shuru aur end ke matching characters compare karta hai; ek bhi mismatch aaye toh palindrome nahi hai.

**How to solve this type of problem:**
For palindrome questions, decide whether to normalize case/spaces first, then compare opposite characters or reverse the value and compare it with the original.

---

### 27. Find duplicate values in an array

**Original section:** First batch (Q1–Q100).

**Question:** Find values that occur more than once in an array.

**Answer:**
```js
function findDuplicates(arr) {
  return arr.filter((value, index) => arr.indexOf(value) !== index);
}

console.log(findDuplicates([1, 2, 2, 3, 4, 4]));
// [2, 4]
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def all_duplicates(a):
    c=Counter(a); return list(dict.fromkeys(x for x in a if c[x]>1))
```

**Java:**
```java
static List<Integer> allDuplicates(int[] a){Map<Integer,Integer>m=new HashMap<>();for(int x:a)m.put(x,m.getOrDefault(x,0)+1);Set<Integer>r=new LinkedHashSet<>();for(int x:a)if(m.get(x)>1)r.add(x);return new ArrayList<>(r);}
```

**C# (.NET):**
```csharp
static int[] AllDuplicates(int[] a){var c=a.GroupBy(x=>x).ToDictionary(g=>g.Key,g=>g.Count());return a.Where(x=>c[x]>1).Distinct().ToArray();}
```

**C++:**
```cpp
vector<int> allDuplicates(const vector<int>&a){unordered_map<int,int>m;for(int x:a)m[x]++;vector<int>r;unordered_set<int>s;for(int x:a)if(m[x]>1&&s.insert(x).second)r.push_back(x);return r;}
```


**Expected Output:**
```text
[2,4]
[2,4]
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 29. Find the second largest number in an array using sorting

**Original section:** First batch (Q1–Q100).

**Question:** Find the second largest distinct number in an array by sorting it.

**Answer:**
```js
function secondLargestUsingSort(arr) {
  const uniqueSorted = [...new Set(arr)].sort((a, b) => b - a);

  if (uniqueSorted.length < 2) {
    return "Second largest value does not exist";
  }

  return uniqueSorted[1];
}

console.log(secondLargestUsingSort([8, 5, 2, 9, 6, 8]));
// 8
```

**Other Language Solutions:**

**Python:**
```python
def second_largest(arr):
    vals=sorted(set(arr), reverse=True)
    if len(vals)<2: raise ValueError("need two distinct values")
    return vals[1]
```

**Java:**
```java
static int secondLargest(int[] a){return Arrays.stream(a).distinct().boxed().sorted(Collections.reverseOrder()).skip(1).findFirst().orElseThrow();}
```

**C# (.NET):**
```csharp
static int SecondLargest(int[] a)=>a.Distinct().OrderByDescending(x=>x).Skip(1).First();
```

**C++:**
```cpp
int secondLargest(vector<int> a){sort(a.rbegin(),a.rend());a.erase(unique(a.begin(),a.end()),a.end());if(a.size()<2)throw invalid_argument("need two values");return a[1];}
```


**Expected Output:**
```text
8
```

**Explanation (Simple English):**
The values are arranged according to a comparison rule. For numeric sorting, the comparator must return a negative, zero, or positive value based on the order.

**Explanation (Simple Hindi):**
Values ko comparison rule ke hisaab se arrange kiya jaata hai. Numeric sorting mein comparator batata hai ki kaunsa number pehle aayega.

**How to solve this type of problem:**
For sorting, decide ascending or descending order, use the correct numeric comparator, and remember that sort() changes the original array.

---

### 30. Find the second largest number without sorting

**Original section:** First batch (Q1–Q100).

**Question:** Find the second largest distinct number in an array without using `sort()`.

**Answer:**
```js
function secondLargestWithoutSort(arr) {
  let largest = -Infinity;
  let secondLargest = -Infinity;

  for (const number of arr) {
    if (number > largest) {
      secondLargest = largest;
      largest = number;
    } else if (number > secondLargest && number < largest) {
      secondLargest = number;
    }
  }

  return secondLargest === -Infinity
    ? "Second largest value does not exist"
    : secondLargest;
}

console.log(secondLargestWithoutSort([12, 26, 38, 98, 99, 76]));
// 98
```

**Other Language Solutions:**

**Python:**
```python
def second_largest(arr):
    first=second=float("-inf")
    for x in arr:
        if x>first: second,first=first,x
        elif first>x>second: second=x
    if second==float("-inf"): raise ValueError("need two distinct values")
    return second
```

**Java:**
```java
static int secondLargest(int[] a){int first=Integer.MIN_VALUE,second=Integer.MIN_VALUE;for(int x:a){if(x>first){second=first;first=x;}else if(x<first&&x>second)second=x;}if(second==Integer.MIN_VALUE)throw new IllegalArgumentException();return second;}
```

**C# (.NET):**
```csharp
static int SecondLargest(int[] a){int first=int.MinValue,second=int.MinValue;foreach(int x in a){if(x>first){second=first;first=x;}else if(x<first&&x>second)second=x;}if(second==int.MinValue)throw new ArgumentException();return second;}
```

**C++:**
```cpp
int secondLargest(const vector<int>& a){int f=INT_MIN,s=INT_MIN;for(int x:a){if(x>f){s=f;f=x;}else if(x<f&&x>s)s=x;}if(s==INT_MIN)throw invalid_argument("need two distinct");return s;}
```


**Expected Output:**
```text
98
```

**Explanation (Simple English):**
The values are arranged according to a comparison rule. For numeric sorting, the comparator must return a negative, zero, or positive value based on the order.

**Explanation (Simple Hindi):**
Values ko comparison rule ke hisaab se arrange kiya jaata hai. Numeric sorting mein comparator batata hai ki kaunsa number pehle aayega.

**How to solve this type of problem:**
For sorting, decide ascending or descending order, use the correct numeric comparator, and remember that sort() changes the original array.

---

### 31. Find the missing number in an array

**Original section:** First batch (Q1–Q100).

**Question:** An array contains distinct numbers from 1 to `n`, with one number missing. Find the missing number.

**Answer:**
```js
function findMissingNumber(arr, n) {
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = arr.reduce((sum, number) => sum + number, 0);

  return expectedSum - actualSum;
}

console.log(findMissingNumber([1, 2, 3, 5], 5)); // 4
```

**Other Language Solutions:**

**Python:**
```python
def missing_number(arr, n):
    return n*(n+1)//2 - sum(arr)
```

**Java:**
```java
static int missingNumber(int[] a,int n){int sum=n*(n+1)/2;for(int x:a)sum-=x;return sum;}
```

**C# (.NET):**
```csharp
static int MissingNumber(int[] a,int n)=>n*(n+1)/2-a.Sum();
```

**C++:**
```cpp
int missingNumber(const vector<int>& a,int n){return n*(n+1)/2-accumulate(a.begin(),a.end(),0);}
```


**Expected Output:**
```text
4
```

**Explanation (Simple English):**
The solution compares the values that are present with the expected range or expected total. Any number that is not accounted for is missing.

**Explanation (Simple Hindi):**
Code present numbers ko expected range ya expected sum se compare karta hai. Jo number cover nahi hota, wahi missing hota hai.

**How to solve this type of problem:**
For missing-number problems, confirm the expected range and whether exactly one or several values are missing; then use a sum, Set, or frequency array.

---

### 36. Compare two arrays for equality

**Original section:** First batch (Q1–Q100).

**Question:** Check whether two arrays contain the same values in the same order.

**Answer:**
```js
function areArraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((value, index) => value === arr2[index]);
}

console.log(areArraysEqual([6, 4, 8, 10], [6, 4, 8, 10]));
// true

console.log(areArraysEqual([1, 2], [2, 1]));
// false
```

**Other Language Solutions:**

**Python:**
```python
def arrays_equal(a,b): return a==b
```

**Java:**
```java
static boolean arraysEqual(int[] a,int[] b){return Arrays.equals(a,b);}
```

**C# (.NET):**
```csharp
static bool ArraysEqual(int[] a,int[] b)=>a.SequenceEqual(b);
```

**C++:**
```cpp
bool arraysEqual(const vector<int>&a,const vector<int>&b){return a==b;}
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

### 37. Find the intersection of two arrays

**Original section:** First batch (Q1–Q100).

**Question:** Find the common elements present in both arrays.

**Answer:**
```js
function findIntersection(arr1, arr2) {
  return [...new Set(arr1.filter(value => arr2.includes(value)))];
}

console.log(findIntersection([9, 4, 6, 8, 4], [4, 8, 6, 9, 12]));
// [9, 4, 6, 8]
```

**Other Language Solutions:**

**Python:**
```python
def intersection(a,b): return list(dict.fromkeys(x for x in a if x in set(b)))
```

**Java:**
```java
static List<Integer> intersection(int[] a,int[] b){Set<Integer> s=new HashSet<>();for(int x:b)s.add(x);Set<Integer> r=new LinkedHashSet<>();for(int x:a)if(s.contains(x))r.add(x);return new ArrayList<>(r);}
```

**C# (.NET):**
```csharp
static int[] Intersection(int[] a,int[] b)=>a.Intersect(b).ToArray();
```

**C++:**
```cpp
vector<int> intersection(const vector<int>&a,const vector<int>&b){unordered_set<int>s(b.begin(),b.end());vector<int>r;for(int x:a)if(s.count(x)&&find(r.begin(),r.end(),x)==r.end())r.push_back(x);return r;}
```


**Expected Output:**
```text
[9,4,6,8]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

### 38. Find the union of two arrays

**Original section:** First batch (Q1–Q100).

**Question:** Combine two arrays and remove duplicate values.

**Answer:**
```js
function findUnion(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])];
}

console.log(findUnion([1, 2, 6, 8], [4, 8, 10, 12]));
// [1, 2, 6, 8, 4, 10, 12]
```

**Other Language Solutions:**

**Python:**
```python
def union(a,b): return list(dict.fromkeys(a+b))
```

**Java:**
```java
static List<Integer> union(int[] a,int[] b){Set<Integer>s=new LinkedHashSet<>();for(int x:a)s.add(x);for(int x:b)s.add(x);return new ArrayList<>(s);}
```

**C# (.NET):**
```csharp
static int[] Union(int[] a,int[] b)=>a.Union(b).ToArray();
```

**C++:**
```cpp
vector<int> unionValues(const vector<int>&a,const vector<int>&b){vector<int>r;unordered_set<int>s;for(int x:a)if(s.insert(x).second)r.push_back(x);for(int x:b)if(s.insert(x).second)r.push_back(x);return r;}
```


**Expected Output:**
```text
[1,2,6,8,4,10,12]
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 39. Find the frequency of each element in an array

**Original section:** First batch (Q1–Q100).

**Question:** Count how many times each element appears in an array.

**Answer:**
```js
function getFrequency(arr) {
  const frequency = {};

  for (const value of arr) {
    frequency[value] = (frequency[value] || 0) + 1;
  }

  return frequency;
}

console.log(getFrequency([1, 2, 1, 3, 2, 1]));
// { "1": 3, "2": 2, "3": 1 }
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def frequency(arr): return dict(Counter(arr))
```

**Java:**
```java
static Map<Integer,Integer> frequency(int[] a){Map<Integer,Integer>m=new LinkedHashMap<>();for(int x:a)m.put(x,m.getOrDefault(x,0)+1);return m;}
```

**C# (.NET):**
```csharp
static Dictionary<int,int> Frequency(int[] a){var d=new Dictionary<int,int>();foreach(int x in a)d[x]=d.GetValueOrDefault(x)+1;return d;}
```

**C++:**
```cpp
unordered_map<int,int> frequency(const vector<int>&a){unordered_map<int,int>m;for(int x:a)m[x]++;return m;}
```


**Expected Output:**
```text
{"1":3,"2":2,"3":1}
```

**Explanation (Simple English):**
A frequency object or Map stores a count for each value. Each time a value appears, its count is increased by one.

**Explanation (Simple Hindi):**
Frequency object ya Map har value ki count store karta hai. Jab bhi value dobara milti hai, uski count ek badh jaati hai.

**How to solve this type of problem:**
For frequency problems, create an empty object/Map, scan the input once, increment each value’s count, then read the counts you need.

---

### 43. Check whether a string contains another string

**Original section:** First batch (Q1–Q100).

**Question:** Check whether a substring exists inside a main string.

**Answer:**
```js
function containsText(str, substring) {
  return str.indexOf(substring) !== -1;
}

console.log(containsText("Hello Geeks", "Geeks")); // true
console.log(containsText("Hello Geeks", "World")); // false
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

### 44. Find the first non-repeating character in a string

**Original section:** First batch (Q1–Q100).

**Question:** Find the first character that appears only once in a string.

**Answer:**
```js
function firstNonRepeatingCharacter(str) {
  for (const char of str) {
    if (str.indexOf(char) === str.lastIndexOf(char)) {
      return char;
    }
  }

  return null;
}

console.log(firstNonRepeatingCharacter("javascript")); // j
```

**Other Language Solutions:**

**Python:**
```python
def first_non_repeating(s):
    from collections import Counter
    c=Counter(s)
    return next((ch for ch in s if c[ch]==1), None)
```

**Java:**
```java
static Character firstNonRepeating(String s){Map<Character,Integer>m=new LinkedHashMap<>();for(char c:s.toCharArray())m.put(c,m.getOrDefault(c,0)+1);for(char c:s.toCharArray())if(m.get(c)==1)return c;return null;}
```

**C# (.NET):**
```csharp
static char? FirstNonRepeating(string s){var d=s.GroupBy(c=>c).ToDictionary(g=>g.Key,g=>g.Count());foreach(char c in s)if(d[c]==1)return c;return null;}
```

**C++:**
```cpp
char firstNonRepeating(const string&s){unordered_map<char,int>m;for(char c:s)m[c]++;for(char c:s)if(m[c]==1)return c;return '\0';}
```


**Expected Output:**
```text
j
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 45. Find the longest word in a string

**Original section:** First batch (Q1–Q100).

**Question:** Find the longest word in a sentence.

**Answer:**
```js
function findLongestWord(sentence) {
  const words = sentence.trim().split(/\s+/);
  let longest = "";

  for (const word of words) {
    if (word.length > longest.length) {
      longest = word;
    }
  }

  return longest;
}

console.log(findLongestWord("coding makes problem solving great"));
// problem
```

**Other Language Solutions:**

**Python:**
```python
def longest_word(words): return max(words, key=len, default="")
```

**Java:**
```java
static String longestWord(String[] a){String best="";for(String s:a)if(s.length()>best.length())best=s;return best;}
```

**C# (.NET):**
```csharp
static string LongestWord(string[] a)=>a.OrderByDescending(s=>s.Length).FirstOrDefault() ?? "";
```

**C++:**
```cpp
string longestWord(const vector<string>& a){string best;for(auto&s:a)if(s.size()>best.size())best=s;return best;}
```


**Expected Output:**
```text
problem
```

**Explanation (Simple English):**
The code compares word lengths and stores the longest word found so far. At the end, the stored word is the answer.

**Explanation (Simple Hindi):**
Code words ki length compare karta hai aur ab tak ka sabse lamba word store rakhta hai. End mein wahi answer hota hai.

**How to solve this type of problem:**
For longest-word problems, split into words, initialize the best word, compare lengths, and update the best word when a longer one appears.

---

### 49. Find the factorial of a number using recursion

**Original section:** First batch (Q1–Q100).

**Question:** Write a recursive function to calculate the factorial of a number.

**Answer:**
```js
function factorial(number) {
  if (!Number.isInteger(number) || number < 0) {
    return "Enter a non-negative integer";
  }

  if (number === 0 || number === 1) {
    return 1;
  }

  return number * factorial(number - 1);
}

console.log(factorial(4)); // 24
```

**Other Language Solutions:**

**Python:**
```python
def factorial(n):
    if n < 0: raise ValueError("n must be non-negative")
    if n <= 1: return 1
    return n * factorial(n - 1)
```

**Java:**
```java
static long factorial(int n) {
    if (n < 0) throw new IllegalArgumentException();
    return n <= 1 ? 1 : n * factorial(n - 1);
}
```

**C# (.NET):**
```csharp
static long Factorial(int n) {
    if (n < 0) throw new ArgumentOutOfRangeException(nameof(n));
    return n <= 1 ? 1 : n * Factorial(n - 1);
}
```

**C++:**
```cpp
long long factorial(int n) { if (n < 0) throw invalid_argument("negative n"); return n <= 1 ? 1 : n * factorial(n-1); }
```


**Expected Output:**
```text
24
```

**Explanation (Simple English):**
Factorial means multiplying all whole numbers from the given number down to 1. The loop or recursive calls keep multiplying until the base case is reached.

**Explanation (Simple Hindi):**
Factorial ka matlab hai diye gaye number se 1 tak sabhi numbers ko multiply karna. Loop ya recursion har step par multiplication karta hai, aur base case par rukta hai.

**How to solve this type of problem:**
For factorial, handle invalid/negative input, remember that 0! and 1! equal 1, then multiply the numbers from 2 through n or use a recursive base case.

---

### 54. Check whether two strings are anagrams

**Original section:** First batch (Q1–Q100).

**Question:** Check whether two strings contain the same characters in a different order.

**Answer:**
```js
function areAnagrams(str1, str2) {
  const normalize = str =>
    str.toLowerCase().replace(/\s/g, "").split("").sort().join("");

  return normalize(str1) === normalize(str2);
}

console.log(areAnagrams("listen", "silent")); // true
console.log(areAnagrams("hello", "world"));   // false
```

**Other Language Solutions:**

**Python:**
```python
def are_anagrams(a,b): return sorted(a.replace(" ","").lower()) == sorted(b.replace(" ","").lower())
```

**Java:**
```java
static boolean areAnagrams(String a,String b){char[] x=a.replace(" ","").toLowerCase().toCharArray(),y=b.replace(" ","").toLowerCase().toCharArray();Arrays.sort(x);Arrays.sort(y);return Arrays.equals(x,y);}
```

**C# (.NET):**
```csharp
static bool AreAnagrams(string a,string b)=>string.Concat(a.Where(c=>!char.IsWhiteSpace(c)).ToLower().OrderBy(c=>c))==string.Concat(b.Where(c=>!char.IsWhiteSpace(c)).ToLower().OrderBy(c=>c));
```

**C++:**
```cpp
bool areAnagrams(string a,string b){a.erase(remove_if(a.begin(),a.end(),::isspace),a.end());b.erase(remove_if(b.begin(),b.end(),::isspace),b.end());sort(a.begin(),a.end());sort(b.begin(),b.end());return a==b;}
```


**Expected Output:**
```text
true
false
```

**Explanation (Simple English):**
Two strings are anagrams when they contain the same characters with the same counts. Sorting both character lists makes equal arrangements easy to compare.

**Explanation (Simple Hindi):**
Do strings anagram tab hote hain jab dono mein same characters utni hi baar hon. Dono ke characters sort karke compare karna easy hota hai.

**How to solve this type of problem:**
For anagrams, first normalize both strings if needed, then compare sorted characters or build character-frequency counts.

---

### 55. Find the maximum difference between two numbers in an array

**Original section:** First batch (Q1–Q100).

**Question:** Find the difference between the maximum and minimum values in an array.

**Answer:**
```js
function maximumDifference(arr) {
  if (arr.length < 2) {
    throw new Error("Array must contain at least two numbers");
  }

  const max = Math.max(...arr);
  const min = Math.min(...arr);

  return max - min;
}

console.log(maximumDifference([10, 32, 7, 21]));
// 25
```

**Other Language Solutions:**

**Python:**
```python
def max_difference(arr):
    if not arr: raise ValueError("empty array")
    return max(arr)-min(arr)
```

**Java:**
```java
static int maxDifference(int[] a){if(a.length==0)throw new IllegalArgumentException();return Arrays.stream(a).max().getAsInt()-Arrays.stream(a).min().getAsInt();}
```

**C# (.NET):**
```csharp
static int MaxDifference(int[] a)=>a.Max()-a.Min();
```

**C++:**
```cpp
int maxDifference(const vector<int>&a){if(a.empty())throw invalid_argument("empty");auto mm=minmax_element(a.begin(),a.end());return *mm.second-*mm.first;}
```


**Expected Output:**
```text
25
```

**Explanation (Simple English):**
The solution keeps a current best value and compares each new value with it. Whenever a bigger or smaller value is found, the stored answer is updated.

**Explanation (Simple Hindi):**
Code ek current best value rakhta hai aur har naye number se compare karta hai. Bada ya chhota number milne par answer update ho jaata hai.

**How to solve this type of problem:**
For minimum/maximum problems, initialize the answer with the first array value, scan the remaining values, and update it whenever a better value appears.

---

### 56. Remove duplicate values from an array

**Original section:** First batch (Q1–Q100).

**Question:** Remove duplicate values and return an array containing only unique values.

**Answer:**
```js
const fruits = ["apple", "orange", "apple", "mango"];

const uniqueFruits = [...new Set(fruits)];

console.log(uniqueFruits); // ["apple", "orange", "mango"]
```

**Other Language Solutions:**

**Python:**
```python
def unique_values(arr): return list(dict.fromkeys(arr))
```

**Java:**
```java
static int[] uniqueValues(int[] a){return Arrays.stream(a).distinct().toArray();}
```

**C# (.NET):**
```csharp
static int[] UniqueValues(int[] a)=>a.Distinct().ToArray();
```

**C++:**
```cpp
vector<int> uniqueValues(const vector<int>& a){vector<int> r;unordered_set<int>s;for(int x:a)if(s.insert(x).second)r.push_back(x);return r;}
```


**Expected Output:**
```text
["apple","orange","mango"]
["apple","orange","mango"]
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 57. Get unique characters from a string

**Original section:** First batch (Q1–Q100).

**Question:** Remove repeated characters from a string and return the unique characters.

**Answer:**
```js
function getUniqueCharacters(str) {
  const uniqueCharacters = [];

  for (const char of str) {
    if (!uniqueCharacters.includes(char)) {
      uniqueCharacters.push(char);
    }
  }

  return uniqueCharacters.join("");
}

console.log(getUniqueCharacters("geeksforgeeks"));
// "geksfor"
```

**Other Language Solutions:**

**Python:**
```python
def unique_characters(s): return "".join(dict.fromkeys(s))
```

**Java:**
```java
static String uniqueCharacters(String s){StringBuilder r=new StringBuilder();Set<Character> seen=new HashSet<>();for(char c:s.toCharArray())if(seen.add(c))r.append(c);return r.toString();}
```

**C# (.NET):**
```csharp
static string UniqueCharacters(string s){var seen=new HashSet<char>();return new string(s.Where(c=>seen.Add(c)).ToArray());}
```

**C++:**
```cpp
string uniqueCharacters(const string&s){string r;unordered_set<char>seen;for(char c:s)if(seen.insert(c).second)r+=c;return r;}
```


**Expected Output:**
```text
geksfor
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 59. Find the second smallest element in an array

**Original section:** First batch (Q1–Q100).

**Question:** Find the second smallest distinct number in an array of integers.

**Answer:**
```js
function secondSmallest(arr) {
  if (arr.length < 2) {
    return "Array must contain at least two elements";
  }

  let smallest = Infinity;
  let second = Infinity;

  for (const number of arr) {
    if (number < smallest) {
      second = smallest;
      smallest = number;
    } else if (number > smallest && number < second) {
      second = number;
    }
  }

  return second === Infinity
    ? "Second smallest value does not exist"
    : second;
}

console.log(secondSmallest([5, 8, 1, 2, 4])); // 2
```

**Other Language Solutions:**

**Python:**
```python
def second_smallest(arr):
    vals=sorted(set(arr))
    if len(vals)<2: raise ValueError("need two distinct values")
    return vals[1]
```

**Java:**
```java
static int secondSmallest(int[] a){return Arrays.stream(a).distinct().sorted().skip(1).findFirst().orElseThrow();}
```

**C# (.NET):**
```csharp
static int SecondSmallest(int[] a)=>a.Distinct().OrderBy(x=>x).Skip(1).First();
```

**C++:**
```cpp
int secondSmallest(vector<int>a){sort(a.begin(),a.end());a.erase(unique(a.begin(),a.end()),a.end());if(a.size()<2)throw invalid_argument("need two");return a[1];}
```


**Expected Output:**
```text
2
```

**Explanation (Simple English):**
The solution keeps a current best value and compares each new value with it. Whenever a bigger or smaller value is found, the stored answer is updated.

**Explanation (Simple Hindi):**
Code ek current best value rakhta hai aur har naye number se compare karta hai. Bada ya chhota number milne par answer update ho jaata hai.

**How to solve this type of problem:**
For minimum/maximum problems, initialize the answer with the first array value, scan the remaining values, and update it whenever a better value appears.

---

### 71. Remove duplicate elements from an array

**Original section:** First batch (Q1–Q100).

**Question:** Remove duplicate elements from an array using `Set`.

**Answer:**
```js
const arr = [1, 2, 2, 3, 4, 4];

const unique = [...new Set(arr)];

console.log(unique); // [1, 2, 3, 4]
```

**Other Language Solutions:**

**Python:**
```python
def unique_values(arr): return list(dict.fromkeys(arr))
```

**Java:**
```java
static int[] uniqueValues(int[] a){return Arrays.stream(a).distinct().toArray();}
```

**C# (.NET):**
```csharp
static int[] UniqueValues(int[] a)=>a.Distinct().ToArray();
```

**C++:**
```cpp
vector<int> uniqueValues(const vector<int>& a){vector<int> r;unordered_set<int>s;for(int x:a)if(s.insert(x).second)r.push_back(x);return r;}
```


**Expected Output:**
```text
[1,2,3,4]
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 75. Count the number of even and odd numbers in an array

**Original section:** First batch (Q1–Q100).

**Question:** Count how many elements are even and how many are odd.

**Answer:**
```js
const arr = [1, 2, 3, 4, 5, 6];

let even = 0;
let odd = 0;

arr.forEach(number => {
  if (number % 2 === 0) {
    even++;
  } else {
    odd++;
  }
});

console.log("Even:", even); // 3
console.log("Odd:", odd);   // 3
```

**Other Language Solutions:**

**Python:**
```python
def count_even_odd(a): return sum(x%2==0 for x in a), sum(x%2!=0 for x in a)
```

**Java:**
```java
static int[] countEvenOdd(int[] a){int e=0,o=0;for(int x:a)if(x%2==0)e++;else o++;return new int[]{e,o};}
```

**C# (.NET):**
```csharp
static int[] CountEvenOdd(int[] a){int e=0,o=0;foreach(int x in a)if(x%2==0)e++;else o++;return new[]{e,o};}
```

**C++:**
```cpp
pair<int,int> countEvenOdd(const vector<int>&a){int e=0,o=0;for(int x:a)if(x%2==0)e++;else o++;return{e,o};}
```


**Expected Output:**
```text
Even: 3
Odd: 3
```

**Explanation (Simple English):**
The remainder operator (%) tells whether a number is divisible by 2. A remainder of zero means even; otherwise it is odd.

**Explanation (Simple Hindi):**
% operator batata hai ki number 2 se poori tarah divide hota hai ya nahi. Remainder zero ho toh even, warna odd hota hai.

**How to solve this type of problem:**
For even/odd tasks, use number % 2, then either count, filter, or place each number into the required result group.

---

### 79. Get only unique elements from an array

**Original section:** First batch (Q1–Q100).

**Question:** Return only the elements that occur exactly once in an array.

**Answer:**
```js
const arr = [2, 2, 2, 4, 5, 7, 7];

const uniqueOnly = arr.filter(
  (value, index) => arr.indexOf(value) === arr.lastIndexOf(value)
);

console.log(uniqueOnly); // [4, 5]
```

**Other Language Solutions:**

**Python:**
```python
def unique_values(arr): return list(dict.fromkeys(arr))
```

**Java:**
```java
static int[] uniqueValues(int[] a){return Arrays.stream(a).distinct().toArray();}
```

**C# (.NET):**
```csharp
static int[] UniqueValues(int[] a)=>a.Distinct().ToArray();
```

**C++:**
```cpp
vector<int> uniqueValues(const vector<int>& a){vector<int> r;unordered_set<int>s;for(int x:a)if(s.insert(x).second)r.push_back(x);return r;}
```


**Expected Output:**
```text
[4,5]
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 80. Swap two elements in an array

**Original section:** First batch (Q1–Q100).

**Question:** Swap two array elements using a temporary variable.

**Answer:**
```js
const arr = [1, 2, 3, 4];

const i = 0;
const j = 2;

const temp = arr[i];
arr[i] = arr[j];
arr[j] = temp;

console.log(arr); // [3, 2, 1, 4]
```

**Other Language Solutions:**

**Python:**
```python
def swap_at(a, i, j):
    r=a.copy(); r[i],r[j]=r[j],r[i]; return r
```

**Java:**
```java
static int[] swapAt(int[] a,int i,int j){int[] r=a.clone();int t=r[i];r[i]=r[j];r[j]=t;return r;}
```

**C# (.NET):**
```csharp
static int[] SwapAt(int[] a,int i,int j){var r=(int[])a.Clone();(r[i],r[j])=(r[j],r[i]);return r;}
```

**C++:**
```cpp
vector<int> swapAt(vector<int>a,int i,int j){swap(a[i],a[j]);return a;}
```


**Expected Output:**
```text
[3,2,1,4]
[10,5]
```

**Explanation (Simple English):**
The solution identifies the two positions and exchanges their values. A temporary variable or destructuring assignment makes sure neither value is lost during the swap.

**Explanation (Simple Hindi):**
Code dono positions identify karke unki values exchange karta hai. Temporary variable ya destructuring assignment se swap ke dauraan koi value lost nahi hoti.

**How to solve this type of problem:**
For swapping array elements, verify both indexes, then exchange arr[i] and arr[j] using a temporary variable or [arr[i], arr[j]] = [arr[j], arr[i]].

---

### 81. Find the sum of all values in an array using `reduce()`

**Original section:** First batch (Q1–Q100).

**Question:** Calculate the sum of an array using the `reduce()` method.

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

### 82. Filter out falsy values from an array

**Original section:** First batch (Q1–Q100).

**Question:** Remove falsy values such as `false`, `0`, `""`, `null`, `undefined`, and `NaN`.

**Answer:**
```js
const mixed = [0, 1, false, 2, "", 3, null, undefined];

const truthyValues = mixed.filter(Boolean);

console.log(truthyValues); // [1, 2, 3]
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
[1,2,3]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

### 84. Remove all `null` and `undefined` values from an array

**Original section:** First batch (Q1–Q100).

**Question:** Remove only `null` and `undefined` values from an array.

**Answer:**
```js
const arr = [1, null, 2, undefined, 3, 0, false];

const cleaned = arr.filter(
  value => value !== null && value !== undefined
);

console.log(cleaned); // [1, 2, 3, 0, false]
```

**Other Language Solutions:**

> **Note:** Python has None but no separate undefined value. Java/C#/C++ samples remove null-like values.

**Python:**
```python
def remove_null_undefined(a): return [x for x in a if x is not None]  # Python has no undefined
```

**Java:**
```java
static List<Object> removeNulls(List<Object> a){List<Object>r=new ArrayList<>();for(Object x:a)if(x!=null)r.add(x);return r;}
```

**C# (.NET):**
```csharp
static object[] RemoveNulls(object[] a)=>a.Where(x=>x!=null).ToArray();
```

**C++:**
```cpp
template<class T> vector<T> removeNullLike(const vector<optional<T>>&a){vector<T>r;for(auto&x:a)if(x)r.push_back(*x);return r;}
```


**Expected Output:**
```text
[1,2,3,0,false]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

### 88. Find the second largest number in an array

**Original section:** First batch (Q1–Q100).

**Question:** Find the second largest distinct number using sorting.

**Answer:**
```js
function secondLargest(arr) {
  const sorted = [...new Set(arr)].sort((a, b) => b - a);

  return sorted.length >= 2 ? sorted[1] : null;
}

console.log(secondLargest([1, 4, 5, 6, 7, 8, 9]));
// 8
```

**Other Language Solutions:**

**Python:**
```python
def second_largest(arr):
    vals=sorted(set(arr), reverse=True)
    if len(vals)<2: raise ValueError("need two distinct values")
    return vals[1]
```

**Java:**
```java
static int secondLargest(int[] a){return Arrays.stream(a).distinct().boxed().sorted(Collections.reverseOrder()).skip(1).findFirst().orElseThrow();}
```

**C# (.NET):**
```csharp
static int SecondLargest(int[] a)=>a.Distinct().OrderByDescending(x=>x).Skip(1).First();
```

**C++:**
```cpp
int secondLargest(vector<int> a){sort(a.rbegin(),a.rend());a.erase(unique(a.begin(),a.end()),a.end());if(a.size()<2)throw invalid_argument("need two values");return a[1];}
```


**Expected Output:**
```text
8
```

**Explanation (Simple English):**
The values are arranged according to a comparison rule. For numeric sorting, the comparator must return a negative, zero, or positive value based on the order.

**Explanation (Simple Hindi):**
Values ko comparison rule ke hisaab se arrange kiya jaata hai. Numeric sorting mein comparator batata hai ki kaunsa number pehle aayega.

**How to solve this type of problem:**
For sorting, decide ascending or descending order, use the correct numeric comparator, and remember that sort() changes the original array.

---

### 89. Find the second smallest number in an array

**Original section:** First batch (Q1–Q100).

**Question:** Find the second smallest distinct number using sorting.

**Answer:**
```js
function secondSmallest(arr) {
  const sorted = [...new Set(arr)].sort((a, b) => a - b);

  return sorted.length >= 2 ? sorted[1] : null;
}

console.log(secondSmallest([7, 4, 8, 6, 9, 1]));
// 4
```

**Other Language Solutions:**

**Python:**
```python
def second_smallest(arr):
    vals=sorted(set(arr))
    if len(vals)<2: raise ValueError("need two distinct values")
    return vals[1]
```

**Java:**
```java
static int secondSmallest(int[] a){return Arrays.stream(a).distinct().sorted().skip(1).findFirst().orElseThrow();}
```

**C# (.NET):**
```csharp
static int SecondSmallest(int[] a)=>a.Distinct().OrderBy(x=>x).Skip(1).First();
```

**C++:**
```cpp
int secondSmallest(vector<int>a){sort(a.begin(),a.end());a.erase(unique(a.begin(),a.end()),a.end());if(a.size()<2)throw invalid_argument("need two");return a[1];}
```


**Expected Output:**
```text
4
```

**Explanation (Simple English):**
The values are arranged according to a comparison rule. For numeric sorting, the comparator must return a negative, zero, or positive value based on the order.

**Explanation (Simple Hindi):**
Values ko comparison rule ke hisaab se arrange kiya jaata hai. Numeric sorting mein comparator batata hai ki kaunsa number pehle aayega.

**How to solve this type of problem:**
For sorting, decide ascending or descending order, use the correct numeric comparator, and remember that sort() changes the original array.

---

### 90. Move all zeros to the end of an array

**Original section:** First batch (Q1–Q100).

**Question:** Move all zero values to the end while keeping the order of the non-zero elements.

**Answer:**
```js
function moveZerosToEnd(arr) {
  const nonZeros = arr.filter(number => number !== 0);
  const zeros = arr.filter(number => number === 0);

  return [...nonZeros, ...zeros];
}

console.log(moveZerosToEnd([0, 1, 0, 3, 12]));
// [1, 3, 12, 0, 0]
```

**Other Language Solutions:**

**Python:**
```python
def move_zeros(a):
    return [x for x in a if x!=0] + [0]*a.count(0)
```

**Java:**
```java
static int[] moveZeros(int[] a){int[]r=new int[a.length];int k=0;for(int x:a)if(x!=0)r[k++]=x;return r;}
```

**C# (.NET):**
```csharp
static int[] MoveZeros(int[] a){var r=a.Where(x=>x!=0).Concat(a.Where(x=>x==0));return r.ToArray();}
```

**C++:**
```cpp
vector<int> moveZeros(vector<int>a){int k=0;for(int x:a)if(x!=0)a[k++]=x;while(k<a.size())a[k++]=0;return a;}
```


**Expected Output:**
```text
[1,3,12,0,0]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

### 91. Remove duplicates from a sorted array in place

**Original section:** First batch (Q1–Q100).

**Question:** Remove consecutive duplicate values from a sorted array and return the array without duplicates.

**Answer:**
```js
function removeDuplicatesFromSorted(arr) {
  if (arr.length === 0) return arr;

  let writeIndex = 1;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1]) {
      arr[writeIndex] = arr[i];
      writeIndex++;
    }
  }

  arr.length = writeIndex;
  return arr;
}

console.log(removeDuplicatesFromSorted([1, 1, 2, 2, 3]));
// [1, 2, 3]
```

**Other Language Solutions:**

**Python:**
```python
def unique_values(arr): return list(dict.fromkeys(arr))
```

**Java:**
```java
static int[] uniqueValues(int[] a){return Arrays.stream(a).distinct().toArray();}
```

**C# (.NET):**
```csharp
static int[] UniqueValues(int[] a)=>a.Distinct().ToArray();
```

**C++:**
```cpp
vector<int> uniqueValues(const vector<int>& a){vector<int> r;unordered_set<int>s;for(int x:a)if(s.insert(x).second)r.push_back(x);return r;}
```


**Expected Output:**
```text
[1,2,3]
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 92. Find the missing number from 1 to n

**Original section:** First batch (Q1–Q100).

**Question:** An array contains numbers from 1 to `n` with one number missing. Find the missing number.

**Answer:**
```js
function findMissingNumber(arr, n) {
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = arr.reduce((sum, number) => sum + number, 0);

  return expectedSum - actualSum;
}

console.log(findMissingNumber([1, 2, 4, 5], 5)); // 3
```

**Other Language Solutions:**

**Python:**
```python
def missing_1_to_n(a,n): return n*(n+1)//2-sum(a)
```

**Java:**
```java
static int missing1ToN(int[] a,int n){int s=n*(n+1)/2;for(int x:a)s-=x;return s;}
```

**C# (.NET):**
```csharp
static int Missing1ToN(int[] a,int n)=>n*(n+1)/2-a.Sum();
```

**C++:**
```cpp
int missing1ToN(const vector<int>&a,int n){return n*(n+1)/2-accumulate(a.begin(),a.end(),0);}
```


**Expected Output:**
```text
3
```

**Explanation (Simple English):**
The solution compares the values that are present with the expected range or expected total. Any number that is not accounted for is missing.

**Explanation (Simple Hindi):**
Code present numbers ko expected range ya expected sum se compare karta hai. Jo number cover nahi hota, wahi missing hota hai.

**How to solve this type of problem:**
For missing-number problems, confirm the expected range and whether exactly one or several values are missing; then use a sum, Set, or frequency array.

---

### 94. Check whether an array contains only unique elements

**Original section:** First batch (Q1–Q100).

**Question:** Check whether every element in an array is unique, with no duplicates.

**Answer:**
```js
function hasOnlyUniqueElements(arr) {
  return arr.length === new Set(arr).size;
}

console.log(hasOnlyUniqueElements([1, 2, 3, 4])); // true
console.log(hasOnlyUniqueElements([1, 2, 2, 4])); // false
```

**Other Language Solutions:**

**Python:**
```python
def unique_values(arr): return list(dict.fromkeys(arr))
```

**Java:**
```java
static int[] uniqueValues(int[] a){return Arrays.stream(a).distinct().toArray();}
```

**C# (.NET):**
```csharp
static int[] UniqueValues(int[] a)=>a.Distinct().ToArray();
```

**C++:**
```cpp
vector<int> uniqueValues(const vector<int>& a){vector<int> r;unordered_set<int>s;for(int x:a)if(s.insert(x).second)r.push_back(x);return r;}
```


**Expected Output:**
```text
true
false
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 95. Flatten a nested array

**Original section:** First batch (Q1–Q100).

**Question:** Convert a nested array into a single-level array.

**Answer:**
```js
const nestedArray = [1, [2, [3, 4], 5]];

const flattened = nestedArray.flat(Infinity);

console.log(flattened); // [1, 2, 3, 4, 5]
```

**Other Language Solutions:**

**Python:**
```python
def flatten_one(a): return [x for row in a for x in row]
```

**Java:**
```java
static List<Integer> flattenOne(int[][] a){List<Integer>r=new ArrayList<>();for(int[] row:a)for(int x:row)r.add(x);return r;}
```

**C# (.NET):**
```csharp
static int[] FlattenOne(int[][] a)=>a.SelectMany(x=>x).ToArray();
```

**C++:**
```cpp
vector<int> flattenOne(const vector<vector<int>>&a){vector<int>r;for(auto&v:a)r.insert(r.end(),v.begin(),v.end());return r;}
```


**Expected Output:**
```text
[1,2,3,4,5]
```

**Explanation (Simple English):**
The solution walks through the nested array and adds inner elements to one output array. A recursive or built-in flat approach can handle deeper nesting depending on the requirement.

**Explanation (Simple Hindi):**
Code nested array ke elements par jaakar inner values ko ek output array mein add karta hai. Requirement ke hisaab se recursion ya flat method deeper nesting bhi handle kar sakta hai.

**How to solve this type of problem:**
For flattening, clarify whether nesting is one level or any depth; then use flat(depth) for a built-in solution or recursively visit each nested array.

---

### 96. Find the longest word in an array

**Original section:** First batch (Q1–Q100).

**Question:** Find the word with the greatest number of characters in an array of words.

**Answer:**
```js
const words = ["car", "bike", "airplane", "bus"];

let longest = "";

for (const word of words) {
  if (word.length > longest.length) {
    longest = word;
  }
}

console.log(longest); // airplane
```

**Other Language Solutions:**

**Python:**
```python
def longest_word_array(a): return max(a,key=len,default="")
```

**Java:**
```java
static String longestWordArray(String[] a){String r="";for(String s:a)if(s.length()>r.length())r=s;return r;}
```

**C# (.NET):**
```csharp
static string LongestWordArray(string[] a)=>a.OrderByDescending(x=>x.Length).FirstOrDefault()??"";
```

**C++:**
```cpp
string longestWordArray(const vector<string>&a){string r;for(auto&s:a)if(s.size()>r.size())r=s;return r;}
```


**Expected Output:**
```text
airplane
```

**Explanation (Simple English):**
The solution keeps a current best value and compares each new value with it. Whenever a bigger or smaller value is found, the stored answer is updated.

**Explanation (Simple Hindi):**
Code ek current best value rakhta hai aur har naye number se compare karta hai. Bada ya chhota number milne par answer update ho jaata hai.

**How to solve this type of problem:**
For minimum/maximum problems, initialize the answer with the first array value, scan the remaining values, and update it whenever a better value appears.

---

### 97. Group array elements by a property (age)

**Original section:** First batch (Q1–Q100).

**Question:** Group an array of people objects according to their `age` property.

**Answer:**
```js
const people = [
  { name: "Alice", age: 20 },
  { name: "Bob", age: 20 },
  { name: "Charlie", age: 25 }
];

const grouped = {};

for (const person of people) {
  const age = person.age;

  if (!grouped[age]) {
    grouped[age] = [];
  }

  grouped[age].push(person);
}

console.log(grouped);
```

**Other Language Solutions:**

**Python:**
```python
from collections import defaultdict
def group_by_age(people):
    result=defaultdict(list)
    for person in people: result[person["age"]].append(person)
    return dict(result)
```

**Java:**
```java
static Map<Integer,List<Map<String,Object>>> groupByAge(List<Map<String,Object>> people){Map<Integer,List<Map<String,Object>>>r=new HashMap<>();for(var p:people){int age=(Integer)p.get("age");r.computeIfAbsent(age,k->new ArrayList<>()).add(p);}return r;}
```

**C# (.NET):**
```csharp
static Dictionary<int,List<Dictionary<string,object>>> GroupByAge(List<Dictionary<string,object>> people){var r=new Dictionary<int,List<Dictionary<string,object>>>();foreach(var p in people){int age=(int)p["age"];if(!r.ContainsKey(age))r[age]=new();r[age].Add(p);}return r;}
```

**C++:**
```cpp
// Represent each person as pair<name, age>.
map<int,vector<string>> groupByAge(const vector<pair<string,int>>&p){map<int,vector<string>>r;for(auto&x:p)r[x.second].push_back(x.first);return r;}
```


**Expected Output:**
```text
{"20":[{"name":"Alice","age":20},{"name":"Bob","age":20}],"25":[{"name":"Charlie","age":25}]}
```

**Explanation (Simple English):**
The code uses a property value as a group key. When a group does not exist, it creates an empty array; then it adds the current item to that group.

**Explanation (Simple Hindi):**
Code kisi property ki value ko group key banata hai. Group pehle se nahi ho toh empty array banata hai, phir current item us group mein add karta hai.

**How to solve this type of problem:**
For grouping, decide which property defines a group, create a bucket the first time a key appears, and push each matching object into that bucket.

---

### 98. Get the frequency map of all elements in an array

**Original section:** First batch (Q1–Q100).

**Question:** Create an object that stores each array element and its frequency.

**Answer:**
```js
const items = [1, 2, 1, 2, 1];

const frequency = {};

for (const item of items) {
  if (frequency[item]) {
    frequency[item]++;
  } else {
    frequency[item] = 1;
  }
}

console.log(frequency); // { "1": 3, "2": 2 }
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def frequency(arr): return dict(Counter(arr))
```

**Java:**
```java
static Map<Integer,Integer> frequency(int[] a){Map<Integer,Integer>m=new LinkedHashMap<>();for(int x:a)m.put(x,m.getOrDefault(x,0)+1);return m;}
```

**C# (.NET):**
```csharp
static Dictionary<int,int> Frequency(int[] a){var d=new Dictionary<int,int>();foreach(int x in a)d[x]=d.GetValueOrDefault(x)+1;return d;}
```

**C++:**
```cpp
unordered_map<int,int> frequency(const vector<int>&a){unordered_map<int,int>m;for(int x:a)m[x]++;return m;}
```


**Expected Output:**
```text
{"1":3,"2":2}
```

**Explanation (Simple English):**
An object stores related information as key-value pairs. Dot notation reads a value by using its property name.

**Explanation (Simple Hindi):**
Object related information ko key-value pairs mein store karta hai. Dot notation se property ka naam use karke uski value milti hai.

**How to solve this type of problem:**
For object questions, identify the required keys and values, build the object, and access or update a property using dot or bracket notation.

---

### 100. Find the element with the highest frequency

**Original section:** First batch (Q1–Q100).

**Question:** Find the value that occurs the most times in an array.

**Answer:**
```js
function mostFrequentElement(arr) {
  const frequency = {};
  let maxFrequency = 0;
  let mostFrequent = null;

  for (const value of arr) {
    frequency[value] = (frequency[value] || 0) + 1;

    if (frequency[value] > maxFrequency) {
      maxFrequency = frequency[value];
      mostFrequent = value;
    }
  }

  return mostFrequent;
}

console.log(mostFrequentElement([2, 3, 9, 2, 5, 3, 2]));
// 2
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def frequency(arr): return dict(Counter(arr))
```

**Java:**
```java
static Map<Integer,Integer> frequency(int[] a){Map<Integer,Integer>m=new LinkedHashMap<>();for(int x:a)m.put(x,m.getOrDefault(x,0)+1);return m;}
```

**C# (.NET):**
```csharp
static Dictionary<int,int> Frequency(int[] a){var d=new Dictionary<int,int>();foreach(int x in a)d[x]=d.GetValueOrDefault(x)+1;return d;}
```

**C++:**
```cpp
unordered_map<int,int> frequency(const vector<int>&a){unordered_map<int,int>m;for(int x:a)m[x]++;return m;}
```


**Expected Output:**
```text
2
```

**Explanation (Simple English):**
A frequency object or Map stores a count for each value. Each time a value appears, its count is increased by one.

**Explanation (Simple Hindi):**
Frequency object ya Map har value ki count store karta hai. Jab bhi value dobara milti hai, uski count ek badh jaati hai.

**How to solve this type of problem:**
For frequency problems, create an empty object/Map, scan the input once, increment each value’s count, then read the counts you need.

---

---

## Additional first-batch array exercises

### Find the sum of each subarray

**Original section:** Additional first-batch array exercises.

**Question:** Calculate the sum for every contiguous subarray.

```js
function getSubarraySums(arr) {
  const sums = [];

  for (let start = 0; start < arr.length; start++) {
    let sum = 0;

    for (let end = start; end < arr.length; end++) {
      sum += arr[end];
      sums.push(sum);
    }
  }

  return sums;
}

console.log(getSubarraySums([1, 2, 3]));
// [1, 3, 6, 2, 5, 3]
```

**Other Language Solutions:**

**Python:**
```python
def subarray_sums(a):
    out=[]
    for i in range(len(a)):
        total=0
        for j in range(i,len(a)):
            total+=a[j]; out.append(total)
    return out
```

**Java:**
```java
static List<Integer> subarraySums(int[] a){List<Integer>r=new ArrayList<>();for(int i=0;i<a.length;i++){int s=0;for(int j=i;j<a.length;j++){s+=a[j];r.add(s);}}return r;}
```

**C# (.NET):**
```csharp
static List<int> SubarraySums(int[] a){var r=new List<int>();for(int i=0;i<a.Length;i++){int s=0;for(int j=i;j<a.Length;j++){s+=a[j];r.Add(s);}}return r;}
```

**C++:**
```cpp
vector<int> subarraySums(const vector<int>&a){vector<int>r;for(int i=0;i<a.size();i++){int s=0;for(int j=i;j<a.size();j++){s+=a[j];r.push_back(s);}}return r;}
```


**Expected Output:**
```text
[1,3,6,2,5,3]
```

**Explanation (Simple English):**
Nested loops choose every possible start and end position. slice() then collects the continuous elements between those positions.

**Explanation (Simple Hindi):**
Nested loops har possible start aur end position choose karte hain. slice() un positions ke beech ke continuous elements nikaalta hai.

**How to solve this type of problem:**
For subarray problems, remember a subarray must be contiguous; choose a start index, extend the end index, and update the result for each range.

---

### Remove consecutive duplicates

**Original section:** Additional first-batch array exercises.

**Question:** Remove repeated values that appear consecutively, keeping one value from each consecutive group.

```js
function removeConsecutiveDuplicates(arr) {
  if (arr.length === 0) return [];

  const result = [arr[0]];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1]) result.push(arr[i]);
  }

  return result;
}

console.log(removeConsecutiveDuplicates([1, 1, 2, 2, 3, 1, 1]));
// [1, 2, 3, 1]
```

**Other Language Solutions:**

**Python:**
```python
def remove_consecutive(a):
    out=[]
    for x in a:
        if not out or out[-1]!=x: out.append(x)
    return out
```

**Java:**
```java
static List<Integer> removeConsecutive(int[] a){List<Integer>r=new ArrayList<>();for(int x:a)if(r.isEmpty()||r.get(r.size()-1)!=x)r.add(x);return r;}
```

**C# (.NET):**
```csharp
static int[] RemoveConsecutive(int[] a){var r=new List<int>();foreach(int x in a)if(r.Count==0||r[^1]!=x)r.Add(x);return r.ToArray();}
```

**C++:**
```cpp
vector<int> removeConsecutive(const vector<int>&a){vector<int>r;for(int x:a)if(r.empty()||r.back()!=x)r.push_back(x);return r;}
```


**Expected Output:**
```text
[1,2,3,1]
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### Remove elements occurring more than once

**Original section:** Additional first-batch array exercises.

**Question:** Keep only values that occur exactly once in the array.

```js
function keepSingleOccurrence(arr) {
  return arr.filter(
    value => arr.indexOf(value) === arr.lastIndexOf(value)
  );
}

console.log(keepSingleOccurrence([1, 2, 2, 3, 4, 4, 5]));
// [1, 3, 5]
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def remove_values_that_repeat(a):
    c=Counter(a);return [x for x in a if c[x]==1]
```

**Java:**
```java
static List<Integer> removeValuesThatRepeat(int[]a){Map<Integer,Integer>m=new HashMap<>();for(int x:a)m.put(x,m.getOrDefault(x,0)+1);List<Integer>r=new ArrayList<>();for(int x:a)if(m.get(x)==1)r.add(x);return r;}
```

**C# (.NET):**
```csharp
static int[] RemoveValuesThatRepeat(int[]a){var c=a.GroupBy(x=>x).ToDictionary(g=>g.Key,g=>g.Count());return a.Where(x=>c[x]==1).ToArray();}
```

**C++:**
```cpp
vector<int> removeValuesThatRepeat(const vector<int>&a){unordered_map<int,int>m;for(int x:a)m[x]++;vector<int>r;for(int x:a)if(m[x]==1)r.push_back(x);return r;}
```


**Expected Output:**
```text
[1,3,5]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

### Shuffle the elements randomly

**Original section:** Additional first-batch array exercises.

**Question:** Randomly shuffle the elements of an array.

```js
function shuffleArray(arr) {
  const result = [...arr];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

console.log(shuffleArray([1, 2, 3, 4, 5]));
// One possible output: [3, 1, 5, 2, 4]
```

**Other Language Solutions:**

**Python:**
```python
import random
def shuffle_array(a):
    r=a.copy(); random.shuffle(r); return r
```

**Java:**
```java
static int[] shuffleArray(int[] a){List<Integer>r=new ArrayList<>();for(int x:a)r.add(x);Collections.shuffle(r);return r.stream().mapToInt(Integer::intValue).toArray();}
```

**C# (.NET):**
```csharp
static int[] ShuffleArray(int[] a){var r=(int[])a.Clone();var rng=Random.Shared;for(int i=r.Length-1;i>0;i--){int j=rng.Next(i+1);(r[i],r[j])=(r[j],r[i]);}return r;}
```

**C++:**
```cpp
vector<int> shuffleArray(vector<int>a){mt19937 g(random_device{}());shuffle(a.begin(),a.end(),g);return a;}
```


**Expected Output:**
```text
[2,5,1,3,4]
```

**Explanation (Simple English):**
The Fisher–Yates style loop chooses a random index from the unprocessed portion and swaps it with the current element.

**Explanation (Simple Hindi):**
Fisher–Yates style loop unprocessed part se random index choose karta hai aur current element ke saath swap kar deta hai.

**How to solve this type of problem:**
For shuffling, walk backward through the array, choose a random index from 0 through the current index, and swap those two items.

---

### Find the median of a numeric array

**Original section:** Additional first-batch array exercises.

**Question:** Find the middle value of a sorted array. For an even number of elements, return the average of the two middle values.

```js
function findMedian(arr) {
  if (arr.length === 0) {
    throw new Error("Array must not be empty");
  }

  const sorted = [...arr].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) return sorted[middle];

  return (sorted[middle - 1] + sorted[middle]) / 2;
}

console.log(findMedian([5, 3, 1, 4, 2])); // 3
console.log(findMedian([5, 3, 1, 4]));    // 3.5
```

**Other Language Solutions:**

**Python:**
```python
def median(a):
    if not a: raise ValueError("empty array")
    s=sorted(a); n=len(s); mid=n//2
    return s[mid] if n%2 else (s[mid-1]+s[mid])/2
```

**Java:**
```java
static double median(int[] a){if(a.length==0)throw new IllegalArgumentException();int[]s=a.clone();Arrays.sort(s);int n=s.length;return n%2==1?s[n/2]:(s[n/2-1]+s[n/2])/2.0;}
```

**C# (.NET):**
```csharp
static double Median(int[] a){var s=a.OrderBy(x=>x).ToArray();int n=s.Length;return n%2==1?s[n/2]:(s[n/2-1]+s[n/2])/2.0;}
```

**C++:**
```cpp
double median(vector<int>a){sort(a.begin(),a.end());int n=a.size();return n%2?a[n/2]:(a[n/2-1]+a[n/2])/2.0;}
```


**Expected Output:**
```text
3
3.5
```

**Explanation (Simple English):**
The values are sorted first. For an odd number of values, the middle item is the median; for an even count, it is the average of the two middle values.

**Explanation (Simple Hindi):**
Pehle values sort hoti hain. Odd count mein beech wala element median hota hai; even count mein dono middle values ka average lete hain.

**How to solve this type of problem:**
For median, sort a copy of the numbers, check whether the length is odd or even, and select the middle value(s) accordingly.

---

### Find the mode of an array

**Original section:** Additional first-batch array exercises.

**Question:** Find the value that occurs most frequently.

```js
function findMode(arr) {
  const frequency = new Map();
  let mode = null;
  let highestCount = 0;

  for (const value of arr) {
    const count = (frequency.get(value) || 0) + 1;
    frequency.set(value, count);

    if (count > highestCount) {
      highestCount = count;
      mode = value;
    }
  }

  return mode;
}

console.log(findMode([1, 2, 2, 4, 6])); // 2
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def most_frequent(a):
    if not a: return None
    c=Counter(a); return max(c,key=c.get)
```

**Java:**
```java
static Integer mostFrequent(int[] a){Map<Integer,Integer>m=new HashMap<>();for(int x:a)m.put(x,m.getOrDefault(x,0)+1);Integer best=null;for(int x:a)if(best==null||m.get(x)>m.get(best))best=x;return best;}
```

**C# (.NET):**
```csharp
static int? MostFrequent(int[] a){if(a.Length==0)return null;return a.GroupBy(x=>x).OrderByDescending(g=>g.Count()).First().Key;}
```

**C++:**
```cpp
int mostFrequent(const vector<int>&a){unordered_map<int,int>m;for(int x:a)m[x]++;int best=0;for(int x:a)if(m[x]>m[best])best=x;return best;}
```


**Expected Output:**
```text
2
```

**Explanation (Simple English):**
Mode is the value that appears most often. The code counts each value and then selects the value with the highest frequency.

**Explanation (Simple Hindi):**
Mode woh value hoti hai jo sabse zyada baar aati hai. Code har value ki frequency count karke highest frequency wali value choose karta hai.

**How to solve this type of problem:**
For mode, build a frequency map, track the largest count, and decide how to handle ties when multiple values occur equally often.

---

### Rotate an array to the right by one position

**Original section:** Additional first-batch array exercises.

**Question:** Move the last element to the beginning of the array.

```js
function rotateRightOne(arr) {
  if (arr.length === 0) return [];

  const result = [...arr];
  const last = result.pop();
  result.unshift(last);

  return result;
}

console.log(rotateRightOne([1, 2, 3, 4, 5]));
// [5, 1, 2, 3, 4]
```

**Other Language Solutions:**

**Python:**
```python
def rotate_right(a,k=1):
    if not a: return []
    k%=len(a); return a[-k:]+a[:-k] if k else a[:]
```

**Java:**
```java
static int[] rotateRight(int[] a,int k){if(a.length==0)return a;k%=a.length;int[]r=new int[a.length];for(int i=0;i<a.length;i++)r[(i+k)%a.length]=a[i];return r;}
```

**C# (.NET):**
```csharp
static int[] RotateRight(int[] a,int k){if(a.Length==0)return a;k%=a.Length;return a.Skip(a.Length-k).Concat(a.Take(a.Length-k)).ToArray();}
```

**C++:**
```cpp
vector<int> rotateRight(vector<int>a,int k){if(a.empty())return a;k%=a.size();rotate(a.begin(),a.end()-k,a.end());return a;}
```


**Expected Output:**
```text
[5,1,2,3,4]
```

**Explanation (Simple English):**
Rotation moves elements around the array while preserving their relative order. The code normalizes the number of steps and combines or shifts the relevant part of the array.

**Explanation (Simple Hindi):**
Rotation mein elements array ke ek end se doosre end par move hote hain aur unka order preserve rehta hai. Code steps ko normalize karke values shift ya combine karta hai.

**How to solve this type of problem:**
For rotation, reduce k using k % array.length, decide left or right, and use slicing or an in-place reversal strategy.

---

### Count elements greater than the average

**Original section:** Additional first-batch array exercises.

**Question:** Count how many array values are greater than the array's average.

```js
function countAboveAverage(arr) {
  if (arr.length === 0) return 0;

  const average = arr.reduce((sum, value) => sum + value, 0) / arr.length;
  return arr.filter(value => value > average).length;
}

console.log(countAboveAverage([2, 4, 6, 8, 10])); // 2
```

**Other Language Solutions:**

**Python:**
```python
def count_above_average(a):
    avg=sum(a)/len(a) if a else 0
    return sum(x>avg for x in a)
```

**Java:**
```java
static long countAboveAverage(int[] a){if(a.length==0)return 0;double avg=Arrays.stream(a).average().orElse(0);return Arrays.stream(a).filter(x->x>avg).count();}
```

**C# (.NET):**
```csharp
static int CountAboveAverage(int[] a){if(a.Length==0)return 0;double avg=a.Average();return a.Count(x=>x>avg);}
```

**C++:**
```cpp
int countAboveAverage(const vector<int>&a){if(a.empty())return 0;double avg=(double)accumulate(a.begin(),a.end(),0)/a.size();return count_if(a.begin(),a.end(),[&](int x){return x>avg;});}
```


**Expected Output:**
```text
2
```

**Explanation (Simple English):**
The solution first calculates the total of all values, then divides that total by the number of elements. An empty array must be handled separately.

**Explanation (Simple Hindi):**
Pehle saare numbers ka sum nikalta hai, phir us sum ko elements ki count se divide karta hai. Empty array ko alag handle karna zaroori hai.

**How to solve this type of problem:**
For average problems, calculate the sum, divide by array length, and decide what to do when the array is empty.

---

### Check whether an array is a palindrome

**Original section:** Additional first-batch array exercises.

**Question:** Check whether an array reads the same from left to right and right to left.

```js
function isArrayPalindrome(arr) {
  for (let i = 0; i < Math.floor(arr.length / 2); i++) {
    if (arr[i] !== arr[arr.length - 1 - i]) return false;
  }

  return true;
}

console.log(isArrayPalindrome([1, 2, 3, 2, 1])); // true
```

**Other Language Solutions:**

**Python:**
```python
def is_palindrome_array(a): return a == a[::-1]
```

**Java:**
```java
static boolean isPalindromeArray(int[] a){for(int i=0,j=a.length-1;i<j;i++,j--)if(a[i]!=a[j])return false;return true;}
```

**C# (.NET):**
```csharp
static bool IsPalindromeArray(int[] a){for(int i=0,j=a.Length-1;i<j;i++,j--)if(a[i]!=a[j])return false;return true;}
```

**C++:**
```cpp
bool isPalindromeArray(const vector<int>&a){return equal(a.begin(),a.end(),a.rbegin());}
```


**Expected Output:**
```text
true
```

**Explanation (Simple English):**
A palindrome reads the same from both ends. The solution compares matching characters from the beginning and end; one mismatch means it is not a palindrome.

**Explanation (Simple Hindi):**
Palindrome aage aur peeche se same read hota hai. Code shuru aur end ke matching characters compare karta hai; ek bhi mismatch aaye toh palindrome nahi hai.

**How to solve this type of problem:**
For palindrome questions, decide whether to normalize case/spaces first, then compare opposite characters or reverse the value and compare it with the original.

---

### Find minimum and maximum in one pass

**Original section:** Additional first-batch array exercises.

**Question:** Find the smallest and largest values in one traversal of an array.

```js
function findMinMax(arr) {
  if (arr.length === 0) {
    throw new Error("Array must not be empty");
  }

  let min = arr[0];
  let max = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }

  return { min, max };
}

console.log(findMinMax([9, 1, 7, 3, 5]));
// { min: 1, max: 9 }
```

**Other Language Solutions:**

**Python:**
```python
def min_max(a): return min(a), max(a)
```

**Java:**
```java
static int[] minMax(int[] a){int mn=a[0],mx=a[0];for(int x:a){mn=Math.min(mn,x);mx=Math.max(mx,x);}return new int[]{mn,mx};}
```

**C# (.NET):**
```csharp
static int[] MinMax(int[] a){int mn=a[0],mx=a[0];foreach(int x in a){mn=Math.Min(mn,x);mx=Math.Max(mx,x);}return new[]{mn,mx};}
```

**C++:**
```cpp
pair<int,int> minMax(const vector<int>&a){int mn=a[0],mx=a[0];for(int x:a){mn=min(mn,x);mx=max(mx,x);}return{mn,mx};}
```


**Expected Output:**
```text
{"min":1,"max":9}
```

**Explanation (Simple English):**
The solution keeps a current best value and compares each new value with it. Whenever a bigger or smaller value is found, the stored answer is updated.

**Explanation (Simple Hindi):**
Code ek current best value rakhta hai aur har naye number se compare karta hai. Bada ya chhota number milne par answer update ho jaata hai.

**How to solve this type of problem:**
For minimum/maximum problems, initialize the answer with the first array value, scan the remaining values, and update it whenever a better value appears.

---

### Remove every N-th element

**Original section:** Additional first-batch array exercises.

**Question:** Remove elements at every N-th position (1-based positions).

```js
function removeEveryNth(arr, n) {
  if (n <= 0) throw new Error("n must be greater than zero");

  return arr.filter((_, index) => (index + 1) % n !== 0);
}

console.log(removeEveryNth([1, 2, 3, 4, 5, 6, 7, 8], 3));
// [1, 2, 4, 5, 7, 8]
```

**Other Language Solutions:**

**Python:**
```python
def remove_every_nth(a,n): return [x for i,x in enumerate(a,1) if i%n!=0]
```

**Java:**
```java
static int[] removeEveryNth(int[] a,int n){return java.util.stream.IntStream.range(0,a.length).filter(i->(i+1)%n!=0).map(i->a[i]).toArray();}
```

**C# (.NET):**
```csharp
static int[] RemoveEveryNth(int[] a,int n)=>a.Where((x,i)=>(i+1)%n!=0).ToArray();
```

**C++:**
```cpp
vector<int> removeEveryNth(const vector<int>&a,int n){vector<int>r;for(int i=0;i<a.size();i++)if((i+1)%n)r.push_back(a[i]);return r;}
```


**Expected Output:**
```text
[1,2,4,5,7,8]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

### Find the last index of a given element without `lastIndexOf()`

**Original section:** Additional first-batch array exercises.

**Question:** Find the last occurrence index of a target value using a loop.

```js
function findLastIndex(arr, target) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === target) return i;
  }

  return -1;
}

console.log(findLastIndex([1, 2, 3, 2, 4], 2)); // 3
```

**Other Language Solutions:**

**Python:**
```python
def last_index(a,target):
    for i in range(len(a)-1,-1,-1):
        if a[i]==target: return i
    return -1
```

**Java:**
```java
static int lastIndex(int[] a,int t){for(int i=a.length-1;i>=0;i--)if(a[i]==t)return i;return -1;}
```

**C# (.NET):**
```csharp
static int LastIndex(int[] a,int t){for(int i=a.Length-1;i>=0;i--)if(a[i]==t)return i;return -1;}
```

**C++:**
```cpp
int lastIndex(const vector<int>&a,int t){for(int i=(int)a.size()-1;i>=0;i--)if(a[i]==t)return i;return -1;}
```


**Expected Output:**
```text
3
```

**Explanation (Simple English):**
The solution scans the array and compares each element with the target. Depending on the task, it returns the first match, all matching indexes, or a not-found value.

**Explanation (Simple Hindi):**
Code array scan karke har element ko target se compare karta hai. Task ke hisaab se pehla match, saare indexes, ya not-found value return hoti hai.

**How to solve this type of problem:**
For search problems, decide whether you need a value or an index, scan the array, and define clearly what to return when no match is found.

---

### Count the frequency of every element

**Original section:** Additional first-batch array exercises.

**Question:** Build a frequency object for all values in an array.

```js
function countFrequency(arr) {
  const frequency = {};

  for (const value of arr) {
    frequency[value] = (frequency[value] || 0) + 1;
  }

  return frequency;
}

console.log(countFrequency([1, 2, 2, 3, 1, 2]));
// { "1": 2, "2": 3, "3": 1 }
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def frequency(arr): return dict(Counter(arr))
```

**Java:**
```java
static Map<Integer,Integer> frequency(int[] a){Map<Integer,Integer>m=new LinkedHashMap<>();for(int x:a)m.put(x,m.getOrDefault(x,0)+1);return m;}
```

**C# (.NET):**
```csharp
static Dictionary<int,int> Frequency(int[] a){var d=new Dictionary<int,int>();foreach(int x in a)d[x]=d.GetValueOrDefault(x)+1;return d;}
```

**C++:**
```cpp
unordered_map<int,int> frequency(const vector<int>&a){unordered_map<int,int>m;for(int x:a)m[x]++;return m;}
```


**Expected Output:**
```text
{"1":2,"2":3,"3":1}
```

**Explanation (Simple English):**
An object stores related information as key-value pairs. Dot notation reads a value by using its property name.

**Explanation (Simple Hindi):**
Object related information ko key-value pairs mein store karta hai. Dot notation se property ka naam use karke uski value milti hai.

**How to solve this type of problem:**
For object questions, identify the required keys and values, build the object, and access or update a property using dot or bracket notation.

---

### Remove all non-numeric values

**Original section:** Additional first-batch array exercises.

**Question:** Keep only values whose JavaScript type is `number` and which are finite.

```js
function keepNumbers(arr) {
  return arr.filter(
    value => typeof value === "number" && Number.isFinite(value)
  );
}

console.log(keepNumbers([1, "a", 2, null, 3, "4"]));
// [1, 2, 3]
```

**Other Language Solutions:**

**Python:**
```python
def keep_numbers(a): return [x for x in a if isinstance(x,(int,float)) and not isinstance(x,bool)]
```

**Java:**
```java
static List<Number> keepNumbers(List<Object> a){List<Number>r=new ArrayList<>();for(Object x:a)if(x instanceof Number)r.add((Number)x);return r;}
```

**C# (.NET):**
```csharp
static object[] KeepNumbers(object[] a)=>a.Where(x=>x is byte||x is short||x is int||x is long||x is float||x is double||x is decimal).ToArray();
```

**C++:**
```cpp
vector<double> keepNumbers(const vector<variant<int,double,string>>&a){vector<double>r;for(auto&x:a){if(holds_alternative<int>(x))r.push_back(get<int>(x));else if(holds_alternative<double>(x))r.push_back(get<double>(x));}return r;}
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

### Find the common prefix of strings in an array

**Original section:** Additional first-batch array exercises.

**Question:** Find the longest prefix shared by all strings.

```js
function longestCommonPrefix(words) {
  if (words.length === 0) return "";

  let prefix = words[0];

  for (const word of words.slice(1)) {
    while (!word.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }

  return prefix;
}

console.log(longestCommonPrefix(["flower", "flow", "flight"]));
// "fl"
```

**Other Language Solutions:**

**Python:**
```python
def common_prefix(words):
    if not words: return ""
    p=words[0]
    for w in words[1:]:
        while not w.startswith(p): p=p[:-1]
    return p
```

**Java:**
```java
static String commonPrefix(String[] a){if(a.length==0)return "";String p=a[0];for(String s:a)while(!s.startsWith(p))p=p.substring(0,p.length()-1);return p;}
```

**C# (.NET):**
```csharp
static string CommonPrefix(string[] a){if(a.Length==0)return "";string p=a[0];foreach(string s in a)while(!s.StartsWith(p))p=p.Substring(0,p.Length-1);return p;}
```

**C++:**
```cpp
string commonPrefix(const vector<string>&a){if(a.empty())return "";string p=a[0];for(auto&s:a)while(s.rfind(p,0)!=0)p.pop_back();return p;}
```


**Expected Output:**
```text
fl
```

**Explanation (Simple English):**
The solution starts with one word as the possible prefix and shortens it until every other word begins with that same prefix.

**Explanation (Simple Hindi):**
Code pehle word ko possible prefix maanta hai aur jab tak baaki sabhi words usse start nahi hote, prefix ko chhota karta rehta hai.

**How to solve this type of problem:**
For a common-prefix problem, start with the first string, compare it with each next string, and remove characters from the end until it matches the beginning of all strings.

---

### Find elements occurring exactly once

**Original section:** Additional first-batch array exercises.

**Question:** Return only values that appear once in the array.

```js
function elementsExactlyOnce(arr) {
  return arr.filter(
    value => arr.indexOf(value) === arr.lastIndexOf(value)
  );
}

console.log(elementsExactlyOnce([1, 2, 3, 2, 4, 1, 5]));
// [3, 4, 5]
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def occurring_once(a):
    c=Counter(a); return [x for x in a if c[x]==1]
```

**Java:**
```java
static List<Integer> occurringOnce(int[] a){Map<Integer,Integer>m=new HashMap<>();for(int x:a)m.put(x,m.getOrDefault(x,0)+1);List<Integer>r=new ArrayList<>();for(int x:a)if(m.get(x)==1)r.add(x);return r;}
```

**C# (.NET):**
```csharp
static int[] OccurringOnce(int[] a){var counts=a.GroupBy(x=>x).ToDictionary(g=>g.Key,g=>g.Count());return a.Where(x=>counts[x]==1).ToArray();}
```

**C++:**
```cpp
vector<int> occurringOnce(const vector<int>&a){unordered_map<int,int>m;for(int x:a)m[x]++;vector<int>r;for(int x:a)if(m[x]==1)r.push_back(x);return r;}
```


**Expected Output:**
```text
[3,4,5]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

### Remove elements divisible by a given number

**Original section:** Additional first-batch array exercises.

**Question:** Return the array values that are not divisible by the given divisor.

```js
function removeDivisible(arr, divisor) {
  if (divisor === 0) throw new Error("Divisor cannot be zero");

  return arr.filter(value => value % divisor !== 0);
}

console.log(removeDivisible([10, 14, 20, 25, 30], 10));
// [14, 25]
```

**Other Language Solutions:**

**Python:**
```python
def not_divisible(a,n): return [x for x in a if x % n != 0]
```

**Java:**
```java
static int[] notDivisible(int[] a,int n){return Arrays.stream(a).filter(x->x%n!=0).toArray();}
```

**C# (.NET):**
```csharp
static int[] NotDivisible(int[] a,int n)=>a.Where(x=>x%n!=0).ToArray();
```

**C++:**
```cpp
vector<int> notDivisible(const vector<int>&a,int n){vector<int>r;for(int x:a)if(x%n!=0)r.push_back(x);return r;}
```


**Expected Output:**
```text
[14,25]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

### Separate strings and numbers

**Original section:** Additional first-batch array exercises.

**Question:** Divide a mixed array into separate arrays of strings and numbers.

```js
function separateStringsAndNumbers(arr) {
  const numbers = [];
  const strings = [];

  for (const value of arr) {
    if (typeof value === "number") numbers.push(value);
    else if (typeof value === "string") strings.push(value);
  }

  return { numbers, strings };
}

console.log(separateStringsAndNumbers([1, "a", 2, "b", 3]));
// { numbers: [1, 2, 3], strings: ["a", "b"] }
```

**Other Language Solutions:**

**Python:**
```python
def separate_types(a):
    return [x for x in a if isinstance(x,str)], [x for x in a if isinstance(x,(int,float)) and not isinstance(x,bool)]
```

**Java:**
```java
static List<List<Object>> separateTypes(List<Object>a){List<Object>s=new ArrayList<>(),n=new ArrayList<>();for(Object x:a){if(x instanceof String)s.add(x);else if(x instanceof Number)n.add(x);}return Arrays.asList(s,n);}
```

**C# (.NET):**
```csharp
static (List<string> strings,List<double> numbers) SeparateTypes(object[] a){var s=new List<string>();var n=new List<double>();foreach(var x in a){if(x is string z)s.Add(z);else if(x is IConvertible && double.TryParse(x.ToString(),out double d))n.Add(d);}return(s,n);}
```

**C++:**
```cpp
pair<vector<string>,vector<double>> separateTypes(const vector<variant<string,double,int>>&a){vector<string>s;vector<double>n;for(auto&x:a){if(holds_alternative<string>(x))s.push_back(get<string>(x));else if(holds_alternative<double>(x))n.push_back(get<double>(x));else n.push_back(get<int>(x));}return{s,n};}
```


**Expected Output:**
```text
{"numbers":[1,2,3],"strings":["a","b"]}
```

**Explanation (Simple English):**
split() breaks a string into an array. An empty separator creates character elements, while a space or comma separator splits at those delimiters.

**Explanation (Simple Hindi):**
split() string ko array mein todta hai. Empty separator se characters milte hain, aur space/comma separator se words ya comma-separated values milti hain.

**How to solve this type of problem:**
For string-to-array tasks, choose the correct separator: empty string for characters, spaces for words, or commas for CSV-like text.

---

### Calculate the running sum

**Original section:** Additional first-batch array exercises.

**Question:** Return an array where each position contains the sum of all values up to that position.

```js
function runningSum(arr) {
  let sum = 0;

  return arr.map(value => {
    sum += value;
    return sum;
  });
}

console.log(runningSum([1, 2, 3, 4]));
// [1, 3, 6, 10]
```

**Other Language Solutions:**

**Python:**
```python
def running_sum(a):
    out=[]; total=0
    for x in a: total+=x; out.append(total)
    return out
```

**Java:**
```java
static int[] runningSum(int[] a){int[]r=new int[a.length];int s=0;for(int i=0;i<a.length;i++){s+=a[i];r[i]=s;}return r;}
```

**C# (.NET):**
```csharp
static int[] RunningSum(int[] a){int[]r=new int[a.Length];int s=0;for(int i=0;i<a.Length;i++){s+=a[i];r[i]=s;}return r;}
```

**C++:**
```cpp
vector<int> runningSum(const vector<int>&a){vector<int>r;int s=0;for(int x:a){s+=x;r.push_back(s);}return r;}
```


**Expected Output:**
```text
[1,3,6,10]
```

**Explanation (Simple English):**
The code starts a total at zero and adds each array value to it. At the end, the accumulated total is returned.

**Explanation (Simple Hindi):**
Code total ko zero se start karta hai aur har array value ko usmein add karta hai. End mein final sum return hota hai.

**How to solve this type of problem:**
For sum problems, initialize total = 0, visit every number, add it to total, and return total after the loop.

---

### Find the maximum difference between any two elements

**Original section:** Additional first-batch array exercises.

**Question:** Find the difference between the maximum and minimum values.

```js
function maxDifference(arr) {
  if (arr.length < 2) return 0;

  let min = arr[0];
  let maxDifference = -Infinity;

  for (let i = 1; i < arr.length; i++) {
    maxDifference = Math.max(maxDifference, Math.abs(arr[i] - min));
    min = Math.min(min, arr[i]);
  }

  return Math.max(maxDifference, Math.max(...arr) - Math.min(...arr));
}

console.log(maxDifference([5, 9, 3, 8])); // 6
```

**Other Language Solutions:**

**Python:**
```python
def max_difference(arr):
    if not arr: raise ValueError("empty array")
    return max(arr)-min(arr)
```

**Java:**
```java
static int maxDifference(int[] a){if(a.length==0)throw new IllegalArgumentException();return Arrays.stream(a).max().getAsInt()-Arrays.stream(a).min().getAsInt();}
```

**C# (.NET):**
```csharp
static int MaxDifference(int[] a)=>a.Max()-a.Min();
```

**C++:**
```cpp
int maxDifference(const vector<int>&a){if(a.empty())throw invalid_argument("empty");auto mm=minmax_element(a.begin(),a.end());return *mm.second-*mm.first;}
```


**Expected Output:**
```text
6
```

**Explanation (Simple English):**
The solution keeps a current best value and compares each new value with it. Whenever a bigger or smaller value is found, the stored answer is updated.

**Explanation (Simple Hindi):**
Code ek current best value rakhta hai aur har naye number se compare karta hai. Bada ya chhota number milne par answer update ho jaata hai.

**How to solve this type of problem:**
For minimum/maximum problems, initialize the answer with the first array value, scan the remaining values, and update it whenever a better value appears.

---

### Rotate an array to the left by N positions

**Original section:** Additional first-batch array exercises.

**Question:** Move the first N elements to the end of the array.

```js
function rotateLeftByN(arr, n) {
  if (arr.length === 0) return [];

  n = ((n % arr.length) + arr.length) % arr.length;
  return arr.slice(n).concat(arr.slice(0, n));
}

console.log(rotateLeftByN([1, 2, 3, 4, 5], 2));
// [3, 4, 5, 1, 2]
```

**Other Language Solutions:**

**Python:**
```python
def rotate_left(a,k):
    if not a: return []
    k%=len(a); return a[k:]+a[:k]
```

**Java:**
```java
static int[] rotateLeft(int[] a,int k){if(a.length==0)return a;k%=a.length;int[]r=new int[a.length];for(int i=0;i<a.length;i++)r[i]=a[(i+k)%a.length];return r;}
```

**C# (.NET):**
```csharp
static int[] RotateLeft(int[] a,int k){if(a.Length==0)return a;k%=a.Length;return a.Skip(k).Concat(a.Take(k)).ToArray();}
```

**C++:**
```cpp
vector<int> rotateLeft(vector<int>a,int k){if(a.empty())return a;k%=a.size();rotate(a.begin(),a.begin()+k,a.end());return a;}
```


**Expected Output:**
```text
[3,4,5,1,2]
```

**Explanation (Simple English):**
Rotation moves elements around the array while preserving their relative order. The code normalizes the number of steps and combines or shifts the relevant part of the array.

**Explanation (Simple Hindi):**
Rotation mein elements array ke ek end se doosre end par move hote hain aur unka order preserve rehta hai. Code steps ko normalize karke values shift ya combine karta hai.

**How to solve this type of problem:**
For rotation, reduce k using k % array.length, decide left or right, and use slicing or an in-place reversal strategy.

---

### Find all elements that appear more than once

**Original section:** Additional first-batch array exercises.

**Question:** Return each duplicated value once.

```js
function findRepeatedValues(arr) {
  const seen = new Set();
  const repeated = new Set();

  for (const value of arr) {
    if (seen.has(value)) repeated.add(value);
    else seen.add(value);
  }

  return [...repeated];
}

console.log(findRepeatedValues([1, 2, 3, 2, 4, 1]));
// [2, 1]
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def all_duplicates(a):
    c=Counter(a); return list(dict.fromkeys(x for x in a if c[x]>1))
```

**Java:**
```java
static List<Integer> allDuplicates(int[] a){Map<Integer,Integer>m=new HashMap<>();for(int x:a)m.put(x,m.getOrDefault(x,0)+1);Set<Integer>r=new LinkedHashSet<>();for(int x:a)if(m.get(x)>1)r.add(x);return new ArrayList<>(r);}
```

**C# (.NET):**
```csharp
static int[] AllDuplicates(int[] a){var c=a.GroupBy(x=>x).ToDictionary(g=>g.Key,g=>g.Count());return a.Where(x=>c[x]>1).Distinct().ToArray();}
```

**C++:**
```cpp
vector<int> allDuplicates(const vector<int>&a){unordered_map<int,int>m;for(int x:a)m[x]++;vector<int>r;unordered_set<int>s;for(int x:a)if(m[x]>1&&s.insert(x).second)r.push_back(x);return r;}
```


**Expected Output:**
```text
[2,1]
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### Sort an array by frequency

**Original section:** Additional first-batch array exercises.

**Question:** Sort values according to their frequency in the array, with more frequent values first.

```js
function sortByFrequency(arr) {
  const frequency = new Map();

  for (const value of arr) {
    frequency.set(value, (frequency.get(value) || 0) + 1);
  }

  return [...arr].sort((a, b) =>
    frequency.get(b) - frequency.get(a)
  );
}

console.log(sortByFrequency([4, 1, 2, 2, 3, 3, 3, 1]));
// Values with higher frequency appear first; ties keep engine-stable input order.
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def frequency(arr): return dict(Counter(arr))
```

**Java:**
```java
static Map<Integer,Integer> frequency(int[] a){Map<Integer,Integer>m=new LinkedHashMap<>();for(int x:a)m.put(x,m.getOrDefault(x,0)+1);return m;}
```

**C# (.NET):**
```csharp
static Dictionary<int,int> Frequency(int[] a){var d=new Dictionary<int,int>();foreach(int x in a)d[x]=d.GetValueOrDefault(x)+1;return d;}
```

**C++:**
```cpp
unordered_map<int,int> frequency(const vector<int>&a){unordered_map<int,int>m;for(int x:a)m[x]++;return m;}
```


**Expected Output:**
```text
[3,3,3,1,2,2,1,4]
```

**Explanation (Simple English):**
The code first counts how often each value appears. The sort comparator then places values with higher counts before values with lower counts.

**Explanation (Simple Hindi):**
Code pehle har value ki frequency count karta hai. Uske baad sort comparator zyada baar aane wali values ko pehle rakhta hai.

**How to solve this type of problem:**
For frequency sorting, build a frequency map first, then sort using the stored counts; decide how ties should be ordered.

---

---

## First-batch closing exercises (Q146 onward)

### 147. Find the k-th smallest element

**Original section:** First-batch closing exercises (Q146 onward).

**Question:** Find the k-th smallest value in an array.

**Answer:**
```js
function kthSmallest(arr, k) {
  if (k < 1 || k > arr.length) {
    throw new Error("k is outside the array range");
  }

  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[k - 1];
}

console.log(kthSmallest([5, 8, 1, 2, 4], 3)); // 4
```

**Other Language Solutions:**

**Python:**
```python
def kth_smallest(a,k): return sorted(a)[k-1]
```

**Java:**
```java
static int kthSmallest(int[] a,int k){int[]r=a.clone();Arrays.sort(r);return r[k-1];}
```

**C# (.NET):**
```csharp
static int KthSmallest(int[] a,int k)=>a.OrderBy(x=>x).ElementAt(k-1);
```

**C++:**
```cpp
int kthSmallest(vector<int>a,int k){nth_element(a.begin(),a.begin()+k-1,a.end());return a[k-1];}
```


**Expected Output:**
```text
4
```

**Explanation (Simple English):**
The array is ordered, and the k position is selected from that order. Because JavaScript arrays use zero-based indexes, the k-th smallest value is at index k - 1 after sorting.

**Explanation (Simple Hindi):**
Array ko order mein arrange karte hain aur phir k-th position select karte hain. JavaScript index zero se start hota hai, isliye sorting ke baad index k - 1 hota hai.

**How to solve this type of problem:**
For k-th smallest/largest problems, validate k, decide whether sorting is acceptable, and remember the difference between a 1-based position and a 0-based index.

---

### 148. Find missing numbers between the minimum and maximum values

**Original section:** First-batch closing exercises (Q146 onward).

**Question:** Find all missing integers between the smallest and largest values in an array.

**Answer:**
```js
function findMissingBetweenMinMax(arr) {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const values = new Set(arr);
  const missing = [];

  for (let i = min; i <= max; i++) {
    if (!values.has(i)) missing.push(i);
  }

  return missing;
}

console.log(findMissingBetweenMinMax([1, 2, 4, 6]));
// [3, 5]
```

**Other Language Solutions:**

**Python:**
```python
def missing_between_min_max(a):
    present=set(a); return [x for x in range(min(a),max(a)+1) if x not in present]
```

**Java:**
```java
static List<Integer> missingBetween(int[] a){int mn=Arrays.stream(a).min().getAsInt(),mx=Arrays.stream(a).max().getAsInt();Set<Integer>s=new HashSet<>();for(int x:a)s.add(x);List<Integer>r=new ArrayList<>();for(int x=mn;x<=mx;x++)if(!s.contains(x))r.add(x);return r;}
```

**C# (.NET):**
```csharp
static List<int> MissingBetween(int[] a){int mn=a.Min(),mx=a.Max();var set=a.ToHashSet();var r=new List<int>();for(int x=mn;x<=mx;x++)if(!set.Contains(x))r.Add(x);return r;}
```

**C++:**
```cpp
vector<int> missingBetween(const vector<int>&a){int mn=*min_element(a.begin(),a.end()),mx=*max_element(a.begin(),a.end());unordered_set<int>s(a.begin(),a.end());vector<int>r;for(int x=mn;x<=mx;x++)if(!s.count(x))r.push_back(x);return r;}
```


**Expected Output:**
```text
[3,5]
```

**Explanation (Simple English):**
The solution compares the values that are present with the expected range or expected total. Any number that is not accounted for is missing.

**Explanation (Simple Hindi):**
Code present numbers ko expected range ya expected sum se compare karta hai. Jo number cover nahi hota, wahi missing hota hai.

**How to solve this type of problem:**
For missing-number problems, confirm the expected range and whether exactly one or several values are missing; then use a sum, Set, or frequency array.

---

### 150. Count distinct elements in an array

**Original section:** First-batch closing exercises (Q146 onward).

**Question:** Count the number of different values in an array.

**Answer:**
```js
const arr = [1, 2, 2, 3, 4, 1];

const distinctCount = new Set(arr).size;

console.log(distinctCount); // 4
```

**Other Language Solutions:**

**Python:**
```python
def distinct_count(a): return len(set(a))
```

**Java:**
```java
static int distinctCount(int[] a){return (int)Arrays.stream(a).distinct().count();}
```

**C# (.NET):**
```csharp
static int DistinctCount(int[] a)=>a.Distinct().Count();
```

**C++:**
```cpp
int distinctCount(const vector<int>&a){unordered_set<int>s(a.begin(),a.end());return s.size();}
```


**Expected Output:**
```text
4
```

**Explanation (Simple English):**
The loop visits array elements one by one. The current index is used to read the value, and the required action is performed for each item.

**Explanation (Simple Hindi):**
Loop array ke har element par ek-ek karke jaata hai. Current index se value read hoti hai aur har item par required action hota hai.

**How to solve this type of problem:**
For basic array questions, identify what must happen to each element, loop from index 0 to length - 1, and update or collect the result.

---

## 100 Intermediate JS section (26 visible questions)

### 1. Find the first repeating element in an array

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Return the first value that appears more than once while scanning from left to right.

**Answer:**
```js
function firstRepeating(arr) {
  const seen = new Set();

  for (const value of arr) {
    if (seen.has(value)) return value;
    seen.add(value);
  }

  return null;
}

console.log(firstRepeating([2, 3, 4, 2, 5, 3])); // 2
```

**Other Language Solutions:**

**Python:**
```python
def first_repeating(a):
    seen=set()
    for x in a:
        if x in seen: return x
        seen.add(x)
    return None
```

**Java:**
```java
static Integer firstRepeating(int[] a){Set<Integer>s=new HashSet<>();for(int x:a)if(!s.add(x))return x;return null;}
```

**C# (.NET):**
```csharp
static int? FirstRepeating(int[] a){var s=new HashSet<int>();foreach(int x in a)if(!s.Add(x))return x;return null;}
```

**C++:**
```cpp
optional<int> firstRepeating(const vector<int>&a){unordered_set<int>s;for(int x:a)if(!s.insert(x).second)return x;return nullopt;}
```


**Expected Output:**
```text
2
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 2. Rotate an array to the left by k positions

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Rotate an array to the left by `k` steps.

**Answer:**
```js
function rotateLeft(arr, k) {
  if (arr.length === 0) return [];

  k = ((k % arr.length) + arr.length) % arr.length;
  return arr.slice(k).concat(arr.slice(0, k));
}

console.log(rotateLeft([1, 2, 3, 4, 5], 2));
// [3, 4, 5, 1, 2]
```

**Other Language Solutions:**

**Python:**
```python
def rotate_left(a,k):
    if not a: return []
    k%=len(a); return a[k:]+a[:k]
```

**Java:**
```java
static int[] rotateLeft(int[] a,int k){if(a.length==0)return a;k%=a.length;int[]r=new int[a.length];for(int i=0;i<a.length;i++)r[i]=a[(i+k)%a.length];return r;}
```

**C# (.NET):**
```csharp
static int[] RotateLeft(int[] a,int k){if(a.Length==0)return a;k%=a.Length;return a.Skip(k).Concat(a.Take(k)).ToArray();}
```

**C++:**
```cpp
vector<int> rotateLeft(vector<int>a,int k){if(a.empty())return a;k%=a.size();rotate(a.begin(),a.begin()+k,a.end());return a;}
```


**Expected Output:**
```text
[3,4,5,1,2]
```

**Explanation (Simple English):**
Rotation moves elements around the array while preserving their relative order. The code normalizes the number of steps and combines or shifts the relevant part of the array.

**Explanation (Simple Hindi):**
Rotation mein elements array ke ek end se doosre end par move hote hain aur unka order preserve rehta hai. Code steps ko normalize karke values shift ya combine karta hai.

**How to solve this type of problem:**
For rotation, reduce k using k % array.length, decide left or right, and use slicing or an in-place reversal strategy.

---

### 3. Check whether all elements in an array are unique

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Return `true` if no value occurs more than once.

**Answer:**
```js
function allUnique(arr) {
  return new Set(arr).size === arr.length;
}

console.log(allUnique([1, 2, 3, 4])); // true
console.log(allUnique([1, 2, 2, 4])); // false
```

**Other Language Solutions:**

**Python:**
```python
def all_unique(a): return len(a)==len(set(a))
```

**Java:**
```java
static boolean allUnique(int[] a){return Arrays.stream(a).distinct().count()==a.length;}
```

**C# (.NET):**
```csharp
static bool AllUnique(int[] a)=>a.Distinct().Count()==a.Length;
```

**C++:**
```cpp
bool allUnique(const vector<int>&a){return unordered_set<int>(a.begin(),a.end()).size()==a.size();}
```


**Expected Output:**
```text
true
false
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 5. Flatten a nested array (one level deep)

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Convert a one-level nested array into a single-level array.

**Answer:**
```js
const arr = [1, [2, 3], 4];

const flattened = [].concat(...arr);

console.log(flattened); // [1, 2, 3, 4]
```

**Other Language Solutions:**

**Python:**
```python
def flatten_one(a): return [x for row in a for x in row]
```

**Java:**
```java
static List<Integer> flattenOne(int[][] a){List<Integer>r=new ArrayList<>();for(int[] row:a)for(int x:row)r.add(x);return r;}
```

**C# (.NET):**
```csharp
static int[] FlattenOne(int[][] a)=>a.SelectMany(x=>x).ToArray();
```

**C++:**
```cpp
vector<int> flattenOne(const vector<vector<int>>&a){vector<int>r;for(auto&v:a)r.insert(r.end(),v.begin(),v.end());return r;}
```


**Expected Output:**
```text
[1,2,3,4]
```

**Explanation (Simple English):**
The solution walks through the nested array and adds inner elements to one output array. A recursive or built-in flat approach can handle deeper nesting depending on the requirement.

**Explanation (Simple Hindi):**
Code nested array ke elements par jaakar inner values ko ek output array mein add karta hai. Requirement ke hisaab se recursion ya flat method deeper nesting bhi handle kar sakta hai.

**How to solve this type of problem:**
For flattening, clarify whether nesting is one level or any depth; then use flat(depth) for a built-in solution or recursively visit each nested array.

---

### 6. Get the frequency map of array elements

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Create an object showing how many times each value occurs.

**Answer:**
```js
function getFrequency(arr) {
  const frequency = {};

  for (const value of arr) {
    frequency[value] = (frequency[value] || 0) + 1;
  }

  return frequency;
}

console.log(getFrequency([1, 2, 2, 3, 3, 3]));
// { "1": 1, "2": 2, "3": 3 }
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def frequency(arr): return dict(Counter(arr))
```

**Java:**
```java
static Map<Integer,Integer> frequency(int[] a){Map<Integer,Integer>m=new LinkedHashMap<>();for(int x:a)m.put(x,m.getOrDefault(x,0)+1);return m;}
```

**C# (.NET):**
```csharp
static Dictionary<int,int> Frequency(int[] a){var d=new Dictionary<int,int>();foreach(int x in a)d[x]=d.GetValueOrDefault(x)+1;return d;}
```

**C++:**
```cpp
unordered_map<int,int> frequency(const vector<int>&a){unordered_map<int,int>m;for(int x:a)m[x]++;return m;}
```


**Expected Output:**
```text
{"1":1,"2":2,"3":3}
```

**Explanation (Simple English):**
An object stores related information as key-value pairs. Dot notation reads a value by using its property name.

**Explanation (Simple Hindi):**
Object related information ko key-value pairs mein store karta hai. Dot notation se property ka naam use karke uski value milti hai.

**How to solve this type of problem:**
For object questions, identify the required keys and values, build the object, and access or update a property using dot or bracket notation.

---

### 8. Find the longest word in an array

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Find the word with the greatest length.

**Answer:**
```js
const words = ["apple", "banana", "kiwi"];

const longest = words.reduce((a, b) =>
  a.length >= b.length ? a : b
);

console.log(longest); // banana
```

**Other Language Solutions:**

**Python:**
```python
def longest_word_array(a): return max(a,key=len,default="")
```

**Java:**
```java
static String longestWordArray(String[] a){String r="";for(String s:a)if(s.length()>r.length())r=s;return r;}
```

**C# (.NET):**
```csharp
static string LongestWordArray(string[] a)=>a.OrderByDescending(x=>x.Length).FirstOrDefault()??"";
```

**C++:**
```cpp
string longestWordArray(const vector<string>&a){string r;for(auto&s:a)if(s.size()>r.size())r=s;return r;}
```


**Expected Output:**
```text
banana
```

**Explanation (Simple English):**
The solution keeps a current best value and compares each new value with it. Whenever a bigger or smaller value is found, the stored answer is updated.

**Explanation (Simple Hindi):**
Code ek current best value rakhta hai aur har naye number se compare karta hai. Bada ya chhota number milne par answer update ho jaata hai.

**How to solve this type of problem:**
For minimum/maximum problems, initialize the answer with the first array value, scan the remaining values, and update it whenever a better value appears.

---

### 11. Rotate an array one place to the left

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Move the first element to the end of the array.

**Answer:**
```js
function rotateOneLeft(arr) {
  if (arr.length === 0) return [];

  const result = [...arr];
  const first = result.shift();
  result.push(first);

  return result;
}

console.log(rotateOneLeft([1, 2, 3, 4]));
// [2, 3, 4, 1]
```

**Other Language Solutions:**

**Python:**
```python
def rotate_left(a,k):
    if not a: return []
    k%=len(a); return a[k:]+a[:k]
```

**Java:**
```java
static int[] rotateLeft(int[] a,int k){if(a.length==0)return a;k%=a.length;int[]r=new int[a.length];for(int i=0;i<a.length;i++)r[i]=a[(i+k)%a.length];return r;}
```

**C# (.NET):**
```csharp
static int[] RotateLeft(int[] a,int k){if(a.Length==0)return a;k%=a.Length;return a.Skip(k).Concat(a.Take(k)).ToArray();}
```

**C++:**
```cpp
vector<int> rotateLeft(vector<int>a,int k){if(a.empty())return a;k%=a.size();rotate(a.begin(),a.begin()+k,a.end());return a;}
```


**Expected Output:**
```text
[2,3,4,1]
```

**Explanation (Simple English):**
Rotation moves elements around the array while preserving their relative order. The code normalizes the number of steps and combines or shifts the relevant part of the array.

**Explanation (Simple Hindi):**
Rotation mein elements array ke ek end se doosre end par move hote hain aur unka order preserve rehta hai. Code steps ko normalize karke values shift ya combine karta hai.

**How to solve this type of problem:**
For rotation, reduce k using k % array.length, decide left or right, and use slicing or an in-place reversal strategy.

---

## String questions (58)

### 27. Remove duplicate characters

**Original section:** String questions (58).

**Question:** Keep only the first occurrence of each character.

**Answer:**
```js
function removeDuplicateCharacters(str) {
  let result = "";

  for (const char of str) {
    if (!result.includes(char)) {
      result += char;
    }
  }

  return result;
}

console.log(removeDuplicateCharacters("aabbcc")); // abc
```

**Other Language Solutions:**

**Python:**
```python
def unique_chars(s): return "".join(dict.fromkeys(s))
```

**Java:**
```java
static String removeDuplicateChars(String s){StringBuilder r=new StringBuilder();Set<Character>seen=new HashSet<>();for(char c:s.toCharArray())if(seen.add(c))r.append(c);return r.toString();}
```

**C# (.NET):**
```csharp
static string RemoveDuplicateChars(string s){var seen=new HashSet<char>();return new string(s.Where(c=>seen.Add(c)).ToArray());}
```

**C++:**
```cpp
string removeDuplicateChars(const string&s){string r;unordered_set<char>seen;for(char c:s)if(seen.insert(c).second)r+=c;return r;}
```


**Expected Output:**
```text
abc
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 29. Check whether a string is a palindrome

**Original section:** String questions (58).

**Question:** Check whether a string reads the same forward and backward.

**Answer:**
```js
function isPalindrome(str) {
  return str === str.split("").reverse().join("");
}

console.log(isPalindrome("madam")); // true
```

**Other Language Solutions:**

**Python:**
```python
def is_palindrome(s): return s == s[::-1]
```

**Java:**
```java
static boolean isPalindrome(String s){return s.equals(new StringBuilder(s).reverse().toString());}
```

**C# (.NET):**
```csharp
static bool IsPalindrome(string s)=>s==new string(s.Reverse().ToArray());
```

**C++:**
```cpp
bool isPalindrome(const string&s){return equal(s.begin(),s.end(),s.rbegin());}
```


**Expected Output:**
```text
true
```

**Explanation (Simple English):**
A palindrome reads the same from both ends. The solution compares matching characters from the beginning and end; one mismatch means it is not a palindrome.

**Explanation (Simple Hindi):**
Palindrome aage aur peeche se same read hota hai. Code shuru aur end ke matching characters compare karta hai; ek bhi mismatch aaye toh palindrome nahi hai.

**How to solve this type of problem:**
For palindrome questions, decide whether to normalize case/spaces first, then compare opposite characters or reverse the value and compare it with the original.

---

### 34. Check whether two strings are anagrams

**Original section:** String questions (58).

**Question:** Check whether two strings contain the same letters in a different order.

**Answer:**
```js
function areAnagrams(a, b) {
  const normalize = str =>
    str.toLowerCase().replace(/\s/g, "").split("").sort().join("");

  return normalize(a) === normalize(b);
}

console.log(areAnagrams("listen", "silent")); // true
```

**Other Language Solutions:**

**Python:**
```python
def are_anagrams(a,b): return sorted(a.replace(" ","").lower()) == sorted(b.replace(" ","").lower())
```

**Java:**
```java
static boolean areAnagrams(String a,String b){char[] x=a.replace(" ","").toLowerCase().toCharArray(),y=b.replace(" ","").toLowerCase().toCharArray();Arrays.sort(x);Arrays.sort(y);return Arrays.equals(x,y);}
```

**C# (.NET):**
```csharp
static bool AreAnagrams(string a,string b)=>string.Concat(a.Where(c=>!char.IsWhiteSpace(c)).ToLower().OrderBy(c=>c))==string.Concat(b.Where(c=>!char.IsWhiteSpace(c)).ToLower().OrderBy(c=>c));
```

**C++:**
```cpp
bool areAnagrams(string a,string b){a.erase(remove_if(a.begin(),a.end(),::isspace),a.end());b.erase(remove_if(b.begin(),b.end(),::isspace),b.end());sort(a.begin(),a.end());sort(b.begin(),b.end());return a==b;}
```


**Expected Output:**
```text
true
```

**Explanation (Simple English):**
Two strings are anagrams when they contain the same characters with the same counts. Sorting both character lists makes equal arrangements easy to compare.

**Explanation (Simple Hindi):**
Do strings anagram tab hote hain jab dono mein same characters utni hi baar hon. Dono ke characters sort karke compare karna easy hota hai.

**How to solve this type of problem:**
For anagrams, first normalize both strings if needed, then compare sorted characters or build character-frequency counts.

---

### 35. Check whether a string has duplicate letters

**Original section:** String questions (58).

**Question:** Check whether any character appears more than once.

**Answer:**
```js
function hasDuplicateCharacters(str) {
  return new Set(str).size !== str.length;
}

console.log(hasDuplicateCharacters("hello")); // true
```

**Other Language Solutions:**

**Python:**
```python
def has_unique_chars(s): return len(set(s))==len(s)
```

**Java:**
```java
static boolean hasUniqueChars(String s){return s.chars().distinct().count()==s.length();}
```

**C# (.NET):**
```csharp
static bool HasUniqueChars(string s)=>s.Distinct().Count()==s.Length;
```

**C++:**
```cpp
bool hasUniqueChars(const string&s){return unordered_set<char>(s.begin(),s.end()).size()==s.size();}
```


**Expected Output:**
```text
true
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 37. Replace the first letter of each word with `*`

**Original section:** String questions (58).

**Question:** Replace the first character of every word with an asterisk.

**Answer:**
```js
function maskFirstLetters(sentence) {
  return sentence.replace(/\b\w/g, "*");
}

console.log(maskFirstLetters("hello world")); // *ello *orld
```

**Other Language Solutions:**

**Python:**
```python
def mask_first_letter_each_word(s): return " ".join("*"+w[1:] if w else w for w in s.split(" "))
```

**Java:**
```java
static String maskFirstLetters(String s){String[]w=s.split(" ",-1);for(int i=0;i<w.length;i++)if(!w[i].isEmpty())w[i]="*"+w[i].substring(1);return String.join(" ",w);}
```

**C# (.NET):**
```csharp
static string MaskFirstLetters(string s)=>string.Join(" ",s.Split(' ').Select(w=>w.Length==0?w:"*"+w.Substring(1)));
```

**C++:**
```cpp
string maskFirstLetters(string s){stringstream ss(s);string w,r;while(ss>>w){if(!r.empty())r+=" ";r+="*"+w.substr(1);}return r;}
```


**Expected Output:**
```text
*ello *orld
```

**Explanation (Simple English):**
replace() changes the first matching part by default, while replaceAll() or a global regular expression changes every occurrence.

**Explanation (Simple Hindi):**
replace() default mein pehla matching part change karta hai, jabki replaceAll() ya global regex har occurrence change karta hai.

**How to solve this type of problem:**
For replacement, decide whether one or all matches should change, consider case sensitivity, and choose replace(), replaceAll(), or a regex.

---

### 39. Compress repeating characters

**Original section:** String questions (58).

**Question:** Compress consecutive repeated characters by writing the character followed by its count.

**Answer:**
```js
function compressString(str) {
  if (!str) return "";

  let result = "";
  let count = 1;

  for (let i = 1; i <= str.length; i++) {
    if (str[i] === str[i - 1]) {
      count++;
    } else {
      result += str[i - 1] + count;
      count = 1;
    }
  }

  return result;
}

console.log(compressString("aaabb")); // a3b2
```

**Other Language Solutions:**

**Python:**
```python
def compress(s):
    if not s: return ""
    out=[]; count=1
    for i in range(1,len(s)+1):
        if i<len(s) and s[i]==s[i-1]: count+=1
        else: out.append(s[i-1]+str(count)); count=1
    return "".join(out)
```

**Java:**
```java
static String compress(String s){StringBuilder r=new StringBuilder();for(int i=0;i<s.length();){int j=i;while(j<s.length()&&s.charAt(j)==s.charAt(i))j++;r.append(s.charAt(i)).append(j-i);i=j;}return r.toString();}
```

**C# (.NET):**
```csharp
static string Compress(string s){var r=new StringBuilder();for(int i=0;i<s.Length;){int j=i;while(j<s.Length&&s[j]==s[i])j++;r.Append(s[i]).Append(j-i);i=j;}return r.ToString();}
```

**C++:**
```cpp
string compress(const string&s){string r;for(int i=0;i<s.size();){int j=i;while(j<s.size()&&s[j]==s[i])j++;r+=s[i]+to_string(j-i);i=j;}return r;}
```


**Expected Output:**
```text
a3b2
```

**Explanation (Simple English):**
The code counts consecutive occurrences of the same character and stores the character with its count. Expansion reads the character and count and repeats the character.

**Explanation (Simple Hindi):**
Code ek jaise lagataar characters ki count karta hai aur character ke saath count store karta hai. Expand karte waqt count ke hisaab se character repeat hota hai.

**How to solve this type of problem:**
For run-length compression, scan consecutive equal characters, count each run, and write character + count; for expansion, parse each character/count pair.

---

### 40. Expand a compressed string

**Original section:** String questions (58).

**Question:** Expand a string in which each character is followed by its repeat count.

**Answer:**
```js
function expandString(str) {
  let result = "";

  for (let i = 0; i < str.length; i += 2) {
    const char = str[i];
    let j = i + 1;

    while (j < str.length && /\d/.test(str[j])) j++;

    const count = Number(str.slice(i + 1, j));
    result += char.repeat(count);
    i = j - 2;
  }

  return result;
}

console.log(expandString("a3b2")); // aaabb
```

**Other Language Solutions:**

**Python:**
```python
import re
def expand(s): return "".join(ch*int(n) for ch,n in re.findall(r"(.)(\d+)",s))
```

**Java:**
```java
static String expand(String s){StringBuilder r=new StringBuilder();for(int i=0;i<s.length();){char c=s.charAt(i++);int j=i;while(i<s.length()&&Character.isDigit(s.charAt(i)))i++;int n=Integer.parseInt(s.substring(j,i));r.append(String.valueOf(c).repeat(n));}return r.toString();}
```

**C# (.NET):**
```csharp
static string Expand(string s){var r=new StringBuilder();for(int i=0;i<s.Length;){char c=s[i++];int j=i;while(i<s.Length&&char.IsDigit(s[i]))i++;int n=int.Parse(s.Substring(j,i-j));r.Append(c,n);}return r.ToString();}
```

**C++:**
```cpp
string expand(const string&s){string r;for(int i=0;i<s.size();){char c=s[i++];int n=0;while(i<s.size()&&isdigit((unsigned char)s[i]))n=n*10+(s[i++]-'0');r.append(n,c);}return r;}
```


**Expected Output:**
```text
aaabb
```

**Explanation (Simple English):**
The code counts consecutive occurrences of the same character and stores the character with its count. Expansion reads the character and count and repeats the character.

**Explanation (Simple Hindi):**
Code ek jaise lagataar characters ki count karta hai aur character ke saath count store karta hai. Expand karte waqt count ke hisaab se character repeat hota hai.

**How to solve this type of problem:**
For run-length compression, scan consecutive equal characters, count each run, and write character + count; for expansion, parse each character/count pair.

---

### 42. Remove duplicate words

**Original section:** String questions (58).

**Question:** Remove repeated words from a sentence while keeping the first occurrence.

**Answer:**
```js
function removeDuplicateWords(sentence) {
  const words = sentence.split(/\s+/);
  return [...new Set(words)].join(" ");
}

console.log(removeDuplicateWords("hello world hello"));
// hello world
```

**Other Language Solutions:**

**Python:**
```python
def remove_duplicate_words(s): return " ".join(dict.fromkeys(s.split()))
```

**Java:**
```java
static String removeDuplicateWords(String s){return String.join(" ",new LinkedHashSet<>(Arrays.asList(s.split("\\s+"))));}
```

**C# (.NET):**
```csharp
static string RemoveDuplicateWords(string s)=>string.Join(" ",s.Split(' ',StringSplitOptions.RemoveEmptyEntries).Distinct());
```

**C++:**
```cpp
string removeDuplicateWords(const string&s){stringstream ss(s);string w,r;unordered_set<string>seen;while(ss>>w)if(seen.insert(w).second){if(!r.empty())r+=" ";r+=w;}return r;}
```


**Expected Output:**
```text
hello world
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 43. Reverse each word in a sentence

**Original section:** String questions (58).

**Question:** Reverse the characters of each word without changing word order.

**Answer:**
```js
function reverseEachWord(sentence) {
  return sentence
    .split(" ")
    .map(word => word.split("").reverse().join(""))
    .join(" ");
}

console.log(reverseEachWord("hello world")); // olleh dlrow
```

**Other Language Solutions:**

**Python:**
```python
def reverse_each_word(s): return " ".join(w[::-1] for w in s.split(" "))
```

**Java:**
```java
static String reverseEachWord(String s){String[]w=s.split(" ",-1);for(int i=0;i<w.length;i++)w[i]=new StringBuilder(w[i]).reverse().toString();return String.join(" ",w);}
```

**C# (.NET):**
```csharp
static string ReverseEachWord(string s)=>string.Join(" ",s.Split(' ').Select(w=>new string(w.Reverse().ToArray())));
```

**C++:**
```cpp
string reverseEachWord(string s){stringstream ss(s);string w,r;while(ss>>w){reverse(w.begin(),w.end());if(!r.empty())r+=" ";r+=w;}return r;}
```


**Expected Output:**
```text
olleh dlrow
```

**Explanation (Simple English):**
The map() method visits every element and converts it into a new value. The result has the same number of elements as the input array.

**Explanation (Simple Hindi):**
map() har element par jaata hai aur usko naye value mein convert karta hai. Result array mein elements ki count original ke barabar rehti hai.

**How to solve this type of problem:**
For transformation problems, decide what one input item should become, write that transformation in map(), and return the new value from the callback.

---

### 44. Reverse the order of words in a sentence

**Original section:** String questions (58).

**Question:** Reverse the word order in a sentence.

**Answer:**
```js
function reverseWordOrder(sentence) {
  return sentence.trim().split(/\s+/).reverse().join(" ");
}

console.log(reverseWordOrder("one two three"));
// three two one
```

**Other Language Solutions:**

**Python:**
```python
def reverse_word_order(s): return " ".join(s.split()[::-1])
```

**Java:**
```java
static String reverseWordOrder(String s){List<String>w=new ArrayList<>(Arrays.asList(s.trim().split("\\s+")));Collections.reverse(w);return String.join(" ",w);}
```

**C# (.NET):**
```csharp
static string ReverseWordOrder(string s)=>string.Join(" ",s.Split(' ',StringSplitOptions.RemoveEmptyEntries).Reverse());
```

**C++:**
```cpp
string reverseWordOrder(const string&s){stringstream ss(s);vector<string>w;string x;while(ss>>x)w.push_back(x);reverse(w.begin(),w.end());string r;for(auto&v:w){if(!r.empty())r+=" ";r+=v;}return r;}
```


**Expected Output:**
```text
three two one
```

**Explanation (Simple English):**
The solution reads the value from the end towards the beginning and builds a new reversed result. This avoids changing the original array/string when a new result is required.

**Explanation (Simple Hindi):**
Code value ko end se start ki taraf read karke naya reversed result banata hai. Naya array/string banane se original value safe rehti hai.

**How to solve this type of problem:**
For reversing, identify whether you must mutate the original or return a new value, then traverse backward or use split/reverse/join for strings.

---

### 48. Print non-repeating characters

**Original section:** String questions (58).

**Question:** Print all characters that occur exactly once.

**Answer:**
```js
function nonRepeatingCharacters(str) {
  const frequency = {};

  for (const char of str) {
    frequency[char] = (frequency[char] || 0) + 1;
  }

  return [...str].filter(char => frequency[char] === 1);
}

console.log(nonRepeatingCharacters("aabbcde")); // ["c", "d", "e"]
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def non_repeating_chars(s):
    c=Counter(s); return [ch for ch in s if c[ch]==1]
```

**Java:**
```java
static List<Character> nonRepeatingChars(String s){Map<Character,Integer>m=new HashMap<>();for(char c:s.toCharArray())m.put(c,m.getOrDefault(c,0)+1);List<Character>r=new ArrayList<>();for(char c:s.toCharArray())if(m.get(c)==1)r.add(c);return r;}
```

**C# (.NET):**
```csharp
static char[] NonRepeatingChars(string s){var c=s.GroupBy(x=>x).ToDictionary(g=>g.Key,g=>g.Count());return s.Where(x=>c[x]==1).ToArray();}
```

**C++:**
```cpp
vector<char> nonRepeatingChars(const string&s){unordered_map<char,int>m;for(char c:s)m[c]++;vector<char>r;for(char c:s)if(m[c]==1)r.push_back(c);return r;}
```


**Expected Output:**
```text
["c","d","e"]
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 49. Check whether all characters in a string are unique

**Original section:** String questions (58).

**Question:** Return `true` if every character appears only once.

**Answer:**
```js
function allCharactersUnique(str) {
  return new Set(str).size === str.length;
}

console.log(allCharactersUnique("abc"));  // true
console.log(allCharactersUnique("hello")); // false
```

**Other Language Solutions:**

**Python:**
```python
def has_unique_chars(s): return len(set(s))==len(s)
```

**Java:**
```java
static boolean hasUniqueChars(String s){return s.chars().distinct().count()==s.length();}
```

**C# (.NET):**
```csharp
static bool HasUniqueChars(string s)=>s.Distinct().Count()==s.Length;
```

**C++:**
```cpp
bool hasUniqueChars(const string&s){return unordered_set<char>(s.begin(),s.end()).size()==s.size();}
```


**Expected Output:**
```text
true
false
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 50. Find the first repeating character

**Original section:** String questions (58).

**Question:** Find the first character whose second occurrence is encountered while scanning from left to right.

**Answer:**
```js
function firstRepeatingCharacter(str) {
  const seen = new Set();

  for (const char of str) {
    if (seen.has(char)) return char;
    seen.add(char);
  }

  return null;
}

console.log(firstRepeatingCharacter("abac")); // a
```

**Other Language Solutions:**

**Python:**
```python
def first_repeating_char(s):
    seen=set()
    for c in s:
        if c in seen:return c
        seen.add(c)
    return None
```

**Java:**
```java
static Character firstRepeatingChar(String s){Set<Character>seen=new HashSet<>();for(char c:s.toCharArray())if(!seen.add(c))return c;return null;}
```

**C# (.NET):**
```csharp
static char? FirstRepeatingChar(string s){var seen=new HashSet<char>();foreach(char c in s)if(!seen.Add(c))return c;return null;}
```

**C++:**
```cpp
optional<char> firstRepeatingChar(const string&s){unordered_set<char>seen;for(char c:s)if(!seen.insert(c).second)return c;return nullopt;}
```


**Expected Output:**
```text
a
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 51. Find the most frequent character

**Original section:** String questions (58).

**Question:** Find the character that appears most often in a string.

**Answer:**
```js
function mostFrequentCharacter(str) {
  const frequency = {};
  let maxCount = 0;
  let result = null;

  for (const char of str) {
    frequency[char] = (frequency[char] || 0) + 1;

    if (frequency[char] > maxCount) {
      maxCount = frequency[char];
      result = char;
    }
  }

  return result;
}

console.log(mostFrequentCharacter("aabbbcc")); // b
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def most_frequent_char(s): return Counter(s).most_common(1)[0][0] if s else None
```

**Java:**
```java
static Character mostFrequentChar(String s){Map<Character,Integer>m=new HashMap<>();for(char c:s.toCharArray())m.put(c,m.getOrDefault(c,0)+1);Character best=null;for(char c:s.toCharArray())if(best==null||m.get(c)>m.get(best))best=c;return best;}
```

**C# (.NET):**
```csharp
static char? MostFrequentChar(string s)=>s.Length==0?null:s.GroupBy(c=>c).OrderByDescending(g=>g.Count()).First().Key;
```

**C++:**
```cpp
char mostFrequentChar(const string&s){unordered_map<char,int>m;for(char c:s)m[c]++;char best='\0';for(char c:s)if(best=='\0'||m[c]>m[best])best=c;return best;}
```


**Expected Output:**
```text
b
```

**Explanation (Simple English):**
A frequency object or Map stores a count for each value. Each time a value appears, its count is increased by one.

**Explanation (Simple Hindi):**
Frequency object ya Map har value ki count store karta hai. Jab bhi value dobara milti hai, uski count ek badh jaati hai.

**How to solve this type of problem:**
For frequency problems, create an empty object/Map, scan the input once, increment each value’s count, then read the counts you need.

---

### 52. Remove all repeated characters

**Original section:** String questions (58).

**Question:** Keep only characters that occur exactly once.

**Answer:**
```js
function removeRepeatedCharacters(str) {
  const frequency = {};

  for (const char of str) {
    frequency[char] = (frequency[char] || 0) + 1;
  }

  return [...str].filter(char => frequency[char] === 1).join("");
}

console.log(removeRepeatedCharacters("aabbcde")); // cde
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def keep_chars_occurring_once(s):
    c=Counter(s); return "".join(ch for ch in s if c[ch]==1)
```

**Java:**
```java
static String keepUniqueOccurrences(String s){Map<Character,Integer>m=new HashMap<>();for(char c:s.toCharArray())m.put(c,m.getOrDefault(c,0)+1);StringBuilder r=new StringBuilder();for(char c:s.toCharArray())if(m.get(c)==1)r.append(c);return r.toString();}
```

**C# (.NET):**
```csharp
static string KeepUniqueOccurrences(string s){var c=s.GroupBy(x=>x).ToDictionary(g=>g.Key,g=>g.Count());return new string(s.Where(x=>c[x]==1).ToArray());}
```

**C++:**
```cpp
string keepUniqueOccurrences(const string&s){unordered_map<char,int>m;for(char c:s)m[c]++;string r;for(char c:s)if(m[c]==1)r+=c;return r;}
```


**Expected Output:**
```text
cde
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 53. Group repeated characters together

**Original section:** String questions (58).

**Question:** Sort the characters so identical characters appear next to one another.

**Answer:**
```js
function groupRepeatedCharacters(str) {
  return [...str].sort().join("");
}

console.log(groupRepeatedCharacters("cabca")); // aabcc
```

**Other Language Solutions:**

**Python:**
```python
def group_characters(s): return "".join(sorted(s))
```

**Java:**
```java
static String groupCharacters(String s){char[]a=s.toCharArray();Arrays.sort(a);return new String(a);}
```

**C# (.NET):**
```csharp
static string GroupCharacters(string s)=>new string(s.OrderBy(c=>c).ToArray());
```

**C++:**
```cpp
string groupCharacters(string s){sort(s.begin(),s.end());return s;}
```


**Expected Output:**
```text
aabcc
```

**Explanation (Simple English):**
The code uses a property value as a group key. When a group does not exist, it creates an empty array; then it adds the current item to that group.

**Explanation (Simple Hindi):**
Code kisi property ki value ko group key banata hai. Group pehle se nahi ho toh empty array banata hai, phir current item us group mein add karta hai.

**How to solve this type of problem:**
For grouping, decide which property defines a group, create a bucket the first time a key appears, and push each matching object into that bucket.

---

### 54. Count how many times a substring appears

**Original section:** String questions (58).

**Question:** Count the occurrences of a substring in a string.

**Answer:**
```js
function countSubstring(str, target) {
  if (target === "") return 0;

  return str.split(target).length - 1;
}

console.log(countSubstring("hello hello hello", "hello")); // 3
```

**Other Language Solutions:**

**Python:**
```python
def substring_count(s, sub):
    if not sub: return 0
    return sum(s.startswith(sub,i) for i in range(len(s)-len(sub)+1))
```

**Java:**
```java
static int substringCount(String s,String sub){if(sub.isEmpty())return 0;int n=0,p=0;while((p=s.indexOf(sub,p))!=-1){n++;p++;}return n;}
```

**C# (.NET):**
```csharp
static int SubstringCount(string s,string sub){if(sub.Length==0)return 0;int n=0,p=0;while((p=s.IndexOf(sub,p,StringComparison.Ordinal))!=-1){n++;p++;}return n;}
```

**C++:**
```cpp
int substringCount(const string&s,const string&sub){if(sub.empty())return 0;int n=0;size_t p=0;while((p=s.find(sub,p))!=string::npos){n++;p++;}return n;}
```


**Expected Output:**
```text
3
```

**Explanation (Simple English):**
The solution checks whether the target text exists inside the main string. Methods such as includes() or indexOf() answer this directly.

**Explanation (Simple Hindi):**
Code check karta hai ki target text main string ke andar present hai ya nahi. includes() ya indexOf() se ye check ho jaata hai.

**How to solve this type of problem:**
For substring searches, identify the exact target, choose whether case matters, and use includes()/indexOf() or a loop if built-ins are not allowed.

---

### 55. Encrypt a string using a Caesar cipher

**Original section:** String questions (58).

**Question:** Shift each lowercase English letter by a fixed number of positions.

**Answer:**
```js
function caesarCipher(str, shift) {
  shift = ((shift % 26) + 26) % 26;

  return [...str].map(char => {
    if (char < "a" || char > "z") return char;

    const code = char.charCodeAt(0) - 97;
    return String.fromCharCode(97 + (code + shift) % 26);
  }).join("");
}

console.log(caesarCipher("abc", 2)); // cde
```

**Other Language Solutions:**

**Python:**
```python
def caesar(s, shift):
    out=[]
    for c in s:
        if 'a'<=c<='z': out.append(chr((ord(c)-97+shift)%26+97))
        elif 'A'<=c<='Z': out.append(chr((ord(c)-65+shift)%26+65))
        else: out.append(c)
    return ''.join(out)
```

**Java:**
```java
static String caesar(String s,int k){StringBuilder r=new StringBuilder();for(char c:s.toCharArray()){if(c>='a'&&c<='z')r.append((char)('a'+(c-'a'+k)%26));else if(c>='A'&&c<='Z')r.append((char)('A'+(c-'A'+k)%26));else r.append(c);}return r.toString();}
```

**C# (.NET):**
```csharp
static string Caesar(string s,int k){var r=new StringBuilder();foreach(char c in s){if(c>='a'&&c<='z')r.Append((char)('a'+(c-'a'+k)%26));else if(c>='A'&&c<='Z')r.Append((char)('A'+(c-'A'+k)%26));else r.Append(c);}return r.ToString();}
```

**C++:**
```cpp
string caesar(string s,int k){for(char&c:s){if(c>='a'&&c<='z')c='a'+(c-'a'+k)%26;else if(c>='A'&&c<='Z')c='A'+(c-'A'+k)%26;}return s;}
```


**Expected Output:**
```text
cde
```

**Explanation (Simple English):**
Each letter is shifted by a fixed number of positions in the alphabet. The character code is adjusted and wrapped around when it passes the end of the alphabet.

**Explanation (Simple Hindi):**
Har letter alphabet mein fixed positions aage shift hota hai. Character code adjust hota hai aur alphabet ke end par pahunchne ke baad wapas start se continue karta hai.

**How to solve this type of problem:**
For Caesar cipher, convert letters to alphabet positions, add the shift, use modulo 26 to wrap around, and convert back to characters.

---

### 58. Convert a string to binary representation

**Original section:** String questions (58).

**Question:** Convert each character into its 8-bit binary character code.

**Answer:**
```js
function stringToBinary(str) {
  return [...str]
    .map(char => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

console.log(stringToBinary("ABC"));
// 01000001 01000010 01000011
```

**Other Language Solutions:**

**Python:**
```python
def to_binary(s): return " ".join(format(ord(c),"08b") for c in s)
```

**Java:**
```java
static String toBinary(String s){StringJoiner j=new StringJoiner(" ");for(char c:s.toCharArray())j.add(String.format("%8s",Integer.toBinaryString(c)).replace(' ','0'));return j.toString();}
```

**C# (.NET):**
```csharp
static string ToBinary(string s)=>string.Join(" ",s.Select(c=>Convert.ToString(c,2).PadLeft(8,'0')));
```

**C++:**
```cpp
string toBinary(const string&s){string r;for(unsigned char c:s){if(!r.empty())r+=" ";for(int i=7;i>=0;i--)r+=((c>>i)&1)?'1':'0';}return r;}
```


**Expected Output:**
```text
01000001 01000010 01000011
```

**Explanation (Simple English):**
Each character is converted to its character code, then that number is written in base 2. The binary pieces are joined into one string.

**Explanation (Simple Hindi):**
Har character ka character code nikalta hai, phir us number ko base 2 (binary) mein convert karta hai. Saare binary parts join hote hain.

**How to solve this type of problem:**
For text-to-binary, get each character code, convert it with toString(2), and decide whether every binary group needs fixed-width padding.

---

---

---

## 50 Intermediate array section (12 visible questions)

### 1. Find the intersection of two arrays

**Original section:** 50 Intermediate array section (12 visible questions).

```js
function intersection(a, b) {
  return a.filter(value => b.includes(value));
}

console.log(intersection([1, 2, 8, 4], [3, 4, 5, 6]));
// [4]
```

**Other Language Solutions:**

**Python:**
```python
def intersection(a,b): return list(dict.fromkeys(x for x in a if x in set(b)))
```

**Java:**
```java
static List<Integer> intersection(int[] a,int[] b){Set<Integer> s=new HashSet<>();for(int x:b)s.add(x);Set<Integer> r=new LinkedHashSet<>();for(int x:a)if(s.contains(x))r.add(x);return new ArrayList<>(r);}
```

**C# (.NET):**
```csharp
static int[] Intersection(int[] a,int[] b)=>a.Intersect(b).ToArray();
```

**C++:**
```cpp
vector<int> intersection(const vector<int>&a,const vector<int>&b){unordered_set<int>s(b.begin(),b.end());vector<int>r;for(int x:a)if(s.count(x)&&find(r.begin(),r.end(),x)==r.end())r.push_back(x);return r;}
```


**Expected Output:**
```text
[4]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

### 2. Rotate an array to the right by k steps

**Original section:** 50 Intermediate array section (12 visible questions).

```js
function rotateRight(arr, k) {
  if (arr.length === 0) return [];

  k = ((k % arr.length) + arr.length) % arr.length;
  return arr.slice(-k).concat(arr.slice(0, -k));
}

console.log(rotateRight([1, 2, 3, 4, 5], 2));
// [4, 5, 1, 2, 3]
```

**Other Language Solutions:**

**Python:**
```python
def rotate_right_k(a,k):
    if not a:return []
    k%=len(a);return a[-k:]+a[:-k] if k else a[:]
```

**Java:**
```java
static int[] rotateRightK(int[]a,int k){if(a.length==0)return a;k%=a.length;int[]r=new int[a.length];for(int i=0;i<a.length;i++)r[(i+k)%a.length]=a[i];return r;}
```

**C# (.NET):**
```csharp
static int[] RotateRightK(int[]a,int k){if(a.Length==0)return a;k%=a.Length;return a.Skip(a.Length-k).Concat(a.Take(a.Length-k)).ToArray();}
```

**C++:**
```cpp
vector<int> rotateRightK(vector<int>a,int k){if(a.empty())return a;k%=a.size();rotate(a.begin(),a.end()-k,a.end());return a;}
```


**Expected Output:**
```text
[4,5,1,2,3]
```

**Explanation (Simple English):**
Rotation moves elements around the array while preserving their relative order. The code normalizes the number of steps and combines or shifts the relevant part of the array.

**Explanation (Simple Hindi):**
Rotation mein elements array ke ek end se doosre end par move hote hain aur unka order preserve rehta hai. Code steps ko normalize karke values shift ya combine karta hai.

**How to solve this type of problem:**
For rotation, reduce k using k % array.length, decide left or right, and use slicing or an in-place reversal strategy.

---

### 3. Find the first duplicate in an array

**Original section:** 50 Intermediate array section (12 visible questions).

```js
function firstDuplicate(arr) {
  const seen = new Set();

  for (const value of arr) {
    if (seen.has(value)) return value;
    seen.add(value);
  }

  return -1;
}

console.log(firstDuplicate([2, 1, 5, 5, 2]));
// 5
```

**Other Language Solutions:**

**Python:**
```python
def first_duplicate(a):
    seen=set()
    for x in a:
        if x in seen:return x
        seen.add(x)
    return None
```

**Java:**
```java
static Integer firstDuplicate(int[]a){Set<Integer>s=new HashSet<>();for(int x:a)if(!s.add(x))return x;return null;}
```

**C# (.NET):**
```csharp
static int? FirstDuplicate(int[]a){var s=new HashSet<int>();foreach(int x in a)if(!s.Add(x))return x;return null;}
```

**C++:**
```cpp
optional<int> firstDuplicate(const vector<int>&a){unordered_set<int>s;for(int x:a)if(!s.insert(x).second)return x;return nullopt;}
```


**Expected Output:**
```text
5
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 5. Remove duplicates in place from a sorted array

**Original section:** 50 Intermediate array section (12 visible questions).

```js
function removeDuplicatesInPlace(nums) {
  if (nums.length === 0) return 0;

  let write = 1;

  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[read - 1]) {
      nums[write] = nums[read];
      write++;
    }
  }

  nums.length = write;
  return write;
}

const nums = [1, 1, 2, 2, 3];
removeDuplicatesInPlace(nums);
console.log(nums); // [1, 2, 3]
```

**Other Language Solutions:**

**Python:**
```python
def remove_duplicates_sorted_in_place(a):
    if not a: return 0
    write=1
    for read in range(1,len(a)):
        if a[read]!=a[write-1]: a[write]=a[read]; write+=1
    del a[write:]
    return write
```

**Java:**
```java
static int removeDuplicatesSorted(int[] a){if(a.length==0)return 0;int w=1;for(int r=1;r<a.length;r++)if(a[r]!=a[w-1])a[w++]=a[r];return w;}
```

**C# (.NET):**
```csharp
static int RemoveDuplicatesSorted(int[] a){if(a.Length==0)return 0;int w=1;for(int r=1;r<a.Length;r++)if(a[r]!=a[w-1])a[w++]=a[r];return w;}
```

**C++:**
```cpp
int removeDuplicatesSorted(vector<int>&a){if(a.empty())return 0;int w=1;for(int r=1;r<a.size();r++)if(a[r]!=a[w-1])a[w++]=a[r];a.resize(w);return w;}
```


**Expected Output:**
```text
[1,2,3]
```

**Explanation (Simple English):**
The solution checks whether a value has already appeared or counts how many times it occurs. A Set or frequency map helps identify repeated and unique values.

**Explanation (Simple Hindi):**
Code check karta hai ki value pehle aa chuki hai ya nahi, ya phir uski frequency count karta hai. Set ya frequency map duplicates aur unique values identify karne mein help karta hai.

**How to solve this type of problem:**
For duplicate questions, decide whether you need duplicate values, unique values, or first repeated item; then use Set, indexOf/lastIndexOf, or a frequency map.

---

### 7. Move all zeros to the end without changing the order

**Original section:** 50 Intermediate array section (12 visible questions).

```js
function moveZeros(arr) {
  const nonZeros = arr.filter(value => value !== 0);
  return nonZeros.concat(Array(arr.length - nonZeros.length).fill(0));
}

console.log(moveZeros([0, 1, 0, 3, 12]));
// [1, 3, 12, 0, 0]
```

**Other Language Solutions:**

**Python:**
```python
def move_zeros(a):
    return [x for x in a if x!=0] + [0]*a.count(0)
```

**Java:**
```java
static int[] moveZeros(int[] a){int[]r=new int[a.length];int k=0;for(int x:a)if(x!=0)r[k++]=x;return r;}
```

**C# (.NET):**
```csharp
static int[] MoveZeros(int[] a){var r=a.Where(x=>x!=0).Concat(a.Where(x=>x==0));return r.ToArray();}
```

**C++:**
```cpp
vector<int> moveZeros(vector<int>a){int k=0;for(int x:a)if(x!=0)a[k++]=x;while(k<a.size())a[k++]=0;return a;}
```


**Expected Output:**
```text
[1,3,12,0,0]
```

**Explanation (Simple English):**
The filter() method checks each item against a condition. It keeps only the items for which the condition returns true and creates a new array.

**Explanation (Simple Hindi):**
filter() har item par condition check karta hai. Jis item ke liye condition true hoti hai, wahi naye array mein rakha jaata hai.

**How to solve this type of problem:**
For filtering, turn the requirement into a true/false condition for one item, apply filter(), and check whether the original array should remain unchanged.

---

### 8. Count pairs with a given difference (k)

**Original section:** 50 Intermediate array section (12 visible questions).

```js
function countPairsWithDifference(arr, k) {
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (Math.abs(arr[i] - arr[j]) === k) count++;
    }
  }

  return count;
}

console.log(countPairsWithDifference([1, 5, 8, 4, 2], 2));
// 3
```

**Other Language Solutions:**

**Python:**
```python
def count_pairs_diff(a,k):
    return sum(abs(a[i]-a[j])==k for i in range(len(a)) for j in range(i+1,len(a)))
```

**Java:**
```java
static int countPairsDiff(int[]a,int k){int c=0;for(int i=0;i<a.length;i++)for(int j=i+1;j<a.length;j++)if(Math.abs(a[i]-a[j])==k)c++;return c;}
```

**C# (.NET):**
```csharp
static int CountPairsDiff(int[]a,int k){int c=0;for(int i=0;i<a.Length;i++)for(int j=i+1;j<a.Length;j++)if(Math.Abs(a[i]-a[j])==k)c++;return c;}
```

**C++:**
```cpp
int countPairsDiff(const vector<int>&a,int k){int c=0;for(int i=0;i<a.size();i++)for(int j=i+1;j<a.size();j++)if(abs(a[i]-a[j])==k)c++;return c;}
```


**Expected Output:**
```text
1
```

**Explanation (Simple English):**
The solution checks pairs of different indexes and tests the required difference or sum. A counter or result list is updated when a pair satisfies the condition.

**Explanation (Simple Hindi):**
Code alag indexes wale pairs check karta hai aur required difference ya sum test karta hai. Condition match hone par counter ya result list update hoti hai.

**How to solve this type of problem:**
For pair problems, define the exact relation between two values, avoid pairing an element with itself, and decide whether you need pair count or the actual pairs.

---

### 9. Check whether one string is a rotation of another

**Original section:** 50 Intermediate array section (12 visible questions).

```js
function isRotation(a, b) {
  return a.length === b.length && (a + a).includes(b);
}

console.log(isRotation("abcd", "cdab")); // true
```

**Other Language Solutions:**

**Python:**
```python
def is_rotation(a,b): return len(a)==len(b) and b in (a+a)
```

**Java:**
```java
static boolean isRotation(String a,String b){return a.length()==b.length()&&(a+a).contains(b);}
```

**C# (.NET):**
```csharp
static bool IsRotation(string a,string b)=>a.Length==b.Length&&(a+a).Contains(b);
```

**C++:**
```cpp
bool isRotation(const string&a,const string&b){return a.size()==b.size()&&(a+a).find(b)!=string::npos;}
```


**Expected Output:**
```text
true
```

**Explanation (Simple English):**
A string is a rotation of another when both have the same length and the second string appears inside the first string repeated twice. This checks whether the characters can wrap around.

**Explanation (Simple Hindi):**
Ek string doosri ki rotation tab hoti hai jab dono ki length same ho aur doosri string, pehli string ko do baar jodne par uske andar mil jaaye. Isse wrap-around order check hota hai.

**How to solve this type of problem:**
For string rotation, first compare lengths; if they match, check whether the target appears in original + original. Handle empty strings according to the problem rules.

---

### 10. Count frequency of elements in an array using Map

**Original section:** 50 Intermediate array section (12 visible questions).

```js
function frequencyWithMap(arr) {
  const frequency = new Map();

  for (const value of arr) {
    frequency.set(value, (frequency.get(value) || 0) + 1);
  }

  return frequency;
}

console.log([...frequencyWithMap([1, 2, 2, 3, 3, 3])]);
// [[1, 1], [2, 2], [3, 3]]
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def frequency(arr): return dict(Counter(arr))
```

**Java:**
```java
static Map<Integer,Integer> frequency(int[] a){Map<Integer,Integer>m=new LinkedHashMap<>();for(int x:a)m.put(x,m.getOrDefault(x,0)+1);return m;}
```

**C# (.NET):**
```csharp
static Dictionary<int,int> Frequency(int[] a){var d=new Dictionary<int,int>();foreach(int x in a)d[x]=d.GetValueOrDefault(x)+1;return d;}
```

**C++:**
```cpp
unordered_map<int,int> frequency(const vector<int>&a){unordered_map<int,int>m;for(int x:a)m[x]++;return m;}
```


**Expected Output:**
```text
[[1,1],[2,2],[3,3]]
```

**Explanation (Simple English):**
A frequency object or Map stores a count for each value. Each time a value appears, its count is increased by one.

**Explanation (Simple Hindi):**
Frequency object ya Map har value ki count store karta hai. Jab bhi value dobara milti hai, uski count ek badh jaati hai.

**How to solve this type of problem:**
For frequency problems, create an empty object/Map, scan the input once, increment each value’s count, then read the counts you need.

---

### 11. Remove duplicate values from an object

**Original section:** 50 Intermediate array section (12 visible questions).

```js
function removeDuplicateObjectValues(obj) {
  const result = {};
  const seen = new Set();

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (!seen.has(value)) {
      result[key] = value;
      seen.add(value);
    }
  }

  return result;
}

console.log(removeDuplicateObjectValues({
  a: 1, b: 2, c: 1, d: 3
}));
// { a: 1, b: 2, d: 3 }
```

**Other Language Solutions:**

**Python:**
```python
def remove_duplicate_values(obj):
    out={}
    for k,v in obj.items():
        if v not in out.values(): out[k]=v
    return out
```

**Java:**
```java
static <K,V> Map<K,V> removeDuplicateValues(Map<K,V> obj){Map<K,V>r=new LinkedHashMap<>();Set<V>s=new HashSet<>();for(var e:obj.entrySet())if(s.add(e.getValue()))r.put(e.getKey(),e.getValue());return r;}
```

**C# (.NET):**
```csharp
static Dictionary<string,object> RemoveDuplicateValues(Dictionary<string,object> obj){var r=new Dictionary<string,object>();var seen=new HashSet<object>();foreach(var kv in obj)if(seen.Add(kv.Value))r[kv.Key]=kv.Value;return r;}
```

**C++:**
```cpp
map<string,int> removeDuplicateValues(const map<string,int>&o){map<string,int>r;set<int>s;for(auto&[k,v]:o)if(s.insert(v).second)r[k]=v;return r;}
```


**Expected Output:**
```text
{"a":1,"b":2,"d":3}
```

**Explanation (Simple English):**
A Set remembers property values already seen. The code copies a value only the first time it appears, so repeated values are skipped.

**Explanation (Simple Hindi):**
Set pehle dekhi hui property values yaad rakhta hai. Code kisi value ko sirf pehli baar copy karta hai, isliye duplicate values skip hoti hain.

**How to solve this type of problem:**
For unique object values, track seen values in a Set and keep the first property for each value; decide how duplicate values should be represented.

---

### 12. Invert keys and values in an object

**Original section:** 50 Intermediate array section (12 visible questions).

```js
function invertObject(obj) {
  const inverted = {};

  for (const key of Object.keys(obj)) {
    inverted[obj[key]] = key;
  }

  return inverted;
}

console.log(invertObject({ a: 1, b: 2, c: 3 }));
// { 1: "a", 2: "b", 3: "c" }
```

**Other Language Solutions:**

**Python:**
```python
def invert_object(obj): return {str(v):k for k,v in obj.items()}
```

**Java:**
```java
static Map<String,String> invertObject(Map<String,String> obj){Map<String,String>r=new LinkedHashMap<>();for(var e:obj.entrySet())r.put(e.getValue(),e.getKey());return r;}
```

**C# (.NET):**
```csharp
static Dictionary<string,string> InvertObject(Dictionary<string,string> obj){var r=new Dictionary<string,string>();foreach(var kv in obj)r[kv.Value]=kv.Key;return r;}
```

**C++:**
```cpp
map<string,string> invertObject(const map<string,string>&o){map<string,string>r;for(auto&[k,v]:o)r[v]=k;return r;}
```


**Expected Output:**
```text
{"1":"a","2":"b","3":"c"}
```

**Explanation (Simple English):**
The loop reads each key and value, then creates a new property where the old value becomes the key and the old key becomes the value.

**Explanation (Simple Hindi):**
Loop har key aur value read karta hai, phir nayi object property banata hai jahan purani value key aur purani key value ban jaati hai.

**How to solve this type of problem:**
For object inversion, loop through Object.entries(), assign result[value] = key, and consider duplicate values because object keys must be unique strings/symbols.

---


---

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

