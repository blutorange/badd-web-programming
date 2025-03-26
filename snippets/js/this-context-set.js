const demo = {
  logThis: function(name) {
    console.log(`${name}: ${this}`);
  },
};

demo.logThis("dot-notation");

const logThis = demo.logThis;
logThis("function-reference");

demo.logThis.call("Who am I?", "call");

const boundLogThis = demo.logThis.bind("A ghost");
boundLogThis("rebound");
