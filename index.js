numOfBtn = document.querySelectorAll(".btn").length;
for (var i = 0; i < numOfBtn; i++) {
    document.querySelectorAll(".btn")[i].addEventListener("click", function () {
        if (this.innerHTML === "=") {
            infixToPostfix();
        }
        else if (this.innerHTML === "Clear") {
            document.querySelector(".text-field>input").value = "";
        }
        else {
            document.querySelector(".text-field>input").value += this.innerHTML;
        }
    });
}
document.addEventListener("keydown", function (event) {
    var operator = ['+', '-', '*', '/', '^'];
    var key = event.key;
    if (key === "Enter") {
        infixToPostfix();
    }
    else if (key === 'Backspace') {

        document.querySelector(".text-field>input").value = document.querySelector(".text-field>input").value.slice(0, -1);
    }
    else if ((/\d/.test(key)) || operator.includes(key)) {
        document.querySelector(".text-field>input").value += key

    }
    // document.addEventListener("keydown", function (event) { console.log(key) });
})
function isOperator(char) {
    return ['+', '-', '*', '/', '^'].includes(char);
}

function getPrecedence(operator) {
    switch (operator) {
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
            return 2;
        case '^':
            return 3;
        default:
            return 0;
    }
}

function infixToPostfix() {
    var expression = document.querySelector(".text-field>input").value;
    var output = '';
    var stack = [];

    // Helper function to check if a character is a digit or decimal point
    function isDigitOrDecimalPoint(char) {
        return /\d|\./.test(char);
    }

    // Helper function to parse a number from the expression
    function parseNumber(index) {
        var number = '';
        while (index < expression.length && isDigitOrDecimalPoint(expression[index])) {
            number += expression[index];
            index++;
        }
        return number;
    }

    for (var i = 0; i < expression.length; i++) {
        var char = expression[i];

        if (char === ' ') {
            continue;
        } else if (isOperator(char)) {
            while (
                stack.length > 0 &&
                isOperator(stack[stack.length - 1]) &&
                getPrecedence(char) <= getPrecedence(stack[stack.length - 1])
            ) {
                output += stack.pop() + ' ';
            }
            stack.push(char);
        } else if (char === '(') {
            stack.push(char);
        } else if (char === ')') {
            while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                output += stack.pop() + ' ';
            }
            stack.pop(); // Discard the '(' symbol
        } else if (isDigitOrDecimalPoint(char)) {
            const number = parseNumber(i);
            output += number + ' ';
            i += number.length - 1;
        } else {
            throw new Error('Invalid character: ' + char);
        }
    }

    while (stack.length > 0) {
        output += stack.pop() + ' ';
    }

    evaluatePostfix(output.trim());
}

function evaluatePostfix(expression) {
    var stack = [];

    for (var i = 0; i < expression.length; i++) {
        var char = expression[i];

        if (char === ' ') {
            continue;
        } else if (!isNaN(parseFloat(char))) {
            var number = '';
            while (i < expression.length && (char === '.' || !isNaN(parseFloat(char)))) {
                number += char;
                i++;
                char = expression[i];
            }
            stack.push(parseFloat(number));
        } else {
            const operand2 = stack.pop();
            const operand1 = stack.pop();

            var result;

            switch (char) {
                case '+':
                    result = operand1 + operand2;
                    break;
                case '-':
                    result = operand1 - operand2;
                    break;
                case '*':
                    result = operand1 * operand2;
                    break;
                case '/':
                    result = operand1 / operand2;
                    break;
                case '^':
                    result = Math.pow(operand1, operand2);
                    break;
                default:
                    throw new Error('Invalid operator');
            }

            stack.push(result);
        }
    }

    document.querySelector(".text-field>input").value = stack.pop();
}

