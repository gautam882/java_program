
import java.util.*;
class Condition{
    
    
    public static void main(String[] args) {
        int age=3;
        if(age<=18){
            // System.out.println("not elegible for the vote");

        }
        else{
            // System.out.println("elegible for vote");
        }

        // use of else if

        if(age<=5){
            System.out.println("you are a child");
        }
        else if(age>5&&age<=12){
            System.out.println("you are adolance");
        }
        else if(age>=13&&age<=19){
            System.out.println("you are teenager");
        }
        else{
            System.out.println("you can vote");
        }

        // Student grade using if else


        int chemesty=55;
        int physics=64;
        int biology=56;
        int math=54;
        int english=58;
        int marathi=50;
        int sum=chemesty+physics+biology+math+english+marathi;
        float percentage=sum/6;
        System.out.println("percentage are " +percentage);

        if(percentage<35){
            System.out.println("FAIL");
        }
        else if(percentage>=35&&percentage<=50){
            System.out.println("PASS CLASS");
        }
        else if(percentage>50&&percentage<=55){
            System.out.println(" second class");
        }
        else if(percentage>55&&percentage<=60){
            System.out.println("higher second class");
        }
        else if(percentage>60&&percentage<=70){
            System.out.println("first class");
        }
        else{
            System.out.println("Distinction");
        }

        // Taking input from user
        Scanner sc=new Scanner(System.in);
        System.out.println("enter the number");
        int num1=sc.nextInt();
        if(num1>=0){
            System.out.println("positive number");
        }
        else{
            System.out.println("nigative number");
        }


        System.out.println("enter the name of player");
       String name1=sc.nextLine();
       String name2=sc.nextLine();

       if(name1.equals("sachin")){
         System.out.println(name1 + "was a great cricketer");
       }
       else if(name2.equals("saurav")){
         System.out.println(name2 + "good left handed batsman");
       }
       else{
         System.out.println("invalid input");
       }




        


    }
}