(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{261:function(e,a,t){e.exports=t(471)},266:function(e,a,t){},267:function(e,a,t){},471:function(e,a,t){"use strict";t.r(a);var n=t(0),o=t.n(n),i=t(21),r=t.n(i),l=(t(266),t(46)),c=t(47),s=t(49),m=t(48),u=t(50),p=(t(267),t(83)),h=t.n(p),d=t(51),g=t(35),b=t.n(g),y=function(e){function a(){return Object(l.a)(this,a),Object(s.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(u.a)(a,e),Object(c.a)(a,[{key:"render",value:function(){var e=b.a.auth().currentUser,a=o.a.createElement("div",null,'"please log in"');return e&&(a=o.a.createElement("h2",null,'Joined the lobby as "',e.displayName,'"')),o.a.createElement("div",null,o.a.createElement("h1",null,"Game ID: ",this.props.match.params.gameID),a,o.a.createElement(d.a,{variant:"contained",color:"primary"},"Start Game"))}}]),a}(o.a.Component),f=t(177),v=t(82),E=t.n(v),j=function(e){function a(e){var t;return Object(l.a)(this,a),(t=Object(s.a)(this,Object(m.a)(a).call(this,e))).state={displayName:"kiminonawa",gameID:"new lobby",isLoading:!1},t.handleChange=function(e){return function(a){t.setState(Object(f.a)({},e,a.target.value))}},t.login=function(e){t.setState({isLoading:!0}),b.a.auth().signInAnonymously().then(function(e){var a=e.user;a&&a.updateProfile({displayName:t.state.displayName}).then(function(){t.setState({isLoading:!1}),t.props.history.push("/".concat(t.state.gameID))})})},console.log(t.props.match.params),b.a.auth().signOut(),b.a.auth().onAuthStateChanged(function(e){e&&console.log('joined "'.concat(t.state.gameID,'" as "').concat(t.state.displayName,'"'))}),t}return Object(u.a)(a,e),Object(c.a)(a,[{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement("form",{noValidate:!0,autoComplete:"off"},o.a.createElement(d.b,{id:"outlined-uncontrolled",label:"Display Name",defaultValue:this.state.displayName,margin:"normal",variant:"outlined",onChange:this.handleChange("displayName")}),o.a.createElement(d.b,{id:"outlined-uncontrolled",label:"Lobby Name",defaultValue:this.state.gameID,margin:"normal",variant:"outlined",onChange:this.handleChange("lobbyName")})),o.a.createElement(d.a,{variant:"contained",color:"primary",onClick:this.login},"Join Game"),o.a.createElement("div",null,this.state.isLoading?o.a.createElement(E.a,null):null))}}]),a}(o.a.Component),O=t(178),w=t(38);g.initializeApp({apiKey:"AIzaSyC8GlZSkhT_-jVM7pv_5IulaL4PUWfw8ys",authDomain:"pictionary-c2ea2.firebaseapp.com",databaseURL:"https://pictionary-c2ea2.firebaseio.com",projectId:"pictionary-c2ea2",storageBucket:"pictionary-c2ea2.appspot.com",messagingSenderId:"1067811636183"});var I=function(e){function a(){return Object(l.a)(this,a),Object(s.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(u.a)(a,e),Object(c.a)(a,[{key:"render",value:function(){return o.a.createElement("div",{className:"App"},o.a.createElement("link",{rel:"stylesheet",href:"https://fonts.googleapis.com/css?family=Roboto:300,400,500"}),o.a.createElement(h.a,{component:"h2",variant:"h2",gutterBottom:!0},"Pictionary"),o.a.createElement(O.a,{basename:"/pictionary"},o.a.createElement(w.a,{exact:!0,path:"/",component:j}),o.a.createElement(w.a,{path:"/:gameID",component:y})))}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(o.a.createElement(I,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[261,1,2]]]);
//# sourceMappingURL=main.8a8a532d.chunk.js.map