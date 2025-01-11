import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// dotenv.config();

const inputf = document.querySelector(".questionr textarea");
const sendquesbtn = document.querySelector(".sendbtn button");
const ansarea = document.querySelector(".replyarea .ansarea");

// Initialize Google Generative AI with API key
const API_KEY = import.meta.env.VITE_API_KEY; // Use the Vite syntax to access the environment variable
// Use environment variable for the API key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const createAnswerElement = (message) => {
  const replyElement = document.createElement("div");
  replyElement.classList.add("response");
  replyElement.innerHTML = `<p>${message}</p>`;
  return replyElement;
};

const generateResponse = async () => {
  const question = inputf.value.trim();
  if (!question) return;

  ansarea.innerHTML = "";
  const loadingMessage = createAnswerElement("Generating response...");
  ansarea.appendChild(loadingMessage);

  try {
    const result = await model.generateContent({ prompts: [question] }); // Ensure question is wrapped in an array
    const response = result.response.text(); // Make sure this matches your API's response structure

    ansarea.innerHTML = ""; // Clear the loading message
    const replyElement = createAnswerElement(response);
    ansarea.appendChild(replyElement);
  } catch (error) {
    ansarea.innerHTML = "<p>Oops, something went wrong.</p>";
    console.error("Error generating response:", error); // Log error for debugging
  }
};

// Add event listener to the send button
sendquesbtn.addEventListener("click", generateResponse);

window.onload = function () {
  document.querySelector("#download").addEventListener("click", () => {
    const getpdf = document.querySelector(".ansarea");
    if (getpdf) {
      const options = {
        margin: 0,
        filename: "document.pdf",
        backgroundColor: null,
        html2canvas: { scale: 1, useCORS: true },
        jsPDF: { unit: "in", format: [8.27, 11.69], orientation: "portrait" },
      };

      html2pdf().set(options).from(getpdf).save();
    } else {
      console.error("Element .ansarea not found.");
    }
  });
};

// Copy response to clipboard
const copyButton = document.querySelector(".copy");
copyButton.addEventListener("click", () => {
  const range = document.createRange();
  range.selectNodeContents(ansarea);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      alert("Response copied!");
    } else {
      console.log("Unable to copy text");
    }
  } catch (err) {
    console.error("Error copying text: ", err);
  }

  // Clear the selection after copying
  selection.removeAllRanges();
});

// Speech recognition functionality
document.addEventListener("DOMContentLoaded", function () {
  const micS = document.querySelector(".mic");

  if (micS) {
    micS.addEventListener("click", () => {
      const recognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!recognition) {
        alert("Speech recognition is not supported in this browser.");
        return;
      }

      const speechRecognition = new recognition();
      speechRecognition.lang = "en-GB";

      speechRecognition.onstart = function () {
        console.log("Speech recognition started...");
      };

      speechRecognition.onerror = function (event) {
        console.error("Speech recognition error: ", event.error);
      };

      speechRecognition.onresult = function (event) {
        if (event.results.length > 0) {
          inputf.value = event.results[0][0].transcript; // Set the recognized speech to the input field
        }
      };

      speechRecognition.onspeechend = function () {
        console.log("Speech recognition ended.");
        speechRecognition.stop();
      };

      speechRecognition.start();
    });
  } else {
    console.error("Element with class 'mic' not found.");
  }
});
