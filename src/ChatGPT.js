import React, { useState } from "react";

const ChatGPT = () => {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer insert API key",
        },
        body: JSON.stringify({
          prompt: prompt,
          temperature: 0.5,
          max_tokens: 1000,
          model: "text-davinci-003",
        }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();

      setResponses(data.choices[0].text);
      setIsLoading(false);
      const chunks = data.choices[0].text.match(/.{1,32000}/g);
      chunks.forEach((chunk) => {
        const speech = new SpeechSynthesisUtterance(chunk);
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
        speech.addEventListener("end", () => setIsLoading(false));
      });
    } catch (err) {
      setResponses(err.message);
    }
  };

  return (
    <div className="container">
      <h1>ChatGPT Text-to-Speech</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">Prompt:</label>
        <div>
          <input
            type="text"
            id="prompt"
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>
        <div>
          <button disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </div>
        {responses ? <div className="response-space">{responses}</div> : null}
      </form>
    </div>
  );
};

export default ChatGPT;
