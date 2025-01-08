 import java.util.*;

 public class StringInput {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);  
        System.out.println("Enter first name:");

        String name1 = sc.nextLine();  

        
        if (name1.equalsIgnoreCase("sachin")) {
            System.out.println("Right hand batsman");
        } else if (name1.equalsIgnoreCase("saurav")) {
            System.out.println("Left hand batsman");
        } else {
            System.out.println("Name not recognized");
        }

        
    }
}

