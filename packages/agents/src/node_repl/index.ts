import vm from 'vm';

type Context = Record<string, unknown>;

class NodeRepl {
  private context: vm.Context;

  constructor(context: Context) {
    // Create a new Node.js context with the given object as the global object
    this.context = vm.createContext(context);

    // Copy the global objects from the Node.js context to this context
    // for (const prop in global) {
    //   if (!this.context.hasOwnProperty(prop)) {
    //     this.context[prop] = global[prop];
    //   }
    // }
  }

  // Evaluate a JavaScript expression and return the result
  public evaluate(expression: string): unknown {
    // Use the built-in vm module to evaluate the expression in the context of the Node.js context
    const result = vm.runInContext(expression, this.context);

    // Return the result
    return result;
  }
}

// Example usage:
const repl = new NodeRepl({});
const result = repl.evaluate('const axios = require("axios"); axios.get("https://jsonplaceholder.typicode.com/posts/1").then(response => console.log(response.data)); "Hello, world!"');
// Output: the JSON response from the HTTP request made using axios
// Returns: "Hello, world!"
