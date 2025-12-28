import java.util.HashMap;
import java.util.Map;

public class romanToInt {
    public static void main(String[] args) {
        Map<String, Integer> normal = new HashMap<>();
        normal.put("I",1);
        normal.put("V",5);
        normal.put("X",10);
        normal.put("L",50);
        normal.put("C",100);
        normal.put("D",500);
        normal.put("M",1000);

        Map<String, Integer> exceptions = new HashMap<>();

        exceptions.put("IV", 4);
        exceptions.put("IX", 9);
        exceptions.put("XL", 40);
        exceptions.put("XC", 90);
        exceptions.put("CD", 400);
        exceptions.put("CM", 900);

        
    }
}
