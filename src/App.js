import React, { useState } from "react";

import {
    Button
} from "./Components/Button";
import {
    Screen
} from "./Components/Screen";
import {
    Wrapper
} from "./Components/Wrapper";
import {
    ButtonBox
} from "./Components/ButtonBox";


const button_values = [
    ["C", "+/-", "%", "/"],
    [7, 8, 9, "X"],
    [4, 5, 6, "-"],
    [1, 2, 3, "+"],
    [0, ".", "="],
];

/* toLocaleString is used to make my output in form of million thousand format */ 
const toLocaleString = number => String(number).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

/* removeSpaces remove space from those and helps in evaluation */ 
const removeSpaces = number => String(number).replace(/\s/g, "");

/** Math Function for calculation */
const math = (y, z, symb) => symb === "+" ? y + z : symb === "-" ? y - z : symb === "X" ? y * z : y / z;

/* Division error handling */
const zeroDivisionError = "Oops! it's imposible to divide with 0";


const App = () => {
  /** Using useState hook for having state in App functional component */
    let [calc, setCalc] = useState({
        symb: "",
        number: 0,
        res: 0,
    });

    const numberClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        if (removeSpaces(calc.number).length < 16) {
            setCalc({
                ...calc,
                number:
                    removeSpaces(calc.number) % 1 === 0 && !calc.number.toString().includes(".")
                        ? toLocaleString(Number(removeSpaces(calc.number + value)))
                        : toLocaleString(calc.number + value),
                res: !calc.symb ? 0 : calc.res,
            });
        }
    };

    const comaClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        setCalc({
            ...calc,
            number: !calc.number.toString().includes(".") ? calc.number + value : calc.number,
        });
    };

    const symbClickHandler = (e) => {
        setCalc({
            ...calc,
            symb: e.target.innerHTML,
            res: !calc.number
                ? calc.res
                : !calc.res
                    ? calc.number
                    : toLocaleString(
                        math(
                            Number(removeSpaces(calc.res)),
                            Number(removeSpaces(calc.number)),
                            calc.symb
                        )
                    ),
            number: 0,
        });
    };

    const equalsClickHandler = () => {
        if (calc.symb && calc.number) {
            setCalc({
                ...calc,
                res:
                    calc.number === "0" && calc.symb === "/"
                        ? zeroDivisionError
                        : toLocaleString(
                            math(
                                Number(removeSpaces(calc.res)),
                                Number(removeSpaces(calc.number)),
                                calc.symb
                            )
                        ),
                symb: "",
                number: 0,
            });
        }
    };

    const invertClickHandler = function () {
        setCalc({
            ...calc,
            number: calc.number ? toLocaleString(removeSpaces(calc.number) * -1) : 0,
            res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
            symb: "",
        });
    };
    const percentClickHandler = function () {
        let number = calc.number ? parseFloat(removeSpaces(calc.number)) : 0;
        let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;
        setCalc({
            ...calc,
            number: (number /= Math.pow(100, 1)),
            res: (res /= Math.pow(100, 1)),
            symb: "",
        });
    };
    const resetClickHandler = function () {
        setCalc({
            ...calc,
            symb: "",
            number: 0,
            res: 0,
        });
    };

    /** This function is send to every button as a prop and it triggers a button the basis of value of button */
    const buttonClickHandler = (e, btn) => {
        btn === "C" || calc.res === zeroDivisionError
            ? resetClickHandler()
            : btn === "+/-"
                ? invertClickHandler()
                : btn === "%"
                    ? percentClickHandler()
                    : btn === "="
                        ? equalsClickHandler()
                        : btn === "/" || btn === "X" || btn === "-" || btn === "+"
                            ? symbClickHandler(e)
                            : btn === "."
                                ? comaClickHandler(e)
                                : numberClickHandler(e)
    }

    return (
        <Wrapper>
            <Screen value={calc.number ? calc.number : calc.res} />
            <ButtonBox>
                {button_values.flat().map((btn, i) => {
                    return (
                        <Button
                            key={i}
                            className={btn === "=" ? "equals" : ""}
                            value={btn}
                            onClick={(e) => buttonClickHandler(e, btn)}
                        />
                    );
                })}
            </ButtonBox>
        </Wrapper>
    );
};

export default App;