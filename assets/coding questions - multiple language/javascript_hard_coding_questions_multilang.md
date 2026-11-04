# Coding Questions – Hard (JavaScript, Python, Java, C# and C++)

**How to use this file:** Start here if you are at the hard stage. Try each problem before reading its solution. Every question keeps its original notebook section/number in the source label, so you can trace it back to the master notes.

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

## Question count: 22

## Additional first-batch array exercises

### Find all subarrays of an array

**Original section:** Additional first-batch array exercises.

**Question:** Generate all contiguous, non-empty subarrays.

```js
function getAllSubarrays(arr) {
  const result = [];

  for (let start = 0; start < arr.length; start++) {
    for (let end = start + 1; end <= arr.length; end++) {
      result.push(arr.slice(start, end));
    }
  }

  return result;
}

console.log(getAllSubarrays([1, 2, 3]));
// [[1], [1, 2], [1, 2, 3], [2], [2, 3], [3]]
```

**Other Language Solutions:**

**Python:**
```python
def all_subarrays(a):
    return [a[i:j] for i in range(len(a)) for j in range(i+1,len(a)+1)]
```

**Java:**
```java
static List<List<Integer>> allSubarrays(int[] a){List<List<Integer>>r=new ArrayList<>();for(int i=0;i<a.length;i++)for(int j=i+1;j<=a.length;j++){List<Integer>x=new ArrayList<>();for(int k=i;k<j;k++)x.add(a[k]);r.add(x);}return r;}
```

**C# (.NET):**
```csharp
static List<List<int>> AllSubarrays(int[] a){var r=new List<List<int>>();for(int i=0;i<a.Length;i++)for(int j=i+1;j<=a.Length;j++)r.Add(a.Skip(i).Take(j-i).ToList());return r;}
```

**C++:**
```cpp
vector<vector<int>> allSubarrays(const vector<int>&a){vector<vector<int>>r;for(int i=0;i<a.size();i++)for(int j=i+1;j<=a.size();j++)r.emplace_back(a.begin()+i,a.begin()+j);return r;}
```


**Expected Output:**
```text
[[1],[1,2],[1,2,3],[2],[2,3],[3]]
```

**Explanation (Simple English):**
Nested loops choose every possible start and end position. slice() then collects the continuous elements between those positions.

**Explanation (Simple Hindi):**
Nested loops har possible start aur end position choose karte hain. slice() un positions ke beech ke continuous elements nikaalta hai.

**How to solve this type of problem:**
For subarray problems, remember a subarray must be contiguous; choose a start index, extend the end index, and update the result for each range.

---

### Find the longest increasing contiguous subarray

**Original section:** Additional first-batch array exercises.

**Question:** Find the length of the longest contiguous strictly increasing run.

```js
function longestIncreasingSubarray(arr) {
  if (arr.length === 0) return 0;

  let currentLength = 1;
  let longestLength = 1;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[i - 1]) {
      currentLength++;
    } else {
      currentLength = 1;
    }

    longestLength = Math.max(longestLength, currentLength);
  }

  return longestLength;
}

console.log(longestIncreasingSubarray([1, 2, 2, 3, 4, 1, 2]));
// 3
```

**Other Language Solutions:**

**Python:**
```python
def longest_increasing_run(a):
    if not a:return 0
    best=cur=1
    for i in range(1,len(a)):
        cur=cur+1 if a[i]>a[i-1] else 1
        best=max(best,cur)
    return best
```

**Java:**
```java
static int longestIncreasingRun(int[]a){if(a.length==0)return 0;int cur=1,best=1;for(int i=1;i<a.length;i++){cur=a[i]>a[i-1]?cur+1:1;best=Math.max(best,cur);}return best;}
```

**C# (.NET):**
```csharp
static int LongestIncreasingRun(int[]a){if(a.Length==0)return 0;int cur=1,best=1;for(int i=1;i<a.Length;i++){cur=a[i]>a[i-1]?cur+1:1;best=Math.Max(best,cur);}return best;}
```

**C++:**
```cpp
int longestIncreasingRun(const vector<int>&a){if(a.empty())return 0;int cur=1,best=1;for(int i=1;i<a.size();i++){cur=a[i]>a[i-1]?cur+1:1;best=max(best,cur);}return best;}
```


**Expected Output:**
```text
3
```

**Explanation (Simple English):**
The code tracks the current increasing run and the longest run seen so far. A value that is not greater than its previous neighbour starts a new run.

**Explanation (Simple Hindi):**
Code current increasing run aur ab tak ke longest run ko track karta hai. Agar current number previous se bada nahi hai, toh naya run start hota hai.

**How to solve this type of problem:**
For contiguous increasing sequence problems, compare neighbours, grow the current run when the condition holds, reset it when it breaks, and update the maximum.

---

## 100 Intermediate JS section (26 visible questions)

### 4. Implement a custom version of `map()`

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Create a function that behaves like the array `map()` method.

**Answer:**
```js
function customMap(arr, callback) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push(callback(arr[i], i, arr));
  }

  return result;
}

console.log(customMap([1, 2, 3], number => number * 2));
// [2, 4, 6]
```

**Other Language Solutions:**

**Python:**
```python
def custom_map(arr, callback):
    result=[]
    for i,value in enumerate(arr): result.append(callback(value,i,arr))
    return result
```

**Java:**
```java
static <T,R> List<R> customMap(List<T> a, BiFunction<T,Integer,R> cb){List<R>r=new ArrayList<>();for(int i=0;i<a.size();i++)r.add(cb.apply(a.get(i),i));return r;}
```

**C# (.NET):**
```csharp
static List<R> CustomMap<T,R>(IEnumerable<T> a,Func<T,int,R> callback){var r=new List<R>();int i=0;foreach(var x in a)r.Add(callback(x,i++));return r;}
```

**C++:**
```cpp
template<class T,class F> auto customMap(const vector<T>&a,F cb){using R=decay_t<decltype(cb(a[0],0))>;vector<R>r;for(int i=0;i<a.size();i++)r.push_back(cb(a[i],i));return r;}
```


