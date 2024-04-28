class l{#K;#Q;constructor(K,Q=!1){this.#K=Q?K.copy().invert():K,this.#Q=!1}next(){let K;if(this.#Q)K={done:!0,value:void 0};else K={done:!1,value:this.#K},this.#Q=!0;return K}}class d{#K;#Q;#Z;#_;constructor(K,Q=!1){this.#K=Q?4:0,this.#Q=K.algA,this.#Z=K.algB,Q=Q!==K.amount<0,this.#_=new w(Q?this.#Z:this.#Q)}next(){const K=this.#_.next();if(K.done){switch(this.#K++,this.#K){case 1:this.#_=new w(this.#Z);break;case 2:this.#_=new w(this.#Q,!0);break;case 3:this.#_=new w(this.#Z,!0);break;case 5:this.#_=new w(this.#Q);break;case 6:this.#_=new w(this.#Z,!0);break;case 7:this.#_=new w(this.#Q,!0);break;case 4:case 8:return{done:!0,value:void 0}}return this.#_.next()}return K}}class c{#K;#Q;#Z;#_;#J;constructor(K,Q=!1){this.#K=0,this.#Q=K.algA,this.#Z=K.algB,this.#J=Q!==K.amount<0,this.#_=new w(this.#Q)}next(){const K=this.#_.next();if(K.done){switch(this.#K++,this.#K){case 1:this.#_=new w(this.#Z,this.#J);break;case 2:this.#_=new w(this.#Q,!0);break;case 3:return{done:!0,value:void 0}}return this.#_.next()}return K}}class w{#K;#Q;#Z;#_;#J;constructor(K,Q=!1){this.#J=Q!==K.amount<0,this.#K=this.#J?K.nodes.length-1:0,this.#Q=Math.abs(K.amount),this.#Z=K.moveNodes,this.#_=this.#X(this.#Z[this.#K],this.#J)}#X(K,Q=!1){if(!K)return null;switch(K.type){case"Move":return new l(K,Q);case"Commutator":return new d(K,Q);case"Conjugate":return new c(K,Q);case"Alg":return new w(K,Q);default:throw new Error(`Unknown alg move node type: ${K.type}`)}}next(){if(this.#_){const K=this.#_.next();if(!K.done)return{done:!1,value:K.value}}if(this.#K+=this.#J?-1:1,this.#K<this.#Z.length&&!this.#J||this.#K>=0&&this.#J)return this.#_=this.#X(this.#Z[this.#K],this.#J),this.next();if(--this.#Q>0)return this.#K=this.#J?this.#Z.length-1:0,this.#_=this.#X(this.#Z[this.#K],this.#J),this.next();return{done:!0,value:void 0}}}function i(K,Q){return(K%Q+Q)%Q}function y(K,Q){if(!K){if(Q)throw new Error(`Assertion failed: ${Q}`);throw new Error("Assertion failed")}}function m(K,Q){y(Number.isInteger(Q),"arrayRepeat() repeat must be an integer"),y(Q>=0,"arrayRepeat() repeat must be a nonnegative integer");const _=K.length;K.length=Q*_;for(let Z=1;Z<Q;){const J=Math.min(Q-Z,Z);K.copyWithin(Z*_,0,J*_),Z+=J}return K}class e{type="Commutator";algA;algB;isGrouping;amount;length;constructor(K,Q,_=1,Z=!0){this.algA=K,this.algB=Q,this.amount=_,this.isGrouping=Z,this.length=2*(this.algA.length+this.algB.length)}copy(){return new e(this.algA.copy(),this.algB.copy(),this.amount,this.isGrouping)}expanded(){if(this.amount===0)return[];const K=this.algA.expanded(),Q=this.algB.expanded(),_=[],Z=[];for(let q=K.length-1;q>=0;q--){const G=K[q];if(G.type==="Move"){_.push(G.copy().invert());continue}_.push(G.copy())}for(let q=Q.length-1;q>=0;q--){const G=Q[q];if(G.type==="Move"){Z.push(G.copy().invert());continue}Z.push(G.copy())}let J;if(this.amount>0)J=K.concat(Q,_,Z);else J=Q.concat(K,Z,_);const X=J.length,W=m(J,Math.abs(this.amount));for(let q=X;q<J.length;q++)J[q]=J[q].copy();return W}expandedMoves(){if(this.amount===0)return[];const K=this.algA.expandedMoves(),Q=this.algB.expandedMoves(),_=[],Z=[];for(let q=K.length-1;q>=0;q--)_.push(K[q].copy().invert());for(let q=Q.length-1;q>=0;q--)Z.push(Q[q].copy().invert());let J;if(this.amount>0)J=K.concat(Q,_,Z);else J=Q.concat(K,Z,_);const X=J.length,W=m(J,Math.abs(this.amount));for(let q=X;q<J.length;q++)J[q]=J[q].copy();return W}invert(){const K=this.algA;return this.algA=this.algB,this.algB=K,this}toString(){const K=`[${this.algA.toString()},${this.algB.toString()}]`;if(this.isGrouping){if(Math.abs(this.amount)!==1)return`[${K}]${this.amount}${this.amount<0?"'":""}`;return`[${K}]${this.amount<0?"'":""}`}return K}simplify(){if(this.algA.simplify(),this.algB.simplify(),this.amount<0){const K=this.algA;this.algA=this.algB,this.algB=K,this.amount*=-1}return this}forward(){return{[Symbol.iterator]:()=>new d(this)}}reverse(){return{[Symbol.iterator]:()=>new d(this,!0)}}[Symbol.iterator](){return new d(this)}}class K0{type="Conjugate";algA;algB;isGrouping;amount;length;constructor(K,Q,_=1,Z=!0){this.algA=K,this.algB=Q,this.amount=_,this.isGrouping=Z,this.length=2*this.algA.length+this.algB.length}copy(){return new K0(this.algA.copy(),this.algB.copy(),this.amount,this.isGrouping)}expanded(){const K=this.algA.expanded(),Q=this.algB.expanded(),_=[];for(let X=K.length-1;X>=0;X--){const W=K[X];if(W.type==="Move"){_.push(W.copy().invert());continue}_.push(W.copy())}if(this.amount<0){for(let X=0;X<Q.length;X++){const W=Q[X];if(W.type==="Move")W.invert()}Q.reverse()}const Z=K.concat(Q,_),J=Z.length;m(Z,Math.abs(this.amount));for(let X=J;X<Z.length;X++)Z[X]=Z[X].copy();return Z}expandedMoves(){const K=this.algA.expandedMoves(),Q=this.algB.expandedMoves(),_=[];for(let X=K.length-1;X>=0;X--)_.push(K[X].copy().invert());if(this.amount<0){for(let X=0;X<Q.length;X++){const W=Q[X];if(W.type==="Move")W.invert()}Q.reverse()}const Z=K.concat(Q,_),J=Z.length;m(Z,Math.abs(this.amount));for(let X=J;X<Z.length;X++)Z[X]=Z[X].copy();return Z}invert(){return this.algB.invert(),this}toString(){const K=`${this.algA.toString()}:${this.algB.toString()}`;if(this.isGrouping){if(Math.abs(this.amount)!==1)return`[${K}]${this.amount}${this.amount<0?"'":""}`;return`[${K}]${this.amount<0?"'":""}`}return K}simplify(){if(this.algA.simplify(),this.algB.simplify(),this.amount<0)this.algB.invert(),this.amount*=-1;return this}forward(){return{[Symbol.iterator]:()=>new c(this)}}reverse(){return{[Symbol.iterator]:()=>new c(this,!0)}}[Symbol.iterator](){return new c(this)}}class R0{#K;pos=0;line=1;col=0;constructor(K){this.#K=K}get string(){return this.#K}next(){let K=this.#K.charAt(this.pos);if(this.pos++,K==="\n")this.line++,this.col=0;else this.col++;return K}peek(){return this.#K.charAt(this.pos)}skip(K){for(let Q=0;Q<K&&this.pos<this.#K.length;Q++)this.next()}match(K){return this.#K.substring(this.pos,this.pos+K.length)===K}eof(){return this.peek()===""}croak(K){throw`Error Ln ${this.line} Col ${this.col}: ${K}`}}class Q0{input;#K=new Set;constructor(K){this.input=new R0(K)}isWhitespace(K){if(!K)return!1;return" \t\n".indexOf(K)>-1}isPunctuation(K){if(!K)return!1;return"[](),:=".indexOf(K)>-1}isMove(K){if(!K)return!1;return"ufrbldmesxyz".indexOf(K.toLowerCase())>-1}isNumber(K){if(!K)return!1;return"0123456789".indexOf(K)>-1}isVariable(K){if(!K)return!1;return K>="a"&&K<="z"||K>="A"&&K<="Z"}peekVariable(){const K=this.input.string;for(let Q=this.input.pos;Q<K.length;Q++){const _=K[Q];if(_>="a"&&_<="z"||_>="A"&&_<="Z")continue;return K.substring(this.input.pos,Q)}return K.substring(this.input.pos)}readWhile(K){let Q=[];while(!this.input.eof()&&K(this.input.peek()))Q.push(this.input.next());return Q.join("")}readNumber(){return this.readWhile(this.isNumber)}readMove(){let K="";if(this.isNumber(this.input.peek()))K+=this.readNumber();if(this.input.peek()==="-")K+=this.input.next(),K+=this.readNumber();const Q=this.input.next();K+=Q;let _=this.input.peek();if(this.isNumber(_)){if(K+=this.readNumber(),this.input.peek()==="'")K+=this.input.next();return K}switch(_){case"w":if("UFRBLD".indexOf(Q)===-1)this.input.croak("Invalid move before 'w'");if(K+=this.input.next(),this.isNumber(this.input.peek()))K+=this.readNumber();if(this.input.peek()==="'")K+=this.input.next();return K;case"'":return K+this.input.next()}return K}readPunc(){return this.input.next()}readCommentToken(){const K=this.input.pos,Q=this.input.line,_=this.input.col;switch(this.input.next(),this.input.peek()){case"/":return this.input.next(),{type:"lineComment",value:this.readWhile((J)=>J!=="\n"),pos:K,line:Q,col:_};case"*":{this.input.next();let Z="";while(!this.input.eof()){if(Z+=this.readWhile((J)=>J!=="*"),this.input.match("*/"))return this.input.next(),this.input.next(),{type:"blockComment",value:Z,pos:K,line:Q,col:_};this.input.next()}this.input.croak("Syntax Error: Missing end to multi-line comment.")}default:this.input.croak("Syntax Error: Random forward slash.")}}readWhitespace(){return this.readWhile(this.isWhitespace)}readNext(){if(this.input.eof())return null;const K=this.input.pos,Q=this.input.line,_=this.input.col;let Z=this.input.peek();if(this.isWhitespace(Z))return{type:"whitespace",value:this.readWhitespace(),pos:K,line:Q,col:_};if(this.isVariable(Z)){const J=this.peekVariable();if(this.#K.has(J)){this.input.skip(J.length);let W=1;if(this.isNumber(this.input.peek()))W=Number.parseInt(this.readNumber());if(this.input.peek()==="'")this.input.next(),W*=-1;return{type:"variable",value:J,amount:W,pos:K,line:Q,col:_}}const X=this.input.string;for(let W=this.input.pos+J.length;W<X.length;W++){const q=X[W];if(this.isWhitespace(q))continue;if(q==="=")return this.#K.add(J),this.input.skip(J.length),{type:"variable",value:J,pos:K,line:Q,col:_};break}}if(this.isMove(Z)||this.isNumber(Z))return{type:"move",value:this.readMove(),pos:K,line:Q,col:_};if(this.isPunctuation(Z)){let J={type:"punctuation",value:this.readPunc(),pos:K,line:Q,col:_};if((this.isNumber(this.input.peek())||this.input.peek()==="'")&&(J.value===")"||J.value==="]")){if(J.amount=Number.parseInt(this.readNumber()),isNaN(J.amount))J.amount=1;if(this.input.peek()==="'")this.input.next(),J.amount*=-1}return J}if(Z==="/")return this.readCommentToken();this.input.croak(`Syntax Error: Unexpected character: '${Z}'`)}}class s{type="Move";face;shallow=1;deep=1;amount;length=1;constructor(K,Q,_,Z){this.face=K,this.shallow=Q,this.deep=_,this.amount=Z}static fromString(K){let Q,_=1,Z=1,J=1;const X=new Q0(K);let W=X.input.peek(),q=!1;if(X.isNumber(W)){if(Z=Number.parseInt(X.readNumber()),X.input.peek()==="-"){X.input.next();let G=Number.parseInt(X.readNumber());_=Z,Z=G,q=!0}}if(Q=X.input.next(),Q===Q.toUpperCase()&&X.input.peek()!=="w"&&!q&&Z!==1)_=Z;if(X.input.peek()==="w"||Q===Q.toLowerCase()){if(Z===1)Z=2}if("UFRBLD".indexOf(Q.toUpperCase())!==-1)Q=Q.toUpperCase();if(X.input.peek()==="w")X.input.next();if(X.isNumber(X.input.peek())&&!X.input.eof())J=Number.parseInt(X.readNumber());if(X.input.peek()==="'")X.input.next(),J*=-1;if(!Number.isSafeInteger(_)||!Number.isSafeInteger(Z)||!Number.isSafeInteger(J))throw"Invalid move: Number too large to have precise behavior.";if(Q.length===0)throw"Invalid move: Face is missing.";if("UFRBLDMESmesxyz".indexOf(Q)===-1)throw"Invalid move";if(_>Z)throw"Invalid move: Shallow index cannot be greater than deep index.";if(_<1)throw"Invalid move: Shallow index must be at least 1.";return new s(Q,_,Z,J)}copy(){return new s(this.face,this.shallow,this.deep,this.amount)}expanded(){return[this.copy()]}expandedMoves(){return[this.copy()]}invert(){return this.amount*=-1,this}toString(){let K="",Q=!1;if(this.deep!==1){if(Q=!0,this.shallow!==1)if(this.shallow===this.deep)K+=this.shallow,Q=!1;else K+=this.shallow+"-"+this.deep;else if(this.deep!==2)K+=this.deep}if(Q)K+=this.face.toLowerCase();else K+=this.face;if(Math.abs(this.amount)!==1)K+=Math.abs(this.amount);if(this.amount<0)K+="'";return K}simplify(){if(this.amount%=4,Math.abs(this.amount)===3)this.amount=-Math.sign(this.amount);return this}equal(K){return i(this.amount,4)===i(K.amount,4)&&this.face===K.face&&this.shallow===K.shallow&&this.deep===K.deep}forward(){return{[Symbol.iterator]:()=>new l(this)}}reverse(){return{[Symbol.iterator]:()=>new l(this,!0)}}[Symbol.iterator](){return new l(this)}}var H0=function(K,Q=!1,_=!1){let Z=[];while(!0){const J=K.next();if(!J)break;const{pos:X,line:W,col:q}=J;if(J.type==="move"){Z.push(s.fromString(J.value));continue}if(J.type==="variable"){const G=E0.get(J.value);if(!G){v.push({message:`Undefined variable '${J.value}'`,pos:X,line:W,col:q});continue}Z.push(G);continue}if(J.type==="punctuation")switch(J.value){case":":case",":{const G=H0(K,!1);if(Z.length===0)v.push({message:`Left-hand side of ${J.value===","?"commutator":"conjugate"} cannot be empty.`,pos:X,line:W,col:q});else if(G.moveNodes.length===0)return v.push({message:`Right-hand side of ${J.value===","?"commutator":"conjugate"} cannot be empty.`,pos:X,line:W,col:q}),new N(Z);Z=[new(J.value===","?e:K0)(new N(Z),G)];break}case"(":case"[":{const G=H0(K,!1,!0);if(G.isGrouping=!0,G)Z.push(G);const U=K.next();if(!U){v.push({message:`Missing closing ${J.value==="("?"parentheses":"brackets"}`,pos:X,line:W,col:q});break}if(U.type!=="punctuation"||J.value==="("&&U.value!==")"||J.value==="["&&U.value!=="]")v.push({message:`Unexpected token '${J.value}'`,pos:X,line:W,col:q});break}case")":case"]":if(Q)v.push({message:`Unexpected closing bracked: '${J.value}'`,pos:X,line:W,col:q});return K.prev(),new N(Z,_?J.amount:1);default:v.push({message:`Bug: Unknown punctuation '${J.value}'`,pos:X,line:W,col:q})}}return new N(Z)};function u0(K){const Q=new L0(K.filter((_)=>_.type!=="blockComment"&&_.type!=="lineComment"&&_.type!=="whitespace"));return E0.clear(),v.length=0,H0(Q,!0)}function j0(K){const Q=new Q0(K),_=[];while(!0){const Z=Q.readNext();if(Z===null)break;_.push(Z)}return[u0(_),v.slice()]}class L0{#K;#Q;constructor(K){this.#K=K,this.#Q=0}next(){return this.#K[this.#Q++]??null}prev(){this.#Q--}current(){return this.#K[this.#Q-1]??null}peek(){return this.#K[this.#Q]??null}peekRelevant(){for(let K=this.#Q;K<this.#K.length;K++){switch(this.#K[K].type){case"blockComment":case"lineComment":case"whitespace":continue}return this.#K[K]}return null}}var E0=new Map,v=[];class N{type="Alg";nodes;moveNodes;length;isGrouping;amount;constructor(K,Q=1,_=!1){this.nodes=K,this.moveNodes=[],this.amount=Q,this.isGrouping=_,this.length=0;for(let Z of K)switch(Z.type){case"Alg":case"Move":case"Commutator":case"Conjugate":this.moveNodes.push(Z),this.length+=Z.length;break}}static fromString(K){const[Q,_]=j0(K);if(_.length>0){let Z="";for(let J of _)Z+=`Error Ln ${J.line} Col ${J.col}: ${J.message}\n`;throw new Error(Z)}return Q}copy(){const K=[];for(let Q of this.nodes)K.push(Q.copy());return new N(K,this.amount,this.isGrouping)}expanded(){if(this.amount===0)return[];const K=[];for(let _ of this.nodes){if(_.type==="Whitespace"||_.type==="Comment"){K.push(_);continue}K.push(..._.expanded())}if(this.amount<0){K.reverse();for(let _ of K)if(_.type==="Move")_.invert()}const Q=K.length;m(K,Math.abs(this.amount));for(let _=Q;_<K.length;_++)K[_]=K[_].copy();return K}expandedMoves(){if(this.amount===0)return[];const K=[];for(let _ of this.nodes){if(_.type==="Whitespace"||_.type==="Comment")continue;K.push(..._.expandedMoves())}if(this.amount<0)K.reverse(),K.forEach((_)=>_.invert());const Q=K.length;m(K,Math.abs(this.amount));for(let _=Q;_<K.length;_++)K[_]=K[_].copy();return K}invert(){for(let K of this.moveNodes)K.invert();return this.nodes.reverse(),this}toString(){let K="";for(let Q of this.nodes)K+=Q.toString();if(this.isGrouping){const Q=Math.abs(this.amount);if(Q!==1)K+=Q.toString();if(this.amount<0)K+="'";return`(${K})`}return K}simplify(){let K=!0;while(K){K=!1;let Q=null,_=-1;for(let Z=0;Z<this.nodes.length;Z++){let J=this.nodes[Z];if(J.type==="Whitespace"||J.type==="Comment")continue;if(J.simplify(),J.type==="Move"){if(J.amount===0){this.nodes.splice(Z,1),Z--;continue}}if(J.type==="Move"&&Q?.type==="Move"){if(J.face===Q.face){K=!0,Q.amount+=J.amount,this.nodes.splice(Z,1),Z=_;continue}}Q=J,_=Z}}return this}forward(){return{[Symbol.iterator]:()=>new w(this)}}reverse(){return{[Symbol.iterator]:()=>new w(this,!0)}}[Symbol.iterator](){return new w(this)}}class q0{type="Comment";value;commentType;constructor(K,Q){this.value=K,this.commentType=Q}copy(){return new q0(this.value,this.commentType)}toString(){if(this.commentType==="lineComment")return`//${this.value}`;return`/*${this.value}*/`}}class Y0{type="Whitespace";value;constructor(K){this.value=K}copy(){return new Y0(this.value)}toString(){return this.value}}var A0=function(K){switch(K){case Y.U:return Y.D;case Y.F:return Y.B;case Y.R:return Y.L;case Y.B:return Y.F;case Y.L:return Y.R;case Y.D:return Y.U;default:return Y.U}},D0=function(K){switch(K){case Y.U:return"U";case Y.F:return"F";case Y.R:return"R";case Y.B:return"B";case Y.L:return"L";case Y.D:return"D";default:return"?"}},Z0=function(K){switch(K.toUpperCase()){case"U":return Y.U;case"F":return Y.F;case"R":return Y.R;case"B":return Y.B;case"L":return Y.L;case"D":return Y.D;default:return-1}},o=function(K,Q){let _=K%Q,Z=Math.floor(K/Q),J=Q-Z-1;return _*Q+J},l0=function(K,Q){let _=K%Q,J=Math.floor(K/Q);return(Q-_-1)*Q+J},Y;(function(W){W[W["U"]=0]="U";W[W["L"]=1]="L";W[W["F"]=2]="F";W[W["R"]=3]="R";W[W["B"]=4]="B";W[W["D"]=5]="D"})(Y||(Y={}));class M{#K;stickers;constructor(K){console.assert(Number.isInteger(K)&&K>1),this.#K=K;let Q=K*K;this.stickers=Array(6);for(let _=0;_<6;_++){this.stickers[_]=Array(Q);for(let Z=0;Z<Q;Z++)this.stickers[_][Z]=_}}static fromString(K){const Q=Math.floor(Math.sqrt(K.length/6)),_=Q*Q,Z=new M(Q);for(let J=0;J<6;J++)for(let X=0;X<_;X++)Z.stickers[J][X]=Z0(K[J*_+X]);return Z}toString(){const K=[],Q=this.#K*this.#K;for(let _=0;_<6;_++)for(let Z=0;Z<Q;Z++)K.push(D0(this.stickers[_][Z]));return K.join("")}getLayerCount(){return this.#K}solve(){let K=this.#K*this.#K;for(let Q=0;Q<6;Q++)for(let _=0;_<K;_++)this.stickers[Q][_]=Q}solved(){let K=this.#K*this.#K;for(let Q=0;Q<6;Q++){let _=this.stickers[Q][0];for(let Z=1;Z<K;Z++)if(this.stickers[Q][Z]!==_)return!1}return!0}static#Q(K,Q,_,Z,J,X){_=_.filter((O)=>O!==J(O,!1)&&Z(O)!==Z(Q));const W=(O,j)=>{return Z(O)===Z(j)},q=Array(K).fill(!1),G=[];let U=J(Q,!1),L=Q;q[Z(Q)]=!0;let P=0;K:while(!0){if(P++>100)return console.error("Infinite loop error"),G;if(W(U,L)||W(U,Q)){if(W(U,L)&&!W(U,Q)){if(q[Z(L)]=!0,G.push(U),X)X(U)}while(!0){const O=_.shift();if(O===void 0)break K;if(!q[Z(O)]){L=O;break}}if(U=L,G.push(U),X)X(U);U=J(U,!1);continue}if(G.push(U),q[Z(U)]=!0,X)X(U);U=J(U,!0)}return G}memoEdges(K,Q){const _=this.#_(),Z=(X)=>{return Math.floor(X/2)},J=(X)=>{const W=_[Z(X)];return W-W%2+(W+X)%2};return M.#Q(_.length,K,Q,Z,J)}static#Z(K){switch(K.reduce((_,Z)=>_|1<<Z,0)){case 17:return 0;case 9:return 1;case 5:return 2;case 3:return 3;case 12:return 4;case 6:return 5;case 18:return 6;case 24:return 7;case 36:return 8;case 40:return 9;case 48:return 10;case 34:return 11;default:throw new Error(`Invalid edge: [${K.join(", ")}]`)}}#_(){const K=this.#O(Math.floor(this.#K/2)),Q=Array(K.length);for(let _=0;_<K.length;_++){const Z=K[_];let J;if(Z.some((W)=>W===Y.U||W===Y.D))J=!(Z[0]===Y.U||Z[0]===Y.D);else J=!(Z[0]===Y.F||Z[0]===Y.B);const X=M.#Z(Z);Q[_]=X*2+Number(J)}return Q}memoWings(K,Q,_){const Z=this.#X(K),J=(W)=>W,X=(W)=>Z[W];return M.#Q(Z.length,Q,_,J,X)}static#J(K){switch(1<<K[0]|1<<K[1]+6){case 1025:return 0;case 80:return 1;case 513:return 2;case 72:return 3;case 257:return 4;case 68:return 5;case 129:return 6;case 66:return 7;case 516:return 8;case 264:return 9;case 132:return 10;case 258:return 11;case 144:return 12;case 1026:return 13;case 528:return 14;case 1032:return 15;case 288:return 16;case 2052:return 17;case 544:return 18;case 2056:return 19;case 1056:return 20;case 2064:return 21;case 160:return 22;case 2050:return 23;default:throw new Error(`Invalid wing: [${K.join(", ")}]`)}}#X(K){const Q=this.#U(K),_=Array(Q.length);for(let Z=0;Z<Q.length;Z++){const J=Q[Z];if(Z%2===1){const X=J[0];J[0]=J[1],J[1]=X}_[Z]=M.#J(J)}return _}memoCorners(K,Q){const _=this.#q(),Z=(X)=>{return Math.floor(X/3)},J=(X)=>{const W=_[Z(X)];return W-W%3+(W+X)%3};return M.#Q(_.length,K,Q,Z,J)}static#V(K){switch(K.reduce((_,Z)=>_|1<<Z,0)){case 19:return 0;case 25:return 1;case 13:return 2;case 7:return 3;case 38:return 4;case 44:return 5;case 56:return 6;case 50:return 7;default:throw`Invalid corner: [${K.join(", ")}]`}}#q(){const K=this.#$(),Q=Array(K.length);for(let _=0;_<K.length;_++){const Z=K[_];if(_%2===1){const q=Z[1];Z[1]=Z[2],Z[2]=q}let J=Z.findIndex((q)=>q===Y.U||q===Y.D);if(J===-1)throw new Error(`Invalid corner triplet: [${Z.join(", ")}]`);let W=M.#V(Z)*3+J;Q[_]=W}return Q}memoCenters(K,Q,_){const Z=this.#Y(K),J=Z.slice(),X=(P)=>Math.floor(P/4),W=(P)=>P,q=(P,O)=>{if(!O)return Z[P];const F=X(Z[P])*4;for(let C=0;C<4;C++){const p=F+C;if(J[p]===p)continue;const b=Z.indexOf(p);y(b!==-1),y(X(Z[b])===X(Z[P]));const u=Z[b];Z[b]=Z[P],Z[P]=u;{const J0=J[b];J[b]=J[P],J[P]=J0}const g="ABCDEFGHIJKLMNOPQRSTUVWX";return console.log(`swap ${g[b]} ${g[P]} (${g[Z[b]]} ${g[Z[P]]})`),u}return Z[P]},U=(P)=>{const O=J[Q];J[Q]=J[P],J[P]=O},L=M.#Q(Z.length,Q,_,W,q,U);return console.log(J.map((P)=>"ABCDEFGHIJKLMNOPQRSTUVWX"[P]).join(" ")),L}#Y(K){const Q=this.#W(K),_=Array(Q.length),Z=Array(Q.length).fill(!1);for(let J=0;J<Q.length;J++){const X=Q[J],W=Math.floor(J/4);if(X===W)_[J]=J,Z[J]=!0}for(let J=0;J<Q.length;J++){if(_[J]!==void 0)continue;for(let X=0;X<4;X++){let W=Q[J]*4+X;if(!Z[W]){Z[W]=!0,_[J]=W;break}}}return y(Z.every((J)=>J===!0)),_}#W(K){const Q=[];for(let _=0;_<6;_++)for(let Z=0;Z<4;Z++)Q.push(this.stickers[_][K]),K=o(K,this.#K);return Q}#O(K){const Q=[],_=[Y.U,Y.L,Y.F,Y.R,Y.B,Y.D];for(let U of _)for(let L=0;L<4;L++)Q.push(this.stickers[U][K]),K=o(K,this.#K);const Z=Q.slice(0,4),J=Q.slice(4,8),X=Q.slice(8,12),W=Q.slice(12,16),q=Q.slice(16,20),G=Q.slice(20,24);return[[Z[0],q[0]],[Z[1],W[0]],[Z[2],X[0]],[Z[3],J[0]],[X[1],W[3]],[X[3],J[1]],[q[1],J[3]],[q[3],W[1]],[G[0],X[2]],[G[1],W[2]],[G[2],q[2]],[G[3],J[2]]]}#U(K){const Q=[];let _=this.#K-K-1;const Z=[Y.U,Y.L,Y.F,Y.R,Y.B,Y.D];for(let L of Z)for(let P=0;P<4;P++)Q.push(this.stickers[L][K]),Q.push(this.stickers[L][_]),K=o(K,this.#K),_=o(_,this.#K);const J=Q.slice(0,8),X=Q.slice(8,16),W=Q.slice(16,24),q=Q.slice(24,32),G=Q.slice(32,40),U=Q.slice(40,48);return[[J[0],G[1]],[J[1],G[0]],[J[2],q[1]],[J[3],q[0]],[J[4],W[1]],[J[5],W[0]],[J[6],X[1]],[J[7],X[0]],[W[2],q[7]],[W[3],q[6]],[W[6],X[3]],[W[7],X[2]],[G[2],X[7]],[G[3],X[6]],[G[6],q[3]],[G[7],q[2]],[U[0],W[5]],[U[1],W[4]],[U[2],q[5]],[U[3],q[4]],[U[4],G[5]],[U[5],G[4]],[U[6],X[5]],[U[7],X[4]]]}#$(){const K=[],Q=[Y.U,Y.L,Y.F,Y.R,Y.B,Y.D];let _=0;for(let U of Q)for(let L=0;L<4;L++)K.push(this.stickers[U][_]),_=o(_,this.#K);const Z=K.slice(0,4),J=K.slice(4,8),X=K.slice(8,12),W=K.slice(12,16),q=K.slice(16,20),G=K.slice(20,24);return[[Z[0],q[1],J[0]],[Z[1],q[0],W[1]],[Z[2],X[1],W[0]],[Z[3],X[0],J[1]],[G[0],X[3],J[2]],[G[1],X[2],W[3]],[G[2],q[3],W[2]],[G[3],q[2],J[3]]]}#H(K){const Q=[];for(let Z of this.stickers[K]){const J=document.createElement("div");J.classList.add("sticker"),J.classList.add(D0(Z)),Q.push(J)}const _=document.createElement("div");return _.classList.add("face"),_.replaceChildren(...Q),_}#G(){const K=document.createElement("div");return K.classList.add("face"),K}html(K){K.classList.add("cube"),K.style.setProperty("--layer-count",this.#K.toString()),K.replaceChildren(this.#G(),this.#H(Y.U),this.#G(),this.#G(),this.#H(Y.L),this.#H(Y.F),this.#H(Y.R),this.#H(Y.B),this.#G(),this.#H(Y.D))}static#L(K){var Q;(function(q){q[q["U"]=Y.U]="U";q[q["R"]=Y.R]="R";q[q["L"]=Y.L]="L";q[q["D"]=Y.D]="D"})(Q||(Q={}));const _=(Z,J)=>({face:Z,direction:J});switch(K){case Y.U:return[_(Y.B,Q.U),_(Y.R,Q.U),_(Y.F,Q.U),_(Y.L,Q.U)];case Y.L:return[_(Y.U,Q.L),_(Y.F,Q.L),_(Y.D,Q.L),_(Y.B,Q.R)];case Y.F:return[_(Y.U,Q.D),_(Y.R,Q.L),_(Y.D,Q.U),_(Y.L,Q.R)];case Y.R:return[_(Y.U,Q.R),_(Y.B,Q.L),_(Y.D,Q.R),_(Y.F,Q.R)];case Y.B:return[_(Y.U,Q.U),_(Y.L,Q.L),_(Y.D,Q.D),_(Y.R,Q.R)];case Y.D:return[_(Y.F,Q.D),_(Y.R,Q.D),_(Y.B,Q.D),_(Y.L,Q.D)];default:return console.error(`Invalid face: ${K}`),[]}}#z(K){let Q=this.stickers[K],_=Q.slice();for(let Z=0;Z<Q.length;Z++)Q[Z]=_[l0(Z,this.#K)]}#E(K){let Q=this.stickers[K],_=Q.slice();for(let Z=0;Z<Q.length;Z++)Q[Z]=_[o(Z,this.#K)]}#P(K,Q){if(Q)this.#E(K);else this.#z(K)}#j(K,Q){const _=[];switch(K){case Y.U:{let Z=Q*this.#K;for(let J=0;J<this.#K;J++)_.push(Z+J);return _}case Y.R:{let Z=this.#K-Q-1;for(let J=0;J<this.#K;J++)_.push(Z+this.#K*J);return _}case Y.L:{let Z=Q;for(let J=this.#K-1;J>=0;J--)_.push(Z+this.#K*J);return _}case Y.D:{let Z=(this.#K-Q)*this.#K-this.#K;for(let J=this.#K-1;J>=0;J--)_.push(Z+J);return _}default:return console.error(`Invalid direction: ${K}`),[]}}#R(K,Q){const _=M.#L(K),Z=[];for(let X of _)Z.push(this.#j(X.direction,Q));let J=[];for(let X of Z[0])J[X]=this.stickers[_[0].face][X];for(let X=0;X<Z.length;X++){const W=this.stickers?.[_[X+1]?.face]??J;for(let q=0;q<Z[0].length;q++){const G=Z[X][q],U=Z[(X+1)%Z.length][q];if(!Number.isInteger(W[U])){console.error(`Invalid index: ${U}`);continue}this.stickers[_[X].face][G]=W[U]}}}#T(K,Q){for(let _=0;_<3;_++)this.#R(K,Q)}#A(K,Q,_){if(_)this.#R(K,Q);else this.#T(K,Q)}reset(){for(let K=0;K<6;K++)for(let Q=0;Q<this.stickers[K].length;Q++)this.stickers[K][Q]=K}move(K,Q,_=1,Z=1){let J=Q<0;if(Q=Math.abs(Q)%4,Q===0)return;J=Q===3!==J;let X=Q===2;if(_=Math.min(_,this.#K),Z=Math.min(Z,this.#K),!X){if(_===1)this.#P(K,J);if(Z>=this.#K)this.#P(A0(K),!J);for(let W=_-1;W<Z;W++)this.#A(K,W,J)}else{if(_===1)this.#z(K),this.#z(K);if(Z>=this.#K){let W=A0(K);this.#z(W),this.#z(W)}for(let W=_-1;W<Z;W++)this.#T(K,W),this.#T(K,W)}}execute(K){for(let Q of K)if("UFRBLD".indexOf(Q.face)>-1)this.move(Z0(Q.face),Q.amount,Q.shallow,Q.deep);else if("MES".indexOf(Q.face)>-1){if(this.#K%2===0)continue;let _=Z0("LDF"["MES".indexOf(Q.face)]),Z=(this.#K-1)/2+1;this.move(_,Q.amount,Z,Z)}else if("mes".indexOf(Q.face)>-1){let _=Z0("LDF"["mes".indexOf(Q.face)]);this.move(_,Q.amount,2,this.#K-1)}else if("xyz".indexOf(Q.face)>-1){let _=Z0("RUF"["xyz".indexOf(Q.face)]);this.move(_,Q.amount,1,this.#K)}else console.error(`Move ${Q.face} not supported.`)}executeUntil(K,Q){for(let _ of K){if(Q--<=0)return _;this.execute(_)}return null}}class h{layerCount;cube;stickersPerFace;#K;#Q;constructor(K){this.layerCount=K,this.cube=new M(K),this.stickersPerFace=K**2,this.#K=new M(K),this.#Q=new WeakMap}static#Z(K,Q,_){const Z=K.stickers[Q[0][0]][Q[0][1]];for(let J=0;J<Q.length;J++){const X=Q[J],W=i(J+_,Q.length),q=W===0?Z:K.stickers[Q[W][0]][Q[W][1]];K.stickers[X[0]][X[1]]=q}}static#_(K,Q,_){const Z=Q[Q.length-1],J=K.stickers[Z[0]][Z[1]];for(let X=Q.length-1;X>=0;X--){const W=Q[X],q=i(X+_,Q.length),G=q===Q.length-1?J:K.stickers[Q[q][0]][Q[q][1]];K.stickers[W[0]][W[1]]=G}}static#J(K,Q,_){if(_===0)return;if(_>0)for(let Z of Q)this.#Z(K,Z,_);else for(let Z of Q)this.#_(K,Z,_)}#X(K,Q){return K*this.stickersPerFace+Q}#V(K,Q){const _=[];let Z=K,J=Q;do{_.push([Z,J]);const X=this.#K.stickers[Z][J];Z=Math.floor(X/this.stickersPerFace),J=X%this.stickersPerFace}while(Z!==K||J!==Q);return _}#q(){const K=[],Q=new Set;for(let _=0;_<6;_++)for(let Z=0;Z<this.stickersPerFace;Z++){const J=this.#X(_,Z);if(Q.has(J))continue;if(this.#K.stickers[_][Z]!==J){const X=this.#V(_,Z);for(let W=1;W<X.length;W++)Q.add(this.#X(X[W][0],X[W][1]));K.push(X)}}return K}#Y(){for(let K=0;K<6;K++)for(let Q=0;Q<this.stickersPerFace;Q++)this.#K.stickers[K][Q]=this.#X(K,Q)}recordAlg(K){this.#Y();let Q=K.amount;K.amount=1,this.#K.execute(K),K.amount=Q;const _=this.#q();return this.#Q.set(K,_),_}#W(K){if(this.#Q.has(K))return;this.#Y();for(let Q of K.moveNodes)switch(Q.type){case"Alg":this.#W(Q);break;case"Commutator":case"Conjugate":this.#W(Q.algA),this.#W(Q.algB);case"Move":continue;default:throw new Error(`Unimplemented alg move node type in CacheCube.execute(): '${Q.type}'`)}this.#Y();for(let Q of K.moveNodes)switch(Q.type){case"Alg":{const _=this.#Q.get(Q);y(_!==void 0),h.#J(this.#K,_,Q.amount);break}case"Commutator":case"Conjugate":{const _=this.#Q.get(Q.algA),Z=this.#Q.get(Q.algB);y(_!==void 0&&Z!==void 0);const J=Math.abs(Q.amount);if(Q.amount>0){if(h.#J(this.#K,_,J*Q.algA.amount),h.#J(this.#K,Z,J*Q.algB.amount),h.#J(this.#K,_,-J*Q.algA.amount),Q.type==="Commutator")h.#J(this.#K,Z,-J*Q.algB.amount)}else{if(Q.type==="Commutator")h.#J(this.#K,Z,J*Q.algB.amount);h.#J(this.#K,_,J*Q.algA.amount),h.#J(this.#K,Z,-J*Q.algB.amount),h.#J(this.#K,_,-J*Q.algA.amount)}break}case"Move":this.#K.execute(Q)}this.#Q.set(K,this.#q())}execute(K){let Q=this.#Q.get(K);if(Q){h.#J(this.cube,Q,K.amount);return}this.#W(K),Q=this.#Q.get(K),y(Q!==void 0),h.#J(this.cube,Q,K.amount)}}var d0=await navigator.gpu?.requestAdapter(),c0=await d0?.requestDevice(),D=c0;function B0(K,Q){Q??=new Float32Array(16);for(let _=0;_<4;_++)for(let Z=0;Z<4;Z++)Q[_*4+Z]=K[Z*4+_];return Q}function _0(K,Q,_){_??=new Float32Array(16);for(let Z=0;Z<4;Z++)for(let J=0;J<4;J++){const X=Z*4+J;_[X]=0;for(let W=0;W<4;W++)_[X]+=K[Z*4+W]*Q[W*4+J]}return _}function k0(K){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,K[0],K[1],K[2],1])}function M0(K,Q){Q??=new Float32Array(16);const _=Math.cos(K),Z=Math.sin(K);return Q.set([1,0,0,0,0,_,-Z,0,0,Z,_,0,0,0,0,1]),Q}function F0(K,Q){Q??=new Float32Array(16);const _=Math.cos(K),Z=Math.sin(K);return Q.set([_,0,Z,0,0,1,0,0,-Z,0,_,0,0,0,0,1]),Q}function I0(K){return new Float32Array([K[0],0,0,0,0,K[1],0,0,0,0,K[2],0,0,0,0,1])}function w0(K,Q,_){return new Float32Array([K/Q,0,0,0,0,K,0,0,0,0,-1,-2*_,0,0,-1,0])}class A{layerCount;#K;#Q;#Z;#_;#J;#X;#V;#q;#Y;#W;#O=1;#U;constructor(K,Q){this.layerCount=Q,this.#K=K;let _;[this.#Q,_]=A.#H(K),this.#Z=A.#G(K.width,K.height),this.#_=A.#L(this.#Z),this.#J=A.#z(Q);const Z=A.#E(),J=A.#P(Z);this.#X=A.#j(this.#J,J,_,this.#Z.format),this.#V=A.#R(this.#J,J),this.#q=A.#A(Q),this.#Y=A.#D(),this.#W=A.#B(),this.#U=A.#k(Z,this.#Y,this.#q,this.#W),this.reset(),this.clearAnimation()}render(){const K=D.createCommandEncoder({label:"Draw NxN"});this.#_.colorAttachments[0].view=this.#Q.getCurrentTexture().createView();const Q=K.beginRenderPass(this.#_);Q.setPipeline(this.#X);for(let _=0;_<this.#U.length;_++)Q.setBindGroup(_,this.#U[_]);Q.draw(4,6*this.#O),Q.end(),D.queue.submit([K.finish()])}reset(){const K=D.createCommandEncoder({label:"Reset NxN"}),Q=K.beginComputePass();Q.setPipeline(this.#V);for(let _=0;_<this.#U.length;_++)Q.setBindGroup(_,this.#U[_]);Q.dispatchWorkgroups(Math.ceil(this.#q.size/256)),Q.end(),D.queue.submit([K.finish()])}setCameraTransform(K,Q,_){const Z=_0(I0(Array(3).fill(0.8)),_0(_0(F0(_),M0(Q)),k0(K))),J=w0(2,this.#K.width/this.#K.height,0.01),X=new Float32Array(16);X.set(_0(Z,B0(J))),D.queue.writeBuffer(this.#Y,0,X)}set(K){const Q=new ArrayBuffer(this.#q.size),_=new Uint32Array(Q);let Z=0,J=0;for(let X=0;X<K.stickers.length;X++)for(let W=0;W<K.stickers[X].length;W++)if(_[Z]|=K.stickers[X][W]<<J,J+=3,J>=30)Z++,J=0;D.queue.writeBuffer(this.#q,0,Q)}static#$(K,Q,_,Z){if(Q<=0)return[];return[K|Q<<16,_|Z<<16]}animateMove(K,Q){function _(W,q){return(W%q+q)%q}const Z="ULFRBD".indexOf(K.face.toUpperCase());if(Z===-1)throw new Error(`Unsupported face '${K.face}'`);const J=[],X=_(Math.floor(65535*Q*K.amount/4),65535);if(K.shallow===1)J.push(...A.#$(X,K.deep,this.layerCount-K.deep,Z)),J.push(...A.#$(0,this.layerCount-K.deep,0,Z));else J.push(...A.#$(0,K.shallow-1,this.layerCount-K.shallow+1,Z)),J.push(...A.#$(X,K.deep-K.shallow+1,this.layerCount-K.deep,Z)),J.push(...A.#$(0,this.layerCount-K.deep,0,Z));this.#O=J.length/2,D.queue.writeBuffer(this.#W,0,new Uint32Array(J))}clearAnimation(){const K=new Uint32Array(A.#$(0,this.layerCount,0,0));this.#O=1,D.queue.writeBuffer(this.#W,0,new Uint32Array(K))}destroy(){this.#Q.unconfigure(),this.#Z.destroy(),this.#q.destroy(),this.#Y.destroy()}resize(K,Q){if(this.#K.width===K&&this.#K.height===Q)return;this.#K.width=K,this.#K.height=Q,this.#Z.destroy(),this.#Z=A.#G(K,Q);const _=this.#_.depthStencilAttachment;_.view=this.#Z.createView()}static#H(K){y(K.width!==0&&K.height!==0);const Q=K.getContext("webgpu");if(!Q)throw new Error("Failed to initialize WebGPU canvas context");const _=navigator.gpu.getPreferredCanvasFormat();return Q.configure({device:D,format:_}),[Q,_]}static#G(K,Q){return D.createTexture({size:{width:K,height:Q},format:"depth16unorm",dimension:"2d",usage:GPUTextureUsage.RENDER_ATTACHMENT})}static#L(K){return{label:"Draw NxN Render Pass Descriptor",colorAttachments:[{view:null,clearValue:[1,1,1,1],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:K.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}}}static#z(K){const Q=A.#T(K)/4,_=`
            struct CameraData {
                viewProjMatrix: mat4x4f,
            };

            struct BlockData {
                packedRotationScale: u32,
                packedAxisTranslation: u32,
            };

            const vertices = array<vec2f, 4>(
                vec2f(-1.0, -1.0),
                vec2f(-1.0,  1.0),
                vec2f( 1.0, -1.0),
                vec2f( 1.0,  1.0),
            );
            const normals = array<vec3f, 6>(
                vec3f( 0.0,  1.0,  0.0),
                vec3f(-1.0,  0.0,  0.0),
                vec3f( 0.0,  0.0,  1.0),
                vec3f( 1.0,  0.0,  0.0),
                vec3f( 0.0,  0.0, -1.0),
                vec3f( 0.0, -1.0,  0.0)
            );
            const colors = array<vec4f, 8>(
                vec4f(1.0, 1.0, 1.0, 1.0),
                vec4f(1.0, 0.6, 0.0, 1.0),
                vec4f(0.0, 1.0, 0.0, 1.0),
                vec4f(1.0, 0.0, 0.0, 1.0),
                vec4f(0.0, 0.0, 1.0, 1.0),
                vec4f(1.0, 1.0, 0.0, 1.0),
                // unused
                vec4f(0.0, 0.0, 0.0, 1.0),
                vec4f(0.0, 0.0, 0.0, 1.0),
            );
        
            @group(0) @binding(0) var<uniform> cameraData: CameraData;
            @group(0) @binding(1) var<storage, read_write> stickers: array<u32, ${Q}>;
            @group(0) @binding(2) var<storage, read> blocks: array<BlockData>;
        
            struct VertexOut {
                @builtin(position) position: vec4f,
                @location(0) uv: vec2f,
                @location(1) @interpolate(flat) face: u32,
                @location(2) @interpolate(flat) fill: u32,
            };
    
            @vertex
            fn vert_main(@builtin(vertex_index) vertexId: u32, @builtin(instance_index) instanceId: u32) -> VertexOut {
                var out: VertexOut;

                var vertex = vertices[vertexId];
                let normal = normals[instanceId % 6];

                let block = blocks[instanceId / 6];

                let scaleU32 = (block.packedRotationScale >> 16) & 0xffff;
                let translationU32 = block.packedAxisTranslation & 0xffff;

                let rotation: f32 = -f32(block.packedRotationScale & 0xffff) / f32(0xffff) * 6.2831853072;
                let halfScale: f32 = f32(scaleU32) / f32(${K});
                let translation: f32 = -1 + 2 * f32(translationU32) / f32(${K});
                let axis: vec3f = normals[(block.packedAxisTranslation >> 16) & 0x7];

                var position = vec3f(vertex, 0.0);
                if (normal.x != 0) { position = position.zxy + normal; }
                if (normal.y != 0) { position = position.xzy + normal; }
                if (normal.z != 0) { position += normal; }

                let normalDotAxis = dot(normal, axis);
                out.fill = u32(
                    (normalDotAxis == 1.0 && translationU32 + scaleU32 < ${K}) ||
                    (normalDotAxis == -1.0 && translationU32 != 0)
                );

                if (normalDotAxis > 0.1) {
                    position -= position * abs(axis);
                    position += axis * (translation + halfScale * 2);
                } else if (normalDotAxis < -0.1) {
                    position -= position * abs(axis);
                    position += axis * translation;
                } else {
                    let positionDotAxis = dot(position, axis);
                    if (positionDotAxis > 0.1) {
                        position -= position * abs(axis);
                        position += axis * (translation + halfScale * 2);
                    } else {
                        position -= position * abs(axis);
                        position += axis * translation;
                    }

                    let scale = halfScale * 2.0;

                    if (axis.x != 0.0) {
                        vertex.x *= halfScale;
                        vertex.x += axis.x * (halfScale + translation);
                    } else if (axis.y != 0.0) {
                        let i = instanceId % 6;
                        if (i == 1 || i == 3) {
                            vertex.x *= halfScale;
                            vertex.x += axis.y * (halfScale + translation);
                        } else {
                            vertex.y *= halfScale;
                            vertex.y += axis.y * (halfScale + translation);
                        }
                    } else if (axis.z != 0.0) {
                        vertex.y *= halfScale;
                        vertex.y += axis.z * (halfScale + translation);
                    }
                }

                // https://en.wikipedia.org/wiki/Axis-angle_representation#Rotating_a_vector
                position =
                    cos(rotation) * position +
                    sin(rotation) * cross(axis, position) +
                    (1 - cos(rotation)) * dot(axis, position) * axis;

                out.position = cameraData.viewProjMatrix * vec4f(position * 0.1, 1);
                out.uv = vertex;
                out.face = instanceId % 6;

                switch (instanceId % 6) {
                    case 1: { out.uv = vec2f(out.uv.y, -out.uv.x); break; }
                    case 2: { out.uv.y *= -1; break; }
                    case 3: { out.uv = vec2f(-out.uv.y, -out.uv.x); break; }
                    case 4: { out.uv *= -1; break; }
                    case 5: { out.uv.y *= -1; break; }
                    default: { break; }
                }

                out.uv = (out.uv + 1) / 2;
    
                return out;
            }
    
            @fragment
            fn frag_main(in: VertexOut) -> @location(0) vec4f {
                const lineWidth = vec2f(0.1);
                const gridRepeat = vec2f(${K});

                // https://bgolus.medium.com/the-best-darn-grid-shader-yet-727f9278b9d8
                var gridAA = max(abs(dpdx(in.uv)), abs(dpdy(in.uv))) * 1;

                if (bool(in.fill)) {
                    return vec4f(0, 0, 0, 1);
                }

                var drawWidth = clamp(lineWidth, gridAA, vec2f(0.5));
                var gridUV = 1.0 - abs(fract(in.uv * gridRepeat) * 2.0 - 1.0);
                var grid2 = smoothstep(drawWidth + gridAA, drawWidth - gridAA, gridUV);
                grid2 *= saturate(lineWidth / drawWidth);
                grid2 = mix(grid2, lineWidth, saturate(gridAA * 2.0 - 1.0));
                var grid = max(grid2.x, grid2.y);

                var i2 = vec2u(floor(in.uv * gridRepeat));
                var index =
                    in.face * u32(gridRepeat.x) * u32(gridRepeat.y) +
                    i2.y * u32(gridRepeat.x) + i2.x;
                var colorIndex = (stickers[index / 10] >> ((index % 10) * 3)) & 0x7;

                return mix(colors[colorIndex], vec4f(0, 0, 0, 1), grid);
            }

            @compute @workgroup_size(64) fn initStickers(
                @builtin(global_invocation_id) gid: vec3<u32>
            ) {
                if (gid.x < ${Q}) {
                    let id = gid.x * 10;
                    var value: u32 = 0;
                    for (var i: u32 = 0; i < 10; i++) {
                        value |= ((i + id) / ${K*K}) << (i * 3);
                    }
                    stickers[gid.x] = value;
                }
            }
        `;return D.createShaderModule({label:"puzzle shader module",code:_})}static#E(){return D.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]})}static#P(K){return D.createPipelineLayout({bindGroupLayouts:[K]})}static#j(K,Q,_,Z){return D.createRenderPipeline({label:"Draw Puzzle Render Pipeline",layout:Q,vertex:{module:K,entryPoint:"vert_main"},fragment:{module:K,entryPoint:"frag_main",targets:[{format:_}]},depthStencil:{format:Z,depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-strip"}})}static#R(K,Q){return D.createComputePipeline({layout:Q,compute:{module:K,entryPoint:"initStickers"}})}static#T(K){return Math.ceil(6*K*K/10)*4}static#A(K){return D.createBuffer({label:"Sticker Buffer",size:A.#T(K),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}static#D(){return D.createBuffer({size:80,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}static#B(){return D.createBuffer({size:24,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}static#k(K,Q,_,Z){return[D.createBindGroup({layout:K,entries:[{binding:0,resource:{buffer:Q}},{binding:1,resource:{buffer:_}},{binding:2,resource:{buffer:Z}}]})]}}var U0;(function(N0){N0.SOLVED_STATE=5517840;const Q=0,_=1,Z=2,J=3,X=4,W=5,q=6,G=7;let U;(function(R){R[R["M"]=1]="M";R[R["M2"]=2]="M2";R[R["MPrime"]=3]="MPrime";R[R["U"]=4]="U";R[R["U2"]=5]="U2";R[R["UPrime"]=6]="UPrime"})(U||(U={}));function L(H){switch(H){case U.M:return"M";case U.M2:return"M2";case U.MPrime:return"M'";case U.U:return"U";case U.UPrime:return"U'";case U.U2:return"U2";default:throw new Error(`Invalid LSE move number: '${H}'`)}}function P(H){switch(H){case"M":return U.M;case"M'":return U.MPrime;case"M2":return U.M2;case"U":return U.U;case"U'":return U.UPrime;case"U2":return U.U2;default:throw new Error(`Invalid LSE move: '${H}'`)}}N0.stringToLseMove=P;function O(H,$){return H>>$*4&15}function j(H,$,V){return H&(~0^15<<$*4)|V<<$*4}function F(H,$,V,T,E){let z=H;return z=j(z,$,O(H,E)),z=j(z,V,O(H,$)),z=j(z,T,O(H,V)),z=j(z,E,O(H,T)),z}function C(H,$,V,T,E){let z=H;return z=j(z,$,O(H,V)),z=j(z,V,O(H,T)),z=j(z,T,O(H,E)),z=j(z,E,O(H,$)),z}function p(H,$,V){let T=H;return T=j(T,$,O(H,V)),T=j(T,V,O(H,$)),T}function b(H){return H^8914952}function u(H,$){return j(H,7,(O(H,7)+$)%4)}function g(H,$){return j(H,6,(O(H,6)+$)%4)}function J0(H,$){switch($){case U.M:H=C(H,0,5,4,2),H=b(H),H=u(H,3);break;case U.MPrime:H=F(H,0,5,4,2),H=b(H),H=u(H,1);break;case U.M2:H=p(H,0,4),H=p(H,2,5),H=u(H,2);break;case U.U:H=F(H,0,1,2,3),H=g(H,1);break;case U.UPrime:H=C(H,0,1,2,3),H=g(H,3);break;case U.U2:H=p(H,0,2),H=p(H,1,3),H=g(H,2);break;default:throw new Error(`Invalid move: '${$}'`)}return H}N0.move=J0;function h0(H){switch(H){case U.M:return U.MPrime;case U.MPrime:return U.M;case U.U:return U.UPrime;case U.UPrime:return U.U;default:return H}}function z0(H,$,V){return H&~0<<$*3|V<<$*3}function f0(H,$){return H>>$*3&7}function S0(H){return Math.trunc((34-Math.clz32(H))/3)}function i0(H){let $=0;for(let V=0;V<H.length;V++)$=z0($,V,H[V]);return $}function y0(H){const $=[];for(let V=0;V<10;V++){const T=f0(H,V);if(T)$.push(T)}return $}const n=new Map;let r=0;function X0(H,$,V,T){const E=V?1:4,z=V?4:7;for(let R=E;R<z;R++){const B=R,I=J0(H,B);if(I===5517840)continue;const k=z0(T,$-1,h0(B)),f=n.get(I);if(f===void 0)n.set(I,k);else if(typeof f==="number")n.set(I,[f,k]);else f.push(k);if($>1)X0(I,$-1,!V,k)}}function s0(){r=10,console.time("fill table"),X0(5517840,r,!0,0),X0(5517840,r,!1,0),console.timeEnd("fill table")}N0.initTable=s0;function C0(){r=0,console.time("clear table"),n.clear(),console.timeEnd("clear table")}N0.clearTable=C0;function a(H,$,V,T,E,z){let R=n.get(H);if(R!==void 0){if(typeof R==="number")R=[R];for(let k of R){if(S0(k)>V)continue;z.push(E.concat(y0(k)).map((f)=>L(f)).join(" "))}return}else if(V<=r)return;const B=T?1:4,I=T?4:7;for(let k=B;k<I;k++){const f=k,t=J0(H,f);if(E.push(f),$(t))z.push(E.map((S)=>L(S)).join(" "));else if(V>1)a(t,$,V-1,!T,E,z);E.pop()}}N0.search=a;function o0(H,$){const V=[],T=(E)=>E===5517840;return console.time("solve"),a(H,T,$,!0,[],V),a(H,T,$,!1,[],V),console.timeEnd("solve"),V}N0.solve=o0;function W0(H,$,V,T,E,z){let R=0;if(H)R=j(R,0,8);if($)R=j(R,1,8);if(V)R=j(R,2,8);if(T)R=j(R,3,8);if(E)R=j(R,4,8);if(z)R=j(R,5,8);return R}function b0(H){let $=H;const V=[3,1],T=O(H,0),E=O(H,1),z=O(H,2),R=O(H,3),B=O(H,4),I=O(H,5);if(V.indexOf(T&7)===-1)$=j($,0,T&8);if(V.indexOf(E&7)===-1)$=j($,1,E&8);if(V.indexOf(z&7)===-1)$=j($,2,z&8);if(V.indexOf(R&7)===-1)$=j($,3,R&8);if(V.indexOf(B&7)===-1)$=j($,4,B&8);if(V.indexOf(I&7)===-1)$=j($,5,I&8);return $}const p0=W0(!1,!1,!1,!1,!1,!1),x0=W0(!1,!0,!1,!0,!0,!0),T0=W0(!0,!0,!0,!0,!0,!0);function P0(H){if(O(H,7)%2===0){if((H&T0)!==p0)return!1}else if((H&T0)!==x0)return!1;const V=O(H,2),T=O(H,0);switch(O(H,6)){case 0:case 2:return!1;case 1:if(V!==1||T!==3)return!1;break;case 3:if(V!==3||T!==1)return!1;break}return!0}function n0(H,$){const V=[],T=b0(H),E=document.createElement("div");document.body.appendChild(E),M.fromString(m0(T)).html(E);function R(B){B=Array(32-B.length%32).fill("0").join("")+B;const I=[];for(let k=0;k<B.length;k+=4)I.push(B.slice(k,Math.min(k+4,B.length)));return I.join(" ")}return C0(),a(T,P0,$,!0,[],V),a(T,P0,$,!1,[],V),V}N0.solveEOLR=n0;function m0(H){const $=O(H,7),V=["U","B","D","F"];for(let S=0;S<$;S++)V.unshift(V.pop());const T=O(H,6),E=["F","L","B","R"];for(let S=0;S<T;S++)E.unshift(E.pop());function z(S){const g0=S&8;S&=7;let x;switch(S){case 0:x="UB";break;case 1:x="UR";break;case 2:x="UF";break;case 3:x="UL";break;case 4:x="DF";break;case 5:x="DB";break;default:throw new Error(`Invalid edge nibble: ${S.toString(2)}`)}if(g0)return x[1]+x[0];return x}const R=z(O(H,0)),B=z(O(H,1)),I=z(O(H,2)),k=z(O(H,3)),f=z(O(H,4)),t=z(O(H,5));return`U${R[0]}U${k[0]}${V[0]}${B[0]}U${I[0]}U`+`${E[1]}${k[1]}${E[1]}LLLLLL`+`${E[0]}${I[1]}${E[0]}F${V[3]}FF${f[1]}F`+`${E[3]}${B[1]}${E[3]}RRRRRR`+`${E[2]}${R[1]}${E[2]}B${V[1]}BB${t[1]}B`+`D${f[0]}DD${V[2]}DD${t[0]}D`}N0.stateToString=m0;function v0(H){let $=0;for(let V=0;V<H.length;V++)if(H[V]!==V){const T=H[H[V]];H[H[V]]=H[V],H[V]=T,$++,V--;continue}return $}function r0(){const H=Math.floor(4*Math.random()),$=Math.floor(4*Math.random()),V=[0,1,2,3,4,5],T=Array(6).fill(0).map(()=>V.splice(Math.floor(V.length*Math.random()),1)[0]),E=Array(6).fill(0).map(()=>Math.floor(2*Math.random()));if(E.reduce((R,B)=>R+B)%2!==0)E[0]^=1;let z=0;if(z=j(z,0,T[0]|E[0]<<3),z=j(z,1,T[1]|E[1]<<3),z=j(z,2,T[2]|E[2]<<3),z=j(z,3,T[3]|E[3]<<3),z=j(z,4,T[4]|E[4]<<3),z=j(z,5,T[5]|E[5]<<3),z=j(z,6,H),z=j(z,7,$),v0(T)%2!==(H+$)%2)z=p(z,4,5);return z}N0.getRandomState=r0})(U0||(U0={}));class $0 extends HTMLElement{#K;#Q;#Z;#_=0;constructor(){super();this.#K=document.createElement("textarea"),this.#K.placeholder="Click here to add moves",this.#K.rows=1,this.#K.spellcheck=!1,this.#K.addEventListener("input",()=>{this.#K.style.height="0px",this.#K.style.height=this.#K.scrollHeight+"px",window.cancelAnimationFrame(this.#_),this.#_=window.requestAnimationFrame(()=>{try{const K=N.fromString(this.#K.value);this.dispatchEvent(new CustomEvent("alg-parse",{detail:K})),this.#K.classList.remove("invalid"),this.#Q.style.display=""}catch(K){this.#K.classList.add("invalid"),this.#Q.textContent=K,this.#Q.style.display="block"}})}),this.#Q=document.createElement("div"),this.#Q.classList.add("error-message"),this.#Z=document.createElement("div"),this.#Z.classList.add("rows-ruler")}get value(){return this.#K.value}set value(K){this.#K.value=K,this.#K.dispatchEvent(new InputEvent("input"))}connectedCallback(){this.appendChild(this.#Z),this.appendChild(this.#K),this.appendChild(this.#Q);const K="alg-textarea-style";if(!document.querySelector(`style#${K}`)){const Q=document.createElement("style");Q.id=K,Q.textContent=`
                alg-textarea textarea, alg-textarea .rows-ruler {
                    position: relative;
                    width: 100%;
                    background-color: #444;
                    box-sizing: border-box;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 1.5em;
                    padding: 0.75em;
                    resize: none;
                    line-height: 1.2em;
                    overflow: hidden;
                }
                alg-textarea textarea.invalid {
                    background-color: #933;
                }
                alg-textarea .error-message {
                    position: relative;
                    width: 100%;
                    background-color: #b66;
                    color: white;
                    font-family: Arial, Helvetica, sans-serif;
                    text-align: center;
                    padding: 0.25em;
                    box-sizing: border-box;
                    display: none;
                }
                alg-textarea .rows-ruler {
                    position: absolute;
                    pointer-events: none;
                    white-space: pre-wrap;
                    visibility: hidden;
                }
            `,document.head.appendChild(Q)}}static get observedAttributes(){return["min-rows","value"]}attributeChangedCallback(K,Q,_){switch(K){case"min-rows":const Z=()=>{let J=Number.parseInt(_);this.#Z.textContent=Array(J).fill("\n").join(""),this.#K.style.minHeight=this.#Z.clientHeight+"px"};if(document.readyState!=="complete"){window.addEventListener("load",Z);break}Z();break;case"value":this.#K.value=_;break}}}customElements.define("alg-textarea",$0);class V0 extends HTMLElement{#K;#Q;#Z;#_;#J=0;constructor(){super();this.#K=document.createElement("div"),this.#K.className="text-input",this.#K.contentEditable="true",this.#K.spellcheck=!1,this.#K.addEventListener("beforeinput",this.#X),this.#Q=document.createElement("div"),this.#Q.className="error-message",this.#Z=document.createElement("div"),this.#Z.className="placeholder",this.#Z.textContent="Click here to add moves",this.#_=document.createElement("div"),this.#_.classList.add("text-input","rows-ruler")}get value(){return this.#K.textContent??""}set value(K){this.#K.textContent=K,this.#K.dispatchEvent(new InputEvent("input"))}connectedCallback(){this.appendChild(this.#_),this.appendChild(this.#Z),this.appendChild(this.#K),this.appendChild(this.#Q);const K="alg-input-style";if(!document.querySelector(`style#${K}`)){const _=document.createElement("style");_.id=K,_.textContent=`
                alg-input {
                    background-color: #444;
                    display: block;
                    position: relative;
                }

                alg-input .text-input {
                    position: relative;
                    line-height: 1.2em;
                    width: 100%;
                    box-sizing: border-box;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 1.5em;
                    padding: 0.75em;
                    margin: 0;
                    border-radius: 0;
                    color: white;
                    border: 1px solid #777;
                    display: inline-block;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }

                alg-input .placeholder {
                    position: absolute;
                    line-height: 1.2em;
                    font-size: 1.5em;
                    padding: 0.75em;
                    color: #777;
                    user-select: none;
                    pointer-events: none;
                }

                alg-input .error-message {
                    position: relative;
                    width: 100%;
                    background-color: #b66;
                    color: white;
                    font-family: Arial, Helvetica, sans-serif;
                    text-align: center;
                    padding: 0.25em;
                    box-sizing: border-box;
                    display: none;
                }

                alg-input .rows-ruler {
                    position: absolute;
                    width: 0px;
                    right: 0;
                    opacity: 0;
                }

                .text-input span {
                    background-color: transparent;
                }
                .text-input span.comment {
                    color: #888;
                    font-style: italic;
                }
                .text-input span.move {
                    color: #ddd;
                }
                .text-input span.punctuation {
                    /* color: white; */
                    color: #aaa;
                }
                .text-input span.rotation {
                    /* color: yellow; */
                    color: skyblue;
                }
            `,document.head.appendChild(_)}const Q=document.createElement("link");Q.rel="stylesheet",Q.href="/src/cubing/templates/alg-input.css",this.appendChild(Q)}static get observedAttributes(){return["min-rows"]}attributeChangedCallback(K,Q,_){switch(K){case"min-rows":const Z=()=>{let J=Number.parseInt(_);this.#_.textContent=Array(J).fill("\n").join(""),this.#K.style.minHeight=this.#_.clientHeight+"px"};if(document.readyState!=="complete")window.addEventListener("load",Z);else Z();break}}#X=async(K)=>{console.time("alg-input.oninput"),K.preventDefault();const Q=K.getTargetRanges()[0];if((this.#K.textContent??"")===""||this.#K.childNodes.length===1&&this.#K.firstChild?.textContent==="\n")this.#Z.style.display="";else this.#Z.style.display="none";try{let{startContainer:Z,endContainer:J}=Q,X=document.createRange();X.setStart(Z,Q.startOffset),X.setEnd(J,Q.endOffset);let W=window.getSelection(),q=J,G=0;console.assert(W!==null);let U=K.data??"";switch(K.inputType){case"insertText":{if(Z===this.#K){let L=Z.textContent??"";L=L.slice(0,Q.startOffset)+U+L.slice(Q.startOffset),Z.textContent=L,q=Z,G=Q.startOffset+U.length}break}case"insertFromPaste":case"deleteWordBackward":case"deleteSoftLineBackward":case"deleteContentBackward":{if(G=Q.startOffset,Z!==J){Z.textContent=(Z.textContent??"").slice(0,Q.startOffset);while(!0){const O=Z.nextSibling;if(O===null||O===J)break;O.remove()}J.textContent=(J.textContent??"").slice(0,Q.endOffset),q=J,G=0}else{let O=Z.textContent??"";Z.textContent=O.slice(0,Q.startOffset)+O.slice(Q.endOffset),G=Q.startOffset}if(K.inputType!=="insertFromPaste")break;const L=await navigator.clipboard.readText();let P=Z.textContent??"";Z.textContent=P.slice(0,Q.startOffset)+L+P.slice(Q.startOffset),G+=L.length;break}case"insertParagraph":{let L=!0;for(let P of this.#K.children)if(P.tagName==="BR"){L=!1;break}if(Z===this.#K){if(console.log(1),L)this.#K.prepend(document.createElement("br"));this.#K.prepend(document.createElement("br"))}else if(Z===J){console.log(2);let P=Z.textContent??"",O=P.slice(0,Q.startOffset),j=P.slice(Q.startOffset);const F=Z.cloneNode();if(Z.textContent=O,F.textContent=j,this.#K.insertBefore(F,Z.nextSibling),this.#K.insertBefore(document.createElement("br"),Z.nextSibling),L)this.#K.insertBefore(document.createElement("br"),Z.nextSibling)}else{console.log(3);let P=Z.textContent??"",O=P.slice(0,Q.startOffset),j=P.slice(Q.startOffset);const F=Z.cloneNode(),C=Z.parentElement;if(C===null){console.error("Failed to insert paragraph: Node does not have a parent.");break}if(Z.textContent=O,F.textContent=j,C.after(F),C.after(document.createElement("br")),L)C.after(document.createElement("br"))}break}default:console.error(`Unknown input type: '${K.inputType}'`)}W.collapse(q,G),this.#Q.style.display=""}catch(Z){this.#Q.textContent=Z,this.#Q.style.display="block"}console.timeEnd("alg-input.oninput")};#V(K){let Q=[],_="",Z="";for(let J=0;J<K.length;J++){const X=K[J];let W,q;switch(X.type){case"blockComment":case"lineComment":W=X.type==="blockComment"?`/*${X.value}*/`:`//${X.value}`,q="comment";break;case"move":if(X.value.match(/x|y|z/)!==null){W=X.value,q="rotation";break}default:W=X.value,q=X.type;break}if(J===0){if(_=W,q!=="whitespace")Z=q;continue}if(q===Z||q==="whitespace")_+=W;else{const G=document.createElement("span");G.textContent=_,G.className=Z,Q.push(G),_=W,Z=q}}if(_!==""){const J=document.createElement("span");J.textContent=_,J.className=Z,Q.push(J)}return Q}}customElements.define("alg-input",V0);class G0 extends HTMLElement{cube;alg;ease;#K;#Q;#Z;#_;#J;#X;#V=0;#q=0;#Y=!1;#W=!1;#O=0.001;#U=!1;constructor(){super();this.#K=document.createElement("input"),this.#K.type="range",this.#K.min="0",this.#K.max="1",this.#K.step="0.0001",this.#K.value="1",this.#Z=document.createElement("canvas"),this.#Q=document.createElement("button"),this.#Q.textContent="Play",this.#J=this.#Z.width,this.#X=this.#Z.height,this.cube=new M(3),this.alg=new N([]),this.ease=(Q)=>Q*Q*(3-2*Q),this.#_=new A(this.#Z,3),this.#_.reset(),new ResizeObserver(()=>{this.#H()}).observe(this),this.#Z.addEventListener("mousemove",(Q)=>{if(this.#Y)this.#V-=Q.movementY*0.005,this.#q-=Q.movementX*0.005,this.#H()}),this.#Z.addEventListener("mousedown",()=>{this.#Y=!0}),this.#Z.addEventListener("mouseup",()=>{this.#Y=!1}),this.#K.addEventListener("input",()=>{this.#U=!0,this.#H()}),this.#Q.addEventListener("click",()=>{if(this.#W=!this.#W,this.#K.value==="1")this.#K.value="0";this.#H()}),this.#H()}connectedCallback(){const K=document.createElement("div");K.className="bottom-wrapper",K.append(this.#K,this.#Q),this.append(this.#Z,K);const Q="alg-textarea-style";if(!document.querySelector(`style#${Q}`)){const _=document.createElement("style");_.id=Q,_.textContent=`
                puzzle-viewer {
                    display: flex;
                    flex-direction: column;
                }

                puzzle-viewer .bottom-wrapper {
                    flex-basis: 50px;
                    background-color: black;
                    padding: 10px;
                    box-sizing: border-box;

                    & input[type="range"] {
                        width: 100%;
                    }
                }
                
                puzzle-viewer canvas {
                    flex: 1;
                }
            `,this.appendChild(_)}}static get observedAttributes(){return["size","alg"]}attributeChangedCallback(K,Q,_){switch(K){case"size":{const Z=Number(_);if(Z>0&&Number.isInteger(Z)&&Z!=this.cube.getLayerCount())this.cube=new M(Z),this.#U=!0;break}case"alg":this.alg=N.fromString(_),this.#U=!0;break}this.#H()}update(){if(this.#G(this.#Z.clientWidth,this.#Z.clientHeight),this.cube.getLayerCount()!=this.#_.layerCount)this.#_.destroy(),this.#_=new A(this.#Z,this.cube.getLayerCount());if(this.#U){if(this.cube.reset(),this.#W){const Z=Math.min(Number(this.#K.value)+this.#O,1);if(Z===1)this.#W=!1;this.#K.value=Z.toString()}const K=Math.max(0,Math.min(Number(this.#K.value),1)),Q=Math.floor(K*this.alg.length),_=this.cube.executeUntil(this.alg,Q);if(this.#_.set(this.cube),_!==null){const Z=K*this.alg.length-Q;this.#_.animateMove(_,this.ease(Z))}else this.#_.clearAnimation()}if(this.render(),this.#W)this.#H()}#$=0;#H(){window.cancelAnimationFrame(this.#$),this.#$=window.requestAnimationFrame(this.update.bind(this))}render(){this.#_.setCameraTransform([0,0,-0.4],this.#V,this.#q),this.#_.render()}#G(K,Q){if(this.#J===K&&this.#X===Q)return;this.#J=K,this.#X=Q,this.#_.resize(K,Q)}}customElements.define("puzzle-viewer",G0);var O0;(function(s1){function K(Z){switch(Z){case 2:return 15;case 3:return 25;case 4:return 40;case 5:return 60;case 6:return 80;case 7:return 100;default:return 0}}function Q(Z,J){return Z+Math.floor(Math.random()*(J-Z))}function _(Z,J){const X=Math.floor(Z/2),W=Z%2===0;if(J===void 0)J=K(Z);const q=[["D","U"],["B","F"],["L","R"]],G=[];K:for(let L=0;L<J;L++){const P=Q(0,3),O=Q(0,2),j=Q(1,X+(W?O:1));for(let F=L-1;F>=0;F--){if(G[F].index0===P){if(G[F].index1===O&&G[F].width===j){L--;continue K}continue}break}G.push({index0:P,index1:O,width:j})}return G.map((L)=>{let P=q[L.index0][L.index1];if(L.width>1)if(L.width===2)P+="w";else P=`${L.width}${P}w`;return P+=["","'","2"][Q(0,3)],P}).join(" ")}s1.randomMove=_})(O0||(O0={}));export{Y0 as Whitespace,O0 as Scramble,G0 as PuzzleViewer,A as NxNDrawer,s as Move,U0 as FastLSE,M as Cube,K0 as Conjugate,e as Commutator,q0 as Comment,h as CacheCube,$0 as AlgTextarea,V0 as AlgInput,N as Alg};
