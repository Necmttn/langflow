type Message<T> = { sender: T; text: string };

export class BufferedChatMemory<T extends string> {
  private messages: Array<{ sender: T; text: string }>;

  constructor(private actorNames: Array<T>) {
    this.messages = [];
  }

  public addMessage(message: { sender: T; text: string }): void {
    if (this.actorNames.includes(message.sender)) {
      this.messages.push(message);
    }
  }

  public get(last: number = Infinity): BufferedChatMemory<T> {
    const messagesCopy = [...this.messages];
    const lastMessages = messagesCopy.slice(-last);
    return new BufferedChatMemory<T>(this.actorNames).addMessages(lastMessages);
  }

  public addMessages(messages: Array<Message<T>>): BufferedChatMemory<T> {
    messages.forEach((message) => this.addMessage(message));
    return this;
  }

  public json(): string {
    return JSON.stringify(this.messages);
  }

  public text(): string {
    const lastMessages = this.messages;
    return lastMessages
      .map((message) => `${message.sender}: ${message.text}`)
      .join("\n");
  }
}
