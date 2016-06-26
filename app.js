//init stuff
//var deep = require('deep-diff');
var genetic = Genetic.create();

var mlog = [];
function log(x){
	mlog.push(x);
}


function prS(x){return console.log(x.toString()) ; };

function pr(x) {
	//forKeys(prS, x);
	//if(x['func']){console.log(x['func'].toString())}
	
    console.log( JSON.stringify(x));
}

//#end function 
function resolveFitness(obj , i ){
    // TODO some function of difference between data structure
    var diff = deep(obj, target);
	if(!_.isNil(diff)){      // TODO some function of diff 
		return diff.length;  // maybe complex distance ? 
	}else{
		return 0;
	};
};

genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Tournament2;
genetic.select2 = Genetic.Select2.FittestRandom;

function last(xs){ return xs[xs.length - 1]; };

//OMG BAD CODE!!!!! lolz yo.
//genes -> array of functions.  
genetic.seed = function(){
    var c = [];
	var l = typed.length;
	var arity = 0;
    var inputType = 'Array';				// initial structure type. shud be user input or autodetect
    for (i=0; i< 4;++i) {
							//construct tree of types of functions with compatible types. 
		var validFunction = funcOfSignature(inputType); //get a function with valid input signature
		report(validFunction, validFunction.arity, inputType);
		c = c.concat(reduceArity(validFunction ));
	}
	pr(c.map(x=> x.n));
    return c; 
};


// genetic.seed = function(){
//     var c = [];
// 	var l = typed.length;
// 	var arity = 0;
//     var inputType = 'Array';				// initial structure type. shud be user input or autodetect
//     for (i=0; i< 4;++i) {					//construct tree of types of functions with compatible types. 
// 		var validFunction = funcOfSignature(inputType); //get a function with valid input signature
// 		c = c.concat(reduceArity(validFunction, inputType ));
// 	}
// 	pr(c.map(x=> x.n));
//     return c; 
// };
//take valid function
//F: if arity > 1 
	//find valid function to fill slot
	//new return funcs, and newType

genetic.seed(); 
 
function report(x, arity, inp){
	pr('input : ' + x.input +', search subfunc w/input : ' + arity + ' - ' + inp);
}


function reduceArity(validFunction){
	var c =  [ validFunction ];
	var inputType = [];
	if(validFunction.output === 'function'){
		inputType = validFunction.T;
	}else{
		inputType = validFunction.output;
	}
	var arity = validFunction.arity;			
	pr('func : ' + validFunction.n);
	
	while(arity > 0){
		report(validFunction, arity, inputType);
		var subfunc = funcOfSignature(inputType, arity);
		pr(subfunc);
		if(subfunc.input.length === 0 ){
			c.push(subfunc());
		}else{
			c.push(subfunc);
		}
		// if(subfunc.arity > 1){
		// 	c.concat(reduceArity(subfunc));
		// }
		arity --;
		report(subfunc, arity, subfunc.output )
	};
	pr('---------------------------');
	return c;
};

function funcOfSignature(inputType, arity){
	var res ;
	// if(inputType.indexOf('Any') !== -1){  
	// 	res = _.sample(typed.filter(x => x.input.length > 0)); 
	// }else{
	// 	res = _.sample(typed.filter(x => typeFilter(x, inputType)));
	// }

	return _.sample(typed.filter(x => typeFilter(x, inputType)));
 };
 function typeFilter2(x, type){
	return (last(x['input']) === type); 
} ; 

function typeFilter(x, type){
	return (_.difference(_.takeRight((x['input']) , type.length -1 ), type).length === 0); 
} ;
// function reduceArity(validFunction){
// 	var c =  [];
// 	arity = validFunction.arity;			
// 	inputType = validFunction.output;  //new input type 
// 	c.push(validFunction);
// 	pr('func : ' + validFunction.n);
// 	while(arity > 0){
// 		report(validFunction, arity, inputType);			//reoort
// 		var subfunc = funcOfSignature(arity);	
// 														//recreate input array
// 		//var subfunc = GenerateSubFunc(validFunction, arity, inputType); //pick func with signature of current input
// 															//subfunc can eliminate 1 or more args
// 		c.concat(reduceArity(subfunc));
// 		arity --;	
// 		//pr(c.map(x=> x.n));
// 	};
// 	pr('---------------------------');
// 	return c;
// };

function GenerateSubFunc(func, arityRemaining, inputType){
	var nextInput = func.input[arityRemaining];	
	if(func.T.length > 0 ){					//if the func has a T value, it is new argument
		pr('T : ' +func.T);
											//new input array 					
		return funcOfSignature(func.T)
	}else{
		return funcOfSignature(nextInput); 
	};
};




function randomX(xs){ 
	return xs[Math.floor(Math.random() * xs.length)]; 
};

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
};

genetic.fitness = function(chrmsm){
    var fitness = 0;
    var prev = {};
    var struct = _.cloneDeep(root);
	//var i = 0;
	while(chrmsm.length > 0){
		popFunc(chrmsm);
	};

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
