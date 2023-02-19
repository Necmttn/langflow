import { createMachine, Machine, StateMachine } from "xstate";

type Task = (args: any) => Promise<any>;

interface StateMachineConfig {
  id: string;
  initial: string;
  states: {
    [key: string]: {
      on: {
        [key: string]: string;
      };
      invoke?: {
        id: string;
        src: Task;
        onDone: string;
        onError?: string;
      };
      prompt?: {
        message: string;
        onDone: string;
      };
    };
  };
}

export class SearchStateMachine {
  private config: StateMachineConfig;
  private machine: any;
  constructor(config: StateMachineConfig) {
    this.machine = createMachine(config);
  }


}


export class FlowStateMachine {
  private config: StateMachineConfig;
  private machine: any;
  constructor(config: StateMachineConfig) {
    this.machine = createMachine(config);
  }
}
