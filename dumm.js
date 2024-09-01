import { GoogleGenerativeAI } from "@google/generative-ai";
import html2canvas from 'html2canvas';  // Ensure this is included if you're using npm
import { jsPDF } from 'jspdf';

// const { jsPDF } = window.jspdf;  // Access jsPDF from the global object

const inputf = document.querySelector(".questionr textarea");
const sendquesbtn = document.querySelector(".sendbtn button");
const ansarea = document.querySelector(".replyarea .ansarea");

// Initialize Google Generative AI with your API key
// const API_KEY = "AIzaSyDpw2nlR3OYfr6cAJkmsl-NGJR_Pc-iOow"; 
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

    // Clear previous responses and show loading
    ansarea.innerHTML = '';
    const loadingMessage = createAnswerElement("Generating response...");
    ansarea.appendChild(loadingMessage);

    try {
        // Fetching response from API
        const result = await model.generateContent(question);
        const response = await result.response;
        const text = await response.text();

        // Displaying the response
        ansarea.innerHTML = '';
        const replyElement = createAnswerElement(text);
        ansarea.appendChild(replyElement);
    } catch (error) {
        ansarea.innerHTML = '<p>Oops, something went wrong.</p>';
    }
};

// Event listener for send button
sendquesbtn.addEventListener("click", generateResponse);

window.onload = function() {
    document.querySelector("#download").addEventListener("click", () => {
        const getpdf = document.querySelector(".ansarea");
        if (getpdf) {
            generatePDF();  // Calls the generatePDF function
        } else {
            console.error("Element .ansarea not found.");
        }
    });
}

function generatePDF() {
    const element = document.querySelector('.ansarea'); // Replace with your target element
    
    html2canvas(element, { scrollY: -window.scrollY }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save('output.pdf');
    });
}
