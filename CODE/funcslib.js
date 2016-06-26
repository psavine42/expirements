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
function allKeys(ds){
    return  _.chain(ds).keysIn().uniq().value();
};

var stringStore = (function(){
	var itm = _.sample(allKeys());
});

var numberStore = (function(){
	return Math.random();
});

//Object.prototype.

var typed2 = [
    //Functional
	{ input: [ 'function', 'Array'], n:'map', func: map, T: ['Any'],  output: 'Array', arity:2  },
    { input: ['object','string'], n:'dot', func: dot, T: ['Any'],output: 'object' , arity:2  },
    { input: ['function', 'Array'], n:'forEach', func: forEach, T: ['Any'], output: 'Array', arity:2   },
	{ input: ['function', 'Array'],n:'reduce',func: reduce,T: ['Any','Any'], output: 'Object', arity:2   },
	{ input: ['function', 'Array'], n:'filter', func: filter, T: ['Any'], output: 'Array', arity:2   },
	//generation
	{ input: ['object'], n:'identity',func:identity , T: [], output: 'object', arity:1 },
	{ input:[] ,n:'stringStore',func:stringStore, T: [], output:'string', arity:0 },
	{ input:[] , n:'numberStore',func:numberStore, T: [], output:'Number' , arity: 0},
	//MATH
	{ input: ['Any','Any'], func: equals, output: 'bool', arity:2  },
	//**{ input: ['object','object'], func: If, output: 'bool', arity:2  },

    { input: ['Number','Number'], n:'add',func: add, T: [], output: 'Number', arity:2  },
    { input: ['Number','Number'], n:'divide',func: divide, T: [], output: 'Number', arity:2  },
    { input: ['Number','Number'], n:'multiply',func: multiply, T: [], output: 'Number', arity:2  },
]


var typed = [
    //Functional
	{ input: [ 'Array'], n:'map', func: map, T: ['Any'],  output: 'function', arity:1  },
    { input: [ 'object','string'], n:'dot', func: dot, T: ['Any'],output: 'object' , arity:2  },
    { input: [ 'Array'], n:'forEach', func: forEach, T: ['Any'], output: 'function', arity:1   },
	{ input: [ 'Array'],n:'reduce',func: reduce,T: ['Any','Any'], output: 'function', arity:1   },
	{ input: [ 'Array'], n:'filter', func: filter, T: ['Any'], output: 'function', arity:1   },
	//generation
	{ input: ['object'], n:'identity',func:identity , T: [], output: 'object', arity:1 },
	{ input:[] ,n:'stringStore',func:stringStore, T: [], output:'string', arity:0 },
	{ input:[] , n:'numberStore',func:numberStore, T: [], output:'Number' , arity: 0},
	//MATH
	{ input: ['Any','Any'], func: equals, output: 'bool', arity:2  },
	//**{ input: ['object','object'], func: If, output: 'bool', arity:2  },

    { input: ['Number','Number'], n:'add',func: add, T: [], output: 'Number', arity:2  },
    { input: ['Number','Number'], n:'divide',func: divide, T: [], output: 'Number', arity:2  },
    { input: ['Number','Number'], n:'multiply',func: multiply, T: [], output: 'Number', arity:2  },
]