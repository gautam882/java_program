public class Function {

    static void printMyName(String name,String sname){
         System.out.println("my name is "+ name);
         System.out.println("my sirname is "+ sname);

    }

    static int sum(int num1,int num2){
        int result=num1+num2;
        System.out.println(result);
        return result;

    }
    public static void multi(int a,int b){
        int result=a*b;
        
        System.out.println(result);
    }
    static  void operation(int a,int b){
        int sum=a+b;
        int sub=a-b;
        int multi=a*b;
        int division=a/b;
        int module=a%b;
        System.out.println("sum is " +sum);
        System.out.println("subtraction  " +sub);
        System.out.println("multiplication is " +multi);
        System.out.println("division is " +division);
        System.out.println("module is " +module);
    }
    // String return function

    static String animal(String name1,String name2){
        return "hello "+ name1+name2;
    }

    public static void main(String[] args) {
        printMyName("gautam","gaikwad");
        sum(34,78);
        sum(12,78);
        sum(56,76);
        sum(349,780);
        multi(12,5);
        multi(16,9);
        multi(12,6);
        operation(45, 7);
    String result=animal("Gautam","gaikwad");
    System.out.println(result);
        

        

        
    }
}
