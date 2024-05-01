class l{#K;#Q;constructor(K,Q=!1){this.#K=Q?K.copy().invert():K,this.#Q=!1}next(){let K;if(this.#Q)K={done:!0,value:void 0};else K={done:!1,value:this.#K},this.#Q=!0;return K}}class d{#K;#Q;#Z;#W;constructor(K,Q=!1){this.#K=Q?4:0,this.#Q=K.algA,this.#Z=K.algB,Q=Q!==K.amount<0,this.#W=new N(Q?this.#Z:this.#Q)}next(){const K=this.#W.next();if(K.done){switch(this.#K++,this.#K){case 1:this.#W=new N(this.#Z);break;case 2:this.#W=new N(this.#Q,!0);break;case 3:this.#W=new N(this.#Z,!0);break;case 5:this.#W=new N(this.#Q);break;case 6:this.#W=new N(this.#Z,!0);break;case 7:this.#W=new N(this.#Q,!0);break;case 4:case 8:return{done:!0,value:void 0}}return this.#W.next()}return K}}class c{#K;#Q;#Z;#W;#J;constructor(K,Q=!1){this.#K=0,this.#Q=K.algA,this.#Z=K.algB,this.#J=Q!==K.amount<0,this.#W=new N(this.#Q)}next(){const K=this.#W.next();if(K.done){switch(this.#K++,this.#K){case 1:this.#W=new N(this.#Z,this.#J);break;case 2:this.#W=new N(this.#Q,!0);break;case 3:return{done:!0,value:void 0}}return this.#W.next()}return K}}class N{#K;#Q;#Z;#W;#J;constructor(K,Q=!1){this.#J=Q!==K.amount<0,this.#K=this.#J?K.nodes.length-1:0,this.#Q=Math.abs(K.amount),this.#Z=K.moveNodes,this.#W=this.#X(this.#Z[this.#K],this.#J)}#X(K,Q=!1){if(!K)return null;switch(K.type){case"Move":return new l(K,Q);case"Commutator":return new d(K,Q);case"Conjugate":return new c(K,Q);case"Alg":return new N(K,Q);default:throw new Error(`Unknown alg move node type: ${K.type}`)}}next(){if(this.#W){const K=this.#W.next();if(!K.done)return{done:!1,value:K.value}}if(this.#K+=this.#J?-1:1,this.#K<this.#Z.length&&!this.#J||this.#K>=0&&this.#J)return this.#W=this.#X(this.#Z[this.#K],this.#J),this.next();if(--this.#Q>0)return this.#K=this.#J?this.#Z.length-1:0,this.#W=this.#X(this.#Z[this.#K],this.#J),this.next();return{done:!0,value:void 0}}}function s(K,Q){return(K%Q+Q)%Q}function y(K,Q){if(!K){if(Q)throw new Error(`Assertion failed: ${Q}`);throw new Error("Assertion failed")}}function m(K,Q){y(Number.isInteger(Q),"arrayRepeat() repeat must be an integer"),y(Q>=0,"arrayRepeat() repeat must be a nonnegative integer");const W=K.length;K.length=Q*W;for(let Z=1;Z<Q;){const J=Math.min(Q-Z,Z);K.copyWithin(Z*W,0,J*W),Z+=J}return K}class e{type="Commutator";algA;algB;isGrouping;amount;length;constructor(K,Q,W=1,Z=!0){this.algA=K,this.algB=Q,this.amount=W,this.isGrouping=Z,this.length=2*(this.algA.length+this.algB.length)}copy(){return new e(this.algA.copy(),this.algB.copy(),this.amount,this.isGrouping)}expanded(){if(this.amount===0)return[];const K=this.algA.expanded(),Q=this.algB.expanded(),W=[],Z=[];for(let Y=K.length-1;Y>=0;Y--){const U=K[Y];if(U.type==="Move"){W.push(U.copy().invert());continue}W.push(U.copy())}for(let Y=Q.length-1;Y>=0;Y--){const U=Q[Y];if(U.type==="Move"){Z.push(U.copy().invert());continue}Z.push(U.copy())}let J;if(this.amount>0)J=K.concat(Q,W,Z);else J=Q.concat(K,Z,W);const X=J.length,q=m(J,Math.abs(this.amount));for(let Y=X;Y<J.length;Y++)J[Y]=J[Y].copy();return q}expandedMoves(){if(this.amount===0)return[];const K=this.algA.expandedMoves(),Q=this.algB.expandedMoves(),W=[],Z=[];for(let Y=K.length-1;Y>=0;Y--)W.push(K[Y].copy().invert());for(let Y=Q.length-1;Y>=0;Y--)Z.push(Q[Y].copy().invert());let J;if(this.amount>0)J=K.concat(Q,W,Z);else J=Q.concat(K,Z,W);const X=J.length,q=m(J,Math.abs(this.amount));for(let Y=X;Y<J.length;Y++)J[Y]=J[Y].copy();return q}invert(){const K=this.algA;return this.algA=this.algB,this.algB=K,this}toString(){const K=`[${this.algA.toString()},${this.algB.toString()}]`;if(this.isGrouping){if(Math.abs(this.amount)!==1)return`[${K}]${this.amount}${this.amount<0?"'":""}`;return`[${K}]${this.amount<0?"'":""}`}return K}simplify(){if(this.algA.simplify(),this.algB.simplify(),this.amount<0){const K=this.algA;this.algA=this.algB,this.algB=K,this.amount*=-1}return this}forward(){return{[Symbol.iterator]:()=>new d(this)}}reverse(){return{[Symbol.iterator]:()=>new d(this,!0)}}[Symbol.iterator](){return new d(this)}}class K0{type="Conjugate";algA;algB;isGrouping;amount;length;constructor(K,Q,W=1,Z=!0){this.algA=K,this.algB=Q,this.amount=W,this.isGrouping=Z,this.length=2*this.algA.length+this.algB.length}copy(){return new K0(this.algA.copy(),this.algB.copy(),this.amount,this.isGrouping)}expanded(){const K=this.algA.expanded(),Q=this.algB.expanded(),W=[];for(let X=K.length-1;X>=0;X--){const q=K[X];if(q.type==="Move"){W.push(q.copy().invert());continue}W.push(q.copy())}if(this.amount<0){for(let X=0;X<Q.length;X++){const q=Q[X];if(q.type==="Move")q.invert()}Q.reverse()}const Z=K.concat(Q,W),J=Z.length;m(Z,Math.abs(this.amount));for(let X=J;X<Z.length;X++)Z[X]=Z[X].copy();return Z}expandedMoves(){const K=this.algA.expandedMoves(),Q=this.algB.expandedMoves(),W=[];for(let X=K.length-1;X>=0;X--)W.push(K[X].copy().invert());if(this.amount<0){for(let X=0;X<Q.length;X++){const q=Q[X];if(q.type==="Move")q.invert()}Q.reverse()}const Z=K.concat(Q,W),J=Z.length;m(Z,Math.abs(this.amount));for(let X=J;X<Z.length;X++)Z[X]=Z[X].copy();return Z}invert(){return this.algB.invert(),this}toString(){const K=`${this.algA.toString()}:${this.algB.toString()}`;if(this.isGrouping){if(Math.abs(this.amount)!==1)return`[${K}]${this.amount}${this.amount<0?"'":""}`;return`[${K}]${this.amount<0?"'":""}`}return K}simplify(){if(this.algA.simplify(),this.algB.simplify(),this.amount<0)this.algB.invert(),this.amount*=-1;return this}forward(){return{[Symbol.iterator]:()=>new c(this)}}reverse(){return{[Symbol.iterator]:()=>new c(this,!0)}}[Symbol.iterator](){return new c(this)}}class P0{#K;pos=0;line=1;col=0;constructor(K){this.#K=K}get string(){return this.#K}next(){let K=this.#K.charAt(this.pos);if(this.pos++,K==="\n")this.line++,this.col=0;else this.col++;return K}peek(){return this.#K.charAt(this.pos)}skip(K){for(let Q=0;Q<K&&this.pos<this.#K.length;Q++)this.next()}match(K){return this.#K.substring(this.pos,this.pos+K.length)===K}eof(){return this.peek()===""}croak(K){throw`Error Ln ${this.line} Col ${this.col}: ${K}`}}class Q0{input;#K=new Set;constructor(K){this.input=new P0(K)}isWhitespace(K){if(!K)return!1;return" \t\n".indexOf(K)>-1}isPunctuation(K){if(!K)return!1;return"[](),:=".indexOf(K)>-1}isMove(K){if(!K)return!1;return"ufrbldmesxyz".indexOf(K.toLowerCase())>-1}isNumber(K){if(!K)return!1;return"0123456789".indexOf(K)>-1}isVariable(K){if(!K)return!1;return K>="a"&&K<="z"||K>="A"&&K<="Z"}peekVariable(){const K=this.input.string;for(let Q=this.input.pos;Q<K.length;Q++){const W=K[Q];if(W>="a"&&W<="z"||W>="A"&&W<="Z")continue;return K.substring(this.input.pos,Q)}return K.substring(this.input.pos)}readWhile(K){let Q=[];while(!this.input.eof()&&K(this.input.peek()))Q.push(this.input.next());return Q.join("")}readNumber(){return this.readWhile(this.isNumber)}readMove(){let K="";if(this.isNumber(this.input.peek()))K+=this.readNumber();if(this.input.peek()==="-")K+=this.input.next(),K+=this.readNumber();const Q=this.input.next();K+=Q;let W=this.input.peek();if(this.isNumber(W)){if(K+=this.readNumber(),this.input.peek()==="'")K+=this.input.next();return K}switch(W){case"w":if("UFRBLD".indexOf(Q)===-1)this.input.croak("Invalid move before 'w'");if(K+=this.input.next(),this.isNumber(this.input.peek()))K+=this.readNumber();if(this.input.peek()==="'")K+=this.input.next();return K;case"'":return K+this.input.next()}return K}readPunc(){return this.input.next()}readCommentToken(){const K=this.input.pos,Q=this.input.line,W=this.input.col;switch(this.input.next(),this.input.peek()){case"/":return this.input.next(),{type:"lineComment",value:this.readWhile((J)=>J!=="\n"),pos:K,line:Q,col:W};case"*":{this.input.next();let Z="";while(!this.input.eof()){if(Z+=this.readWhile((J)=>J!=="*"),this.input.match("*/"))return this.input.next(),this.input.next(),{type:"blockComment",value:Z,pos:K,line:Q,col:W};this.input.next()}this.input.croak("Syntax Error: Missing end to multi-line comment.")}default:this.input.croak("Syntax Error: Random forward slash.")}}readWhitespace(){return this.readWhile(this.isWhitespace)}readNext(){if(this.input.eof())return null;const K=this.input.pos,Q=this.input.line,W=this.input.col;let Z=this.input.peek();if(this.isWhitespace(Z))return{type:"whitespace",value:this.readWhitespace(),pos:K,line:Q,col:W};if(this.isVariable(Z)){const J=this.peekVariable();if(this.#K.has(J)){this.input.skip(J.length);let q=1;if(this.isNumber(this.input.peek()))q=Number.parseInt(this.readNumber());if(this.input.peek()==="'")this.input.next(),q*=-1;return{type:"variable",value:J,amount:q,pos:K,line:Q,col:W}}const X=this.input.string;for(let q=this.input.pos+J.length;q<X.length;q++){const Y=X[q];if(this.isWhitespace(Y))continue;if(Y==="=")return this.#K.add(J),this.input.skip(J.length),{type:"variable",value:J,pos:K,line:Q,col:W};break}}if(this.isMove(Z)||this.isNumber(Z))return{type:"move",value:this.readMove(),pos:K,line:Q,col:W};if(this.isPunctuation(Z)){let J={type:"punctuation",value:this.readPunc(),pos:K,line:Q,col:W};if((this.isNumber(this.input.peek())||this.input.peek()==="'")&&(J.value===")"||J.value==="]")){if(J.amount=Number.parseInt(this.readNumber()),isNaN(J.amount))J.amount=1;if(this.input.peek()==="'")this.input.next(),J.amount*=-1}return J}if(Z==="/")return this.readCommentToken();this.input.croak(`Syntax Error: Unexpected character: '${Z}'`)}}class i{type="Move";face;shallow=1;deep=1;amount;length=1;constructor(K,Q,W,Z){this.face=K,this.shallow=Q,this.deep=W,this.amount=Z}static fromString(K){let Q,W=1,Z=1,J=1;const X=new Q0(K);let q=X.input.peek(),Y=!1;if(X.isNumber(q)){if(Z=Number.parseInt(X.readNumber()),X.input.peek()==="-"){X.input.next();let U=Number.parseInt(X.readNumber());W=Z,Z=U,Y=!0}}if(Q=X.input.next(),Q===Q.toUpperCase()&&X.input.peek()!=="w"&&!Y&&Z!==1)W=Z;if(X.input.peek()==="w"||Q===Q.toLowerCase()){if(Z===1)Z=2}if("UFRBLD".indexOf(Q.toUpperCase())!==-1)Q=Q.toUpperCase();if(X.input.peek()==="w")X.input.next();if(X.isNumber(X.input.peek())&&!X.input.eof())J=Number.parseInt(X.readNumber());if(X.input.peek()==="'")X.input.next(),J*=-1;if(!Number.isSafeInteger(W)||!Number.isSafeInteger(Z)||!Number.isSafeInteger(J))throw"Invalid move: Number too large to have precise behavior.";if(Q.length===0)throw"Invalid move: Face is missing.";if("UFRBLDMESmesxyz".indexOf(Q)===-1)throw"Invalid move";if(W>Z)throw"Invalid move: Shallow index cannot be greater than deep index.";if(W<1)throw"Invalid move: Shallow index must be at least 1.";return new i(Q,W,Z,J)}copy(){return new i(this.face,this.shallow,this.deep,this.amount)}expanded(){return[this.copy()]}expandedMoves(){return[this.copy()]}invert(){return this.amount*=-1,this}toString(){let K="",Q=!1;if(this.deep!==1){if(Q=!0,this.shallow!==1)if(this.shallow===this.deep)K+=this.shallow,Q=!1;else K+=this.shallow+"-"+this.deep;else if(this.deep!==2)K+=this.deep}if(Q)K+=this.face.toLowerCase();else K+=this.face;if(Math.abs(this.amount)!==1)K+=Math.abs(this.amount);if(this.amount<0)K+="'";return K}simplify(){if(this.amount%=4,Math.abs(this.amount)===3)this.amount=-Math.sign(this.amount);return this}equal(K){return s(this.amount,4)===s(K.amount,4)&&this.face===K.face&&this.shallow===K.shallow&&this.deep===K.deep}forward(){return{[Symbol.iterator]:()=>new l(this)}}reverse(){return{[Symbol.iterator]:()=>new l(this,!0)}}[Symbol.iterator](){return new l(this)}}var H0=function(K,Q=!1,W=!1){let Z=[];while(!0){const J=K.next();if(!J)break;const{pos:X,line:q,col:Y}=J;if(J.type==="move"){Z.push(i.fromString(J.value));continue}if(J.type==="variable"){const U=j0.get(J.value);if(!U){v.push({message:`Undefined variable '${J.value}'`,pos:X,line:q,col:Y});continue}Z.push(U);continue}if(J.type==="punctuation")switch(J.value){case":":case",":{const U=H0(K,!1);if(Z.length===0)v.push({message:`Left-hand side of ${J.value===","?"commutator":"conjugate"} cannot be empty.`,pos:X,line:q,col:Y});else if(U.moveNodes.length===0)return v.push({message:`Right-hand side of ${J.value===","?"commutator":"conjugate"} cannot be empty.`,pos:X,line:q,col:Y}),new w(Z);Z=[new(J.value===","?e:K0)(new w(Z),U)];break}case"(":case"[":{const U=H0(K,!1,!0);if(U.isGrouping=!0,U)Z.push(U);const _=K.next();if(!_){v.push({message:`Missing closing ${J.value==="("?"parentheses":"brackets"}`,pos:X,line:q,col:Y});break}if(_.type!=="punctuation"||J.value==="("&&_.value!==")"||J.value==="["&&_.value!=="]")v.push({message:`Unexpected token '${J.value}'`,pos:X,line:q,col:Y});break}case")":case"]":if(Q)v.push({message:`Unexpected closing bracked: '${J.value}'`,pos:X,line:q,col:Y});return K.prev(),new w(Z,W?J.amount:1);default:v.push({message:`Bug: Unknown punctuation '${J.value}'`,pos:X,line:q,col:Y})}}return new w(Z)};function u0(K){const Q=new k0(K.filter((W)=>W.type!=="blockComment"&&W.type!=="lineComment"&&W.type!=="whitespace"));return j0.clear(),v.length=0,H0(Q,!0)}function L0(K){const Q=new Q0(K),W=[];while(!0){const Z=Q.readNext();if(Z===null)break;W.push(Z)}return[u0(W),v.slice()]}class k0{#K;#Q;constructor(K){this.#K=K,this.#Q=0}next(){return this.#K[this.#Q++]??null}prev(){this.#Q--}current(){return this.#K[this.#Q-1]??null}peek(){return this.#K[this.#Q]??null}peekRelevant(){for(let K=this.#Q;K<this.#K.length;K++){switch(this.#K[K].type){case"blockComment":case"lineComment":case"whitespace":continue}return this.#K[K]}return null}}var j0=new Map,v=[];class w{type="Alg";nodes;moveNodes;length;isGrouping;amount;constructor(K,Q=1,W=!1){this.nodes=K,this.moveNodes=[],this.amount=Q,this.isGrouping=W,this.length=0;for(let Z of K)switch(Z.type){case"Alg":case"Move":case"Commutator":case"Conjugate":this.moveNodes.push(Z),this.length+=Z.length;break}}static fromString(K){const[Q,W]=L0(K);if(W.length>0){let Z="";for(let J of W)Z+=`Error Ln ${J.line} Col ${J.col}: ${J.message}\n`;throw new Error(Z)}return Q}copy(){const K=[];for(let Q of this.nodes)K.push(Q.copy());return new w(K,this.amount,this.isGrouping)}expanded(){if(this.amount===0)return[];const K=[];for(let W of this.nodes){if(W.type==="Whitespace"||W.type==="Comment"){K.push(W);continue}K.push(...W.expanded())}if(this.amount<0){K.reverse();for(let W of K)if(W.type==="Move")W.invert()}const Q=K.length;m(K,Math.abs(this.amount));for(let W=Q;W<K.length;W++)K[W]=K[W].copy();return K}expandedMoves(){if(this.amount===0)return[];const K=[];for(let W of this.nodes){if(W.type==="Whitespace"||W.type==="Comment")continue;K.push(...W.expandedMoves())}if(this.amount<0)K.reverse(),K.forEach((W)=>W.invert());const Q=K.length;m(K,Math.abs(this.amount));for(let W=Q;W<K.length;W++)K[W]=K[W].copy();return K}invert(){for(let K of this.moveNodes)K.invert();return this.nodes.reverse(),this}toString(){let K="";for(let Q of this.nodes)K+=Q.toString();if(this.isGrouping){const Q=Math.abs(this.amount);if(Q!==1)K+=Q.toString();if(this.amount<0)K+="'";return`(${K})`}return K}simplify(){let K=!0;while(K){K=!1;let Q=null,W=-1;for(let Z=0;Z<this.nodes.length;Z++){let J=this.nodes[Z];if(J.type==="Whitespace"||J.type==="Comment")continue;if(J.simplify(),J.type==="Move"){if(J.amount===0){this.nodes.splice(Z,1),Z--;continue}}if(J.type==="Move"&&Q?.type==="Move"){if(J.face===Q.face){K=!0,Q.amount+=J.amount,this.nodes.splice(Z,1),Z=W;continue}}Q=J,W=Z}}return this}forward(){return{[Symbol.iterator]:()=>new N(this)}}reverse(){return{[Symbol.iterator]:()=>new N(this,!0)}}[Symbol.iterator](){return new N(this)}}class Y0{type="Comment";value;commentType;constructor(K,Q){this.value=K,this.commentType=Q}copy(){return new Y0(this.value,this.commentType)}toString(){if(this.commentType==="lineComment")return`//${this.value}`;return`/*${this.value}*/`}}class G0{type="Whitespace";value;constructor(K){this.value=K}copy(){return new G0(this.value)}toString(){return this.value}}var M0=function(K){switch(K){case G.U:return G.D;case G.F:return G.B;case G.R:return G.L;case G.B:return G.F;case G.L:return G.R;case G.D:return G.U;default:return G.U}},A0=function(K){switch(K){case G.U:return"U";case G.F:return"F";case G.R:return"R";case G.B:return"B";case G.L:return"L";case G.D:return"D";default:return"?"}},Z0=function(K){switch(K.toUpperCase()){case"U":return G.U;case"F":return G.F;case"R":return G.R;case"B":return G.B;case"L":return G.L;case"D":return G.D;default:return-1}},o=function(K,Q){let W=K%Q,Z=Math.floor(K/Q),J=Q-Z-1;return W*Q+J},l0=function(K,Q){let W=K%Q,J=Math.floor(K/Q);return(Q-W-1)*Q+J},G;(function(q){q[q["U"]=0]="U";q[q["L"]=1]="L";q[q["F"]=2]="F";q[q["R"]=3]="R";q[q["B"]=4]="B";q[q["D"]=5]="D"})(G||(G={}));class F{#K;stickers;constructor(K){console.assert(Number.isInteger(K)&&K>1),this.#K=K;let Q=K*K;this.stickers=Array(6);for(let W=0;W<6;W++){this.stickers[W]=Array(Q);for(let Z=0;Z<Q;Z++)this.stickers[W][Z]=W}}static fromString(K){const Q=Math.floor(Math.sqrt(K.length/6)),W=Q*Q,Z=new F(Q);for(let J=0;J<6;J++)for(let X=0;X<W;X++)Z.stickers[J][X]=Z0(K[J*W+X]);return Z}toString(){const K=[],Q=this.#K*this.#K;for(let W=0;W<6;W++)for(let Z=0;Z<Q;Z++)K.push(A0(this.stickers[W][Z]));return K.join("")}getLayerCount(){return this.#K}solve(){let K=this.#K*this.#K;for(let Q=0;Q<6;Q++)for(let W=0;W<K;W++)this.stickers[Q][W]=Q}solved(){let K=this.#K*this.#K;for(let Q=0;Q<6;Q++){let W=this.stickers[Q][0];for(let Z=1;Z<K;Z++)if(this.stickers[Q][Z]!==W)return!1}return!0}static#Q(K,Q,W,Z,J,X){W=W.filter((O)=>O!==J(O,!1)&&Z(O)!==Z(Q));const q=(O,L)=>{return Z(O)===Z(L)},Y=Array(K).fill(!1),U=[];let _=J(Q,!1),k=Q;Y[Z(Q)]=!0;let R=0;K:while(!0){if(R++>100)return console.error("Infinite loop error"),U;if(q(_,k)||q(_,Q)){if(q(_,k)&&!q(_,Q)){if(Y[Z(k)]=!0,U.push(_),X)X(_)}while(!0){const O=W.shift();if(O===void 0)break K;if(!Y[Z(O)]){k=O;break}}if(_=k,U.push(_),X)X(_);_=J(_,!1);continue}if(U.push(_),Y[Z(_)]=!0,X)X(_);_=J(_,!0)}return U}memoEdges(K,Q){const W=this.#W(),Z=(X)=>{return Math.floor(X/2)},J=(X)=>{const q=W[Z(X)];return q-q%2+(q+X)%2};return F.#Q(W.length,K,Q,Z,J)}static#Z(K){switch(K.reduce((W,Z)=>W|1<<Z,0)){case 17:return 0;case 9:return 1;case 5:return 2;case 3:return 3;case 12:return 4;case 6:return 5;case 18:return 6;case 24:return 7;case 36:return 8;case 40:return 9;case 48:return 10;case 34:return 11;default:throw new Error(`Invalid edge: [${K.join(", ")}]`)}}#W(){const K=this.#O(Math.floor(this.#K/2)),Q=Array(K.length);for(let W=0;W<K.length;W++){const Z=K[W];let J;if(Z.some((q)=>q===G.U||q===G.D))J=!(Z[0]===G.U||Z[0]===G.D);else J=!(Z[0]===G.F||Z[0]===G.B);const X=F.#Z(Z);Q[W]=X*2+Number(J)}return Q}memoWings(K,Q,W){const Z=this.#X(K),J=(q)=>q,X=(q)=>Z[q];return F.#Q(Z.length,Q,W,J,X)}static#J(K){switch(1<<K[0]|1<<K[1]+6){case 1025:return 0;case 80:return 1;case 513:return 2;case 72:return 3;case 257:return 4;case 68:return 5;case 129:return 6;case 66:return 7;case 516:return 8;case 264:return 9;case 132:return 10;case 258:return 11;case 144:return 12;case 1026:return 13;case 528:return 14;case 1032:return 15;case 288:return 16;case 2052:return 17;case 544:return 18;case 2056:return 19;case 1056:return 20;case 2064:return 21;case 160:return 22;case 2050:return 23;default:throw new Error(`Invalid wing: [${K.join(", ")}]`)}}#X(K){const Q=this.#_(K),W=Array(Q.length);for(let Z=0;Z<Q.length;Z++){const J=Q[Z];if(Z%2===1){const X=J[0];J[0]=J[1],J[1]=X}W[Z]=F.#J(J)}return W}memoCorners(K,Q){const W=this.#Y(),Z=(X)=>{return Math.floor(X/3)},J=(X)=>{const q=W[Z(X)];return q-q%3+(q+X)%3};return F.#Q(W.length,K,Q,Z,J)}static#V(K){switch(K.reduce((W,Z)=>W|1<<Z,0)){case 19:return 0;case 25:return 1;case 13:return 2;case 7:return 3;case 38:return 4;case 44:return 5;case 56:return 6;case 50:return 7;default:throw`Invalid corner: [${K.join(", ")}]`}}#Y(){const K=this.#$(),Q=Array(K.length);for(let W=0;W<K.length;W++){const Z=K[W];if(W%2===1){const Y=Z[1];Z[1]=Z[2],Z[2]=Y}let J=Z.findIndex((Y)=>Y===G.U||Y===G.D);if(J===-1)throw new Error(`Invalid corner triplet: [${Z.join(", ")}]`);let q=F.#V(Z)*3+J;Q[W]=q}return Q}memoCenters(K,Q,W){const Z=this.#G(K),J=Z.slice(),X=(R)=>Math.floor(R/4),q=(R)=>R,Y=(R,O)=>{if(!O)return Z[R];const B=X(Z[R])*4;for(let p=0;p<4;p++){const b=B+p;if(J[b]===b)continue;const C=Z.indexOf(b);y(C!==-1),y(X(Z[C])===X(Z[R]));const u=Z[C];Z[C]=Z[R],Z[R]=u;{const J0=J[C];J[C]=J[R],J[R]=J0}const g="ABCDEFGHIJKLMNOPQRSTUVWX";return console.log(`swap ${g[C]} ${g[R]} (${g[Z[C]]} ${g[Z[R]]})`),u}return Z[R]},_=(R)=>{const O=J[Q];J[Q]=J[R],J[R]=O},k=F.#Q(Z.length,Q,W,q,Y,_);return console.log(J.map((R)=>"ABCDEFGHIJKLMNOPQRSTUVWX"[R]).join(" ")),k}#G(K){const Q=this.#q(K),W=Array(Q.length),Z=Array(Q.length).fill(!1);for(let J=0;J<Q.length;J++){const X=Q[J],q=Math.floor(J/4);if(X===q)W[J]=J,Z[J]=!0}for(let J=0;J<Q.length;J++){if(W[J]!==void 0)continue;for(let X=0;X<4;X++){let q=Q[J]*4+X;if(!Z[q]){Z[q]=!0,W[J]=q;break}}}return y(Z.every((J)=>J===!0)),W}#q(K){const Q=[];for(let W=0;W<6;W++)for(let Z=0;Z<4;Z++)Q.push(this.stickers[W][K]),K=o(K,this.#K);return Q}#O(K){const Q=[],W=[G.U,G.L,G.F,G.R,G.B,G.D];for(let _ of W)for(let k=0;k<4;k++)Q.push(this.stickers[_][K]),K=o(K,this.#K);const Z=Q.slice(0,4),J=Q.slice(4,8),X=Q.slice(8,12),q=Q.slice(12,16),Y=Q.slice(16,20),U=Q.slice(20,24);return[[Z[0],Y[0]],[Z[1],q[0]],[Z[2],X[0]],[Z[3],J[0]],[X[1],q[3]],[X[3],J[1]],[Y[1],J[3]],[Y[3],q[1]],[U[0],X[2]],[U[1],q[2]],[U[2],Y[2]],[U[3],J[2]]]}#_(K){const Q=[];let W=this.#K-K-1;const Z=[G.U,G.L,G.F,G.R,G.B,G.D];for(let k of Z)for(let R=0;R<4;R++)Q.push(this.stickers[k][K]),Q.push(this.stickers[k][W]),K=o(K,this.#K),W=o(W,this.#K);const J=Q.slice(0,8),X=Q.slice(8,16),q=Q.slice(16,24),Y=Q.slice(24,32),U=Q.slice(32,40),_=Q.slice(40,48);return[[J[0],U[1]],[J[1],U[0]],[J[2],Y[1]],[J[3],Y[0]],[J[4],q[1]],[J[5],q[0]],[J[6],X[1]],[J[7],X[0]],[q[2],Y[7]],[q[3],Y[6]],[q[6],X[3]],[q[7],X[2]],[U[2],X[7]],[U[3],X[6]],[U[6],Y[3]],[U[7],Y[2]],[_[0],q[5]],[_[1],q[4]],[_[2],Y[5]],[_[3],Y[4]],[_[4],U[5]],[_[5],U[4]],[_[6],X[5]],[_[7],X[4]]]}#$(){const K=[],Q=[G.U,G.L,G.F,G.R,G.B,G.D];let W=0;for(let _ of Q)for(let k=0;k<4;k++)K.push(this.stickers[_][W]),W=o(W,this.#K);const Z=K.slice(0,4),J=K.slice(4,8),X=K.slice(8,12),q=K.slice(12,16),Y=K.slice(16,20),U=K.slice(20,24);return[[Z[0],Y[1],J[0]],[Z[1],Y[0],q[1]],[Z[2],X[1],q[0]],[Z[3],X[0],J[1]],[U[0],X[3],J[2]],[U[1],X[2],q[3]],[U[2],Y[3],q[2]],[U[3],Y[2],J[3]]]}#H(K){const Q=[];for(let Z of this.stickers[K]){const J=document.createElement("div");J.classList.add("sticker"),J.classList.add(A0(Z)),Q.push(J)}const W=document.createElement("div");return W.classList.add("face"),W.replaceChildren(...Q),W}#U(){const K=document.createElement("div");return K.classList.add("face"),K}html(K){K.classList.add("cube"),K.style.setProperty("--layer-count",this.#K.toString()),K.replaceChildren(this.#U(),this.#H(G.U),this.#U(),this.#U(),this.#H(G.L),this.#H(G.F),this.#H(G.R),this.#H(G.B),this.#U(),this.#H(G.D))}static#k(K){var Q;(function(Y){Y[Y["U"]=G.U]="U";Y[Y["R"]=G.R]="R";Y[Y["L"]=G.L]="L";Y[Y["D"]=G.D]="D"})(Q||(Q={}));const W=(Z,J)=>({face:Z,direction:J});switch(K){case G.U:return[W(G.B,Q.U),W(G.R,Q.U),W(G.F,Q.U),W(G.L,Q.U)];case G.L:return[W(G.U,Q.L),W(G.F,Q.L),W(G.D,Q.L),W(G.B,Q.R)];case G.F:return[W(G.U,Q.D),W(G.R,Q.L),W(G.D,Q.U),W(G.L,Q.R)];case G.R:return[W(G.U,Q.R),W(G.B,Q.L),W(G.D,Q.R),W(G.F,Q.R)];case G.B:return[W(G.U,Q.U),W(G.L,Q.L),W(G.D,Q.D),W(G.R,Q.R)];case G.D:return[W(G.F,Q.D),W(G.R,Q.D),W(G.B,Q.D),W(G.L,Q.D)];default:return console.error(`Invalid face: ${K}`),[]}}#T(K){let Q=this.stickers[K],W=Q.slice();for(let Z=0;Z<Q.length;Z++)Q[Z]=W[l0(Z,this.#K)]}#j(K){let Q=this.stickers[K],W=Q.slice();for(let Z=0;Z<Q.length;Z++)Q[Z]=W[o(Z,this.#K)]}#R(K,Q){if(Q)this.#j(K);else this.#T(K)}#L(K,Q){const W=[];switch(K){case G.U:{let Z=Q*this.#K;for(let J=0;J<this.#K;J++)W.push(Z+J);return W}case G.R:{let Z=this.#K-Q-1;for(let J=0;J<this.#K;J++)W.push(Z+this.#K*J);return W}case G.L:{let Z=Q;for(let J=this.#K-1;J>=0;J--)W.push(Z+this.#K*J);return W}case G.D:{let Z=(this.#K-Q)*this.#K-this.#K;for(let J=this.#K-1;J>=0;J--)W.push(Z+J);return W}default:return console.error(`Invalid direction: ${K}`),[]}}#P(K,Q){const W=F.#k(K),Z=[];for(let X of W)Z.push(this.#L(X.direction,Q));let J=[];for(let X of Z[0])J[X]=this.stickers[W[0].face][X];for(let X=0;X<Z.length;X++){const q=this.stickers?.[W[X+1]?.face]??J;for(let Y=0;Y<Z[0].length;Y++){const U=Z[X][Y],_=Z[(X+1)%Z.length][Y];if(!Number.isInteger(q[_])){console.error(`Invalid index: ${_}`);continue}this.stickers[W[X].face][U]=q[_]}}}#z(K,Q){for(let W=0;W<3;W++)this.#P(K,Q)}#M(K,Q,W){if(W)this.#P(K,Q);else this.#z(K,Q)}reset(){for(let K=0;K<6;K++)for(let Q=0;Q<this.stickers[K].length;Q++)this.stickers[K][Q]=K}move(K,Q,W=1,Z=1){let J=Q<0;if(Q=Math.abs(Q)%4,Q===0)return;J=Q===3!==J;let X=Q===2;if(W=Math.min(W,this.#K),Z=Math.min(Z,this.#K),!X){if(W===1)this.#R(K,J);if(Z>=this.#K)this.#R(M0(K),!J);for(let q=W-1;q<Z;q++)this.#M(K,q,J)}else{if(W===1)this.#T(K),this.#T(K);if(Z>=this.#K){let q=M0(K);this.#T(q),this.#T(q)}for(let q=W-1;q<Z;q++)this.#z(K,q),this.#z(K,q)}}execute(K){for(let Q of K)if("UFRBLD".indexOf(Q.face)>-1)this.move(Z0(Q.face),Q.amount,Q.shallow,Q.deep);else if("MES".indexOf(Q.face)>-1){if(this.#K%2===0)continue;let W=Z0("LDF"["MES".indexOf(Q.face)]),Z=(this.#K-1)/2+1;this.move(W,Q.amount,Z,Z)}else if("mes".indexOf(Q.face)>-1){let W=Z0("LDF"["mes".indexOf(Q.face)]);this.move(W,Q.amount,2,this.#K-1)}else if("xyz".indexOf(Q.face)>-1){let W=Z0("RUF"["xyz".indexOf(Q.face)]);this.move(W,Q.amount,1,this.#K)}else console.error(`Move ${Q.face} not supported.`)}executeUntil(K,Q){for(let W of K){if(Q--<=0)return W;this.execute(W)}return null}}class f{layerCount;cube;stickersPerFace;#K;#Q;constructor(K){this.layerCount=K,this.cube=new F(K),this.stickersPerFace=K**2,this.#K=new F(K),this.#Q=new WeakMap}static#Z(K,Q,W){const Z=K.stickers[Q[0][0]][Q[0][1]];for(let J=0;J<Q.length;J++){const X=Q[J],q=s(J+W,Q.length),Y=q===0?Z:K.stickers[Q[q][0]][Q[q][1]];K.stickers[X[0]][X[1]]=Y}}static#W(K,Q,W){const Z=Q[Q.length-1],J=K.stickers[Z[0]][Z[1]];for(let X=Q.length-1;X>=0;X--){const q=Q[X],Y=s(X+W,Q.length),U=Y===Q.length-1?J:K.stickers[Q[Y][0]][Q[Y][1]];K.stickers[q[0]][q[1]]=U}}static#J(K,Q,W){if(W===0)return;if(W>0)for(let Z of Q)this.#Z(K,Z,W);else for(let Z of Q)this.#W(K,Z,W)}#X(K,Q){return K*this.stickersPerFace+Q}#V(K,Q){const W=[];let Z=K,J=Q;do{W.push([Z,J]);const X=this.#K.stickers[Z][J];Z=Math.floor(X/this.stickersPerFace),J=X%this.stickersPerFace}while(Z!==K||J!==Q);return W}#Y(){const K=[],Q=new Set;for(let W=0;W<6;W++)for(let Z=0;Z<this.stickersPerFace;Z++){const J=this.#X(W,Z);if(Q.has(J))continue;if(this.#K.stickers[W][Z]!==J){const X=this.#V(W,Z);for(let q=1;q<X.length;q++)Q.add(this.#X(X[q][0],X[q][1]));K.push(X)}}return K}#G(){for(let K=0;K<6;K++)for(let Q=0;Q<this.stickersPerFace;Q++)this.#K.stickers[K][Q]=this.#X(K,Q)}recordAlg(K){this.#G();let Q=K.amount;K.amount=1,this.#K.execute(K),K.amount=Q;const W=this.#Y();return this.#Q.set(K,W),W}#q(K){if(this.#Q.has(K))return;this.#G();for(let Q of K.moveNodes)switch(Q.type){case"Alg":this.#q(Q);break;case"Commutator":case"Conjugate":this.#q(Q.algA),this.#q(Q.algB);case"Move":continue;default:throw new Error(`Unimplemented alg move node type in CacheCube.execute(): '${Q.type}'`)}this.#G();for(let Q of K.moveNodes)switch(Q.type){case"Alg":{const W=this.#Q.get(Q);y(W!==void 0),f.#J(this.#K,W,Q.amount);break}case"Commutator":case"Conjugate":{const W=this.#Q.get(Q.algA),Z=this.#Q.get(Q.algB);y(W!==void 0&&Z!==void 0);const J=Math.abs(Q.amount);if(Q.amount>0){if(f.#J(this.#K,W,J*Q.algA.amount),f.#J(this.#K,Z,J*Q.algB.amount),f.#J(this.#K,W,-J*Q.algA.amount),Q.type==="Commutator")f.#J(this.#K,Z,-J*Q.algB.amount)}else{if(Q.type==="Commutator")f.#J(this.#K,Z,J*Q.algB.amount);f.#J(this.#K,W,J*Q.algA.amount),f.#J(this.#K,Z,-J*Q.algB.amount),f.#J(this.#K,W,-J*Q.algA.amount)}break}case"Move":this.#K.execute(Q)}this.#Q.set(K,this.#Y())}execute(K){let Q=this.#Q.get(K);if(Q){f.#J(this.cube,Q,K.amount);return}this.#q(K),Q=this.#Q.get(K),y(Q!==void 0),f.#J(this.cube,Q,K.amount)}}var d0=await navigator.gpu?.requestAdapter(),c0=await d0?.requestDevice(),A=c0;function E0(K,Q){Q??=new Float32Array(16);for(let W=0;W<4;W++)for(let Z=0;Z<4;Z++)Q[W*4+Z]=K[Z*4+W];return Q}function W0(K,Q,W){W??=new Float32Array(16);for(let Z=0;Z<4;Z++)for(let J=0;J<4;J++){const X=Z*4+J;W[X]=0;for(let q=0;q<4;q++)W[X]+=K[Z*4+q]*Q[q*4+J]}return W}function D0(K){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,K[0],K[1],K[2],1])}function F0(K,Q){Q??=new Float32Array(16);const W=Math.cos(K),Z=Math.sin(K);return Q.set([1,0,0,0,0,W,-Z,0,0,Z,W,0,0,0,0,1]),Q}function B0(K,Q){Q??=new Float32Array(16);const W=Math.cos(K),Z=Math.sin(K);return Q.set([W,0,Z,0,0,1,0,0,-Z,0,W,0,0,0,0,1]),Q}function I0(K){return new Float32Array([K[0],0,0,0,0,K[1],0,0,0,0,K[2],0,0,0,0,1])}function N0(K,Q,W){return new Float32Array([K/Q,0,0,0,0,K,0,0,0,0,-1,-2*W,0,0,-1,0])}class M{layerCount;#K;#Q;#Z;#W;#J;#X;#V;#Y;#G;#q;#O=1;#_;constructor(K,Q){this.layerCount=Q,this.#K=K;let W;[this.#Q,W]=M.#H(K),this.#Z=M.#U(K.width,K.height),this.#W=M.#k(this.#Z),this.#J=M.#T(Q);const Z=M.#j(),J=M.#R(Z);this.#X=M.#L(this.#J,J,W,this.#Z.format),this.#V=M.#P(this.#J,J),this.#Y=M.#M(Q),this.#G=M.#A(),this.#q=M.#E(),this.#_=M.#D(Z,this.#G,this.#Y,this.#q),this.reset(),this.clearAnimation()}render(){const K=A.createCommandEncoder({label:"Draw NxN"});this.#W.colorAttachments[0].view=this.#Q.getCurrentTexture().createView();const Q=K.beginRenderPass(this.#W);Q.setPipeline(this.#X);for(let W=0;W<this.#_.length;W++)Q.setBindGroup(W,this.#_[W]);Q.draw(4,6*this.#O),Q.end(),A.queue.submit([K.finish()])}reset(){const K=A.createCommandEncoder({label:"Reset NxN"}),Q=K.beginComputePass();Q.setPipeline(this.#V);for(let W=0;W<this.#_.length;W++)Q.setBindGroup(W,this.#_[W]);Q.dispatchWorkgroups(Math.ceil(this.#Y.size/256)),Q.end(),A.queue.submit([K.finish()])}setCameraTransform(K,Q,W){const Z=W0(I0(Array(3).fill(0.8)),W0(W0(B0(W),F0(Q)),D0(K))),J=N0(2,this.#K.width/this.#K.height,0.01),X=new Float32Array(16);X.set(W0(Z,E0(J))),A.queue.writeBuffer(this.#G,0,X)}set(K){const Q=new ArrayBuffer(this.#Y.size),W=new Uint32Array(Q);let Z=0,J=0;for(let X=0;X<K.stickers.length;X++)for(let q=0;q<K.stickers[X].length;q++)if(W[Z]|=K.stickers[X][q]<<J,J+=3,J>=30)Z++,J=0;A.queue.writeBuffer(this.#Y,0,Q)}static#$(K,Q,W,Z){if(Q<=0)return[];return[K|Q<<16,W|Z<<16]}animateMove(K,Q){function W(q,Y){return(q%Y+Y)%Y}const Z="ULFRBD".indexOf(K.face.toUpperCase());if(Z===-1)throw new Error(`Unsupported face '${K.face}'`);const J=[],X=W(Math.floor(65535*Q*K.amount/4),65535);if(K.shallow===1)J.push(...M.#$(X,K.deep,this.layerCount-K.deep,Z)),J.push(...M.#$(0,this.layerCount-K.deep,0,Z));else J.push(...M.#$(0,K.shallow-1,this.layerCount-K.shallow+1,Z)),J.push(...M.#$(X,K.deep-K.shallow+1,this.layerCount-K.deep,Z)),J.push(...M.#$(0,this.layerCount-K.deep,0,Z));this.#O=J.length/2,A.queue.writeBuffer(this.#q,0,new Uint32Array(J))}clearAnimation(){const K=new Uint32Array(M.#$(0,this.layerCount,0,0));this.#O=1,A.queue.writeBuffer(this.#q,0,new Uint32Array(K))}destroy(){this.#Q.unconfigure(),this.#Z.destroy(),this.#Y.destroy(),this.#G.destroy()}resize(K,Q){if(this.#K.width===K&&this.#K.height===Q)return;this.#K.width=K,this.#K.height=Q,this.#Z.destroy(),this.#Z=M.#U(K,Q);const W=this.#W.depthStencilAttachment;W.view=this.#Z.createView()}static#H(K){y(K.width!==0&&K.height!==0);const Q=K.getContext("webgpu");if(!Q)throw new Error("Failed to initialize WebGPU canvas context");const W=navigator.gpu.getPreferredCanvasFormat();return Q.configure({device:A,format:W}),[Q,W]}static#U(K,Q){return A.createTexture({size:{width:K,height:Q},format:"depth16unorm",dimension:"2d",usage:GPUTextureUsage.RENDER_ATTACHMENT})}static#k(K){return{label:"Draw NxN Render Pass Descriptor",colorAttachments:[{view:null,clearValue:[1,1,1,1],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:K.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}}}static#T(K){const Q=M.#z(K)/4,W=`
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
        `;return A.createShaderModule({label:"puzzle shader module",code:W})}static#j(){return A.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]})}static#R(K){return A.createPipelineLayout({bindGroupLayouts:[K]})}static#L(K,Q,W,Z){return A.createRenderPipeline({label:"Draw Puzzle Render Pipeline",layout:Q,vertex:{module:K,entryPoint:"vert_main"},fragment:{module:K,entryPoint:"frag_main",targets:[{format:W}]},depthStencil:{format:Z,depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-strip"}})}static#P(K,Q){return A.createComputePipeline({layout:Q,compute:{module:K,entryPoint:"initStickers"}})}static#z(K){return Math.ceil(6*K*K/10)*4}static#M(K){return A.createBuffer({label:"Sticker Buffer",size:M.#z(K),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}static#A(){return A.createBuffer({size:80,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}static#E(){return A.createBuffer({size:24,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}static#D(K,Q,W,Z){return[A.createBindGroup({layout:K,entries:[{binding:0,resource:{buffer:Q}},{binding:1,resource:{buffer:W}},{binding:2,resource:{buffer:Z}}]})]}}var _0;(function(w0){w0.SOLVED_STATE=5517840;const Q=0,W=1,Z=2,J=3,X=4,q=5,Y=6,U=7;let _;(function(P){P[P["M"]=1]="M";P[P["M2"]=2]="M2";P[P["MPrime"]=3]="MPrime";P[P["U"]=4]="U";P[P["U2"]=5]="U2";P[P["UPrime"]=6]="UPrime"})(_||(_={}));function k(H){switch(H){case _.M:return"M";case _.M2:return"M2";case _.MPrime:return"M'";case _.U:return"U";case _.UPrime:return"U'";case _.U2:return"U2";default:throw new Error(`Invalid LSE move number: '${H}'`)}}function R(H){switch(H){case"M":return _.M;case"M'":return _.MPrime;case"M2":return _.M2;case"U":return _.U;case"U'":return _.UPrime;case"U2":return _.U2;default:throw new Error(`Invalid LSE move: '${H}'`)}}w0.stringToLseMove=R;function O(H,$){return H>>$*4&15}function L(H,$,V){return H&(~0^15<<$*4)|V<<$*4}function B(H,$,V,z,j){let T=H;return T=L(T,$,O(H,j)),T=L(T,V,O(H,$)),T=L(T,z,O(H,V)),T=L(T,j,O(H,z)),T}function p(H,$,V,z,j){let T=H;return T=L(T,$,O(H,V)),T=L(T,V,O(H,z)),T=L(T,z,O(H,j)),T=L(T,j,O(H,$)),T}function b(H,$,V){let z=H;return z=L(z,$,O(H,V)),z=L(z,V,O(H,$)),z}function C(H){return H^8914952}function u(H,$){return L(H,7,(O(H,7)+$)%4)}function g(H,$){return L(H,6,(O(H,6)+$)%4)}function J0(H,$){switch($){case _.M:H=p(H,0,5,4,2),H=C(H),H=u(H,3);break;case _.MPrime:H=B(H,0,5,4,2),H=C(H),H=u(H,1);break;case _.M2:H=b(H,0,4),H=b(H,2,5),H=u(H,2);break;case _.U:H=B(H,0,1,2,3),H=g(H,1);break;case _.UPrime:H=p(H,0,1,2,3),H=g(H,3);break;case _.U2:H=b(H,0,2),H=b(H,1,3),H=g(H,2);break;default:throw new Error(`Invalid move: '${$}'`)}return H}w0.move=J0;function f0(H){switch(H){case _.M:return _.MPrime;case _.MPrime:return _.M;case _.U:return _.UPrime;case _.UPrime:return _.U;default:return H}}function T0(H,$,V){return H&~0<<$*3|V<<$*3}function h0(H,$){return H>>$*3&7}function S0(H){return Math.trunc((34-Math.clz32(H))/3)}function s0(H){let $=0;for(let V=0;V<H.length;V++)$=T0($,V,H[V]);return $}function y0(H){const $=[];for(let V=0;V<10;V++){const z=h0(H,V);if(z)$.push(z)}return $}const n=new Map;let r=0;function X0(H,$,V,z){const j=V?1:4,T=V?4:7;for(let P=j;P<T;P++){const E=P,I=J0(H,E);if(I===5517840)continue;const D=T0(z,$-1,f0(E)),h=n.get(I);if(h===void 0)n.set(I,D);else if(typeof h==="number")n.set(I,[h,D]);else h.push(D);if($>1)X0(I,$-1,!V,D)}}function i0(){r=10,console.time("fill table"),X0(5517840,r,!0,0),X0(5517840,r,!1,0),console.timeEnd("fill table")}w0.initTable=i0;function p0(){r=0,console.time("clear table"),n.clear(),console.timeEnd("clear table")}w0.clearTable=p0;function a(H,$,V,z,j,T){let P=n.get(H);if(P!==void 0){if(typeof P==="number")P=[P];for(let D of P){if(S0(D)>V)continue;T.push(j.concat(y0(D)).map((h)=>k(h)).join(" "))}return}else if(V<=r)return;const E=z?1:4,I=z?4:7;for(let D=E;D<I;D++){const h=D,t=J0(H,h);if(j.push(h),$(t))T.push(j.map((S)=>k(S)).join(" "));else if(V>1)a(t,$,V-1,!z,j,T);j.pop()}}w0.search=a;function o0(H,$){const V=[],z=(j)=>j===5517840;return console.time("solve"),a(H,z,$,!0,[],V),a(H,z,$,!1,[],V),console.timeEnd("solve"),V}w0.solve=o0;function q0(H,$,V,z,j,T){let P=0;if(H)P=L(P,0,8);if($)P=L(P,1,8);if(V)P=L(P,2,8);if(z)P=L(P,3,8);if(j)P=L(P,4,8);if(T)P=L(P,5,8);return P}function C0(H){let $=H;const V=[3,1],z=O(H,0),j=O(H,1),T=O(H,2),P=O(H,3),E=O(H,4),I=O(H,5);if(V.indexOf(z&7)===-1)$=L($,0,z&8);if(V.indexOf(j&7)===-1)$=L($,1,j&8);if(V.indexOf(T&7)===-1)$=L($,2,T&8);if(V.indexOf(P&7)===-1)$=L($,3,P&8);if(V.indexOf(E&7)===-1)$=L($,4,E&8);if(V.indexOf(I&7)===-1)$=L($,5,I&8);return $}const b0=q0(!1,!1,!1,!1,!1,!1),x0=q0(!1,!0,!1,!0,!0,!0),z0=q0(!0,!0,!0,!0,!0,!0);function R0(H){if(O(H,7)%2===0){if((H&z0)!==b0)return!1}else if((H&z0)!==x0)return!1;const V=O(H,2),z=O(H,0);switch(O(H,6)){case 0:case 2:return!1;case 1:if(V!==1||z!==3)return!1;break;case 3:if(V!==3||z!==1)return!1;break}return!0}function n0(H,$){const V=[],z=C0(H),j=document.createElement("div");document.body.appendChild(j),F.fromString(m0(z)).html(j);function P(E){E=Array(32-E.length%32).fill("0").join("")+E;const I=[];for(let D=0;D<E.length;D+=4)I.push(E.slice(D,Math.min(D+4,E.length)));return I.join(" ")}return p0(),a(z,R0,$,!0,[],V),a(z,R0,$,!1,[],V),V}w0.solveEOLR=n0;function m0(H){const $=O(H,7),V=["U","B","D","F"];for(let S=0;S<$;S++)V.unshift(V.pop());const z=O(H,6),j=["F","L","B","R"];for(let S=0;S<z;S++)j.unshift(j.pop());function T(S){const g0=S&8;S&=7;let x;switch(S){case 0:x="UB";break;case 1:x="UR";break;case 2:x="UF";break;case 3:x="UL";break;case 4:x="DF";break;case 5:x="DB";break;default:throw new Error(`Invalid edge nibble: ${S.toString(2)}`)}if(g0)return x[1]+x[0];return x}const P=T(O(H,0)),E=T(O(H,1)),I=T(O(H,2)),D=T(O(H,3)),h=T(O(H,4)),t=T(O(H,5));return`U${P[0]}U${D[0]}${V[0]}${E[0]}U${I[0]}U`+`${j[1]}${D[1]}${j[1]}LLLLLL`+`${j[0]}${I[1]}${j[0]}F${V[3]}FF${h[1]}F`+`${j[3]}${E[1]}${j[3]}RRRRRR`+`${j[2]}${P[1]}${j[2]}B${V[1]}BB${t[1]}B`+`D${h[0]}DD${V[2]}DD${t[0]}D`}w0.stateToString=m0;function v0(H){let $=0;for(let V=0;V<H.length;V++)if(H[V]!==V){const z=H[H[V]];H[H[V]]=H[V],H[V]=z,$++,V--;continue}return $}function r0(){const H=Math.floor(4*Math.random()),$=Math.floor(4*Math.random()),V=[0,1,2,3,4,5],z=Array(6).fill(0).map(()=>V.splice(Math.floor(V.length*Math.random()),1)[0]),j=Array(6).fill(0).map(()=>Math.floor(2*Math.random()));if(j.reduce((P,E)=>P+E)%2!==0)j[0]^=1;let T=0;if(T=L(T,0,z[0]|j[0]<<3),T=L(T,1,z[1]|j[1]<<3),T=L(T,2,z[2]|j[2]<<3),T=L(T,3,z[3]|j[3]<<3),T=L(T,4,z[4]|j[4]<<3),T=L(T,5,z[5]|j[5]<<3),T=L(T,6,H),T=L(T,7,$),v0(z)%2!==(H+$)%2)T=b(T,4,5);return T}w0.getRandomState=r0})(_0||(_0={}));class $0 extends HTMLElement{#K;#Q;#Z;#W=0;constructor(){super();this.#K=document.createElement("textarea"),this.#K.placeholder="Click here to add moves",this.#K.rows=1,this.#K.spellcheck=!1,this.#K.addEventListener("input",()=>{this.#K.style.height="0px",this.#K.style.height=this.#K.scrollHeight+"px",window.cancelAnimationFrame(this.#W),this.#W=window.requestAnimationFrame(()=>{try{const K=w.fromString(this.#K.value);this.dispatchEvent(new CustomEvent("alg-parse",{detail:K})),this.#K.classList.remove("invalid"),this.#Q.style.display=""}catch(K){this.#K.classList.add("invalid"),this.#Q.textContent=K,this.#Q.style.display="block"}})}),this.#Q=document.createElement("div"),this.#Q.classList.add("error-message"),this.#Z=document.createElement("div"),this.#Z.classList.add("rows-ruler")}get value(){return this.#K.value}set value(K){this.#K.value=K,this.#K.dispatchEvent(new InputEvent("input"))}connectedCallback(){this.appendChild(this.#Z),this.appendChild(this.#K),this.appendChild(this.#Q);const K="alg-textarea-style";if(!document.querySelector(`style#${K}`)){const Q=document.createElement("style");Q.id=K,Q.textContent=`
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
            `,document.head.appendChild(Q)}}static get observedAttributes(){return["min-rows","value"]}attributeChangedCallback(K,Q,W){switch(K){case"min-rows":const Z=()=>{let J=Number.parseInt(W);this.#Z.textContent=Array(J).fill("\n").join(""),this.#K.style.minHeight=this.#Z.clientHeight+"px"};if(document.readyState!=="complete"){window.addEventListener("load",Z);break}Z();break;case"value":this.#K.value=W;break}}}customElements.define("alg-textarea",$0);class V0 extends HTMLElement{#K;#Q;#Z;#W;#J=0;constructor(){super();this.#K=document.createElement("div"),this.#K.className="text-input",this.#K.contentEditable="true",this.#K.spellcheck=!1,this.#K.addEventListener("beforeinput",this.#X),this.#Q=document.createElement("div"),this.#Q.className="error-message",this.#Z=document.createElement("div"),this.#Z.className="placeholder",this.#Z.textContent="Click here to add moves",this.#W=document.createElement("div"),this.#W.classList.add("text-input","rows-ruler")}get value(){return this.#K.textContent??""}set value(K){this.#K.textContent=K,this.#K.dispatchEvent(new InputEvent("input"))}connectedCallback(){this.appendChild(this.#W),this.appendChild(this.#Z),this.appendChild(this.#K),this.appendChild(this.#Q);const K="alg-input-style";if(!document.querySelector(`style#${K}`)){const W=document.createElement("style");W.id=K,W.textContent=`
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
            `,document.head.appendChild(W)}const Q=document.createElement("link");Q.rel="stylesheet",Q.href="/src/cubing/templates/alg-input.css",this.appendChild(Q)}static get observedAttributes(){return["min-rows"]}attributeChangedCallback(K,Q,W){switch(K){case"min-rows":const Z=()=>{let J=Number.parseInt(W);this.#W.textContent=Array(J).fill("\n").join(""),this.#K.style.minHeight=this.#W.clientHeight+"px"};if(document.readyState!=="complete")window.addEventListener("load",Z);else Z();break}}#X=async(K)=>{console.time("alg-input.oninput"),K.preventDefault();const Q=K.getTargetRanges()[0];if((this.#K.textContent??"")===""||this.#K.childNodes.length===1&&this.#K.firstChild?.textContent==="\n")this.#Z.style.display="";else this.#Z.style.display="none";try{let{startContainer:Z,endContainer:J}=Q,X=document.createRange();X.setStart(Z,Q.startOffset),X.setEnd(J,Q.endOffset);let q=window.getSelection(),Y=J,U=0;console.assert(q!==null);let _=K.data??"";switch(K.inputType){case"insertText":{if(Z===this.#K){let k=Z.textContent??"";k=k.slice(0,Q.startOffset)+_+k.slice(Q.startOffset),Z.textContent=k,Y=Z,U=Q.startOffset+_.length}break}case"insertFromPaste":case"deleteWordBackward":case"deleteSoftLineBackward":case"deleteContentBackward":{if(U=Q.startOffset,Z!==J){Z.textContent=(Z.textContent??"").slice(0,Q.startOffset);while(!0){const O=Z.nextSibling;if(O===null||O===J)break;O.remove()}J.textContent=(J.textContent??"").slice(0,Q.endOffset),Y=J,U=0}else{let O=Z.textContent??"";Z.textContent=O.slice(0,Q.startOffset)+O.slice(Q.endOffset),U=Q.startOffset}if(K.inputType!=="insertFromPaste")break;const k=await navigator.clipboard.readText();let R=Z.textContent??"";Z.textContent=R.slice(0,Q.startOffset)+k+R.slice(Q.startOffset),U+=k.length;break}case"insertParagraph":{let k=!0;for(let R of this.#K.children)if(R.tagName==="BR"){k=!1;break}if(Z===this.#K){if(console.log(1),k)this.#K.prepend(document.createElement("br"));this.#K.prepend(document.createElement("br"))}else if(Z===J){console.log(2);let R=Z.textContent??"",O=R.slice(0,Q.startOffset),L=R.slice(Q.startOffset);const B=Z.cloneNode();if(Z.textContent=O,B.textContent=L,this.#K.insertBefore(B,Z.nextSibling),this.#K.insertBefore(document.createElement("br"),Z.nextSibling),k)this.#K.insertBefore(document.createElement("br"),Z.nextSibling)}else{console.log(3);let R=Z.textContent??"",O=R.slice(0,Q.startOffset),L=R.slice(Q.startOffset);const B=Z.cloneNode(),p=Z.parentElement;if(p===null){console.error("Failed to insert paragraph: Node does not have a parent.");break}if(Z.textContent=O,B.textContent=L,p.after(B),p.after(document.createElement("br")),k)p.after(document.createElement("br"))}break}default:console.error(`Unknown input type: '${K.inputType}'`)}q.collapse(Y,U),this.#Q.style.display=""}catch(Z){this.#Q.textContent=Z,this.#Q.style.display="block"}console.timeEnd("alg-input.oninput")};#V(K){let Q=[],W="",Z="";for(let J=0;J<K.length;J++){const X=K[J];let q,Y;switch(X.type){case"blockComment":case"lineComment":q=X.type==="blockComment"?`/*${X.value}*/`:`//${X.value}`,Y="comment";break;case"move":if(X.value.match(/x|y|z/)!==null){q=X.value,Y="rotation";break}default:q=X.value,Y=X.type;break}if(J===0){if(W=q,Y!=="whitespace")Z=Y;continue}if(Y===Z||Y==="whitespace")W+=q;else{const U=document.createElement("span");U.textContent=W,U.className=Z,Q.push(U),W=q,Z=Y}}if(W!==""){const J=document.createElement("span");J.textContent=W,J.className=Z,Q.push(J)}return Q}}customElements.define("alg-input",V0);class U0 extends HTMLElement{cube;alg;ease;#K;#Q;#Z;#W;#J;#X;#V=0;#Y=0;#G=!1;#q=!1;#O=0.001;#_=!1;constructor(){super();this.#K=document.createElement("input"),this.#K.type="range",this.#K.min="0",this.#K.max="1",this.#K.step="0.0001",this.#K.value="1",this.#Z=document.createElement("canvas"),this.#Q=document.createElement("button"),this.#Q.textContent="Play",this.#J=this.#Z.width,this.#X=this.#Z.height,this.cube=new F(3),this.alg=new w([]),this.ease=(Q)=>Q*Q*(3-2*Q),this.#W=new M(this.#Z,3),this.#W.reset(),new ResizeObserver(()=>{this.#H()}).observe(this),this.#Z.addEventListener("mousemove",(Q)=>{if(this.#G)this.#V-=Q.movementY*0.005,this.#Y-=Q.movementX*0.005,this.#H()}),this.#Z.addEventListener("mousedown",()=>{this.#G=!0}),this.#Z.addEventListener("mouseup",()=>{this.#G=!1}),this.#K.addEventListener("input",()=>{this.#_=!0,this.#H()}),this.#Q.addEventListener("click",()=>{if(this.#q=!this.#q,this.#K.value==="1")this.#K.value="0";this.#H()}),this.#H()}connectedCallback(){const K=document.createElement("div");K.className="bottom-wrapper",K.append(this.#K,this.#Q),this.append(this.#Z,K);const Q="alg-textarea-style";if(!document.querySelector(`style#${Q}`)){const W=document.createElement("style");W.id=Q,W.textContent=`
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
            `,this.appendChild(W)}}static get observedAttributes(){return["size","alg"]}attributeChangedCallback(K,Q,W){switch(K){case"size":{const Z=Number(W);if(Z>0&&Number.isInteger(Z)&&Z!=this.cube.getLayerCount())this.cube=new F(Z),this.#_=!0;break}case"alg":this.alg=w.fromString(W),this.#_=!0;break}this.#H()}update(){if(this.#U(this.#Z.clientWidth,this.#Z.clientHeight),this.cube.getLayerCount()!=this.#W.layerCount)this.#W.destroy(),this.#W=new M(this.#Z,this.cube.getLayerCount());if(this.#_){if(this.cube.reset(),this.#q){const Z=Math.min(Number(this.#K.value)+this.#O,1);if(Z===1)this.#q=!1;this.#K.value=Z.toString()}const K=Math.max(0,Math.min(Number(this.#K.value),1)),Q=Math.floor(K*this.alg.length),W=this.cube.executeUntil(this.alg,Q);if(this.#W.set(this.cube),W!==null){const Z=K*this.alg.length-Q;this.#W.animateMove(W,this.ease(Z))}else this.#W.clearAnimation()}if(this.render(),this.#q)this.#H()}#$=0;#H(){window.cancelAnimationFrame(this.#$),this.#$=window.requestAnimationFrame(this.update.bind(this))}render(){this.#W.setCameraTransform([0,0,-0.4],this.#V,this.#Y),this.#W.render()}#U(K,Q){if(this.#J===K&&this.#X===Q)return;this.#J=K,this.#X=Q,this.#W.resize(K,Q)}}customElements.define("puzzle-viewer",U0);var O0;(function(i4){function K(Z){switch(Z){case 2:return 15;case 3:return 25;case 4:return 40;case 5:return 60;case 6:return 80;case 7:return 100;default:return 0}}function Q(Z,J){return Z+Math.floor(Math.random()*(J-Z))}function W(Z,J){const X=Math.floor(Z/2),q=Z%2===0;if(J===void 0)J=K(Z);const Y=[["D","U"],["B","F"],["L","R"]],U=[];K:for(let k=0;k<J;k++){const R=Q(0,3),O=Q(0,2),L=Q(1,X+(q?O:1));for(let B=k-1;B>=0;B--){if(U[B].index0===R){if(U[B].index1===O&&U[B].width===L){k--;continue K}continue}break}U.push({index0:R,index1:O,width:L})}return U.map((k)=>{let R=Y[k.index0][k.index1];if(k.width>1)if(k.width===2)R+="w";else R=`${k.width}${R}w`;return R+=["","'","2"][Q(0,3)],R}).join(" ")}i4.randomMove=W})(O0||(O0={}));export{G0 as Whitespace,O0 as Scramble,U0 as PuzzleViewer,M as NxNDrawer,i as Move,_0 as FastLSE,F as Cube,K0 as Conjugate,e as Commutator,Y0 as Comment,f as CacheCube,$0 as AlgTextarea,V0 as AlgInput,w as Alg};