**Expected Output:**
```text
[2,4,6]
```

**Explanation (Simple English):**
A custom map loops through the input array, calls the callback for each item, and pushes the returned value into a new array.

**Explanation (Simple Hindi):**
Custom map input array par loop chalata hai, har item ke liye callback call karta hai aur returned value ko naye array mein push karta hai.

**How to solve this type of problem:**
To implement map(), create an output array, call the callback with each element (and optionally index and array), push each result, and return the output.

---

### 9. Find the longest consecutive sequence

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Find the length of the longest sequence of consecutive integers, regardless of their original order.

**Answer:**
```js
function longestConsecutive(nums) {
  const values = new Set(nums);
  let longest = 0;

  for (const num of values) {
    if (!values.has(num - 1)) {
      let current = num;
      let length = 1;

      while (values.has(current + 1)) {
        current++;
        length++;
      }

      longest = Math.max(longest, length);
    }
  }

  return longest;
}

console.log(longestConsecutive([100, 4, 200, 1, 3, 2]));
// 4 (sequence: 1, 2, 3, 4)
```

**Other Language Solutions:**

**Python:**
```python
def longest_consecutive(a):
    s=set(a); best=0
    for x in s:
        if x-1 not in s:
            y=x
            while y in s:y+=1
            best=max(best,y-x)
    return best
```

**Java:**
```java
static int longestConsecutive(int[] a){Set<Integer>s=new HashSet<>();for(int x:a)s.add(x);int best=0;for(int x:s)if(!s.contains(x-1)){int y=x;while(s.contains(y))y++;best=Math.max(best,y-x);}return best;}
```

**C# (.NET):**
```csharp
static int LongestConsecutive(int[] a){var s=a.ToHashSet();int best=0;foreach(int x in s)if(!s.Contains(x-1)){int y=x;while(s.Contains(y))y++;best=Math.Max(best,y-x);}return best;}
```

**C++:**
```cpp
int longestConsecutive(const vector<int>&a){unordered_set<int>s(a.begin(),a.end());int best=0;for(int x:s)if(!s.count(x-1)){int y=x;while(s.count(y))y++;best=max(best,y-x);}return best;}
```


**Expected Output:**
```text
4
```

**Explanation (Simple English):**
A Set provides quick membership checks. The algorithm starts counting only at values that have no predecessor, then walks forward through the consecutive values.

**Explanation (Simple Hindi):**
Set se kisi number ki presence jaldi check hoti hai. Algorithm sirf un numbers se counting start karta hai jinka previous number nahi hai, phir aage consecutive numbers count karta hai.

**How to solve this type of problem:**
For longest-consecutive problems, use a Set, start a run only when num - 1 is absent, and count num + 1, num + 2, and so on.

---

### 10. Implement a custom version of `map()` using a callback

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Build a new array by calling a callback for each array element.

**Answer:**
```js
function myMap(arr, callback) {
  const output = [];

  for (let i = 0; i < arr.length; i++) {
    output.push(callback(arr[i]));
  }

  return output;
}

console.log(myMap([1, 2, 3], num => num * 2));
// [2, 4, 6]
```

**Other Language Solutions:**

**Python:**
```python
def custom_map(arr, callback):
    result=[]
    for i,value in enumerate(arr): result.append(callback(value,i,arr))
    return result
```

**Java:**
```java
static <T,R> List<R> customMap(List<T> a, BiFunction<T,Integer,R> cb){List<R>r=new ArrayList<>();for(int i=0;i<a.size();i++)r.add(cb.apply(a.get(i),i));return r;}
```

**C# (.NET):**
```csharp
static List<R> CustomMap<T,R>(IEnumerable<T> a,Func<T,int,R> callback){var r=new List<R>();int i=0;foreach(var x in a)r.Add(callback(x,i++));return r;}
```

**C++:**
```cpp
template<class T,class F> auto customMap(const vector<T>&a,F cb){using R=decay_t<decltype(cb(a[0],0))>;vector<R>r;for(int i=0;i<a.size();i++)r.push_back(cb(a[i],i));return r;}
```


**Expected Output:**
```text
[2,4,6]
```

**Explanation (Simple English):**
A custom map loops through the input array, calls the callback for each item, and pushes the returned value into a new array.

**Explanation (Simple Hindi):**
Custom map input array par loop chalata hai, har item ke liye callback call karta hai aur returned value ko naye array mein push karta hai.

**How to solve this type of problem:**
To implement map(), create an output array, call the callback with each element (and optionally index and array), push each result, and return the output.

---

### 12. Calculate prefix sums and find a range sum

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Build a prefix-sum array and use it to calculate the sum between two indexes.

**Answer:**
```js
function rangeSum(arr, left, right) {
  const prefix = [0];

  for (const value of arr) {
    prefix.push(prefix[prefix.length - 1] + value);
  }

  return prefix[right + 1] - prefix[left];
}

console.log(rangeSum([1, 2, 3, 4, 5], 1, 3));
// 9 (2 + 3 + 4)
```

**Other Language Solutions:**

**Python:**
```python
def prefix_sums(a):
    p=[]; total=0
    for x in a: total+=x; p.append(total)
    return p
# Range [left, right], inclusive: p[right] - (p[left-1] if left else 0)
```

**Java:**
```java
static int[] prefixSums(int[] a){int[]p=new int[a.length];for(int i=0;i<a.length;i++)p[i]=a[i]+(i==0?0:p[i-1]);return p;}
static int rangeSum(int[] p,int l,int r){return p[r]-(l==0?0:p[l-1]);}
```

**C# (.NET):**
```csharp
static int[] PrefixSums(int[] a){int[]p=new int[a.Length];for(int i=0;i<a.Length;i++)p[i]=a[i]+(i==0?0:p[i-1]);return p;}
static int RangeSum(int[] p,int l,int r)=>p[r]-(l==0?0:p[l-1]);
```

