import java.util.Scanner;

public class Switch {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        // System.out.println("enter the item");
        // int item=sc.nextInt();
        // switch(item){
        //     case 1 -> System.out.println("tea is ready");

        //     case 2 -> System.out.println("coffee is ready");

        //     case 3 -> System.out.println("milk is ready");

        //     default -> System.out.println("invalid input");
        // }

        // using the string

        System.out.println("enter the day");
        String day=sc.nextLine();
        switch(day){
            case "sunday"     -> System.out.println("casual dress");
            case "monday"     -> System.out.println("black dress");
            case "tuseday"    -> System.out.println("blue dress");
            case "wednesday"  ->System.out.println("purple dress");
            case "thursday"   -> System.out.println("white dress");
            case "friday"     -> System.out.println("dark purple dress");
            case "saturday"   -> System.out.println("black T shirt");
            default -> System.out.println("invalid input");
        

            
        }


        
    }
}
