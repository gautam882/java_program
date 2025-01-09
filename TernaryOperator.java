
import java.util.*;
public class TernaryOperator {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        // System.out.println("enter thenumber");

        // int number=sc.nextInt();
    

        // // int number=8;
        // // String result= number < 0 ? "nigative number": "positive number";
        // // System.out.println(result);

        // String result= number%2==0 ? "it is positive number" : "nigative number";
        // System.out.println(result);

        // voting criterea

        // System.out.println("enter the age of student");

        // int age=sc.nextInt();

        // String  result1=age>18? "elegible for vote":"not elegible for vote";
        // System.out.println(result1);

        // multiple condition in ternary operator
        System.out.println("enter the number");
        int num2=sc.nextInt();
        String result2= num2<0? "nigative number":num2>0? "psitive number":"invalid number";
        System.out.println(result2);



    }

}
