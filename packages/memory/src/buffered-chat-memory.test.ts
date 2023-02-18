import { BufferedChatMemory } from "./buffered-chat-memory";

describe("BufferedChatMemory", () => {
  const aliceChat = new BufferedChatMemory(["Alice", "Bob"]);

  beforeAll(() => {
    aliceChat.addMessages([
      { sender: "Alice", text: "Hello Bob" },
      { sender: "Bob", text: "Hi Alice" },
      { sender: "Alice", text: "How are you?" },
    ]);
  });

  it("returns messages in text format", () => {

    expect(aliceChat.get(2).text()).toBe("Bob: Hi Alice\nAlice: How are you?");
  });

  it("adds a new message", () => {
    aliceChat.addMessage({ sender: "Bob", text: "I am fine, thanks!" });

    expect(aliceChat.text()).toContain("Bob: I am fine, thanks!");
  });

  it("returns messages in JSON format", () => {
    expect(aliceChat.get(3).json()).toBe(
      JSON.stringify([
        { sender: "Bob", text: "Hi Alice" },
        { sender: "Alice", text: "How are you?" },
        { sender: "Bob", text: "I am fine, thanks!" },
      ])
    );
  });

  it("returns the last n messages", () => {
    const lastTwoMessages = aliceChat.get(2);

    expect(lastTwoMessages.text()).toBe(
      "Alice: How are you?\nBob: I am fine, thanks!"
    );
  });
});