**C++:**
```cpp
vector<int> prefixSums(const vector<int>&a){vector<int>p(a.size());for(int i=0;i<a.size();i++)p[i]=a[i]+(i? p[i-1]:0);return p;}
int rangeSum(const vector<int>&p,int l,int r){return p[r]-(l? p[l-1]:0);}
```


**Expected Output:**
```text
9
```

**Explanation (Simple English):**
A prefix-sum array stores the running total up to each position. Subtracting the prefix before the left index from the prefix at the right boundary gives the requested range sum.

**Explanation (Simple Hindi):**
Prefix sum array har position tak ka running total store karta hai. Right boundary ka prefix minus left se pehle wala prefix karne par range ka sum milta hai.

**How to solve this type of problem:**
For repeated range-sum queries, build prefix sums once, then answer each range using prefix[right + 1] - prefix[left].

---

### 13. Find an equilibrium index in an array

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Find an index where the sum of elements on the left equals the sum of elements on the right.

**Answer:**
```js
function equilibriumIndex(arr) {
  const total = arr.reduce((sum, value) => sum + value, 0);
  let leftSum = 0;

  for (let i = 0; i < arr.length; i++) {
    const rightSum = total - leftSum - arr[i];

    if (leftSum === rightSum) return i;

    leftSum += arr[i];
  }

  return -1;
}

console.log(equilibriumIndex([1, 3, 5, 2, 2])); // 2
```

**Other Language Solutions:**

**Python:**
```python
def equilibrium_index(a):
    total=sum(a); left=0
    for i,x in enumerate(a):
        if left==total-left-x:return i
        left+=x
    return -1
```

**Java:**
```java
static int equilibriumIndex(int[]a){int total=Arrays.stream(a).sum(),left=0;for(int i=0;i<a.length;i++){if(left==total-left-a[i])return i;left+=a[i];}return -1;}
```

**C# (.NET):**
```csharp
static int EquilibriumIndex(int[]a){int total=a.Sum(),left=0;for(int i=0;i<a.Length;i++){if(left==total-left-a[i])return i;left+=a[i];}return -1;}
```

**C++:**
```cpp
int equilibriumIndex(const vector<int>&a){int total=accumulate(a.begin(),a.end(),0),left=0;for(int i=0;i<a.size();i++){if(left==total-left-a[i])return i;left+=a[i];}return -1;}
```


**Expected Output:**
```text
2
```

**Explanation (Simple English):**
The total sum is calculated first. While scanning, the code compares the running left sum with total minus the left sum and current value, which is the right sum.

**Explanation (Simple Hindi):**
Pehle total sum nikalta hai. Scan ke dauraan left sum ko total - left sum - current value (right sum) se compare karta hai.

**How to solve this type of problem:**
For equilibrium index, calculate total once, keep a running left sum, derive the right sum, compare them, and then move to the next index.

---

### 14. Replace each element with the next greatest element on its right

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Replace each array element with the greatest value to its right. Replace the last element with `-1`.

**Answer:**
```js
function replaceWithNextGreatest(arr) {
  const result = [...arr];
  let maxRight = -1;

  for (let i = result.length - 1; i >= 0; i--) {
    const current = result[i];
    result[i] = maxRight;
    maxRight = Math.max(maxRight, current);
  }

  return result;
}

console.log(replaceWithNextGreatest([16, 17, 4, 3, 5, 2]));
// [17, 5, 5, 5, 2, -1]
```

**Other Language Solutions:**

**Python:**
```python
def replace_with_right_max(a):
    out=[-1]*len(a); mx=-1
    for i in range(len(a)-1,-1,-1): out[i]=mx; mx=max(mx,a[i])
    return out
```

**Java:**
```java
static int[] replaceWithRightMax(int[]a){int[]r=new int[a.length];int mx=-1;for(int i=a.length-1;i>=0;i--){r[i]=mx;mx=Math.max(mx,a[i]);}return r;}
```

**C# (.NET):**
```csharp
static int[] ReplaceWithRightMax(int[]a){int[]r=new int[a.Length];int mx=-1;for(int i=a.Length-1;i>=0;i--){r[i]=mx;mx=Math.Max(mx,a[i]);}return r;}
```

**C++:**
```cpp
vector<int> replaceWithRightMax(const vector<int>&a){vector<int>r(a.size());int mx=-1;for(int i=(int)a.size()-1;i>=0;i--){r[i]=mx;mx=max(mx,a[i]);}return r;}
```


**Expected Output:**
```text
[17,5,5,5,2,-1]
```

**Explanation (Simple English):**
The array is scanned from right to left while keeping the largest value seen so far. That stored value tells what is greater on the right of the current position.

**Explanation (Simple Hindi):**
Array ko right se left scan karte hain aur ab tak ka maximum store rakhte hain. Ye maximum current element ke right side ka greatest value batata hai.

**How to solve this type of problem:**
For right-side maximum or leader problems, scan from the end, maintain a running maximum, and update the answer for each element.

---

### 15. Find leaders in an array

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** An element is a leader if it is greater than every element to its right.

**Answer:**
```js
function findLeaders(arr) {
  const leaders = [];
  let maxRight = -Infinity;

  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] > maxRight) {
      leaders.push(arr[i]);
      maxRight = arr[i];
    }
  }

  return leaders.reverse();
}

console.log(findLeaders([16, 17, 4, 3, 5, 2]));
// [17, 5, 2]
```

**Other Language Solutions:**

**Python:**
```python
def leaders(a):
    out=[]; mx=float("-inf")
    for x in reversed(a):
        if x>mx:out.append(x);mx=x
    return out[::-1]
```

**Java:**
```java
static List<Integer> leaders(int[]a){List<Integer>r=new ArrayList<>();int mx=Integer.MIN_VALUE;for(int i=a.length-1;i>=0;i--)if(a[i]>mx){r.add(a[i]);mx=a[i];}Collections.reverse(r);return r;}
```

**C# (.NET):**
```csharp
static int[] Leaders(int[]a){var r=new List<int>();int mx=int.MinValue;for(int i=a.Length-1;i>=0;i--)if(a[i]>mx){r.Add(a[i]);mx=a[i];}r.Reverse();return r.ToArray();}
```

