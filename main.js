 
// importing  google gen ai from "@google/generative-ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// new thinfg
document.querySelector('.ansarea').style.height = 'auto';
// ends here
const inputf = document.querySelector(".questionr textarea");
const sendquesbtn = document.querySelector(".sendbtn button");
const ansarea = document.querySelector(".replyarea .ansarea");

// Initializingg Google Generative AI with  API key
const API_KEY = " AIzaSyAl8Fz-wheRVQLbfKmEVR19Sdle4cmrCrI";  
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const createAnswerElement = (message) => {
    const replyElement = document.createElement("div");
    replyElement.classList.add("response");
    replyElement.innerHTML = `<p>${message}</p>`;
    return replyElement;
};



document.querySelector('.ansarea').style.height = 'auto';   
const generateResponse = async () => {
    const question = inputf.value.trim();
    if (!question) return;
    ansarea.innerHTML = '';
    const loadingMessage = createAnswerElement("Generating response...");
    ansarea.appendChild(loadingMessage);
    
    try {
        const result = await model.generateContent(question);
        const response = await result.response.text();  
        
        ansarea.innerHTML = '';
        
        const replyElement = createAnswerElement(response);
        ansarea.appendChild(replyElement);
    } catch (error) {
        ansarea.innerHTML = '<p>Oops, something went wrong.</p>';
        console.error(error);  
    }

    // inputf.value = '';
    // question.innerHTML=' ';
};


// Add event listener to the send button
sendquesbtn.addEventListener("click", generateResponse);

window.onload = function() {
    document.querySelector("#download").addEventListener("click", () => {
        const getpdf = document.querySelector(".ansarea");
        if (getpdf) {
            const scrollHeight = getpdf.scrollHeight;
            const options = {
                margin: 0,
                filename: 'document.pdf',
                backgroundColor: null ,
                image: { type: 'jpeg', quality: 2 },
                html2canvas: { scale: 1, useCORS: true },
                overflow: 'hidden',
                jsPDF: { unit: 'in', format:  [8.27, 11.69], orientation: 'portrait' },
                scrollY: 0, 
                scrollX: 0, 
                height: 10000,

              
                width: getpdf.offsetWidth,
                pagebreak: { 
                    mode: ['avoid-all', 'css', 'legacy'], // Ensure content doesn't break awkwardly
                    before: '.page-break', // Ensures page breaks before elements with this class
                    after: '.page-end', // Ensures page breaks after elements with this class
                    avoid: '.no-break' // Avoid page breaks within elements with this class
                }
            };

            html2pdf().set(options).from(getpdf).save();
        } else {
            console.error("Element .ansarea not found.");
        }
    });
};
 







const copyButton = document.querySelector(".copy");
// const ansarea = document.querySelector(".replyarea .ansarea");

copyButton.addEventListener("click", () => {
    const range = document.createRange();
    range.selectNodeContents(ansarea);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert("response copied!");
        } else {
            console.log('Unable to copy text');
        }
    } catch (err) {
        console.error('Error copying text: ', err);
    }

    // Clear the selection after copying
    selection.removeAllRanges();
});

 
document.addEventListener("DOMContentLoaded", function() {
    const micS = document.querySelector(".mic");

    if (micS) {
        micS.addEventListener("click", () => {
            // console.log("Mic clicked, starting voice recognition...");
            
            function voice() {
                var recognition = new webkitSpeechRecognition();
                recognition.lang = "en-GB";
                
                recognition.onstart = function() {
                    console.log("Speech recognition started...");
                };

                recognition.onerror = function(event) {
                    console.error("Speech recognition error: ", event.error);
                };

                recognition.onresult = function(event) {
                    console.log("Speech recognition result event: ", event);
                    if (event.results.length > 0) {
                        console.log("Transcript: ", event.results[0][0].transcript);
                        document.querySelector(".ques").value = event.results[0][0].transcript;
                    } else {
                        console.log("No speech recognized.");
                    }
                };
                
                recognition.onspeechend = function() {
                    console.log("Speech recognition ended.");
                    recognition.stop();
                };

                recognition.start();
            }

            voice();
        });
    } else {
        console.error("Element with class 'mic' not found.");
    }
});


