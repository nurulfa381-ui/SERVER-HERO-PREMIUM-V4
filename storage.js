window.SHStorage={
key:"serverHeroV4Locked",
defaults(){return{lang:null,student:null,projector:false,unlocked:1,completedKP:[],ktScores:{},xp:0,badges:[]}},
load(){try{const d=JSON.parse(localStorage.getItem(this.key));return d?{...this.defaults(),...d}:this.defaults()}catch(e){return this.defaults()}},
save(s){localStorage.setItem(this.key,JSON.stringify(s))},
clear(){localStorage.removeItem(this.key)}
};