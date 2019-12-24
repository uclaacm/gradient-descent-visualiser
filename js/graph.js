'use strict'

let options = {
    target: '#graph-1',
    title: "set up your gradient descent!",
    xAxis: {
        label: 'x - axis',
        domain: [-6, 6]
    },
    yAxis: {
        label: 'y - axis',
        domain: [-1, 36]
    },
    data: [
        {
            fn: 'x^2',
            derivative: {
                fn: '2 * x',
                x0: 2
            }
        }
    ]
}

let started = false;
let currentPos = 0;
let iter = 1;

let inputFunc;
let compiledFunc;
let derivative;

const badJSONDeepCopy = obj => {
    return JSON.parse(JSON.stringify(obj))
}

const redrawPlot = (fn, deriv, evalAt, pointsDiff = undefined) => {
    console.log("redraw")

    // strange quirk to force a title rerender
    delete options.title;
    functionPlot(options);

    options.title = "iteration " + iter;
    console.log(options.title)
    options.data[0].fn = fn;
    options.data[0].derivative = {
        fn: deriv,
        x0: evalAt
    }
    if (pointsDiff !== undefined){
        if (options.data.length === 1){
            options.data.push(
                {
                    points: [pointsDiff],
                    fnType: 'points',
                    graphType: 'scatter'
                }
            );
        }
        else{
            options.data[1].points.push(pointsDiff);
        }
    }
    
    functionPlot(options);
}

const updatePos = (current, learning) => {
    console.log(-1 * derivative.evaluate({x: current}) * learning)
    return current + (-1 * derivative.evaluate({x: current}) * learning);
}

document.getElementById("start-button").addEventListener("click", () => {
    console.log("start")
    if (started) { return; }
    let inputEval = document.getElementById("initial-start").value;
    let evalAt = Number(inputEval);
    if (isNaN(evalAt)){ return; }

    started = true;

    currentPos = evalAt;
    document.getElementById("current-pos").innerHTML = evalAt;

    inputFunc = document.getElementById("function-input").value;
    compiledFunc = math.compile(inputFunc);
    
    derivative = math.derivative(inputFunc, 'x');
    redrawPlot(inputFunc, derivative.toString(), currentPos, [currentPos, compiledFunc.evaluate({x: currentPos})]);
});

document.getElementById("update-button").addEventListener("click", () => {
    console.log("update")
    if (!started) { return; }
    let learningRate = document.getElementById("learning-rate").value;
    if (isNaN(learningRate)) { return; }

    iter = iter + 1;
    currentPos = updatePos(currentPos, learningRate)
    
    document.getElementById("current-pos").innerHTML = currentPos;
    redrawPlot(inputFunc, derivative.toString(), currentPos, [currentPos, compiledFunc.evaluate({x: currentPos})]);
});

functionPlot(options);