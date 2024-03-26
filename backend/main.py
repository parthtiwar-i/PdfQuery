import shutil
from dotenv import load_dotenv
import io
import os
from fastapi import FastAPI, File, UploadFile
from PyPDF2 import PdfReader
# from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from pydantic import BaseModel
from langchain.chains.question_answering import load_qa_chain
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    allow_credentials=True,
    expose_headers=["Content-Disposition"],
)


@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        return {"error": "Invalid file type. Please upload a PDF."}

    try:
        contents = await file.read()
        # using PyPDF2
        pdf_reader = PdfReader(io.BytesIO(contents))
        page_count = len(pdf_reader.pages)  # ignore
        first_page_content = pdf_reader.pages[0].extract_text()  # ignore

        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_text(text=text)

        store_name = file.filename[:-4]

        gemini_embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001", api_key=GOOGLE_API_KEY)
        # embeddings = OpenAIEmbeddings()
        if os.path.exists(f"{store_name}.faiss"):
            VectorStore = FAISS.load_local(
                file.filename, gemini_embeddings, allow_dangerous_deserialization=True)
        else:
            try:
                # Find and delete folders containing index.faiss and index.pkl
                # for root, dirs, _ in os.walk(".", topdown=False):
                #     for dir_name in dirs:
                #         if os.path.exists(os.path.join(root, dir_name, "index.faiss")) and \
                #            os.path.exists(os.path.join(root, dir_name, "index.pkl")):
                #             try:
                #                 shutil.rmtree(os.path.join(root, dir_name))
                #             except Exception as e:
                #                 print(f"Error deleting folder {dir_name}: {e}")
                        VectorStore = FAISS.from_texts(
                            chunks, embedding=gemini_embeddings)
                        VectorStore.save_local(file.filename)
                        res = VectorStore.similarity_search(
                            query="Projects", k=3)
            except Exception as e:
                print(f"Error deleting existing files: {e}")

        return {"page": res, "file_name": file.filename}

    except Exception as e:
        print(f"Error processing PDF: {e}")
        return {"error": "Internal server error during processing."}


class QueryRequest(BaseModel):
    query: str
    store: str


@app.post("/query/")
async def query(request: QueryRequest):
    try:
        query = request.query
        store = request.store
        gemini_embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001")
        # embeddings = OpenAIEmbeddings()
        VectorStore = FAISS.load_local(
            store, gemini_embeddings, allow_dangerous_deserialization=True)
        if query:
            docs = VectorStore.as_retriever(
                search_type="similarity", search_kwargs={"k": 6})
            # docs = VectorStore.similarity_search(query=query, k=3)

            llm = ChatGoogleGenerativeAI(model="gemini-pro",
                                         temperature=1, top_p=0.85, convert_system_message_to_human=True)

            def format_docs(docs):
                return "\n\n".join(doc.page_content for doc in docs)

            llm_prompt_template = """You are an assistant for question-answering tasks.
                Use the following context to answer the question.
                If you don't know the answer, just say that you don't know.
                Use five sentences maximum and keep the answer concise.\n
                Question: {query} \nContext: {docs} \nAnswer:"""

            llm_prompt = PromptTemplate.from_template(llm_prompt_template)

            rag_chain = (
                {"docs": docs | format_docs,
                    "query": RunnablePassthrough()}
                | llm_prompt
                | llm
                | StrOutputParser()
            )
            response = rag_chain.invoke(query)

        return {"query": query, "response": response}
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return {"error": "Internal server error during processing."}
