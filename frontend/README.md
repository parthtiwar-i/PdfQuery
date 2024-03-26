# PDF Query Application

Live @ link

This application allows users to query information from a PDF document. Users can upload a PDF file using the "Upload PDF" button, submit the document, and then ask queries related to the PDF content. After a brief processing time of 5 to 6 seconds, users will receive answers relevant to their queries. If the query does not pertain to the PDF content, a response stating that the information is not found in the PDF will be provided.

## Backend

The backend of this application is built using Python with the FastAPI framework. The backend server is run using uvcorn with the following command:


    uvcorn main::app --reload 

## Frontend 
The frontend of the application is developed using React. It provides a user-friendly interface for uploading PDF files and querying information. The frontend is deployed on Vercel and can be accessed via this link.
LINK

## Getting Started
To clone this repository locally and run the application, follow these steps:

Clone the repository:

    git clone https://github.com/parthtiwar-i/PdfQuery.git

Navigate to the project directory:

    cd <Folder for installing>
Install dependencies for both backend and frontend:


# Install backend dependencies

    cd backend
    pip install -r requirements.txt

# Install frontend dependencies
    cd ../frontend
    npm install

Run the backend server using uvconn:

    uvconn main::app --reload

Start the frontend server:

    npm run dev

Open your browser and visit http://localhost:3000 to use the application locally.

# Usage
- Click on the "Upload PDF" button to select a PDF file from your device.
- Once the PDF is uploaded, click the "Submit" button to process the document.
- After a brief processing time, enter your query in the designated field.
- Press the "Submit Query" button to receive the relevant information from the PDF.
- If the query does not match any content in the PDF, a notification will indicate that the information is not found.
- Enjoy querying information from your PDF documents!