**C++:**
```cpp
vector<int> leaders(const vector<int>&a){vector<int>r;int mx=INT_MIN;for(int i=(int)a.size()-1;i>=0;i--)if(a[i]>mx){r.push_back(a[i]);mx=a[i];}reverse(r.begin(),r.end());return r;}
```


**Expected Output:**
```text
[17,5,2]
```

**Explanation (Simple English):**
The array is scanned from right to left while keeping the largest value seen so far. That stored value tells what is greater on the right of the current position.

**Explanation (Simple Hindi):**
Array ko right se left scan karte hain aur ab tak ka maximum store rakhte hain. Ye maximum current element ke right side ka greatest value batata hai.

**How to solve this type of problem:**
For right-side maximum or leader problems, scan from the end, maintain a running maximum, and update the answer for each element.

---

### 16. Sort an array of 0s, 1s, and 2s without using `sort()`

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Arrange all zeros first, then ones, then twos.

**Answer:**
```js
function sortZeroOneTwo(arr) {
  let low = 0;
  let mid = 0;
  let high = arr.length - 1;

  while (mid <= high) {
    if (arr[mid] === 0) {
      [arr[low], arr[mid]] = [arr[mid], arr[low]];
      low++;
      mid++;
    } else if (arr[mid] === 1) {
      mid++;
    } else {
      [arr[mid], arr[high]] = [arr[high], arr[mid]];
      high--;
    }
  }

  return arr;
}

console.log(sortZeroOneTwo([0, 2, 1, 2, 0, 1]));
// [0, 0, 1, 1, 2, 2]
```

**Other Language Solutions:**

**Python:**
```python
def sort_012(a):
    low=mid=0; high=len(a)-1
    while mid<=high:
        if a[mid]==0:a[low],a[mid]=a[mid],a[low];low+=1;mid+=1
        elif a[mid]==1:mid+=1
        else:a[mid],a[high]=a[high],a[mid];high-=1
    return a
```

**Java:**
```java
static void sort012(int[]a){int l=0,m=0,h=a.length-1;while(m<=h){if(a[m]==0){int t=a[l];a[l++]=a[m];a[m++]=t;}else if(a[m]==1)m++;else{int t=a[m];a[m]=a[h];a[h--]=t;}}}
```

**C# (.NET):**
```csharp
static void Sort012(int[]a){int l=0,m=0,h=a.Length-1;while(m<=h){if(a[m]==0){(a[l],a[m])=(a[m],a[l]);l++;m++;}else if(a[m]==1)m++;else{(a[m],a[h])=(a[h],a[m]);h--;}}}
```

**C++:**
```cpp
void sort012(vector<int>&a){int l=0,m=0,h=a.size()-1;while(m<=h){if(a[m]==0)swap(a[l++],a[m++]);else if(a[m]==1)m++;else swap(a[m],a[h--]);}}
```


**Expected Output:**
```text
[0,0,1,1,2,2]
```

**Explanation (Simple English):**
The values are arranged according to a comparison rule. For numeric sorting, the comparator must return a negative, zero, or positive value based on the order.

**Explanation (Simple Hindi):**
Values ko comparison rule ke hisaab se arrange kiya jaata hai. Numeric sorting mein comparator batata hai ki kaunsa number pehle aayega.

**How to solve this type of problem:**
For sorting, decide ascending or descending order, use the correct numeric comparator, and remember that sort() changes the original array.

---

### 17. Check whether an array can be divided into pairs with an equal sum

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Count pairs of elements whose sum equals a target value.

**Answer:**
```js
function countPairsWithSum(arr, target) {
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) {
        count++;
      }
    }
  }

  return count;
}

console.log(countPairsWithSum([1, 5, 4, -1, 6], 6));
// 2
```

**Other Language Solutions:**

**Python:**
```python
def count_pairs_with_sum(a,target):
    count=0
    for i in range(len(a)):
        for j in range(i+1,len(a)):
            if a[i]+a[j]==target:count+=1
    return count
```

**Java:**
```java
static int countPairsWithSum(int[]a,int target){int c=0;for(int i=0;i<a.length;i++)for(int j=i+1;j<a.length;j++)if(a[i]+a[j]==target)c++;return c;}
```

**C# (.NET):**
```csharp
static int CountPairsWithSum(int[]a,int target){int c=0;for(int i=0;i<a.Length;i++)for(int j=i+1;j<a.Length;j++)if(a[i]+a[j]==target)c++;return c;}
```

