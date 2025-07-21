// Hoisting is a JavaScript behavior where function declarations and
//  variable declarations are moved to the top of their scope before code execution.



let x=add(1,2);
console.log(x);
function add(a, b) {
    return a + b;
    }
    console.log(x);
    

// Temporal Dead Zone (TDZ) is a behavior in JavaScript where variables
//  declared with `let` and `const` cannot be accessed before their 
// declaration in the code. This means that if you try to access a variable 
// before it has been declared, you will get a ReferenceError.

function testVar() {
    console.log(x); // undefined
    var x = 5;
    console.log(x); // 5
}

function testLet() {
    console.log(y); // ❌ ReferenceError
    let y = 5;
    console.log(y); // not reached
}

function testConst(){
    console.log(x);
    const x=5;
    console.log(x);
}
try {
    testVar();
    testLet();
    testConst();
} catch (err) {
    console.error("Error caught:", err.message);
}

const obj = {
    name: "prinshu",
    age: 20,
    greet: function () {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }
};

try {
    console.log(obj.height);
    obj.greet();            
}
catch (err) {
    console.error("Error caught:", err.message);
}
finally {
    console.log(obj?.height); 
}
 
function Outer(){
    var y=10;
    console.log("Inside Outer function");
    let x=0;
    function Inner(){
        console.log("Inside Inner function");
        x++;
        console.log("Value of x:", x);

       
    }
    return Inner;

   

}
let counter = Outer();
for(let i=0;i<5;i++){
    counter();
}


(
function outerFunction() {
    console.log("Function is called when it is defined");
}
)();