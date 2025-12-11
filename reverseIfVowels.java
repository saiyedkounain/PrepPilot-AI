// 1. Reverse String If First and Last Characters Are Vowels

// (Custom LeetCode-style Problem)

// 📝Problem Statement

// Given a string s,check whether both the first and last characters of s are vowels.

// If both are vowels,then reverse only the characters between them(keep the first and last characters unchanged).

// If not,return the string unchanged.

// Vowels are:a,e,i,o,u,A,E,I,O,U.

// Return the resulting string.

// ✅Constraints

// 1≤s.length≤10^5

// s contains only alphabetic characters.

// Must run in O(n)time.

// 📘Examples Example 1

// Input:

// s="abcde"

// Explanation:

// First=a→vowel

// Last=e→vowel Reverse middle"bcd"→"dcb"Final string→"adcbe"

// Output:

// "adcbe"

// Example 2

// Input:

// s="acvbn"

// Explanation:First=a(vowel)Last=n(not a vowel)Condition fails→return original

// Output:

// "acvbn"

// Example 3

// Input:

// s="Etuilo"

// Explanation:First=E→vowel Last=o→vowel Middle"tuil"→reverse→"liut"Final→"Eliuto"
public class reverseIfVowels {
    public static boolean isVowel(char c) {
        return "AEIOUaeiou".indexOf(c) != -1;
    }

    public static String reverse(String str) {
        if (str == null || str.length() <= 1)
            return str;

        if (isVowel(str.charAt(0)) && isVowel(str.charAt(str.length() - 1))) {
            int n = str.length();
            char first = str.charAt(0);
            char last = str.charAt(n - 1);

            // middle part
            String midStr = str.substring(1, n - 1);
            char[] s = midStr.toCharArray();

            // reverse middle
            for (int i = 0; i < s.length / 2; i++) {
                char temp = s[i];
                s[i] = s[s.length - 1 - i];
                s[s.length - 1 - i] = temp;
            }

            // build answer
            StringBuilder sb = new StringBuilder();
            sb.append(first);
            sb.append(s); // append char[]
            sb.append(last);

            return sb.toString();
        } else {
            // condition fails → return original string unchanged
            return str;
        }
    }

    public static void main(String[] args) {
        System.out.println(reverse("abcde")); // adcbe
        System.out.println(reverse("acvbn")); // acvbn
        System.out.println(reverse("Etuilo")); // Eliuto
        System.out.println(reverse("ohello")); // ohellO or fail, depending on last char
    }
}