**C++:**
```cpp
int countPairsWithSum(const vector<int>&a,int target){int c=0;for(int i=0;i<a.size();i++)for(int j=i+1;j<a.size();j++)if(a[i]+a[j]==target)c++;return c;}
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

### 18. Count pairs with a given difference

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Count pairs whose absolute difference is equal to `k`.

**Answer:**
```js
function countPairsWithDifference(arr, k) {
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (Math.abs(arr[i] - arr[j]) === k) {
        count++;
      }
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

### 19. Count inversions in an array

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Count pairs `(i, j)` where `i < j` but `arr[i] > arr[j]`.

**Answer:**
```js
function countInversions(arr) {
  let inversions = 0;

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) inversions++;
    }
  }

  return inversions;
}

console.log(countInversions([1, 20, 6, 4, 5]));
// 5
```

**Other Language Solutions:**

**Python:**
```python
def count_inversions(a):
    return sum(a[i]>a[j] for i in range(len(a)) for j in range(i+1,len(a)))
```

**Java:**
```java
static long countInversions(int[]a){long c=0;for(int i=0;i<a.length;i++)for(int j=i+1;j<a.length;j++)if(a[i]>a[j])c++;return c;}
```

**C# (.NET):**
```csharp
static long CountInversions(int[]a){long c=0;for(int i=0;i<a.Length;i++)for(int j=i+1;j<a.Length;j++)if(a[i]>a[j])c++;return c;}
```

**C++:**
```cpp
long long countInversions(const vector<int>&a){long long c=0;for(int i=0;i<a.size();i++)for(int j=i+1;j<a.size();j++)if(a[i]>a[j])c++;return c;}
```


**Expected Output:**
```text
5
```

**Explanation (Simple English):**
Every pair of indexes is compared. If the earlier value is greater than the later value, that pair is an inversion and the count increases.

**Explanation (Simple Hindi):**
Har index pair compare hota hai. Agar pehle wala number baad wale se bada hai, toh inversion count ek badh jaati hai.

**How to solve this type of problem:**
For inversion counting, use nested loops for a simple approach, compare only pairs i < j, and count when arr[i] > arr[j].

---

### 20. Merge two sorted arrays without extra space

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Merge two sorted arrays so that their combined values are sorted.

**Answer:**
```js
function mergeSortedArrays(a, b) {
  const merged = [...a, ...b];
  merged.sort((x, y) => x - y);
  return merged;
}

console.log(mergeSortedArrays([1, 3, 5], [2, 4, 6]));
// [1, 2, 3, 4, 5, 6]
```

**Other Language Solutions:**

> **Note:** Uses the gap method to compare and swap values across both arrays without creating a third array.

**Python:**
```python
def merge_sorted(a,b):
    i=0
    for j in range(len(b)):
        while i<len(a) and a[i]<=b[j]:i+=1
        a.insert(i,b[j]);i+=1
    return a
```

**Java:**
```java
static void mergeSorted(int[]a,int[]b){int n=a.length,m=b.length,gap=(n+m+1)/2;while(gap>0){int i=0,j=gap;while(j<n+m){int x=i<n?a[i]:b[i-n],y=j<n?a[j]:b[j-n];if(x>y){if(i<n&&j<n){int t=a[i];a[i]=a[j];a[j]=t;}else if(i<n){int t=a[i];a[i]=b[j-n];b[j-n]=t;}else{int t=b[i-n];b[i-n]=b[j-n];b[j-n]=t;}}i++;j++;}if(gap==1)break;gap=(gap+1)/2;}}
```

**C# (.NET):**
```csharp
static void MergeSorted(int[]a,int[]b){int n=a.Length,m=b.Length,gap=(n+m+1)/2;while(gap>0){int i=0,j=gap;while(j<n+m){int x=i<n?a[i]:b[i-n],y=j<n?a[j]:b[j-n];if(x>y){if(i<n&&j<n)(a[i],a[j])=(a[j],a[i]);else if(i<n)(a[i],b[j-n])=(b[j-n],a[i]);else (b[i-n],b[j-n])=(b[j-n],b[i-n]);}i++;j++;}if(gap==1)break;gap=(gap+1)/2;}}
```

**C++:**
```cpp
void mergeSorted(vector<int>&a,vector<int>&b){int n=a.size(),m=b.size(),gap=(n+m+1)/2;while(gap>0){int i=0,j=gap;while(j<n+m){int &x=(i<n?a[i]:b[i-n]),&y=(j<n?a[j]:b[j-n]);if(x>y)swap(x,y);i++;j++;}if(gap==1)break;gap=(gap+1)/2;}}
```


**Expected Output:**
```text
[1,2,3,4,5,6]
```

**Explanation (Simple English):**
Two sorted arrays are combined by comparing their current elements and moving the smaller one into the correct position. This keeps the overall order sorted.

**Explanation (Simple Hindi):**
Do sorted arrays ke current elements compare karke chhota element sahi position par rakhte hain. Isse final array sorted rehta hai.

**How to solve this type of problem:**
For merging sorted arrays, use two pointers, compare the current values, move the smaller one, and then append any remaining values.

---

### 21. Find a triplet with a sum of zero

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Find three array elements whose sum is zero.

**Answer:**
```js
function findZeroSumTriplets(arr) {
  const nums = [...arr].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;

        while (left < right && nums[left] === nums[left - 1]) left++;
        while (left < right && nums[right] === nums[right + 1]) right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

console.log(findZeroSumTriplets([-1, 0, 1, 2, -1, -4]));
// [[-1, -1, 2], [-1, 0, 1]]
```

**Other Language Solutions:**

**Python:**
```python
def three_sum_zero(a):
    s=sorted(a); out=[]
    for i in range(len(s)-2):
        if i and s[i]==s[i-1]:continue
        l,r=i+1,len(s)-1
        while l<r:
            total=s[i]+s[l]+s[r]
            if total==0:out.append((s[i],s[l],s[r]));l+=1;r-=1
            elif total<0:l+=1
            else:r-=1
    return out
```

**Java:**
```java
static List<List<Integer>> threeSumZero(int[]a){Arrays.sort(a);List<List<Integer>>r=new ArrayList<>();for(int i=0;i<a.length-2;i++){if(i>0&&a[i]==a[i-1])continue;int l=i+1,h=a.length-1;while(l<h){int s=a[i]+a[l]+a[h];if(s==0){r.add(Arrays.asList(a[i],a[l],a[h]));l++;h--;while(l<h&&a[l]==a[l-1])l++;}else if(s<0)l++;else h--;}}return r;}
```

**C# (.NET):**
```csharp
static List<List<int>> ThreeSumZero(int[]a){Array.Sort(a);var r=new List<List<int>>();for(int i=0;i<a.Length-2;i++){if(i>0&&a[i]==a[i-1])continue;int l=i+1,h=a.Length-1;while(l<h){int s=a[i]+a[l]+a[h];if(s==0){r.Add(new(){a[i],a[l],a[h]});l++;h--;}else if(s<0)l++;else h--;}}return r;}
```

**C++:**
```cpp
vector<vector<int>> threeSumZero(vector<int>a){sort(a.begin(),a.end());vector<vector<int>>r;for(int i=0;i+2<a.size();i++){if(i&&a[i]==a[i-1])continue;int l=i+1,h=a.size()-1;while(l<h){int s=a[i]+a[l]+a[h];if(s==0){r.push_back({a[i],a[l],a[h]});l++;h--;}else if(s<0)l++;else h--;}}return r;}
```


**Expected Output:**
```text
[[-1,-1,2],[-1,0,1]]
```

**Explanation (Simple English):**
The algorithm considers three different positions and checks whether their values add up to the target (zero in this example).

**Explanation (Simple Hindi):**
Algorithm teen alag positions ke numbers leta hai aur check karta hai ki unka sum target (is example mein zero) hai ya nahi.

**How to solve this type of problem:**
For triplet-sum problems, fix one value and search for the remaining pair; use nested loops for a beginner solution or sorting plus two pointers for a faster one.

---

### 22. Find the missing and repeating numbers in an array

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** An array contains values from 1 to n, with one missing number and one repeated number. Find both.

**Answer:**
```js
function findMissingAndRepeating(arr) {
  const counts = Array(arr.length + 1).fill(0);

  for (const value of arr) {
    counts[value]++;
  }

  let missing = -1;
  let repeating = -1;

  for (let i = 1; i <= arr.length; i++) {
    if (counts[i] === 0) missing = i;
    if (counts[i] > 1) repeating = i;
  }

  return { missing, repeating };
}

console.log(findMissingAndRepeating([4, 3, 6, 2, 1, 1]));
// { missing: 5, repeating: 1 }
```

**Other Language Solutions:**

**Python:**
```python
def missing_and_repeating(a):
    n=len(a); counts=[0]*(n+1)
    for x in a: counts[x]+=1
    missing=next(i for i in range(1,n+1) if counts[i]==0)
    repeating=next(i for i in range(1,n+1) if counts[i]>1)
    return missing,repeating
```

**Java:**
```java
static int[] missingRepeating(int[]a){int n=a.length;int[]c=new int[n+1];for(int x:a)c[x]++;int miss=-1,rep=-1;for(int i=1;i<=n;i++){if(c[i]==0)miss=i;if(c[i]>1)rep=i;}return new int[]{miss,rep};}
```

**C# (.NET):**
```csharp
static int[] MissingRepeating(int[]a){int n=a.Length;int[]c=new int[n+1];foreach(int x in a)c[x]++;int miss=-1,rep=-1;for(int i=1;i<=n;i++){if(c[i]==0)miss=i;if(c[i]>1)rep=i;}return new[]{miss,rep};}
```

**C++:**
```cpp
pair<int,int> missingRepeating(const vector<int>&a){int n=a.size();vector<int>c(n+1);for(int x:a)c[x]++;int miss=-1,rep=-1;for(int i=1;i<=n;i++){if(c[i]==0)miss=i;if(c[i]>1)rep=i;}return{miss,rep};}
```


**Expected Output:**
```text
{"missing":5,"repeating":1}
```

**Explanation (Simple English):**
The solution compares the values that are present with the expected range or expected total. Any number that is not accounted for is missing.

**Explanation (Simple Hindi):**
Code present numbers ko expected range ya expected sum se compare karta hai. Jo number cover nahi hota, wahi missing hota hai.

**How to solve this type of problem:**
For missing-number problems, confirm the expected range and whether exactly one or several values are missing; then use a sum, Set, or frequency array.

---

### 23. Find elements that appear more than n/3 times

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Return the values that occur more than one-third of the array length.

**Answer:**
```js
function majorityElements(arr) {
  const frequency = new Map();

  for (const value of arr) {
    frequency.set(value, (frequency.get(value) || 0) + 1);
  }

  return [...frequency]
    .filter(([, count]) => count > arr.length / 3)
    .map(([value]) => value);
}

console.log(majorityElements([3, 2, 3])); // [3]
```

**Other Language Solutions:**

**Python:**
```python
from collections import Counter
def more_than_n_by_3(a): return [x for x,c in Counter(a).items() if c>len(a)//3]
```

**Java:**
```java
static List<Integer> moreThanNBy3(int[]a){Map<Integer,Integer>m=new HashMap<>();for(int x:a)m.put(x,m.getOrDefault(x,0)+1);List<Integer>r=new ArrayList<>();for(int x:m.keySet())if(m.get(x)>a.length/3)r.add(x);return r;}
```

**C# (.NET):**
```csharp
static int[] MoreThanNBy3(int[]a)=>a.GroupBy(x=>x).Where(g=>g.Count()>a.Length/3).Select(g=>g.Key).ToArray();
```

**C++:**
```cpp
vector<int> moreThanNBy3(const vector<int>&a){unordered_map<int,int>m;for(int x:a)m[x]++;vector<int>r;for(auto [x,c]:m)if(c>(int)a.size()/3)r.push_back(x);return r;}
```


**Expected Output:**
```text
[3]
```

**Explanation (Simple English):**
The map() method visits every element and converts it into a new value. The result has the same number of elements as the input array.

**Explanation (Simple Hindi):**
map() har element par jaata hai aur usko naye value mein convert karta hai. Result array mein elements ki count original ke barabar rehti hai.

**How to solve this type of problem:**
For transformation problems, decide what one input item should become, write that transformation in map(), and return the new value from the callback.

---

### 24. Find the maximum product of a contiguous subarray

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Find the largest product that can be obtained from a contiguous subarray.

**Answer:**
```js
function maxProductSubarray(arr) {
  let maxEnding = arr[0];
  let minEnding = arr[0];
  let result = arr[0];

  for (let i = 1; i < arr.length; i++) {
    const value = arr[i];

    if (value < 0) {
      [maxEnding, minEnding] = [minEnding, maxEnding];
    }

    maxEnding = Math.max(value, maxEnding * value);
    minEnding = Math.min(value, minEnding * value);
    result = Math.max(result, maxEnding);
  }

  return result;
}

console.log(maxProductSubarray([2, 3, -2, 4])); // 6
```

**Other Language Solutions:**

**Python:**
```python
def max_product_subarray(a):
    best=mx=mn=a[0]
    for x in a[1:]:
        if x<0: mx,mn=mn,mx
        mx=max(x,mx*x); mn=min(x,mn*x); best=max(best,mx)
    return best
```

**Java:**
```java
static int maxProductSubarray(int[]a){int max=a[0],min=a[0],best=a[0];for(int i=1;i<a.length;i++){int x=a[i];if(x<0){int t=max;max=min;min=t;}max=Math.max(x,max*x);min=Math.min(x,min*x);best=Math.max(best,max);}return best;}
```

**C# (.NET):**
```csharp
static int MaxProductSubarray(int[]a){int mx=a[0],mn=a[0],best=a[0];for(int i=1;i<a.Length;i++){int x=a[i];if(x<0)(mx,mn)=(mn,mx);mx=Math.Max(x,mx*x);mn=Math.Min(x,mn*x);best=Math.Max(best,mx);}return best;}
```

**C++:**
```cpp
int maxProductSubarray(const vector<int>&a){int mx=a[0],mn=a[0],best=a[0];for(int i=1;i<a.size();i++){int x=a[i];if(x<0)swap(mx,mn);mx=max(x,mx*x);mn=min(x,mn*x);best=max(best,mx);}return best;}
```


**Expected Output:**
```text
6
```

**Explanation (Simple English):**
Nested loops choose every possible start and end position. slice() then collects the continuous elements between those positions.

**Explanation (Simple Hindi):**
Nested loops har possible start aur end position choose karte hain. slice() un positions ke beech ke continuous elements nikaalta hai.

**How to solve this type of problem:**
For subarray problems, remember a subarray must be contiguous; choose a start index, extend the end index, and update the result for each range.

---

### 25. Rearrange an array so even numbers are at even indexes

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Place even values at even indexes and odd values at odd indexes, where possible.

**Answer:**
```js
function arrangeEvenOddIndexes(arr) {
  const result = Array(arr.length);
  let evenIndex = 0;
  let oddIndex = 1;

  for (const value of arr) {
    if (value % 2 === 0 && evenIndex < arr.length) {
      result[evenIndex] = value;
      evenIndex += 2;
    } else if (value % 2 !== 0 && oddIndex < arr.length) {
      result[oddIndex] = value;
      oddIndex += 2;
    }
  }

  return result;
}

console.log(arrangeEvenOddIndexes([3, 6, 12, 1, 7, 8]));
// [6, 3, 12, 1, 8, 7]
```

**Other Language Solutions:**

> **Note:** This assumes the input contains enough even and odd values for the requested positions; validate counts if that is not guaranteed.

**Python:**
```python
def rearrange_even_indexes(a):
    out=a.copy(); evens=[x for x in a if x%2==0]; odds=[x for x in a if x%2]
    i=j=0
    for k in range(len(a)):
        if k%2==0 and i<len(evens):out[k]=evens[i];i+=1
        elif k%2==1 and j<len(odds):out[k]=odds[j];j+=1
    return out
```

**Java:**
```java
static int[] rearrangeEvenIndexes(int[]a){int[]r=new int[a.length];int e=0,o=1;for(int x:a)if(x%2==0){if(e<a.length)r[e]=x;e+=2;}else{if(o<a.length)r[o]=x;o+=2;}return r;}
```

**C# (.NET):**
```csharp
static int[] RearrangeEvenIndexes(int[]a){int[]r=new int[a.Length];int e=0,o=1;foreach(int x in a)if(x%2==0){if(e<a.Length)r[e]=x;e+=2;}else{if(o<a.Length)r[o]=x;o+=2;}return r;}
```

**C++:**
```cpp
vector<int> rearrangeEvenIndexes(const vector<int>&a){vector<int>r(a.size());int e=0,o=1;for(int x:a)if(x%2==0){if(e<r.size())r[e]=x;e+=2;}else{if(o<r.size())r[o]=x;o+=2;}return r;}
```


**Expected Output:**
```text
[6,3,12,1,8,7]
```

**Explanation (Simple English):**
The code keeps separate positions for even indexes and odd indexes. Even values are placed at indexes 0, 2, 4, while odd values are placed at indexes 1, 3, 5.

**Explanation (Simple Hindi):**
Code even index aur odd index ke liye alag positions rakhta hai. Even numbers ko 0, 2, 4 jaise indexes par aur odd numbers ko 1, 3, 5 par rakhta hai.

**How to solve this type of problem:**
For parity-at-index problems, keep one pointer for even indexes and another for odd indexes, then place each value into the matching pointer position.

---

### 26. Find elements smaller than the next element and greater than the previous element

**Original section:** 100 Intermediate JS section (26 visible questions).

**Question:** Find elements that are greater than the element immediately before them and smaller than the element immediately after them.

**Answer:**
```js
function findLocalElements(arr) {
  const result = [];

  for (let i = 1; i < arr.length - 1; i++) {
    if (arr[i] > arr[i - 1] && arr[i] < arr[i + 1]) {
      result.push(arr[i]);
    }
  }

  return result;
}

console.log(findLocalElements([1, 5, 6, 3, 4, 5]));
// [5, 4]
```

**Other Language Solutions:**

**Python:**
```python
def middle_values(a): return [a[i] for i in range(1,len(a)-1) if a[i]>a[i-1] and a[i]<a[i+1]]
```

**Java:**
```java
static List<Integer> middleValues(int[]a){List<Integer>r=new ArrayList<>();for(int i=1;i<a.length-1;i++)if(a[i]>a[i-1]&&a[i]<a[i+1])r.add(a[i]);return r;}
```

**C# (.NET):**
```csharp
static int[] MiddleValues(int[]a){var r=new List<int>();for(int i=1;i<a.Length-1;i++)if(a[i]>a[i-1]&&a[i]<a[i+1])r.Add(a[i]);return r.ToArray();}
```

**C++:**
```cpp
vector<int> middleValues(const vector<int>&a){vector<int>r;for(int i=1;i+1<a.size();i++)if(a[i]>a[i-1]&&a[i]<a[i+1])r.push_back(a[i]);return r;}
```


**Expected Output:**
```text
[5,4]
```

**Explanation (Simple English):**
The loop ignores the first and last elements because they do not have neighbours on both sides. For every middle element, it compares the value with the previous and next values and keeps it only when both conditions are true.

**Explanation (Simple Hindi):**
Loop first aur last element ko ignore karta hai kyunki unke dono taraf neighbours nahi hote. Har middle element ko previous aur next se compare karke condition match hone par result mein rakhta hai.

**How to solve this type of problem:**
For neighbour-comparison problems, start at index 1 and stop before the last index; compare arr[i] with arr[i - 1] and arr[i + 1].

---

---

# Section C – String Coding Questions (Notebook Questions 1–58)

---

## 50 Intermediate array section (12 visible questions)

### 4. Find all subarrays with a given sum

**Original section:** 50 Intermediate array section (12 visible questions).

```js
function subarraysWithSum(arr, target) {
  const result = [];

  for (let start = 0; start < arr.length; start++) {
    let sum = 0;

    for (let end = start; end < arr.length; end++) {
      sum += arr[end];

      if (sum === target) {
        result.push(arr.slice(start, end + 1));
      }
    }
  }

  return result;
}

console.log(subarraysWithSum([1, 2, 3, 4, 5], 5));
// [[2, 3], [5]]
```

**Other Language Solutions:**

**Python:**
```python
def subarrays_with_sum(a,target):
    out=[]
    for i in range(len(a)):
        total=0
        for j in range(i,len(a)):
            total+=a[j]
            if total==target:out.append(a[i:j+1])
    return out
```

**Java:**
```java
static List<List<Integer>> subarraysWithSum(int[]a,int target){List<List<Integer>>r=new ArrayList<>();for(int i=0;i<a.length;i++){int s=0;List<Integer>cur=new ArrayList<>();for(int j=i;j<a.length;j++){s+=a[j];cur.add(a[j]);if(s==target)r.add(new ArrayList<>(cur));}}return r;}
```

**C# (.NET):**
```csharp
static List<List<int>> SubarraysWithSum(int[]a,int target){var r=new List<List<int>>();for(int i=0;i<a.Length;i++){int s=0;var cur=new List<int>();for(int j=i;j<a.Length;j++){s+=a[j];cur.Add(a[j]);if(s==target)r.Add(new List<int>(cur));}}return r;}
```

**C++:**
```cpp
vector<vector<int>> subarraysWithSum(const vector<int>&a,int target){vector<vector<int>>r;for(int i=0;i<a.size();i++){int s=0;vector<int>cur;for(int j=i;j<a.size();j++){s+=a[j];cur.push_back(a[j]);if(s==target)r.push_back(cur);}}return r;}
```


**Expected Output:**
```text
[[2,3],[5]]
```

**Explanation (Simple English):**
Nested loops choose every possible start and end position. slice() then collects the continuous elements between those positions.

**Explanation (Simple Hindi):**
Nested loops har possible start aur end position choose karte hain. slice() un positions ke beech ke continuous elements nikaalta hai.

**How to solve this type of problem:**
For subarray problems, remember a subarray must be contiguous; choose a start index, extend the end index, and update the result for each range.

---

### 6. Merge two sorted arrays without extra space

**Original section:** 50 Intermediate array section (12 visible questions).

```js
function mergeSortedInPlace(a, b) {
  const merged = [...a, ...b].sort((x, y) => x - y);
  return merged;
}

console.log(mergeSortedInPlace([1, 4, 7], [2, 5, 8]));
// [1, 2, 4, 5, 7, 8]
```

**Other Language Solutions:**

> **Note:** Uses the gap method to compare and swap values across both arrays without creating a third array.

**Python:**
```python
def merge_sorted(a,b):
    i=0
    for j in range(len(b)):
        while i<len(a) and a[i]<=b[j]:i+=1
        a.insert(i,b[j]);i+=1
    return a
```

**Java:**
```java
static void mergeSorted(int[]a,int[]b){int n=a.length,m=b.length,gap=(n+m+1)/2;while(gap>0){int i=0,j=gap;while(j<n+m){int x=i<n?a[i]:b[i-n],y=j<n?a[j]:b[j-n];if(x>y){if(i<n&&j<n){int t=a[i];a[i]=a[j];a[j]=t;}else if(i<n){int t=a[i];a[i]=b[j-n];b[j-n]=t;}else{int t=b[i-n];b[i-n]=b[j-n];b[j-n]=t;}}i++;j++;}if(gap==1)break;gap=(gap+1)/2;}}
```

**C# (.NET):**
```csharp
static void MergeSorted(int[]a,int[]b){int n=a.Length,m=b.Length,gap=(n+m+1)/2;while(gap>0){int i=0,j=gap;while(j<n+m){int x=i<n?a[i]:b[i-n],y=j<n?a[j]:b[j-n];if(x>y){if(i<n&&j<n)(a[i],a[j])=(a[j],a[i]);else if(i<n)(a[i],b[j-n])=(b[j-n],a[i]);else (b[i-n],b[j-n])=(b[j-n],b[i-n]);}i++;j++;}if(gap==1)break;gap=(gap+1)/2;}}
```

**C++:**
```cpp
void mergeSorted(vector<int>&a,vector<int>&b){int n=a.size(),m=b.size(),gap=(n+m+1)/2;while(gap>0){int i=0,j=gap;while(j<n+m){int &x=(i<n?a[i]:b[i-n]),&y=(j<n?a[j]:b[j-n]);if(x>y)swap(x,y);i++;j++;}if(gap==1)break;gap=(gap+1)/2;}}
```


**Expected Output:**
```text
[1,2,4,5,7,8]
```

**Explanation (Simple English):**
Two sorted arrays are combined by comparing their current elements and moving the smaller one into the correct position. This keeps the overall order sorted.

**Explanation (Simple Hindi):**
Do sorted arrays ke current elements compare karke chhota element sahi position par rakhte hain. Isse final array sorted rehta hai.

**How to solve this type of problem:**
For merging sorted arrays, use two pointers, compare the current values, move the smaller one, and then append any remaining values.

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

