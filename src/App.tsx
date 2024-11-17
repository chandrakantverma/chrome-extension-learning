import React, { useState } from "react";

const App: React.FC = () => {
  const [webpageText, setWebpageText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Extract visible text from the current webpage
  const extractWebpageContent = (): void => {
    try {
      const text: string = document.body.innerText || document.body.textContent || "";
      setWebpageText(text);
    } catch (error) {
      console.error("Error extracting webpage content:", error);
    }
  };

  // Summarize the extracted content using OpenAI
  const summarizeContent = async (): Promise<void> => {
    if (!webpageText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer OPENAI API KEY`, // Replace with your API key
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a helpful summarization assistant." },
            { role: "user", content: `Summarize the following content concisely:\n\n${webpageText}` },
          ],
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSummary(data.choices[0].message.content || "No summary available.");
      } else {
        console.error("Error response from OpenAI:", data);
        setSummary("Failed to generate summary. Please try again.");
      }
    } catch (error) {
      console.error("Error summarizing content:", error);
      setSummary("An error occurred while summarizing the content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>Webpage Summarizer</h1>
      <button onClick={extractWebpageContent} style={{ margin: "10px" }}>
        Extract Webpage Content
      </button>
      <button onClick={summarizeContent} disabled={loading || !webpageText}>
        {loading ? "Summarizing..." : "Summarize Content"}
      </button>
      <div style={{ marginTop: "20px" }}>
        <h2>Webpage Content:</h2>
        <textarea
          rows={10}
          cols={80}
          value={webpageText}
          readOnly
          placeholder="Extracted content will appear here"
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Summary:</h2>
        <textarea
          rows={10}
          cols={80}
          value={summary}
          readOnly
          placeholder="Summary will appear here"
        />
      </div>
    </div>
  );
};

export default App;
