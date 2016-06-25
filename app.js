//init stuff
//var deep = require('deep-diff');
var genetic = Genetic.create();

var myReport = [];

function pr(x) {
    console.log( JSON.stringify(x));
}

var root = [-
	{
		"id": "0001",
		"type": "donut",
		"name": "Cake",
		"ppu": 0.55,
		"batters":
			{
				"batter":
					[
						{ "id": "1001", "type": "Regular" },
						{ "id": "1002", "type": "Chocolate" },
						{ "id": "1003", "type": "Blueberry" },
						{ "id": "1004", "type": "Devil's Food" }
					]
			},
		"topping":
			[
				{ "id": "5001", "type": "None" },
				{ "id": "5002", "type": "Glazed" },
				{ "id": "5005", "type": "Sugar" },
				{ "id": "5007", "type": "Powdered Sugar" },
				{ "id": "5006", "type": "Chocolate with Sprinkles" },
				{ "id": "5003", "type": "Chocolate" },
				{ "id": "5004", "type": "Maple" }
			]
	},
	{
		"id": "0002",
		"type": "donut",
		"name": "Raised",
		"ppu": 0.55,
		"batters":
			{
				"batter":
					[
						{ "id": "1001", "type": "Regular" }
					]
			},
		"topping":
			[
				{ "id": "5001", "type": "None" },
				{ "id": "5002", "type": "Glazed" },
				{ "id": "5005", "type": "Sugar" },
				{ "id": "5003", "type": "Chocolate" },
				{ "id": "5004", "type": "Maple" }
			]
	},
	{
		"id": "0003",
		"type": "donut",
		"name": "Old Fashioned",
		"ppu": 0.55,
		"batters":
			{
				"batter":
					[
						{ "id": "1001", "type": "Regular" },
						{ "id": "1002", "type": "Chocolate" }
					]
			},
		"topping":
			[
				{ "id": "5001", "type": "None" },
				{ "id": "5002", "type": "Glazed" },
				{ "id": "5003", "type": "Chocolate" },
				{ "id": "5004", "type": "Maple" }
			]
	}
]

var target = {

};


function makeString(){

}

//#end function

//each function f(x)()
// compose ( map(f(g(struct)))  )

var stringStore = (function(){
	allKeys().length
});

var numberStore = (function(){
	return Math.random();
});



//i is index of iteration
function resolveFitness(obj , i ){
    // TODO some function of difference between data structure
    var diff = deep(obj, target);
	if(!_.isNil(diff)){      // TODO some function of diff 
		return diff.length;  // maybe complex distance ? 
	}else{
		return 0;
	}
} 


genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Tournament2;
genetic.select2 = Genetic.Select2.FittestRandom;

function allKeys(){
    return  _.chain(dataset).keysIn().uniq().value();
}

// { input: ['Array', 'function'], func: map, output: 'Array', arity:2  },
//     { input: ['object','string'], func: dot, output: 'object' , arity:2  },
//     { input: ['Array','function'], func: forEach, output: 'Array', arity:2   },
// 	{ input: ['Array','function'], func: reduce, output: 'Object', arity:2   },
//fitness function
//My types
//object
//Number
//Array
//string
//bool
//Tree Comparer
var typed = [
    //Functional
	{ input: [ ['object', 'Array'], 'Array'], func: map, T: ['Any'],  output: 'Array', arity:2  },
    { input: ['object','string'], func: dot, T: ['Any'],output: 'object' , arity:2  },
    { input: ['function', 'Array'], func: forEach, T: ['Any'], output: 'Array', arity:2   },
	//{ input: ['function', 'Array'], func: reduce, output: 'Object', arity:2   },
	{ input: ['function', 'Array'], func: filter, T: ['Any'], output: 'Array', arity:2   },
	//generation
	{ input: ['object'], func:identity , T: [], output: 'object', arity:1 },
	{ input:[] , func:stringStore, T: [], output:'string', arity:0 },
	{ input:[] , func:numberStore, T: [], output:'Number' , arity: 0},
	//MATH
	//{ input: ['object','object'], func: equals, output: 'bool', arity:2  },
	//**{ input: ['object','object'], func: If, output: 'bool', arity:2  },

    { input: ['Number','Number'], func: add, T: [], output: 'Number', arity:2  },
    { input: ['Number','Number'], func: divide, T: [], output: 'Number', arity:2  },
    { input: ['Number','Number'], func: multiply, T: [], output: 'Number', arity:2  },
]
//Object -> Nary tree

function last(xs){ return xs[xs.length - 1]; };

function typeFilter(x, type){return (x['arity'] > 0) && (last(x['input']) === type || last(x['input']) === 'Any') ;  } ;

