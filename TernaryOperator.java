
import java.util.*;
public class TernaryOperator {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        System.out.println("enter thenumber");

        int number=sc.nextInt();
    

        // int number=8;
        // String result= number < 0 ? "nigative number": "positive number";
        // System.out.println(result);

        String result= number%2==0 ? "it is positive number" : "nigative number";
        System.out.println(result);


    }
}
