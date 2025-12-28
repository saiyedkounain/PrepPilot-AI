import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Scanner;

public class RSA {

    private static BigInteger p, q, n, phi, e, d;
    private static final SecureRandom random = new SecureRandom();

    private static void generateKeys() {
        p = BigInteger.probablePrime(512, random);
        q = BigInteger.probablePrime(512, random);

        n = p.multiply(q);
        phi = p.subtract(BigInteger.ONE).multiply(q.subtract(BigInteger.ONE));

        e = BigInteger.valueOf(65537);
        while (!phi.gcd(e).equals(BigInteger.ONE)) {
            e = e.add(BigInteger.TWO);
        }

        d = e.modInverse(phi);
    }

    // Encrypt → Base36
    private static String encrypt(String text) {
        StringBuilder cipher = new StringBuilder();

        for (char ch : text.toCharArray()) {
            BigInteger m = BigInteger.valueOf((int) ch);
            BigInteger c = m.modPow(e, n);

            cipher.append(c.toString(36)).append(" ");
        }
        return cipher.toString().trim();
    }

    // Decrypt ← Base36
    private static String decrypt(String cipherText) {
        StringBuilder plain = new StringBuilder();
        String[] parts = cipherText.split(" ");

        for (String part : parts) {
            BigInteger c = new BigInteger(part, 36);
            BigInteger m = c.modPow(d, n);
            plain.append((char) m.intValue());
        }
        return plain.toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        generateKeys();

        while (true) {
            System.out.println("\nRSA Cipher");
            System.out.println("1. Encrypt");
            System.out.println("2. Decrypt");
            System.out.println("0. Exit");
            System.out.print("Choice: ");

            int choice = sc.nextInt();
            sc.nextLine();

            if (choice == 0)
                break;

            if (choice == 1) {
                System.out.print("Enter plain text: ");
                String plain = sc.nextLine();
                System.out.println("Cipher Text:");
                System.out.println(encrypt(plain));

            } else if (choice == 2) {
                System.out.print("Enter cipher text: ");
                String cipher = sc.nextLine();
                System.out.println("Plain Text:");
                System.out.println(decrypt(cipher));

            } else {
                System.out.println("Invalid choice");
            }
        }
        sc.close();
    }
}