function randomX(xs){ return xs[Math.floor(Math.random() * xs.length)]; };

function funcOfSignature(inputType){return randomX(typed.filter(x => typeFilter(x, inputType))); };

//OMG BAD CODE!!!!! lolz yo.
//genes -> array of functions.  
genetic.seed = function(){
  	console.log('hello');
    var c = [];
	var l = typed.length;
	var arity = 0;
    var inputType = 'Array';		// initial structure type. shud be user input or autodetect
    //construct tree of types of functions with compatible types. 
    for (i=0; i< 4;++i) {
		//get a function with valid input signature
		var validFunction = funcOfSignature(inputType);
		arity = validFunction.arity;
		inputType = validFunction.output;  
		c.push(validFunction);
		pr(c);
		while(arity > 1){
			arity = arity - 1;
			c.concat(GenerateSubFuncs(validFunction, arity, inputType));
			pr(c);
		}
	}
    return c;
};

genetic.seed();

function GenerateSubFuncs(func, arityRemaining, inputType){
	var nextInput = func.input[arityRemaining]
	//if(nextInput === 'function'){
	if(func.T !== [] ){
		pr(func.T);
	}
	if(typeof (nextInput) === Array){
		//push subfunctions to array
		return funcOfSignature(func.subPut);
	}else{
		return funcOfSignature(nextInput);
	}
}

//metaFunc is a function//
//chrmsm is an array of functions
function popFunc(metaFunc, chrmsm){

	//gene is a function!!
	var resultFunc = {};
	var gene = chrmsm.pop();
	if(metaFunc.arity > 1 ){
		return popFunc(gene, chrmsm);
	}else if(metaFunc.arity ===1){
		return compose(metaFunc, gene)
	}else if(metaFunc.arity === 0){
		var exec = gene.func();

	}
	return gene;
}

genetic.fitness = function(chrmsm){
    var fitness = 0;
    var prev = {};
    var struct = _.cloneDeep(root);
	//var i = 0;
	while(chrmsm.length > 0){
		popFunc(chrmsm);
		
	}

    for(var i = 0; chrmsm.length; i++){
        var func = chrmsm[i].func;
        var param = chrmsm[i].input
		//Executre the function 
		//awaited tree
		//func (x2 , x1 ) (inp)
		//func (x1) (inp)
		//func (inp)
        var newstruct = func()(struct);
		//Consequences
        if(typeof struct !== chrmsm[i].output){
            myReport.push("type mismatch");
            //idk how to handle this at this time
        }
        if(struct !== undefined){
            //resolve previous fitness       
            fitness = resolveFitness(chrmsm, i);
        }else{

        }
    }
    return fitness;
}

genetic.mutate = function(entity){
    // allow chromosomal drift with this range (-0.05, 0.05)
	var drift = ((Math.random()-0.5)*2)*0.05;
	var i = Math.floor(Math.random()*entity.length);
	entity[i] += drift;
	return entity;
}

//DONE - LEVEL 1
genetic.crossover = function(mother, father){
    // two-point crossover
	function grouper(entity){
		for(var i = 0; entity.length; i++){
			//if(arity )

		}
	}

    var son = [];
    var daughter = [];
	for(var i = 0; mother.length; i++){
        if(Math.random() < crossover){
            son.push(mother[i]);
            daughter.push(father[i]);
        }else{
            son.push(father[i]);
            daughter.push(mother[i]);
        }
    }
	return [son, daughter];
}

genetic.generation = function(pop, generation, stats){

}


genetic.notification = function(pop, generation, stats, isFinished) {

	// function lerp(a, b, p) {
	// 	return a + (b-a)*p;
	// }
	
	// var value = pop[0].entity;
	// this.last = this.last||value;
	
	// if (pop != 0 && value == this.last)
	// 	return;
	
	
	// var solution = [];
	// var i;
	// for (i=0;i<value.length;++i) {
	// 	var diff = value.charCodeAt(i) - this.last.charCodeAt(i);
	// 	var style = "background: transparent;";
	// 	if (diff > 0) {
	// 		style = "background: rgb(0,200,50); color: #fff;";
	// 	} else if (diff < 0) {
	// 		style = "background: rgb(0,100,50); color: #fff;";
	// 	}

	// 	solution.push("<span style=\"" + style + "\">" + value[i] + "</span>");
	// }
	
	// var buf = "";
	// buf += "<tr>";
	// buf += "<td>" + generation + "</td>";
	// buf += "<td>" + pop[0].fitness.toPrecision(5) + "</td>";
	// buf += "<td>" + solution.join("") + "</td>";
	// buf += "</tr>";
	// $("#results tbody").prepend(buf);
	
	// this.last = value;
};
